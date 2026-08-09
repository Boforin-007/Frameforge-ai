"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { NAV_LINKS } from "@/lib/constants"

function Logomark() {
  return (
    <span
      aria-hidden
      className="relative flex size-7 shrink-0 items-center justify-center rounded-none bg-hh-sun"
    >
      <span className="absolute inset-[3px] rounded-none border border-hh-ink/30" />
      <span className="font-display text-xs font-bold text-hh-ink">
        F
      </span>
    </span>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-hh-cream/10 bg-hh-forest/80 text-hh-cream backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Logomark />
          <span className="font-display text-[15px] font-semibold tracking-tight">
            FrameForge <span className="text-hh-sun">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] tracking-[0.2em] text-hh-cream/70 uppercase transition-colors hover:text-hh-sun"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-hh-cream/80 transition-colors hover:bg-hh-cream/10 hover:text-hh-cream"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full border-2 border-hh-ink bg-hh-sun px-4 py-1.5 text-sm font-bold text-hh-ink shadow-[3px_4px_0_rgba(11,15,12,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-hh-sun-2 hover:shadow-[1px_2px_0_rgba(11,15,12,0.3)]"
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex size-9 items-center justify-center rounded-none text-hh-cream/80 hover:bg-hh-cream/10 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-hh-cream/10 bg-hh-forest px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-none px-2 py-2 font-mono text-[11px] tracking-[0.2em] text-hh-cream/80 uppercase hover:bg-hh-cream/10"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            <Link
              href="/login"
              className="justify-center rounded-full border border-hh-cream/30 px-4 py-2 text-center text-sm font-medium text-hh-cream hover:bg-hh-cream/10"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="justify-center rounded-full border-2 border-hh-ink bg-hh-sun px-4 py-2 text-center text-sm font-bold text-hh-ink"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
