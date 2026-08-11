"use client"

import { useEffect, useSyncExternalStore } from "react";

const imageCache: Record<string, HTMLImageElement> = {};
let cacheVersion = 0;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return cacheVersion;
}

function notify() {
  cacheVersion += 1;
  listeners.forEach((listener) => listener());
}

/** Loads an image once and exposes the decoded HTMLImageElement for Konva. */
export function useImage(url?: string) {
  const version = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    if (!url) return;
    if (imageCache[url]) return;

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      imageCache[url] = img;
      notify();
    };
    img.src = url;
    return () => {
      cancelled = true;
    };
  }, [url]);

  void version;
  return url ? imageCache[url] : undefined;
}

/** Loads images into the shared cache so subsequent `useImage` reads are instant. */
export async function preloadImage(url: string): Promise<void> {
  if (!url || imageCache[url]) return;
  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageCache[url] = img;
      notify();
      resolve();
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

/** Computes a source crop (in image pixels) that "covers" the destination box without distortion. */
export function coverCrop(
  sourceW: number,
  sourceH: number,
  destW: number,
  destH: number
) {
  const scale = Math.max(destW / sourceW, destH / sourceH);
  const srcW = destW / scale;
  const srcH = destH / scale;
  return {
    x: (sourceW - srcW) / 2,
    y: (sourceH - srcH) / 2,
    width: srcW,
    height: srcH,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Cover crop with photo fit-to-frame: `zoom` (≥1) zooms into the image and
 * `panX`/`panY` (fractions of the visible crop, -1..1) shift the visible region,
 * always clamped so the frame never sees empty/transparent edges.
 */
export function coverCropFit(
  sourceW: number,
  sourceH: number,
  destW: number,
  destH: number,
  zoom = 1,
  panX = 0,
  panY = 0
) {
  const base = coverCrop(sourceW, sourceH, destW, destH);
  const srcW = clamp(base.width / Math.max(1, zoom), 1, sourceW);
  const srcH = clamp(base.height / Math.max(1, zoom), 1, sourceH);

  // Total travel distance (in px) before the crop would leave the source image.
  const rangeX = Math.max(0, sourceW - srcW);
  const rangeY = Math.max(0, sourceH - srcH);
  const z = (v: number) => clamp(v, -1, 1);

  return {
    x: clamp((rangeX / 2) * (1 + z(panX)), 0, rangeX),
    y: clamp((rangeY / 2) * (1 + z(panY)), 0, rangeY),
    width: srcW,
    height: srcH,
  };
}