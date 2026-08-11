import { ArrowRight } from "lucide-react"

import { HhGoaLogo } from "@/components/branding/HhGoaLogo"
import { SharpLink } from "@/components/landing/Editorial"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* faint grid + vignette */}
      <div aria-hidden className="bg-hh-line-grid absolute inset-0 opacity-30" />
      <div aria-hidden className="hh-vignette absolute inset-0" />
      <div aria-hidden className="hh-halftone absolute -bottom-24 -right-20 size-80 opacity-25" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pt-14 pb-16 text-center sm:px-6 sm:pt-20 lg:pt-24 lg:pb-24">
        {/* event dateline */}
        <p className="font-mono text-[10px] tracking-[0.35em] text-hh-cream/60 uppercase sm:text-xs">
          Goa, India · 28–31 Oct 2026
        </p>

        {/* HACKER HOUSE / GOA — editorial serif headline with Goa logo stamped mid-title */}
        <div className="relative mt-6 sm:mt-8">
          <h1 className="relative font-serif font-bold uppercase text-hh-sun leading-[0.82] tracking-tight">
<span className="block text-center text-[15vw] sm:text-8xl lg:text-[9rem]">
                HACKER
              </span>
            <span className="relative block text-center text-[15vw] sm:text-8xl lg:text-[9rem]">
              HOUSE
              <HhGoaLogo className="absolute -top-8 left-1/2 h-14 w-auto -translate-x-1/2 drop-shadow-[0_4px_0_rgba(11,15,12,0.9)] sm:-top-10 sm:h-20 lg:-top-12 lg:h-24" />
            </span>
          </h1>
        </div>

        {/* product identity block */}
        <div className="relative mt-8 flex w-full max-w-3xl flex-col items-center gap-2 border-y border-hh-cream/20 py-4">
          <span className="font-display text-2xl font-extrabold tracking-tight text-hh-cream uppercase sm:text-3xl">
            Identity Generator
          </span>
        </div>

        {/* actions */}
        <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <SharpLink href="/dashboard">
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