import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { HhGoaLogo } from "@/components/branding/HhGoaLogo"

export function CTA() {
  return (
    <section className="relative overflow-hidden border-t border-hh-ink bg-hh-sun py-20 text-hh-ink sm:py-28">
      <div aria-hidden className="hh-halftone-ink absolute top-0 right-0 size-56 opacity-20" />
      <div aria-hidden className="hh-halftone-ink absolute bottom-0 left-0 size-40 opacity-10" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-hh-ink/25 py-2.5">
          <span className="font-mono text-[10px] font-bold tracking-[0.28em] uppercase">
            {"// Get started"}
          </span>
          <span className="font-mono text-[10px] tracking-[0.28em] uppercase">
            15.2993°N / 74.1240°E
          </span>
          <span className="font-mono text-[10px] font-bold tracking-[0.28em] uppercase">
            Build / Generate / Export
          </span>
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="max-w-3xl text-balance font-display text-4xl leading-[0.95] font-extrabold tracking-tight uppercase sm:text-6xl lg:text-7xl">
              Your first batch is a{" "}
              <span className="border-2 border-hh-ink bg-hh-cream px-2">template</span>{" "}
              away<span className="text-hh-pink">.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base text-hh-ink/75 sm:text-lg">
              Design once, import a spreadsheet, and export a print-ready batch
              of verified ID cards — built for HH Goa builders.
            </p>
          </div>

          <div className="flex flex-col items-start gap-5">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 border-2 border-hh-ink bg-hh-ink px-7 py-3.5 font-display text-base font-bold tracking-wide text-hh-cream uppercase transition-colors hover:bg-hh-forest"
            >
              Start generating <ArrowRight className="size-4" />
            </Link>
            <div className="flex items-center gap-3">
              <HhGoaLogo className="h-9 w-auto" />
              <span className="font-mono text-[9px] tracking-[0.25em] text-hh-ink/60 uppercase">
                HH Goa 2026 // 28–31 Oct
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
