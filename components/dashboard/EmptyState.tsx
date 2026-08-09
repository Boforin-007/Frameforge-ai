import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="hh-sticker flex flex-col items-center justify-center bg-hh-cream px-6 py-12 text-center text-hh-ink">
      <span className="flex size-10 items-center justify-center rounded-full bg-hh-forest text-hh-cream">
        <Icon className="size-5" />
      </span>
      <p className="mt-4 font-display text-sm font-bold text-hh-ink">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-hh-ink/60">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
