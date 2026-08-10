import type { ReactNode } from "react"

/** Small technical annotation — mono, tracked out, bracketed. */
export function Tag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`font-mono text-[10px] font-medium tracking-[0.28em] text-hh-cream/60 uppercase ${className}`}
    >
      {children}
    </span>
  )
}

/** Corner brackets for hard rectangular framing. */
export function Corners({ className = "" }: { className?: string }) {
  const base = "absolute size-3.5 border-hh-cream/50"
  return (
    <span aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <span className={`${base} top-0 left-0 border-t-2 border-l-2`} />
      <span className={`${base} top-0 right-0 border-t-2 border-r-2`} />
      <span className={`${base} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${base} right-0 bottom-0 border-r-2 border-b-2`} />
    </span>
  )
}

/** Sharp, non-rounded editorial button. */
export function SharpLink({
  href,
  children,
  variant = "sun",
  className = "",
}: {
  href: string
  children: ReactNode
  variant?: "sun" | "outline" | "ink"
  className?: string
}) {
  const styles = {
    sun: "border-hh-ink bg-hh-sun text-hh-ink hover:bg-hh-sun-2",
    outline: "border-hh-cream/40 bg-transparent text-hh-cream hover:border-hh-cream hover:bg-hh-cream/10",
    ink: "border-hh-ink bg-hh-ink text-hh-cream hover:bg-hh-forest",
  }
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 border-2 px-5 py-2.5 font-display text-sm font-bold tracking-wide uppercase transition-colors ${styles[variant]} ${className}`}
    >
      {children}
    </a>
  )
}
