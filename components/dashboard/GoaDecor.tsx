"use client"

/**
 * Reusable Hack The House — Goa decorative graphics.
 *
 * Local SVG/React-only artwork (no external image URLs) used to frame the
 * dashboard composition: palm silhouette, sun disc, waves, birds, halftone
 * field and a technical coordinate caption. Everything is `pointer-events-none`
 * and meant to sit behind content at low opacity.
 */

function PalmTree({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 200" fill="none" aria-hidden className={className}>
      <path
        d="M60 200 Q54 150 56 92"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="square"
      />
      <path
        d="M57 92 Q34 72 10 58 M57 92 Q30 62 24 30 M57 92 Q52 52 70 26"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="square"
      />
      <path
        d="M59 92 Q84 70 108 60 M59 92 Q88 62 96 30 M59 92 Q64 50 48 24"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="square"
      />
      <circle cx="56" cy="92" r="7" fill="currentColor" />
    </svg>
  )
}

function Waves({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 60" fill="none" aria-hidden className={className}>
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="square">
        <path d="M0 24 q20 -14 40 0 t40 0 t40 0 t40 0 t40 0 t40 0" />
        <path d="M0 44 q20 -14 40 0 t40 0 t40 0 t40 0 t40 0 t40 0" />
      </g>
    </svg>
  )
}

function Birds({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 60" fill="none" aria-hidden className={className}>
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="square">
        <path d="M6 30 q12 -14 24 0 q12 -14 24 0" />
        <path d="M92 18 q10 -12 20 0 q10 -12 20 0" />
        <path d="M128 40 q8 -10 16 0 q8 -10 16 0" />
      </g>
    </svg>
  )
}

function Halftone({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden className={className}>
      <g fill="currentColor">
        {Array.from({ length: 14 }).map((_, y) =>
          Array.from({ length: 14 }).map((_, x) => (
            <circle key={`${x}-${y}`} cx={10 + x * 14} cy={10 + y * 14} r={y % 3 === 0 ? 1.6 : 1} />
          ))
        )}
      </g>
    </svg>
  )
}

/** Frame the dashboard with subtle, low-opacity Goa artwork. */
export function GoaDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* technical grid wash */}
      <div className="bg-hh-line-grid absolute inset-0 opacity-20" />

      {/* sun glow top-right */}
      <div className="absolute -top-10 -right-16 opacity-[0.16]">
        <div className="hh-sun-disc size-[340px]" />
      </div>

      {/* palm bottom-left */}
      <PalmTree className="text-hh-forest-deep/70 absolute -bottom-10 -left-4 h-56 w-auto opacity-90" />

      {/* waves bottom-right */}
      <Waves className="text-hh-cream/25 absolute -right-8 -bottom-6 w-72 opacity-70" />

      {/* birds upper-right */}
      <Birds className="text-hh-cream/30 absolute top-10 right-8 w-28" />

      {/* halftone lower-right */}
      <Halftone className="text-hh-cream/15 absolute -right-16 -bottom-16 size-52" />

      {/* technical coordinates caption */}
      <div className="absolute top-2 left-0 hidden font-mono text-[9px] tracking-[0.3em] text-hh-cream/40 uppercase md:block">
        15.49°N · 73.82°E · GOA, IN
      </div>

      {/* corner crop marks top-left of the composition */}
      <span className="absolute top-0 left-0 size-3 border-t-2 border-l-2 border-hh-sun/60" />
      <span className="absolute top-0 left-3 size-3 border-t-2 border-l-2 border-hh-pink/60" />
    </div>
  )
}
