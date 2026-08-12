export const VERIFY_BASE_URL =
  process.env.NEXT_PUBLIC_VERIFY_BASE_URL ?? "https://verify.hhgoa.in";

export interface TemplateSeed {
  slug: string
  name: string
  category: string
  description: string
  accent: string
}

export const TEMPLATE_SEEDS: TemplateSeed[] = [
  {
    slug: "hh-goa-2026",
    name: "Hacker House Goa 2026",
    category: "Event",
    description:
      "Portrait credential built on the official Hacker House — Goa card artwork: deep green + tropical sun band, a large circular photo frame, and a cream QR panel. Photo, name, role, tagline, serial and QR stay replaceable over the fixed illustration.",
    accent: "#e8407c",
  },
]