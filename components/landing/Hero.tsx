import { ArrowRight, QrCode } from "lucide-react"

import { Corners, SharpLink, Tag } from "@/components/landing/Editorial"

function IdCardMock() {
  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      {/* halftone sun disc behind */}
      <div
        aria-hidden
        className="hh-sun-disc absolute -top-16 -right-20 hidden size-72 opacity-80 sm:block"
      />

      <div className="relative rotate-[-1.4deg] border-2 border-hh-ink bg-hh-cream text-hh-ink">
        <Corners />
        {/* top accent bar */}
        <span aria-hidden className="absolute top-0 left-0 h-1.5 w-full bg-hh-forest" />
        <span
          aria-hidden
          className="absolute -top-3 left-10 size-5 rounded-full border-2 border-hh-ink bg-hh-pink"
        />

        <div className="relative flex aspect-[8/5] flex-col p-4">
          {/* top strip */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 bg-hh-sun" />
              <span className="font-display text-[10px] font-extrabold tracking-[0.25em]">
                HH GOA 2026
              </span>
            </div>
            <span className="font-mono text-[7px] tracking-widest text-hh-ink/60 uppercase">
              15.2993°N / 74.1240°E
            </span>
          </div>
          <div className="mt-1.5 border-t border-hh-ink/15" />

          {/* body */}
          <div className="mt-2 flex flex-1 gap-3">
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="font-mono text-[6.5px] tracking-[0.3em] text-hh-ink/60 uppercase">
                Name //
              </span>
              <p className="mt-0.5 truncate font-display text-[20px] leading-[0.95] font-extrabold tracking-tighter">
                Priya Raman
              </p>
              <p className="mt-1 truncate font-display text-[8px] font-bold tracking-[0.15em] text-hh-forest uppercase">
                Role // Builder · HH Goa
              </p>

              <div className="mt-auto">
                <span className="font-mono text-[6.5px] tracking-[0.3em] text-hh-ink/60 uppercase">
                  Serial //
                </span>
                <p className="font-display text-[13px] font-extrabold">HG-0294</p>
                <p className="mt-0.5 truncate font-mono text-[6.5px] text-hh-ink/60">
                  priya@hhgoa.build
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-center gap-1.5">
              <div className="relative size-[72px]">
                <span className="absolute inset-0 border-2 border-hh-ink" />
                <div className="absolute inset-1.5 bg-hh-forest/20" />
                <span className="absolute top-0 left-0 size-2.5 border-t-2 border-l-2 border-hh-ink" />
                <span className="absolute top-0 right-0 size-2.5 border-t-2 border-r-2 border-hh-ink" />
                <span className="absolute bottom-0 left-0 size-2.5 border-b-2 border-l-2 border-hh-ink" />
                <span className="absolute right-0 bottom-0 size-2.5 border-r-2 border-b-2 border-hh-ink" />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="relative bg-white p-1">
                  <QrCode className="size-[46px] text-hh-ink" />
                </div>
                <span className="font-mono text-[5.5px] tracking-[0.25em] text-hh-ink/60 uppercase">
                  Verify // Scan
                </span>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="mt-2 flex items-center justify-between border-t border-hh-ink/15 pt-1">
            <span className="font-mono text-[6px] tracking-[0.15em] text-hh-ink/60 uppercase">
              FrameForge AI // Identity system
            </span>
            <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-hh-forest uppercase">
              Goa // Ind
            </span>
          </div>
        </div>
      </div>

      {/* annotation chips */}
      <div className="absolute -left-10 -bottom-7 hidden rotate-[1.5deg] border-2 border-hh-ink bg-hh-sun px-3 py-2 text-hh-ink md:block">
        <p className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase">
          QR verify // scan
        </p>
      </div>
      <div className="absolute -right-6 top-14 hidden rotate-[-1.5deg] border-2 border-hh-cream/60 bg-hh-forest px-3 py-2 text-hh-cream lg:block">
        <p className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase">
          Export // PNG · PDF · ZIP
        </p>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* faint grid + vignette */}
      <div aria-hidden className="bg-hh-line-grid absolute inset-0 opacity-40" />
      <div aria-hidden className="hh-vignette absolute inset-0" />
      <div aria-hidden className="hh-halftone absolute -bottom-20 -left-16 size-64 opacity-30" />

      <div className="relative mx-auto max-w-6xl px-4 pt-14 pb-12 sm:px-6 sm:pt-20 lg:pt-24 lg:pb-16">
        {/* top annotation row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-hh-cream/20 py-2.5">
          <Tag>FrameForge AI // Identity generation system</Tag>
          <Tag>Goa, India · 28–31 Oct 2026</Tag>
          <Tag className="hidden md:block">15.2993°N / 74.1240°E</Tag>
        </div>

        <div className="mt-12 grid items-center gap-16 lg:mt-16 lg:grid-cols-[7fr_5fr]">
          {/* copy */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 bg-hh-pink" />
              <Tag className="text-hh-sun">Build / Generate / Export</Tag>
            </div>

            <h1 className="mt-6 font-display font-extrabold tracking-tight text-hh-cream uppercase">
              <span className="block text-5xl leading-[0.88] sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
                Identity,
              </span>
              <span className="block text-5xl leading-[0.88] text-hh-sun sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
                generated<span className="text-hh-pink">.</span>
              </span>
              <span className="mt-3 block font-mono text-xs tracking-[0.3em] text-hh-cream/70 sm:text-sm">
                FOR HH GOA BUILDERS // 2026
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-pretty text-base text-hh-cream/80 sm:text-lg">
              FrameForge AI turns one template and a spreadsheet of names into
              thousands of verified ID cards and profile frames — designed on
              canvas, exported as print-ready PNG, PDF, or ZIP.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <SharpLink href="/dashboard">
                Create / Generate <ArrowRight className="size-4" />
              </SharpLink>
              <SharpLink href="/templates" variant="outline">
                Browse templates
              </SharpLink>
            </div>

            <p className="mt-6 font-mono text-[10px] tracking-[0.25em] text-hh-cream/50 uppercase">
              PNG · PDF · ZIP · QR VERIFY · BULK IMPORT · NO SETUP
            </p>
          </div>

          {/* card demo */}
          <div className="relative">
            <IdCardMock />
          </div>
        </div>

        </div>
    </section>
  )
}
