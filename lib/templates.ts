import type { CardElement, CardTemplate, ProfileData } from "@/types/template";
import type { TemplateSeed } from "@/lib/constants";
import { roleTagline } from "@/lib/taglines";

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
    if (key === "tagline") return roleTagline(data.designation);
    const value = data[key as keyof ProfileData];
    return typeof value === "string" ? value : "";
  });
}

const CARD_W = 600;
const CARD_H = 375;
const PORTRAIT_W = 900;
const PORTRAIT_H = 1350;
const HH_CARD_W = 1122;
const HH_CARD_H = 1402;

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
      text: "VERIFIED // HH-01",
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
      text: "HACKER HOUSE // {{organization}}",
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

const HH_CREAM = "#fdf6e3";
const HH_MUTED = "#9db8a4";
const HH_SERIF = "'Times New Roman', Times, serif";

/**
 * Hacker House Goa 2026 credential over `public/templates/hh-goa-id-card.png`.
 *
 * The PNG is the fixed illustrated artwork (deep green + tropical sun band +
 * bottom cream panel). Only the dynamic fields are overlaid:
 *
 *  · HACKER HOUSE wordmark + floating GOA stamp — centred on the empty header
 *  · circular profile photo — cream circle centred at (552, 509), r≈131
 *  · name / role / tagline / serial — centred on the sun band (y≈660–930)
 *  · QR — cream square placeholder at (≈488–616, 940–1080)
 *
 * The bottom panel is intentionally left clear.
 */
