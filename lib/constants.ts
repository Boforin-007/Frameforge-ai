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
      "Compact portrait credential in the Hacker House — Goa language: deep green, gold sun over the ocean, a clean gold frame and an editorial HACKER HOUSE / GOA lockup. Photo, ID, role, QR and role tagline stay replaceable.",
    accent: "#e8407c",
  },
]