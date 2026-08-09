export type ElementKind = "text" | "image" | "qr" | "rect";

export type ElementAlign = "left" | "center" | "right";
export type ElementVerticalAlign = "top" | "middle" | "bottom";

interface ElementBase {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

export interface TextElementConfig extends ElementBase {
  kind: "text";
  /** Raw value; may include {{field}} placeholders resolved against profile data. */
  text: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  align: ElementAlign;
  verticalAlign: ElementVerticalAlign;
  letterSpacing?: number;
  lineHeight?: number;
  /** Render the resolved value in upper case. */
  uppercase?: boolean;
}

export interface ImageElementConfig extends ElementBase {
  kind: "image";
  /** Which data source this image draws from. */
  source: "photo" | "logo" | "upload";
  /** Direct URL when source is "upload". */
  url?: string;
  cornerRadius?: number;
}

export interface QrElementConfig extends ElementBase {
  kind: "qr";
  /** The value encoded into the QR code. */
  value: string;
  fgColor?: string;
  bgColor?: string;
}

export interface RectElementConfig extends ElementBase {
  kind: "rect";
  fill: string;
  cornerRadius?: number;
}

export type CardElement =
  | TextElementConfig
  | ImageElementConfig
  | QrElementConfig
  | RectElementConfig;

export interface CardTemplate {
  id: string;
  slug: string;
  name: string;
  width: number;
  height: number;
  background: string;
  backgroundImage?: string;
  accent: string;
  elements: CardElement[];
}

export type ProfileField =
  | "name"
  | "id"
  | "designation"
  | "department"
  | "organization"
  | "email"
  | "phone";

/** Profile data bound to a card at render time. */
export interface ProfileData {
  name: string;
  id: string;
  designation: string;
  department: string;
  organization: string;
  email: string;
  phone: string;
  photoUrl?: string;
  logoUrl?: string;
}