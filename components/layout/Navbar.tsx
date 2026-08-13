"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { HhFullLogo } from "@/components/branding/HhFullLogo"

const NAV_LINKS = [
  { label: "Create ID", href: "/dashboard" },
   { label: "Downloads", href: "/downloads" },
] as const

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-hh-cream/15 bg-hh-forest/85 text-hh-cream backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <HhFullLogo textClassName="text-[clamp(1.1rem,2.6vw,1.75rem)]" goaClassName="h-[0.5em] w-auto" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[10px] tracking-[0.25em] text-hh-cream/70 uppercase transition-colors hover:text-hh-sun"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <span className="hidden font-mono text-[9px] tracking-[0.2em] text-hh-cream/40 uppercase xl:block">
            Goa, India · 28–31 Oct 2026
          </span>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 border-2 border-hh-ink bg-hh-sun px-4 py-2 font-display text-xs font-bold tracking-wide text-hh-ink uppercase transition-colors hover:bg-hh-sun-2"
          >
            Create ID
            <span aria-hidden className="font-mono">→</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex size-9 items-center justify-center border border-hh-cream/25 text-hh-cream hover:bg-hh-cream/10 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-hh-cream/15 bg-hh-forest px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-l-2 border-transparent px-2 py-2 font-mono text-[10px] tracking-[0.25em] text-hh-cream/80 uppercase hover:border-hh-sun hover:text-hh-sun"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="mt-3 flex items-center justify-center gap-2 border-2 border-hh-ink bg-hh-sun px-4 py-2.5 font-display text-xs font-bold tracking-wide text-hh-ink uppercase"
          >
            One-click ID generator <span aria-hidden className="font-mono">→</span>
          </Link>
        </div>
      )}
    </header>
  )
}