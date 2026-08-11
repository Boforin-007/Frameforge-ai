import type { LucideIcon } from "lucide-react"

import { HhIconTile } from "@/components/ui/icon"

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string
  value: string | number
  hint?: string
  icon: LucideIcon
}) {
  return (
    <div className="hh-sticker bg-hh-cream p-5 text-hh-ink">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate font-mono text-[10px] tracking-[0.2em] text-hh-ink/60 uppercase">
          {label}
        </p>
        <HhIconTile icon={icon} tone="sun" size="size-8" />
      </div>
      <p className="mt-3 font-display text-3xl font-extrabold tracking-tight text-hh-ink">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-hh-ink/60">{hint}</p>}
    </div>
  )
}
