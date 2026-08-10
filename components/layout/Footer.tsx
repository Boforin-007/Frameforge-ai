import Link from "next/link"

import { HhGoaLogo } from "@/components/branding/HhGoaLogo"

const PRODUCT_LINKS = [
  { label: "Editor", href: "#product-preview" },
  { label: "Capabilities", href: "#features" },
  { label: "Workflow", href: "#how-it-works" },
]

const APP_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Templates", href: "/templates" },
  { label: "Generator", href: "/generator" },
  { label: "Downloads", href: "/downloads" },
]

export function Footer() {
  return (
    <footer className="border-t border-hh-cream/15 bg-hh-forest-deep text-hh-cream">
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <HhGoaLogo className="h-9 w-auto" />
              <span className="font-display text-lg font-extrabold tracking-tight">
                FrameForge <span className="text-hh-sun">AI</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-hh-cream/60">
              The identity-generation system for HH Goa 2026 — one template,
              a spreadsheet of names, thousands of verified ID cards and
              profile frames.
            </p>
            <p className="mt-5 font-mono text-[9px] tracking-[0.25em] text-hh-sun uppercase">
              HH Goa 2026 // Identity systems
            </p>
          </div>

          <nav>
            <p className="font-mono text-[10px] tracking-[0.25em] text-hh-cream/40 uppercase">
              Product
            </p>
            <ul className="mt-4 space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-mono text-[11px] tracking-[0.2em] text-hh-cream/70 uppercase transition-colors hover:text-hh-sun"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav>
            <p className="font-mono text-[10px] tracking-[0.25em] text-hh-cream/40 uppercase">
              The app
            </p>
            <ul className="mt-4 space-y-2.5">
              {APP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-mono text-[11px] tracking-[0.2em] text-hh-cream/70 uppercase transition-colors hover:text-hh-sun"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 border-t border-hh-cream/15 pt-8">
          <p className="font-mono text-[9px] tracking-[0.3em] text-hh-cream/40 uppercase">
            FrameForge AI // Identity generation system // Goa, India
          </p>
          <p className="mt-4 overflow-hidden font-display text-[13vw] leading-[0.82] font-extrabold tracking-tighter text-hh-cream/10 uppercase select-none sm:text-8xl">
            FrameForge AI
          </p>
          <p className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-hh-cream/15 pt-4 font-mono text-[10px] tracking-[0.2em] text-hh-cream/45 uppercase">
            <span>© {new Date().getFullYear()} FrameForge AI</span>
            <span>Built for HH Goa builders · PNG · PDF · ZIP</span>
            <span>No database // No accounts</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
