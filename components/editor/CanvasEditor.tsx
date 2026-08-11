"use client"

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Image as KonvaImage,
  Transformer,
  Group,
} from "react-konva";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";

import type { CardElement, CardTemplate, ProfileData } from "@/types/template";
import { VERIFY_BASE_URL } from "@/lib/constants";
import { resolveText } from "@/lib/templates";
import { getQrDataUrl } from "@/lib/qr";
import { useImage, coverCropFit } from "@/hooks/useImage";

export interface CanvasEditorHandle {
  exportPng: (pixelRatio?: number) => void;
  toDataUrl: (pixelRatio?: number, mimeType?: string) => string | null;
  renderToDataUrl: (pixelRatio?: number, mimeType?: string) => Promise<string | null>;
}

interface CanvasEditorProps {
  template: CardTemplate;
  profile: ProfileData;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateElement: (element: CardElement) => void;
  readOnly?: boolean;
  /** Image URLs to treat as already-loaded (skipped while waiting for render). */
  immediateUrls?: string[];
  /**
   * Optional max *display* width in CSS pixels. The Stage keeps its full
   * internal coordinate system (for exports) but is shown uniformly scaled
   * down so the whole card fits without changes to its aspect ratio.
   */
  fitWidth?: number;
}

type BaseCallbacks = {
  onClick: (event: KonvaEventObject<MouseEvent | TouchEvent>) => void;
  onDragEnd: (event: KonvaEventObject<DragEvent>) => void;
  onTransformEnd: (event: KonvaEventObject<Event>) => void;
};

const DEFAULT_FONT = "Arial, Helvetica, sans-serif";

function TextElementNode({
  element,
  profile,
  callbacks,
  nodeRef,
  readOnly,
}: {
  element: Extract<CardElement, { kind: "text" }>;
  profile: ProfileData;
  callbacks: BaseCallbacks;
  nodeRef?: (node: Konva.Node | null) => void;
  readOnly?: boolean;
}) {
  const resolved = resolveText(element.text, profile);
  const text = element.uppercase ? resolved.toUpperCase() : resolved;

  return (
    <Text
      ref={nodeRef}
      x={element.x}
      y={element.y}
      rotation={element.rotation ?? 0}
      width={element.width}
      text={text}
      fontSize={element.fontSize}
      fontStyle={element.fontWeight >= 600 ? "bold" : "normal"}
      fontFamily={DEFAULT_FONT}
      fill={element.color}
      align={element.align}
      verticalAlign={element.verticalAlign}
      letterSpacing={element.letterSpacing ?? 0}
      lineHeight={element.lineHeight ?? 1.1}
      draggable={!readOnly}
      onClick={callbacks.onClick}
      onTap={callbacks.onClick}
      onDragEnd={callbacks.onDragEnd}
      onTransformEnd={callbacks.onTransformEnd}
    />
  );
}

function RectElementNode({
  element,
  callbacks,
  nodeRef,
  readOnly,
}: {
  element: Extract<CardElement, { kind: "rect" }>;
  callbacks: BaseCallbacks;
  nodeRef?: (node: Konva.Node | null) => void;
  readOnly?: boolean;
}) {
  return (
    <Rect
      ref={nodeRef}
      x={element.x}
      y={element.y}
      rotation={element.rotation ?? 0}
      width={element.width}
      height={element.height}
      fill={element.fill}
      cornerRadius={element.cornerRadius ?? 0}
      draggable={!readOnly}
      onClick={callbacks.onClick}
      onTap={callbacks.onClick}
      onDragEnd={callbacks.onDragEnd}
      onTransformEnd={callbacks.onTransformEnd}
    />
  );
}

function ImageElementNode({
  element,
  url,
  callbacks,
  nodeRef,
  readOnly,
}: {
  element: Extract<CardElement, { kind: "image" }>;
  url?: string;
  callbacks: BaseCallbacks;
  nodeRef?: (node: Konva.Node | null) => void;
  readOnly?: boolean;
}) {
  const image = useImage(url);

  const crop = useMemo(() => {
    if (!image) return null;
    return coverCropFit(
      image.width,
      image.height,
      element.width,
      element.height,
      element.cropZoom ?? 1,
      element.cropX ?? 0,
      element.cropY ?? 0
    );
  }, [
    image,
    element.width,
    element.height,
    element.cropZoom,
    element.cropX,
    element.cropY,
  ]);

  if (!image || !crop) {
    return (
      <Group
        ref={nodeRef}
        x={element.x}
        y={element.y}
        rotation={element.rotation ?? 0}
        onClick={callbacks.onClick}
        onTap={callbacks.onClick}
      >
        <Rect
          width={element.width}
          height={element.height}
          fill="#e4e6eb"
          cornerRadius={element.cornerRadius ?? 0}
        />
        <Text
          width={element.width}
          height={element.height}
          text={element.source === "photo" ? "PHOTO" : "LOGO"}
          align="center"
          verticalAlign="middle"
          fontSize={12}
          fontStyle="bold"
          fontFamily={DEFAULT_FONT}
          fill="#9ca3af"
        />
      </Group>
    );
  }

  return (
    <KonvaImage
      ref={nodeRef}
      x={element.x}
      y={element.y}
      rotation={element.rotation ?? 0}
      width={element.width}
      height={element.height}
      image={image}
      crop={crop}
      cornerRadius={element.cornerRadius ?? 0}
      draggable={!readOnly}
      onClick={callbacks.onClick}
      onTap={callbacks.onClick}
      onDragEnd={callbacks.onDragEnd}
      onTransformEnd={callbacks.onTransformEnd}
    />
  );
}

