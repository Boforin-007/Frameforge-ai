import { HhGoaLogo } from "@/components/branding/HhGoaLogo"

/**
 * Full HACKER HOUSE brand logo — the oversized editorial wordmark from the
 * landing hero with the floating GOA logo stamped over the R.
 * Mirrors the Hero composition at a smaller, header-friendly scale.
 */
export function HhFullLogo({
  textClassName = "text-[clamp(1.1rem,2.6vw,2rem)]",
  goaClassName = "h-[0.55em] w-auto",
}: {
  textClassName?: string
  goaClassName?: string
}) {
  return (
    <span
      className={`relative flex items-center justify-center gap-[0.25em] whitespace-nowrap font-serif font-bold tracking-tight text-hh-sun uppercase ${textClassName}`}
    >
      <span className="relative inline-block">
        HACKER
        <HhGoaLogo className={`animate-hh-float-center pointer-events-none absolute top-[38%] left-[104%] ${goaClassName} drop-shadow-[0_4px_0_rgba(11,15,12,0.9)]`} />
      </span>
      HOUSE
    </span>
  )
}
