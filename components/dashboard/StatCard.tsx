import type { LucideIcon } from "lucide-react"

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
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
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-hh-forest text-hh-cream">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-extrabold tracking-tight text-hh-ink">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-hh-ink/60">{hint}</p>}
    </div>
  )
}
