import { WORKFLOW_STEPS } from "@/lib/constants"

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-hh-cream/10 bg-hh-forest-deep py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-[0.3em] text-hh-sun uppercase">
            {"// The workflow"}
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-hh-cream sm:text-4xl">
            From spreadsheet to print-ready in four steps.
          </h2>
        </div>

        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {WORKFLOW_STEPS.map((item, index) => (
            <li key={item.step} className="relative">
              <span className="flex size-10 items-center justify-center rounded-full border-2 border-hh-ink bg-hh-sun font-display text-base font-extrabold text-hh-ink">
                {item.step}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-hh-cream">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-hh-cream/70">
                {item.description}
              </p>
              {index < WORKFLOW_STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-4 -right-4 hidden h-px w-8 bg-hh-cream/20 lg:block"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