function hhGoaElements(_seed: TemplateSeed): Palette {
  void _seed;

  const el = (data: ElementInput): CardElement =>
    ({ ...data, id: uid() }) as CardElement;

  const glyph = (x: number, y: number, w: number, fontSize: number, text: string, color = HH_CREAM, align: "left" | "center" = "left", weight = 700) =>
    el({
      kind: "text",
      text,
      x,
      y,
      width: w,
      height: fontSize + 10,
      fontSize,
      fontWeight: weight,
      color,
      align,
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    });

  // centre of the circular photo frame in the PNG artwork
  const photoCx = 552;
  const photoCy = 535;
  const photoR = 130;
  const photoSize = photoR * 2;

  const elements: CardElement[] = [
   // ── HEADER — HhGoaLogo mark, stacked above one centred wordmark ──
    // Same asset as components/branding/HhGoaLogo.tsx. Stacked (icon above
    // text) instead of inline, so the wordmark always has the card's full
    // centred width to lay out in and can never wrap into or collide with
    // the icon again.
    el({
      kind: "image",
      source: "upload",
      url: "/branding/goa-logo.svg",
      x: 566,
      y: 170,
      width: 75,
      height: 75,
    }),
    el({
      kind: "text",
      text: "HACKER HOUSE",
      x: 111,
      y: 130,
      width: 900,
      height: 70,
      fontSize: 84,
      fontWeight: 800,
      color: "#ffe08a",
      align: "center",
      verticalAlign: "middle",
      letterSpacing: 4,
      fontFamily: HH_SERIF,
      uppercase: true,
    }),

    // ── CIRCULAR PROFILE PHOTO — centred on the baked-in cream circle ──
    el({
      kind: "image",
      source: "photo",
      x: photoCx - photoR,
      y: photoCy - photoR,
      width: photoSize,
      height: photoSize,
      cornerRadius: photoR,
    }),

    // ── NAME — centred on the sun band, directly under the photo ──
    el({
      kind: "text",
      text: "{{name}}",
      x: 111,
      y: 720,
      width: 900,
      height: 60,
      fontSize: 42,
      fontWeight: 800,
      color: "#12301f",
      align: "center",
      verticalAlign: "middle",
      letterSpacing: -0.5,
      fontFamily: "Fredoka",
      uppercase: true,
    }),

    // ── ROLE — centred on the card, 2 sizes bigger than the default ──
    el({
      kind: "text",
      text: "{{designation}}",
      x: 111,
      y: 795,
      width: 900,
      height: 46,
      fontSize: 32,
      fontWeight: 800,
      color: "#0c5c34",
      align: "center",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),

    // ── BUILDER META ──
el({
  kind: "text",
  text: "HACKER HOUSE GOA",
  x: 111,
  y: 885,
  width: 900,
  height: 28,
  fontSize: 18,
  fontWeight: 700,
  color: "#244a05",
  align: "center",
  verticalAlign: "middle",
  letterSpacing: 2,
  uppercase: true,
}),

el({
  kind: "text",
  text: "{{id}}",
  x: 111,
  y: 850,
  width: 900,
  height: 30,
  fontSize: 22,
  fontWeight: 700,
  color: "#244a05",
  align: "center",
  verticalAlign: "middle",
  letterSpacing: 2,
  uppercase: true,
}),

    // ── TAGLINE — subtle, role-derived, slightly below the role ──

   el({
      kind: "text",
      text: '{{tagline}}',
      x: 210,
      y: 1250,
      width: 700,
      height: 30,
      fontSize: 35,
      fontWeight: 700,
      color: "#244a05",
      align: "center",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),

    // ── QR — cream square placeholder in the lower-center area ──
    el({
      kind: "rect",
      x: 488,
      y: 940,
      width: 128,
      height: 128,
      fill: "#ffffff",
      cornerRadius: 2,
    }),
    ...panelBorder(el, 488, 940, 128, 128, 2, "#d9b25f"),
    el({
      kind: "qr",
      value: "",
      x: 498,
      y: 950,
      width: 108,
      height: 108,
    }),
  ];

  return { elements, background: "#0c3a24", foreground: HH_CREAM, muted: HH_MUTED };
}

/** Thin gold border around a panel: four rects painted on top of the panel fill. */
function panelBorder(
  el: (data: ElementInput) => CardElement,
  x: number,
  y: number,
  w: number,
  h: number,
  t: number,
  color: string
): CardElement[] {
  return [
    el({ kind: "rect", x, y, width: w, height: t, fill: color }),
    el({ kind: "rect", x, y: y + h - t, width: w, height: t, fill: color }),
    el({ kind: "rect", x, y, width: t, height: h, fill: color }),
    el({ kind: "rect", x: x + w - t, y, width: t, height: h, fill: color }),
  ];
}

/**
 * "Goa Tropical Identity" — portrait-format illustrated profile frame.
 * The illustrated Goan coastline (ocean, palms, monstera, lighthouse, sunset,
 * shells, gold frame) lives in `public/templates/goa-tropical-bg.svg` and is
 * rendered behind the editable canvas elements via `CardTemplate.backgroundImage`.
 */
function goaTropicalElements(seed: TemplateSeed): Palette {
  const ink = "#12301f";
  const forest = "#0c5c34";
  const muted = "#55705b";
  const cream = "#f2ead3";
  const gold = seed.accent;
  const goldText = "#a97c2f";

  const el = (data: ElementInput): CardElement =>
    ({ ...data, id: uid() }) as CardElement;

  const elements: CardElement[] = [
    // ── TOP IDENTITY HEADER ──
    el({
      kind: "rect",
      x: 80,
      y: 100,
      width: 740,
      height: 220,
      fill: cream,
      cornerRadius: 26,
    }),
    ...panelBorder(el, 80, 100, 740, 220, 3, gold),
    ...cornerBrackets(el, 96, 116, 708, 188, 4, gold, 20),

    // circular profile photo (top-left)
    el({
      kind: "image",
      source: "photo",
      x: 132,
      y: 152,
      width: 118,
      height: 118,
      cornerRadius: 59,
    }),
    // sun chip
    el({ kind: "rect", x: 274, y: 138, width: 14, height: 14, fill: gold }),

    el({
      kind: "text",
      text: "{{name}}",
      x: 302,
      y: 116,
      width: 480,
      height: 54,
      fontSize: 42,
      fontWeight: 800,
      color: ink,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: -0.5,
      uppercase: true,
    }),
    el({
      kind: "text",
      text: "EVENT // 28–31 OCT 2026",
      x: 548,
      y: 172,
      width: 236,
      height: 16,
      fontSize: 11,
      fontWeight: 600,
      color: goldText,
      align: "right",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),
    el({
      kind: "text",
      text: "{{designation}}",
      x: 302,
      y: 176,
      width: 244,
      height: 26,
      fontSize: 18,
      fontWeight: 700,
      color: forest,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: 1,
      uppercase: true,
    }),
    el({
      kind: "text",
      text: "{{organization}}",
      x: 302,
      y: 208,
      width: 480,
      height: 22,
      fontSize: 15,
      fontWeight: 600,
      color: muted,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),
    el({
      kind: "text",
      text: "{{email}}",
      x: 492,
      y: 246,
      width: 292,
      height: 18,
      fontSize: 13,
      fontWeight: 500,
      color: muted,
      align: "right",
      verticalAlign: "middle",
    }),
    el({
      kind: "text",
      text: "SERIAL // {{id}}",
      x: 302,
      y: 246,
      width: 300,
      height: 22,
      fontSize: 15,
      fontWeight: 800,
      color: ink,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: 1,
      uppercase: true,
    }),

    // ── CENTRAL PROFILE AREA ──
    // gold ring behind the portrait
    el({
      kind: "rect",
      x: 326,
      y: 380,
      width: 248,
      height: 248,
      fill: gold,
      cornerRadius: 124,
    }),
    // large circular profile photo
    el({
      kind: "image",
      source: "photo",
      x: 342,
      y: 396,
      width: 220,
      height: 220,
      cornerRadius: 110,
    }),
    ...cornerBrackets(el, 318, 372, 264, 264, 4, gold, 18),

    // center info panel
    el({
      kind: "rect",
      x: 110,
      y: 676,
      width: 680,
      height: 240,
      fill: cream,
      cornerRadius: 26,
    }),
    ...panelBorder(el, 110, 676, 680, 240, 3, gold),
    el({
      kind: "text",
      text: "PROFILE //",
      x: 146,
      y: 702,
      width: 200,
      height: 16,
      fontSize: 11,
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
      x: 146,
      y: 724,
      width: 608,
      height: 48,
      fontSize: 38,
      fontWeight: 800,
      color: ink,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: -0.5,
      uppercase: true,
    }),
    el({ kind: "rect", x: 146, y: 782, width: 608, height: 3, fill: gold }),

    el({
      kind: "text",
      text: "{{designation}}",
      x: 146,
      y: 802,
      width: 300,
      height: 30,
      fontSize: 20,
      fontWeight: 800,
      color: forest,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: 1,
      uppercase: true,
    }),
    el({
      kind: "text",
      text: "{{organization}}",
      x: 460,
      y: 802,
      width: 300,
      height: 26,
      fontSize: 16,
      fontWeight: 600,
      color: muted,
      align: "right",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),
    el({
      kind: "text",
      text: "{{department}}",
      x: 146,
      y: 840,
      width: 300,
      height: 24,
      fontSize: 15,
      fontWeight: 500,
      color: muted,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),
    el({
      kind: "text",
      text: "{{phone}}",
      x: 460,
      y: 842,
      width: 300,
      height: 22,
      fontSize: 15,
      fontWeight: 500,
      color: ink,
      align: "right",
      verticalAlign: "middle",
    }),

    // ── QR AREA ──
    el({
      kind: "rect",
      x: 350,
      y: 944,
      width: 200,
      height: 200,
      fill: "#ffffff",
      cornerRadius: 20,
    }),
    ...panelBorder(el, 350, 944, 200, 200, 3, gold),
    el({
      kind: "qr",
      value: "",
      x: 366,
      y: 960,
      width: 168,
      height: 168,
    }),
    el({
      kind: "text",
      text: "SCAN // VERIFY ID",
      x: 320,
      y: 1152,
      width: 260,
      height: 16,
      fontSize: 11,
      fontWeight: 700,
      color: goldText,
      align: "center",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),

    // ── BOTTOM INFORMATION PANEL ──
    el({
      kind: "rect",
      x: 110,
      y: 1192,
      width: 680,
      height: 114,
      fill: cream,
      cornerRadius: 24,
    }),
    ...panelBorder(el, 110, 1192, 680, 114, 3, gold),
    el({
      kind: "text",
      text: "ABOUT //",
      x: 146,
      y: 1216,
      width: 200,
      height: 16,
      fontSize: 11,
      fontWeight: 500,
      color: muted,
      align: "left",
      verticalAlign: "middle",
      letterSpacing: 3,
      uppercase: true,
    }),
    el({
      kind: "text",
      text: "{{description}}",
      x: 146,
      y: 1240,
      width: 520,
      height: 52,
      fontSize: 18,
      fontWeight: 500,
      color: ink,
      align: "left",
      verticalAlign: "top",
      lineHeight: 1.2,
      letterSpacing: 0.2,
    }),
    el({
      kind: "text",
      text: "GOA // IND",
      x: 560,
      y: 1252,
      width: 194,
      height: 16,
      fontSize: 12,
      fontWeight: 800,
      color: goldText,
      align: "right",
      verticalAlign: "middle",
      letterSpacing: 2,
      uppercase: true,
    }),
  ];

  return { elements, background: "#0b2e1c", foreground: ink, muted };
}

export function buildTemplate(seed: TemplateSeed): CardTemplate {
  const isPortrait = seed.slug === "goa-tropical";
  const isHhGoa = seed.slug === "hh-goa-2026";
  const { elements, background } = isPortrait
    ? goaTropicalElements(seed)
    : isHhGoa
      ? hhGoaElements(seed)
      : baseElements(seed);

  const backgroundImage = isPortrait
    ? "/templates/goa-tropical-bg.svg"
    : isHhGoa
      ? "/templates/hh-goa-id-card.png"
      : undefined;

  return {
    id: `tpl-${seed.slug}`,
    slug: seed.slug,
    name: seed.name,
    width: isPortrait ? PORTRAIT_W : isHhGoa ? HH_CARD_W : CARD_W,
    height: isPortrait ? PORTRAIT_H : isHhGoa ? HH_CARD_H : CARD_H,
    background,
    backgroundImage,
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
