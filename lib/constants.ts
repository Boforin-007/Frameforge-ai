export const NAV_LINKS = [
  { label: "Editor", href: "#product-preview" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
] as const

export const FEATURES = [
  {
    icon: "LayoutTemplate",
    title: "Branded templates",
    description:
      "Start from a template that carries your logo, colors, and typography — every card that comes out matches your brand, every time.",
  },
  {
    icon: "MousePointer2",
    title: "Drag-and-drop editor",
    description:
      "Position photos, text, and logos on a live canvas. Resize, reorder, and align elements without touching a design tool.",
  },
  {
    icon: "QrCode",
    title: "QR verification",
    description:
      "Attach a scannable QR code to every card — link it to a profile, a verification URL, or any custom data you choose.",
  },
  {
    icon: "FileSpreadsheet",
    title: "Bulk generation",
    description:
      "Upload a spreadsheet of names and roles and generate hundreds of cards from one template in a single pass.",
  },
  {
    icon: "FileDown",
    title: "High-resolution export",
    description:
      "Export individual cards as PNG or PDF, or download a full batch as a ready-to-print ZIP archive.",
  },
  {
    icon: "ShieldCheck",
    title: "Secure by design",
    description:
      "Uploads are validated and processed server-side, so every project stays consistent and every photo stays protected.",
  },
] as const

export const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Choose a template",
    description:
      "Pick a starting layout or build your own — set the logo, colors, and the fields every card will need.",
  },
  {
    step: "02",
    title: "Add your people",
    description:
      "Fill in a profile by hand, or import a spreadsheet of names, IDs, and departments for bulk projects.",
  },
  {
    step: "03",
    title: "Design on canvas",
    description:
      "Drop in photos, arrange text, and generate a QR code — the canvas mirrors exactly what gets exported.",
  },
  {
    step: "04",
    title: "Export and ship",
    description:
      "Download a single card or the entire batch as a print-ready ZIP, PNG set, or PDF.",
  },
] as const

export const VERIFY_BASE_URL =
  process.env.NEXT_PUBLIC_VERIFY_BASE_URL ?? "https://verify.frameforge.ai";

export const APP_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Projects", href: "/projects", icon: "FolderKanban" },
  { label: "Templates", href: "/templates", icon: "LayoutTemplate" },
  { label: "Generator", href: "/generator", icon: "PenTool" },
  { label: "Bulk import", href: "/import", icon: "FileSpreadsheet" },
  { label: "Downloads", href: "/downloads", icon: "Download" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const

export type AppNavItem = (typeof APP_NAV)[number]

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
    name: "HH Goa 2026",
    category: "Event",
    description:
      "Editorial black-and-white badge for builders on the coast — oversized display type, Goa coordinates, and scan-to-verify.",
    accent: "#e2440f",
  },
  {
    slug: "employee-standard",
    name: "Employee — Standard",
    category: "Employee",
    description: "Logo, photo, name, role, and department on a clean light layout.",
    accent: "#191512",
  },
  {
    slug: "employee-corporate",
    name: "Employee — Corporate",
    category: "Employee",
    description: "A dark, high-contrast badge built for security and access cards.",
    accent: "#efece6",
  },
  {
    slug: "student-campus",
    name: "Student — Campus",
    category: "Student",
    description: "Bright campus card with course, year, and library QR access.",
    accent: "#191512",
  },
  {
    slug: "event-badge",
    name: "Event — Attendee",
    category: "Event",
    description: "Lanyard-ready badge with session, sponsor, and QR check-in.",
    accent: "#191512",
  },
  {
    slug: "conference-ribbon",
    name: "Conference — Lanyard",
    category: "Event",
    description: "Ribbon-style lanyard card with accent stripe and large QR.",
    accent: "#191512",
  },
]
