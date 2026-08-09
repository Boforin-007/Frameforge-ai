import Link from "next/link"
import { ArrowRight, QrCode } from "lucide-react"

function IdCardMock() {
  return (
    <div className="animate-hh-float relative mx-auto w-full max-w-[340px]">
      <div className="relative rotate-[-1.2deg] hh-sticker bg-hh-cream p-4 text-hh-ink transition-transform duration-300 hover:rotate-0">
        {/* top accent bar + pin */}
        <span aria-hidden className="absolute top-0 left-0 h-1 w-full rounded-t-[0.75rem] bg-hh-forest" />
        <span
          aria-hidden
          className="absolute -top-3 left-10 size-5 rounded-full border-2 border-hh-cream bg-hh-pink shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
        />

        <div className="relative flex aspect-[8/5] flex-col">
          {/* top strip */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="size-2 bg-hh-sun" />
              <span className="font-display text-[10px] font-extrabold tracking-[0.25em]">
                HH GOA 2026
              </span>
            </div>
            <span className="font-mono text-[7px] tracking-widest text-hh-ink/60 uppercase">
              15.2993°N / 74.1240°E
            </span>
          </div>
          <div className="mt-1 border-t border-hh-ink/15" />
          <p className="mt-1.5 truncate font-display text-[10px] font-extrabold tracking-[0.2em]">
            Nimbus Labs
          </p>

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
                Role // Senior Designer
              </p>

              <div className="mt-auto">
                <span className="font-mono text-[6.5px] tracking-[0.3em] text-hh-ink/60 uppercase">
                  Serial //
                </span>
                <p className="font-display text-[13px] font-extrabold">NL-0294</p>
                <p className="mt-0.5 truncate font-mono text-[6.5px] text-hh-ink/60">
                  priya@nimbus.dev
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
              FrameForge // Nimbus Labs
            </span>
            <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-hh-forest uppercase">
              Goa // Ind
            </span>
          </div>
        </div>
      </div>

      {/* floating layer chip */}
      <div className="animate-in fade-in-0 slide-in-from-left-2 duration-500 delay-700 fill-mode-both absolute -right-4 -bottom-8 hidden w-36 rotate-[1.5deg] hh-sticker bg-hh-cream p-2.5 text-hh-ink sm:block">
        <p className="px-1 font-mono text-[9px] tracking-[0.2em] text-hh-ink/60 uppercase">
          Layers
        </p>
        <ul className="mt-1 space-y-1">
          {["QR code", "Name", "Photo"].map((layer, index) => (
            <li
              key={layer}
              className="flex items-center gap-1.5 border-l-2 border-hh-sun px-1.5 py-1 text-[11px] text-hh-ink/70"
            >
              <span className="font-mono text-[9px] font-bold text-hh-forest">
                {String(index + 1).padStart(2, "0")}
              </span>
              {layer}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <div>
          <span className="rounded-full border-2 border-hh-ink bg-hh-sun px-3 py-1.5 font-mono text-[11px] font-bold tracking-[0.18em] text-hh-ink uppercase">
            Goa, India · 28–31 Oct 2026
          </span>
          <h1 className="mt-5 max-w-xl text-balance font-display text-4xl leading-[0.98] font-extrabold tracking-tight text-hh-cream uppercase sm:text-5xl lg:text-[3.25rem]">
            Branded ID cards, designed once, generated by the thousand.
          </h1>
          <p className="mt-5 max-w-lg text-pretty text-lg text-hh-cream/80">
            FrameForge AI turns a template and a spreadsheet of names into
            print-ready employee, student, and event ID cards — with QR
            verification built into every one.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-hh-ink bg-hh-sun px-6 py-2.5 font-display text-base font-bold text-hh-ink shadow-[4px_5px_0_rgba(11,15,12,0.35)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-hh-sun-2 hover:shadow-[2px_3px_0_rgba(11,15,12,0.35)]"
            >
              Start building for free
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#product-preview"
              className="inline-flex items-center justify-center rounded-full border-2 border-hh-cream/30 px-6 py-2.5 font-display text-base font-semibold text-hh-cream transition-colors hover:border-hh-cream/60 hover:bg-hh-cream/10"
            >
              See the editor
            </Link>
          </div>
          <p className="mt-6 font-mono text-xs text-hh-cream/60">
            No credit card required · Export as PNG, PDF, or ZIP
          </p>
        </div>

        <IdCardMock />
      </div>
    </section>
  )
}
