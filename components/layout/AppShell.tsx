"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import type { SessionUser } from "@/lib/auth/session"
import { HhFullLogo } from "@/components/branding/HhFullLogo"

const APP_LINKS = [
  { label: "Create ID", href: "/dashboard" },
  { label: "Downloads", href: "/downloads" },
] as const

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

/**
 * Fixed, full-viewport "Goa sunrise at the beach" backdrop: the house on the
 * sunrise field, a band of palm/tree silhouettes along the bottom, a warm sun
 * glow on top and a scrim so content stays readable.
 */
function BeachBackground() {
  return (
    <>
      {/* house on the sunrise */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/Sun rise.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* tree silhouettes grounded along the bottom — shown whole, never cropped */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 flex h-[46vh] items-end">
        <Image
          src="/footer trees.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-contain object-bottom"
        />
      </div>

      {/* ocean tint + readability scrim */}
      <div className="pointer-events-none fixed inset-0 z-[5] bg-gradient-to-b from-hh-forest/70 via-hh-forest/55 to-hh-forest-deep/80" />
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[6] h-[480px]"
        style={{
          background:
            "radial-gradient(55% 60% at 50% 0%, rgba(254,225,1,0.3) 0%, rgba(254,225,1,0.08) 45%, rgba(11,104,57,0) 75%)",
        }}
      />
    </>
  )
}

export function AppShell({
  user,
  children,
}: {
  user: SessionUser
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative min-h-full bg-hh-forest text-hh-cream">
      <BeachBackground />

      {/* Editorial top bar — brand / nav / event + primary action */}
      <header className="sticky top-0 z-40 border-b-2 border-hh-ink/70 bg-hh-forest-deep/90 text-hh-cream backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* LEFT — compact branding */}
          <Link href="/dashboard" className="flex shrink-0 items-center">
            <HhFullLogo textClassName="text-[clamp(1.1rem,2.6vw,1.75rem)]" goaClassName="h-[0.5em] w-auto" />
          </Link>

          {/* CENTER — existing navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {APP_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[10px] tracking-[0.25em] text-hh-cream/70 uppercase transition-colors hover:text-hh-sun"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT — event info + primary action + account */}
          <div className="flex items-center gap-2.5">
            <span className="hidden font-mono text-[9px] tracking-[0.2em] text-hh-cream/40 uppercase lg:block">
              Goa, India · 28–31 Oct 2026
            </span>
            <Link
              href="/dashboard"
              className="hidden items-center gap-1.5 border-2 border-hh-ink bg-hh-sun px-3 py-1.5 font-display text-[11px] font-bold tracking-wide text-hh-ink uppercase transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-hh-sun-2 sm:inline-flex"
            >
              Create ID <span aria-hidden className="font-mono">→</span>
            </Link>
            <Link href="/settings" className="flex shrink-0 items-center">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="size-8 shrink-0 rounded-none border-2 border-hh-ink object-cover"
                />
              ) : (
                <span className="flex size-8 shrink-0 items-center justify-center rounded-none border-2 border-hh-ink bg-hh-sun text-xs font-semibold text-hh-ink">
                  {initials(user.name)}
                </span>
              )}
            </Link>
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
        </div>

        {open && (
          <div className="border-t border-hh-cream/15 bg-hh-forest px-4 pb-4 md:hidden">
            <nav className="flex flex-col gap-1 pt-3">
              {APP_LINKS.map((link) => (
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

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}