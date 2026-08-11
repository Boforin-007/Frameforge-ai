import type { ComponentType } from "react"
import type { LucideProps } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Hack The House — Goa — unified icon wrapper.
 *
 * Every icon in the app should render through one of these so the whole UI
 * shares the same stroke weight, sizing and retro-editorial alignment:
 *
 *   <HhIcon icon={Download} className="text-hh-ink" />
 *   <HhIcon icon={Trash2} className="text-hh-pink size-4" />
 *
 * Color intentionally comes from the calling context (text-* on the parent or
 * the icon itself) so icons respond to normal / active / hover / destructive
 * states without extra work. The global `.lucide` layer already sets the shared
 * stroke weight, caps and vertical alignment — this wrapper is mainly a typed,
 * convenient surface (plus the default size) so call sites stay consistent.
 */
export type HhIconProps = {
  icon: ComponentType<LucideProps>
  size?: number
  strokeWidth?: number
  className?: string
} & Omit<LucideProps, "className" | "size">

export function HhIcon({
  icon: Icon,
  className,
  ...props
}: HhIconProps) {
  return (
    <Icon
      aria-hidden="true"
      className={cn("hh-icon", className)}
      {...props}
    />
  )
}

/**
 * Squared "event poster" badge holding an icon.
 * Tones map to `hh-icon-tile--*` utilities (sun / forest / pink / cream / ink).
 */
export function HhIconTile({
  icon: Icon,
  tone = "sun",
  size = "size-8",
  iconSize = 16,
  className,
  ...props
}: {
  icon: ComponentType<LucideProps>
  tone?: "sun" | "forest" | "forest-deep" | "pink" | "cream" | "ink"
  size?: string
  iconSize?: number
  className?: string
} & Omit<LucideProps, "className" | "size">) {
  return (
    <span aria-hidden className={cn("hh-icon-tile", `hh-icon-tile--${tone}`, size, className)}>
      <Icon size={iconSize} {...props} />
    </span>
  )
}