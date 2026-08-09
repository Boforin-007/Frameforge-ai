import Link from "next/link"
import type { ReactNode } from "react"

import HHGoaBackground from "@/components/landing/HHGoaBackground"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col items-center bg-hh-forest px-4 py-12 text-hh-cream sm:justify-center">
      <HHGoaBackground />

      <div className="relative z-30 flex w-full flex-col items-center">
        <Link href="/" className="mb-8 flex shrink-0 items-center gap-2.5">
          <span
            aria-hidden
            className="relative flex size-8 items-center justify-center rounded-none bg-hh-sun"
          >
            <span className="absolute inset-[3px] rounded-none border border-hh-ink/30" />
            <span className="font-display text-sm font-bold text-hh-ink">F</span>
          </span>
          <span className="font-display text-[16px] font-semibold tracking-tight">
            FrameForge <span className="text-hh-sun">AI</span>
          </span>
        </Link>

        <div className="w-full max-w-md">{children}</div>

        <p className="mt-8 font-mono text-xs tracking-[0.2em] text-hh-cream/70 uppercase">
          Template once. Generate a thousand times.
        </p>
      </div>
    </div>
  )
}
