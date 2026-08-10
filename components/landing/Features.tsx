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
import { Tag } from "@/components/landing/Editorial"

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
    <section id="features" className="border-t border-hh-cream/15 bg-hh-forest py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 bg-hh-pink" />
              <Tag className="text-hh-sun">{"// Capabilities"}</Tag>
            </div>
            <h2 className="mt-4 text-balance font-display text-3xl font-extrabold tracking-tight text-hh-cream uppercase sm:text-5xl">
              Built to issue cards, not just design them.
            </h2>
          </div>
          <p className="hidden max-w-[240px] font-mono text-[10px] leading-relaxed tracking-[0.2em] text-hh-cream/40 uppercase lg:block">
            Template system // image pipeline // verification // bulk export
          </p>
        </div>

        <div className="mt-14 grid gap-px border-2 border-hh-cream/15 bg-hh-cream/15 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = ICONS[feature.icon]
            return (
              <div
                key={feature.title}
                className="group relative flex flex-col gap-4 bg-hh-forest p-6 transition-colors duration-200 hover:bg-hh-sun sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-11 items-center justify-center border-2 border-hh-cream/30 text-hh-cream transition-colors group-hover:border-hh-ink group-hover:text-hh-ink">
                    <Icon className="size-5" />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.25em] text-hh-cream/40 group-hover:text-hh-ink/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-extrabold tracking-tight text-hh-cream uppercase transition-colors group-hover:text-hh-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-hh-cream/65 transition-colors group-hover:text-hh-ink/75">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
