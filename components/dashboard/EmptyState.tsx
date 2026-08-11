import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

import { HhIconTile } from "@/components/ui/icon"

export function EmptyState({
  icon,
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
      <HhIconTile icon={icon} tone="sun" size="size-12" iconSize={20} />
      <p className="mt-4 font-display text-sm font-bold text-hh-ink">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-hh-ink/60">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
