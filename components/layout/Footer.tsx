import Link from "next/link"

const FOOTER_LINKS = [
  { label: "Editor", href: "#product-preview" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Log in", href: "/login" },
]

export function Footer() {
  return (
    <footer className="border-t border-hh-cream/10 bg-hh-forest-deep text-hh-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-6 items-center justify-center rounded-none bg-hh-sun">
              <span className="font-display text-[10px] font-bold text-hh-ink">
                F
              </span>
            </span>
            <span className="font-display text-sm font-semibold tracking-tight">
              FrameForge AI
            </span>
          </div>
          <p className="mt-2 max-w-sm text-sm text-hh-cream/55">
            Templated ID cards, generated one at a time or by the thousand.
          </p>
          <p className="mt-2 font-mono text-[10px] tracking-[0.25em] text-hh-sun uppercase">
            HH Goa 2026 // Identity systems
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] tracking-[0.2em] text-hh-cream/70 uppercase transition-colors hover:text-hh-sun"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-hh-cream/10 px-4 py-4 sm:px-6">
        <p className="mx-auto max-w-6xl font-mono text-[11px] text-hh-cream/40">
          © {new Date().getFullYear()} FrameForge AI. Built for identity, not just images.
        </p>
      </div>
    </footer>
  )
}
