"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"

import type { SessionUser } from "@/lib/auth/session"

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
  return (
    <div className="relative min-h-full bg-hh-forest text-hh-cream">
      <BeachBackground />

      {/* Slim top bar — brand + Downloads + account, never a sidebar */}
      <header className="sticky top-0 z-40 border-b-2 border-hh-ink/70 bg-hh-forest-deep/90 text-hh-cream backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="relative flex size-7 items-center justify-center rounded-none bg-hh-sun">
              <span className="absolute inset-[3px] rounded-none border border-hh-ink/30" />
              <span className="font-display text-xs font-bold text-hh-ink">H</span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[15px] font-semibold tracking-tight">
                HACKER <span className="text-hh-sun">HOUSE</span>
              </span>
              <span className="mt-1 font-mono text-[8px] tracking-[0.25em] text-hh-cream/45 uppercase">
                Goa · ID generator
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/downloads"
              className="inline-flex items-center gap-1.5 border-2 border-hh-ink bg-hh-sun px-3 py-1.5 font-display text-[11px] font-bold tracking-wide text-hh-ink uppercase transition-colors hover:bg-hh-sun-2"
            >
              Downloads
            </Link>
            <Link href="/settings" className="flex items-center gap-2">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="size-8 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-hh-sun text-xs font-semibold text-hh-ink">
                  {initials(user.name)}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}