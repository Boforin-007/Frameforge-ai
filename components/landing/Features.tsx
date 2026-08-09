import {
  LayoutTemplate,
  MousePointer2,
  QrCode,
  FileSpreadsheet,
  FileDown,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"

import { FEATURES } from "@/lib/constants"

const ICONS: Record<string, LucideIcon> = {
  LayoutTemplate,
  MousePointer2,
  QrCode,
  FileSpreadsheet,
  FileDown,
  ShieldCheck,
}

export function Features() {
  return (
    <section id="features" className="border-t border-hh-cream/10 bg-hh-forest py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-[0.3em] text-hh-sun uppercase">
            {"// Everything the workflow needs"}
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-hh-cream sm:text-4xl">
            Built for teams that issue cards, not just design them.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = ICONS[feature.icon]
            return (
              <div
                key={feature.title}
                className={`hh-sticker group bg-hh-cream p-6 text-hh-ink transition-all duration-300 hover:-translate-y-1 hover:rotate-0 ${
                  index % 2 === 0 ? "rotate-[0.7deg]" : "rotate-[-0.7deg]"
                }`}
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-hh-forest text-hh-cream transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-4.5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-hh-ink">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-hh-ink/70">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
