import Link from "next/link"

import { cn } from "@/lib/utils"
import type { TemplateSeed } from "@/lib/constants"

export function TemplateCard({
  template,
  index = 0,
  className,
}: {
  template: TemplateSeed
  index?: number
  className?: string
}) {
  const monogram = template.name.replace(/[^A-Za-z0-9]/g, "").charAt(0) || "F"

  return (
    <Link
      href={`/generator?template=default-${template.slug}`}
      className={cn(
        "group block hh-sticker bg-hh-cream p-3 text-hh-ink transition-all duration-300 hover:-translate-y-1 hover:rotate-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <div className="relative flex aspect-[1.586] w-full flex-col justify-between overflow-hidden bg-hh-cream p-4">
        {/* hairline inner frame */}
        <div className="pointer-events-none absolute inset-2 border border-hh-ink/10" />

        {/* giant watermark monogram */}
        <span className="pointer-events-none absolute -top-3 -right-1 font-display text-[72px] leading-none font-extrabold tracking-tight text-hh-forest/10 select-none">
          {monogram}
        </span>

        <div className="relative flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-[0.22em] text-hh-ink/50 uppercase">
            {template.category}
          </span>
          <span className="size-2 bg-hh-sun" />
        </div>

        <div className="relative flex items-end justify-between">
          <span className="font-mono text-[9px] tracking-[0.22em] text-hh-ink/50 uppercase">
            No. {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-display text-sm font-extrabold tracking-tight text-hh-ink">
            {template.name.includes("—")
              ? template.name.split("—")[0].trim().toUpperCase()
              : template.name.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="px-1 pt-3 pb-1">
        <p className="truncate font-display text-sm font-bold text-hh-ink">
          {template.name}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-hh-ink/60">
          {template.description}
        </p>
      </div>
    </Link>
  )
}