function QrElementNode({
  element,
  callbacks,
  nodeRef,
  readOnly,
}: {
  element: Extract<CardElement, { kind: "qr" }>;
  callbacks: BaseCallbacks;
  nodeRef?: (node: Konva.Node | null) => void;
  readOnly?: boolean;
}) {
  const value =
    element.value && element.value.trim()
      ? element.value.trim()
      : `${VERIFY_BASE_URL}/`;
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getQrDataUrl(value, {
      fgColor: element.fgColor,
      bgColor: element.bgColor,
      size: 620,
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [value, element.fgColor, element.bgColor]);

  const image = useImage(dataUrl ?? undefined);

  if (!image) {
    return (
      <Group
        ref={nodeRef}
        x={element.x}
        y={element.y}
        rotation={element.rotation ?? 0}
        onClick={callbacks.onClick}
        onTap={callbacks.onClick}
      >
        <Rect width={element.width} height={element.height} fill="#e4e6eb" />
        <Text
          width={element.width}
          height={element.height}
          text="Loading QR…"
          align="center"
          verticalAlign="middle"
          fontSize={9}
          fontFamily={DEFAULT_FONT}
          fill="#9ca3af"
        />
      </Group>
    );
  }

  return (
    <KonvaImage
      ref={nodeRef}
      x={element.x}
      y={element.y}
      rotation={element.rotation ?? 0}
      width={element.width}
      height={element.height}
      image={image}
      draggable={!readOnly}
      onClick={callbacks.onClick}
      onTap={callbacks.onClick}
      onDragEnd={callbacks.onDragEnd}
      onTransformEnd={callbacks.onTransformEnd}
    />
  );
}

function BackgroundImageNode({
  url,
  width,
  height,
}: {
  url: string
  width: number
  height: number
}) {
  const image = useImage(url);

  const crop = useMemo(() => {
    if (!image) return null;
    return coverCropFit(image.width, image.height, width, height);
  }, [image, width, height]);

  if (!image || !crop) return null;

  return (
    <KonvaImage
      x={0}
      y={0}
      width={width}
      height={height}
      image={image}
      crop={crop}
      listening={false}
    />
  );
}

const CanvasEditor = forwardRef<CanvasEditorHandle, CanvasEditorProps>(
  function CanvasEditorInner(
    { template, profile, selectedId, onSelect, onUpdateElement, readOnly = false, immediateUrls = [], fitWidth },
    ref
  ) {
    const stageRef = useRef<Konva.Stage | null>(null);
    const trRef = useRef<Konva.Transformer | null>(null);
    const nodeRefs = useRef<Record<string, Konva.Node>>({});

    // Scale the stage down proportionally to fit `fitWidth` while the internal
    // coordinate system (template.width × template.height) stays untouched, so
    // exports always render at the canonical dimensions and aspect ratio.
    const baseWidth = template.width || 750;
    const baseHeight = template.height || 1000;
    const scale = fitWidth ? fitWidth / baseWidth : 1;
    const displayWidth = baseWidth * scale;
    const displayHeight = baseHeight * scale;

    // Konva exports at stage.width() × pixelRatio; distribute the display scale
    // into the pixel ratio so the produced image is always the full canonical
    // resolution (e.g. 750×1000 at pixelRatio 4 → 3000×4000).
    const exportPx = (pixelRatio = 4) => (scale ? pixelRatio / scale : pixelRatio);

    useEffect(() => {
      if (readOnly) {
        trRef.current?.nodes([]);
        return;
      }
      const node = selectedId ? nodeRefs.current[selectedId] : null;
      trRef.current?.nodes(node ? [node] : []);
    }, [selectedId, template.elements, readOnly]);

    function imageTargets() {
      const targets: string[] = [];
      if (template.backgroundImage) targets.push(template.backgroundImage);
      for (const el of template.elements) {
        if (el.kind === "image") {
          const url =
            el.source === "upload"
              ? el.url
              : el.source === "photo"
                ? profile.photoUrl
                : profile.logoUrl;
          if (url && !immediateUrls.includes(url)) targets.push(url);
        } else if (el.kind === "qr") {
          targets.push(`qr:${el.value}`);
        }
      }
      return targets;
    }

    function waitForReady(): Promise<boolean> {
      return new Promise((resolve) => {
        const targets = imageTargets();
        const expected = targets.length;
        if (expected === 0) {
          resolve(true);
          return;
        }
        let attempts = 0;
        const poll = () => {
          attempts += 1;
          const stage = stageRef.current;
          const images = stage
            ? (stage.find("Image") as unknown as Konva.Image[])
            : [];
          const loaded = images.filter((img) => {
            const el = img.image() as HTMLImageElement | undefined;
            return !!el && el.complete && el.naturalWidth > 0;
          });
          if (loaded.length >= expected || attempts > 60) {
            resolve(true);
            return;
          }
          setTimeout(poll, 80);
        };
        poll();
      });
    }

    useImperativeHandle(ref, () => ({
      toDataUrl: (pixelRatio = 4, mimeType = "image/png") => {
        const stage = stageRef.current;
        if (!stage) return null;
        return stage.toDataURL({ pixelRatio: exportPx(pixelRatio), mimeType });
      },
      renderToDataUrl: async (pixelRatio = 4, mimeType = "image/png") => {
        await waitForReady();
        const stage = stageRef.current;
        if (!stage) return null;
        return stage.toDataURL({ pixelRatio: exportPx(pixelRatio), mimeType });
      },
      exportPng: async (pixelRatio = 4) => {
        const dataUrl = await waitForReady().then(() => {
          const stage = stageRef.current;
          return stage?.toDataURL({ pixelRatio: exportPx(pixelRatio), mimeType: "image/png" });
        });
        if (!dataUrl) return;
        const link = document.createElement("a");
        link.download = `${profile.id || "card"}.png`;
        link.href = dataUrl;
        link.click();
      },
    }));

    function attachRef(id: string) {
      return (node: Konva.Node | null) => {
        if (node) nodeRefs.current[id] = node;
        else delete nodeRefs.current[id];
      };
    }

    function selectHandler(id: string) {
      return (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
        event.cancelBubble = true;
        onSelect(id);
      };
    }

    function dragEndHandler(element: CardElement) {
      return (event: KonvaEventObject<DragEvent>) => {
        const node = event.target as Konva.Node;
        onUpdateElement({ ...element, x: node.x(), y: node.y() });
      };
    }

    function transformEndHandler(element: CardElement) {
      return (event: KonvaEventObject<Event>) => {
        const node = event.target as Konva.Node;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onUpdateElement({
          ...element,
          x: node.x(),
          y: node.y(),
          width: Math.max(6, node.width() * scaleX),
          height: Math.max(6, node.height() * scaleY),
          rotation: node.rotation(),
        });
      };
    }

    function callbacks(element: CardElement): BaseCallbacks {
      return {
        onClick: selectHandler(element.id),
        onDragEnd: dragEndHandler(element),
        onTransformEnd: transformEndHandler(element),
      };
    }

    function renderElement(element: CardElement) {
      const cb = callbacks(element);
      const nodeRef = attachRef(element.id);
      switch (element.kind) {
        case "text":
          return (
            <TextElementNode
              key={element.id}
              element={element}
              profile={profile}
              callbacks={cb}
              nodeRef={nodeRef}
              readOnly={readOnly}
            />
          );
        case "rect":
          return (
            <RectElementNode
              key={element.id}
              element={element}
              callbacks={cb}
              nodeRef={nodeRef}
              readOnly={readOnly}
            />
          );
        case "image": {
          const url =
            element.source === "upload"
              ? element.url
              : element.source === "photo"
                ? profile.photoUrl
                : profile.logoUrl;
          return (
            <ImageElementNode
              key={element.id}
              element={element}
              url={url}
              callbacks={cb}
              nodeRef={nodeRef}
              readOnly={readOnly}
            />
          );
        }
        case "qr":
          return (
            <QrElementNode
              key={element.id}
              element={element}
              callbacks={cb}
              nodeRef={nodeRef}
            />
          );
      }
    }

    return (
      <Stage
        ref={stageRef}
        width={displayWidth}
        height={displayHeight}
        scaleX={scale}
        scaleY={scale}
        onClick={() => {
          if (!readOnly) onSelect(null);
        }}
      >
        <Layer>
          <Rect width={template.width} height={template.height} fill={template.background} />
          {template.backgroundImage && <BackgroundImageNode url={template.backgroundImage} width={template.width} height={template.height} />}
          {template.elements.map((element) => renderElement(element))}
          <Transformer
            ref={trRef}
            rotateEnabled
            flipEnabled={false}
            borderStroke="#6366f1"
            anchorStroke="#6366f1"
            anchorSize={9}
            keepRatio={false}
            boundBoxFunc={(oldBox, newBox) =>
              newBox.width < 8 || newBox.height < 8 ? oldBox : newBox
            }
          />
        </Layer>
      </Stage>
    );
  }
);

export default CanvasEditor;