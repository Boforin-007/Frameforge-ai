import { WORKFLOW_STEPS } from "@/lib/constants"
import { Tag } from "@/components/landing/Editorial"

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative border-t border-hh-cream/15 bg-hh-forest-deep py-20 sm:py-28"
    >
      <div aria-hidden className="hh-halftone absolute -top-10 right-1/4 size-40 opacity-20" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 bg-hh-sun" />
              <Tag className="text-hh-sun">{"// Workflow"}</Tag>
            </div>
            <h2 className="mt-4 text-balance font-display text-3xl font-extrabold tracking-tight text-hh-cream uppercase sm:text-5xl">
              Spreadsheet in. Print-ready out.
            </h2>
          </div>
          <p className="hidden max-w-[240px] font-mono text-[10px] leading-relaxed tracking-[0.2em] text-hh-cream/40 uppercase lg:block">
            No design tool required // no database // no setup
          </p>
        </div>

        <ol className="mt-16 grid gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-0">
          {WORKFLOW_STEPS.map((item, index) => (
            <li
              key={item.step}
              className={`relative flex flex-col border-hh-cream/15 lg:border-l-2 lg:px-6 lg:first:border-l-0 lg:first:pl-0 ${
                index % 2 === 1 ? "lg:translate-y-10" : ""
              }`}
            >
              <span className="font-display text-6xl leading-none font-extrabold tracking-tighter text-hh-cream/15 sm:text-7xl">
                {item.step}
              </span>
              <span className="mt-4 h-1 w-10 bg-hh-pink" />
              <h3 className="mt-3 font-display text-lg font-extrabold tracking-tight text-hh-cream uppercase">
                {item.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-hh-cream/70">
                {item.description}
              </p>
              <span className="mt-5 font-mono text-[9px] tracking-[0.25em] text-hh-cream/40 uppercase">
                Step {index + 1} / 04
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
