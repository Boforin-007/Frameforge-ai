import type { CardElement, CardTemplate, ProfileData } from "@/types/template";
import type { TemplateSeed } from "@/lib/constants";

let idCounter = 0;

export function uid(prefix = "el"): string {
  idCounter += 1;
  return `${prefix}-${idCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

const FIELD_PATTERN = /\{\{\s*(\w+)\s*\}\}/g;

type ElementInput =
  | Omit<Extract<CardElement, { kind: "text" }>, "id">
  | Omit<Extract<CardElement, { kind: "image" }>, "id">
  | Omit<Extract<CardElement, { kind: "qr" }>, "id">
  | Omit<Extract<CardElement, { kind: "rect" }>, "id">;

export function resolveText(text: string, data: ProfileData): string {
  return text.replace(FIELD_PATTERN, (_match, key: string) => {
    const value = data[key as keyof ProfileData];
    return typeof value === "string" ? value : "";
  });
}

const CARD_W = 600;
const CARD_H = 375;

/** Corner brackets (L-marks) around a rectangular area. Painted in array order. */
function cornerBrackets(
  el: (data: ElementInput) => CardElement,
  x: number,
  y: number,
  w: number,
  h: number,
  t: number,
  color: string,
  length = 26
): CardElement[] {
  return [
    // top-left
    el({ kind: "rect", x, y, width: length, height: t, fill: color }),
    el({ kind: "rect", x, y, width: t, height: length, fill: color }),
    // top-right
    el({ kind: "rect", x: x + w - length, y, width: length, height: t, fill: color }),
    el({ kind: "rect", x: x + w - t, y, width: t, height: length, fill: color }),
    // bottom-left
    el({ kind: "rect", x, y: y + h - t, width: length, height: t, fill: color }),
    el({ kind: "rect", x, y: y + h - length, width: t, height: length, fill: color }),
    // bottom-right
    el({ kind: "rect", x: x + w - length, y: y + h - t, width: length, height: t, fill: color }),
    el({ kind: "rect", x: x + w - t, y: y + h - length, width: t, height: length, fill: color }),
  ];
}

/** Thin full-card frame: four hairline rects. */
function cardFrame(
  el: (data: ElementInput) => CardElement,
  color: string
): CardElement[] {
  return [
    el({ kind: "rect", x: 0, y: 0, width: CARD_W, height: 2, fill: color }),
    el({ kind: "rect", x: 0, y: CARD_H - 2, width: CARD_W, height: 2, fill: color }),
    el({ kind: "rect", x: 0, y: 0, width: 2, height: CARD_H, fill: color }),
    el({ kind: "rect", x: CARD_W - 2, y: 0, width: 2, height: CARD_H, fill: color }),
  ];
}

interface Palette {
  elements: CardElement[];
  background: string;
  foreground: string;
  muted: string;
}

function baseElements(seed: TemplateSeed): Palette {
  const isDark = seed.slug.includes("corporate");
  const background = isDark ? "#14120f" : "#f2efe9";
  const foreground = isDark ? "#efece6" : "#191512";
  const muted = isDark ? "#a09a90" : "#6f6a61";
  const frame = isDark ? "rgba(239,236,230,0.14)" : "rgba(25,21,18,0.12)";
  const photoX = 444;
  const photoY = 84;
  const photoSize = 132;

  const el = (data: ElementInput): CardElement =>
    ({ ...data, id: uid() }) as CardElement;

  const elements: CardElement[] = [
    ...cardFrame(el, frame),

    // top strip
    el({ kind: "rect", x: 24, y: 24, width: 12, height: 12, fill: seed.accent }),
    el({
      kind: "text",
      text: "{{organization}}",
      x: 48,
      y: 20,
      width: 360,
      height: 20,
      fontSize: 22,
      fontWeight: 800,
      color: foreground,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),
    el({
      kind: "text",
      text: "VERIFIED // FF-01",
      x: 470,
      y: 24,
      width: 106,
      height: 14,
      fontSize: 10,
      fontWeight: 500,
      color: muted,
      align: "right",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),

    // vertical separator before photo column
    el({ kind: "rect", x: photoX - 12, y: 84, width: 1, height: CARD_H - 84, fill: frame }),

    // name block
    el({
      kind: "text",
      text: "{{name}}",
      x: 24,
      y: 84,
      width: 396,
      height: 52,
      fontSize: 44,
      fontWeight: 800,
      color: foreground,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: -0.5,
      uppercase: true,
    }),
    el({ kind: "rect", x: 24, y: 146, width: 396, height: 2, fill: foreground }),
    el({
      kind: "text",
      text: "{{designation}}",
      x: 24,
      y: 158,
      width: 320,
      height: 20,
      fontSize: 14,
      fontWeight: 600,
      color: muted,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),

    // id block
    el({
      kind: "text",
      text: "SERIAL //",
      x: 24,
      y: 196,
      width: 120,
      height: 14,
      fontSize: 10,
      fontWeight: 500,
      color: muted,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),
    el({
      kind: "text",
      text: "{{id}}",
      x: 24,
      y: 212,
      width: 300,
      height: 34,
      fontSize: 26,
      fontWeight: 700,
      color: foreground,
      align: "left",
      verticalAlign: "middle",
    }),
    el({
      kind: "text",
      text: "{{department}}",
      x: 24,
      y: 252,
      width: 320,
      height: 22,
      fontSize: 15,
      fontWeight: 500,
      color: muted,
      align: "left",
      verticalAlign: "middle",
      uppercase: true,
    }),

    // contact column
    el({
      kind: "text",
      text: "{{email}}",
      x: 24,
      y: 302,
      width: 300,
      height: 16,
      fontSize: 11,
      fontWeight: 500,
      color: muted,
      align: "left",
      verticalAlign: "middle",
    }),
    el({
      kind: "text",
      text: "{{phone}}",
      x: 24,
      y: 324,
      width: 300,
      height: 16,
      fontSize: 11,
      fontWeight: 500,
      color: muted,
      align: "left",
      verticalAlign: "middle",
    }),
    el({
      kind: "text",
      text: "FRAMEFORGE // {{organization}}",
      x: 24,
      y: 348,
      width: 360,
      height: 14,
      fontSize: 10,
      fontWeight: 500,
      color: muted,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),

    // photo
    el({
      kind: "image",
      source: "photo",
      x: photoX,
      y: photoY,
      width: photoSize,
      height: photoSize,
      cornerRadius: 0,
    }),
    ...cornerBrackets(el, photoX, photoY, photoSize, photoSize, 4, seed.accent),
    el({
      kind: "text",
      text: "IDENTITY // PHOTO",
      x: photoX,
      y: photoY + photoSize + 6,
      width: photoSize,
      height: 12,
      fontSize: 9,
      fontWeight: 500,
      color: muted,
      align: "center",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),

    // qr
    el({
      kind: "text",
      text: "VERIFY // SCAN",
      x: photoX,
      y: 250,
      width: photoSize,
      height: 12,
      fontSize: 9,
      fontWeight: 500,
      color: muted,
      align: "center",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),
    el({
      kind: "qr",
      value: "",
      x: photoX + 14,
      y: 262,
      width: photoSize - 28,
      height: photoSize - 28,
    }),
    el({ kind: "rect", x: photoX, y: 244, width: photoSize, height: 1, fill: frame }),
    el({ kind: "rect", x: photoX, y: 372, width: photoSize, height: 1, fill: frame }),
  ];

  return { elements, background, foreground, muted };
}

function hhGoaElements(seed: TemplateSeed): Palette {
  const background = "#f0ece4";
  const foreground = "#16130e";
  const muted = "#6e685c";
  const frame = "rgba(22,19,14,0.14)";
  const photoX = 428;
  const photoY = 84;
  const photoSize = 148;

  const el = (data: ElementInput): CardElement =>
    ({ ...data, id: uid() }) as CardElement;

  const elements: CardElement[] = [
    ...cardFrame(el, frame),
    ...cornerBrackets(el, 0, 0, CARD_W, CARD_H, 5, seed.accent, 30),

    // top strip
    el({ kind: "rect", x: 20, y: 20, width: 14, height: 14, fill: seed.accent }),
    el({
      kind: "text",
      text: "HH GOA 2026",
      x: 44,
      y: 20,
      width: 200,
      height: 16,
      fontSize: 16,
      fontWeight: 800,
      color: foreground,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: 4,
      uppercase: true,
    }),
    el({
      kind: "text",
      text: "15.2993° N / 74.1240° E",
      x: 320,
      y: 20,
      width: 260,
      height: 14,
      fontSize: 10,
      fontWeight: 500,
      color: muted,
      align: "right",
      verticalAlign: "middle",
      letterSpacing: 1,
      uppercase: true,
    }),
    el({ kind: "rect", x: 20, y: 48, width: CARD_W - 40, height: 1, fill: frame }),

    // organization
    el({
      kind: "text",
      text: "{{organization}}",
      x: 20,
      y: 60,
      width: CARD_W - 40,
      height: 24,
      fontSize: 22,
      fontWeight: 800,
      color: foreground,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),

    // name block
    el({
      kind: "text",
      text: "NAME //",
      x: 20,
      y: 108,
      width: 120,
      height: 14,
      fontSize: 10,
      fontWeight: 500,
      color: muted,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: 3,
      uppercase: true,
    }),
    el({
      kind: "text",
      text: "{{name}}",
      x: 20,
      y: 124,
      width: 372,
      height: 74,
      fontSize: 62,
      fontWeight: 800,
      color: foreground,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: -1,
      lineHeight: 0.95,
      uppercase: true,
    }),
    el({
      kind: "text",
      text: "ROLE // {{designation}}",
      x: 20,
      y: 204,
      width: 372,
      height: 20,
      fontSize: 15,
      fontWeight: 700,
      color: foreground,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),
    el({
      kind: "text",
      text: "{{department}}",
      x: 20,
      y: 230,
      width: 372,
      height: 18,
      fontSize: 11,
      fontWeight: 500,
      color: muted,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),

    // vertical separator before right column
    el({ kind: "rect", x: 404, y: 84, width: 1, height: CARD_H - 84, fill: frame }),

    // id block
    el({
      kind: "text",
      text: "SERIAL //",
      x: 20,
      y: 262,
      width: 120,
      height: 14,
      fontSize: 10,
      fontWeight: 500,
      color: muted,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),
    el({
      kind: "text",
      text: "{{id}}",
      x: 20,
      y: 278,
      width: 320,
      height: 36,
      fontSize: 28,
      fontWeight: 800,
      color: foreground,
      align: "left",
      verticalAlign: "middle",
    }),
    el({ kind: "rect", x: 20, y: 322, width: 368, height: 1, fill: frame }),
    el({
      kind: "text",
      text: "{{email}}",
      x: 20,
      y: 332,
      width: 300,
      height: 16,
      fontSize: 11,
      fontWeight: 500,
      color: muted,
      align: "left",
      verticalAlign: "middle",
    }),
    el({
      kind: "text",
      text: "{{phone}}",
      x: 20,
      y: 352,
      width: 300,
      height: 14,
      fontSize: 10,
      fontWeight: 500,
      color: muted,
      align: "left",
      verticalAlign: "middle",
    }),

    // photo
    el({
      kind: "image",
      source: "photo",
      x: photoX,
      y: photoY,
      width: photoSize,
      height: photoSize,
      cornerRadius: 0,
    }),
    ...cornerBrackets(el, photoX, photoY, photoSize, photoSize, 4, seed.accent, 22),
    el({
      kind: "text",
      text: "IDENTITY // PHOTO",
      x: photoX,
      y: photoY + photoSize + 8,
      width: photoSize,
      height: 12,
      fontSize: 9,
      fontWeight: 500,
      color: muted,
      align: "center",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),

    // qr
    el({
      kind: "text",
      text: "VERIFY // SCAN",
      x: photoX,
      y: 252,
      width: photoSize,
      height: 12,
      fontSize: 9,
      fontWeight: 500,
      color: muted,
      align: "center",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),
    el({
      kind: "qr",
      value: "",
      x: photoX + 22,
      y: 268,
      width: photoSize - 44,
      height: photoSize - 44,
    }),
    el({ kind: "rect", x: photoX, y: 264, width: photoSize, height: 1, fill: frame }),
    el({ kind: "rect", x: photoX, y: 372, width: photoSize, height: 1, fill: frame }),

    // footer marker
    el({
      kind: "text",
      text: "GOA // IND",
      x: photoX,
      y: CARD_H - 24,
      width: photoSize,
      height: 14,
      fontSize: 10,
      fontWeight: 700,
      color: seed.accent,
      align: "right",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),
  ];

  return { elements, background, foreground, muted };
}

export function buildTemplate(seed: TemplateSeed): CardTemplate {
  const isHhGoa = seed.slug === "hh-goa-2026";
  const { elements, background } = isHhGoa
    ? hhGoaElements(seed)
    : baseElements(seed);

  return {
    id: `tpl-${seed.slug}`,
    slug: seed.slug,
    name: seed.name,
    width: CARD_W,
    height: CARD_H,
    background,
    accent: seed.accent,
    elements,
  };
}

export function updateElement(
  template: CardTemplate,
  element: CardElement
): CardTemplate {
  return {
    ...template,
    elements: template.elements.map((e) => (e.id === element.id ? element : e)),
  };
}

export function removeElement(template: CardTemplate, id: string): CardTemplate {
  return {
    ...template,
    elements: template.elements.filter((e) => e.id !== id),
  };
}

export function moveElement(
  template: CardTemplate,
  id: string,
  direction: "up" | "down"
): CardTemplate {
  const index = template.elements.findIndex((e) => e.id === id);
  if (index < 0) return template;
  const swap = direction === "up" ? index - 1 : index + 1;
  if (swap < 0 || swap >= template.elements.length) return template;

  const next = [...template.elements];
  [next[index], next[swap]] = [next[swap], next[index]];
  return { ...template, elements: next };
}
