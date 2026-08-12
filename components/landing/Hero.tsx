import { ArrowRight } from "lucide-react"

import { HhFullLogo } from "@/components/branding/HhFullLogo"
import { SharpLink } from "@/components/landing/Editorial"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* faint grid + vignette */}
      <div aria-hidden className="bg-hh-line-grid absolute inset-0 opacity-30" />
      <div aria-hidden className="hh-vignette absolute inset-0" />
      <div aria-hidden className="hh-halftone absolute -bottom-24 -right-20 size-80 opacity-25" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pt-14 pb-6 text-center sm:px-6 sm:pt-20 lg:pt-24">
        {/* event dateline */}
        <p className="font-mono text-[10px] tracking-[0.35em] text-hh-cream/60 uppercase sm:text-xs">
          Goa, India · 28–31 Oct 2026
        </p>
      </div>

      {/* HACKER HOUSE — oversized editorial poster wordmark, GOA logo stamped over the R */}
      <div className="relative">
        <h1
          aria-label="Hacker House Goa"
          className="hh-title-poster font-serif font-bold tracking-tight text-hh-sun uppercase"
        >
          <HhFullLogo textClassName="text-[clamp(2.25rem,10.8vw,9.5rem)] leading-[0.82]" />
        </h1>
        <div aria-hidden className="hh-halftone absolute -top-10 -left-8 size-72 opacity-30" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pt-6 pb-16 text-center sm:px-6 lg:pb-24">
        {/* actions */}
        <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <SharpLink href="/dashboard" className="animate-hh-bob hh-bob-1">
            One-click ID generator <ArrowRight className="size-4" />
          </SharpLink>
        </div>

        <p className="relative mt-10 flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-hh-cream/50 uppercase">
          <span>Photo</span><span className="text-hh-pink">→</span>
          <span>Details</span><span className="text-hh-pink">→</span>
          <span>Generate</span><span className="text-hh-pink">→</span>
          <span>Export</span>
        </p>
      </div>
    </section>
  )
}