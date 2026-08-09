import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="border-t border-hh-ink/15 bg-hh-sun py-20 text-hh-ink sm:py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-lg">
          <p className="font-mono text-xs tracking-[0.3em] text-hh-forest uppercase">
            {"// Get started"}
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Your first batch of cards is a template away.
          </h2>
          <p className="mt-3 text-hh-ink/70">
            Set up a template, import a spreadsheet, and export a print-ready
            batch in the same afternoon.
          </p>
        </div>
        <Link
          href="/register"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border-2 border-hh-ink bg-hh-ink px-6 py-3 font-display text-base font-bold text-hh-cream shadow-[4px_5px_0_rgba(11,15,12,0.25)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_3px_0_rgba(11,15,12,0.25)]"
        >
          Start building for free
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
