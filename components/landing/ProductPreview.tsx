import { Move3d, Palette, QrCode, Type, ImagePlus, Layers } from "lucide-react"

import { Corners, Tag } from "@/components/landing/Editorial"

const TOOLS = [
  { icon: Move3d, label: "Move" },
  { icon: Type, label: "Text" },
  { icon: ImagePlus, label: "Image" },
  { icon: QrCode, label: "QR" },
  { icon: Palette, label: "Style" },
]

const LAYERS = [
  { name: "Background", index: "01", active: false },
  { name: "Org logo", index: "02", active: false },
  { name: "Profile photo", index: "03", active: false },
  { name: "Full name", index: "04", active: true },
  { name: "Employee ID", index: "05", active: false },
  { name: "QR code", index: "06", active: false },
]

export function ProductPreview() {
  return (
    <section
      id="product-preview"
      className="relative border-t border-hh-cream/15 bg-hh-forest-deep py-20 sm:py-28"
    >
      <div aria-hidden className="hh-halftone absolute top-10 right-0 size-40 opacity-20" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 bg-hh-sun" />
              <Tag className="text-hh-sun">{"// The editor"}</Tag>
            </div>
            <h2 className="mt-4 text-balance font-display text-3xl font-extrabold tracking-tight text-hh-cream uppercase sm:text-5xl">
              One canvas. Exactly what exports.
            </h2>
            <p className="mt-5 max-w-xl text-base text-hh-cream/75 sm:text-lg">
              Arrange every element by hand — logo, photo, name, QR code — and
              the same layout renders server-side for a consistent,
              high-resolution export.
            </p>
          </div>
          <p className="hidden font-mono text-[10px] tracking-[0.25em] text-hh-cream/40 uppercase lg:block">
            Editor v0.1 // Konva stage
          </p>
        </div>

        <div className="relative mt-12 border-2 border-hh-ink bg-hh-forest">
          <Corners />
          {/* toolbar */}
          <div className="flex items-center justify-between border-b border-hh-cream/15 px-4 py-2.5">
            <div className="flex items-center gap-1">
              {TOOLS.map((tool) => (
                <div
                  key={tool.label}
                  className="flex size-8 items-center justify-center border border-hh-cream/20 text-hh-cream/70 first:border-hh-ink first:bg-hh-sun first:text-hh-ink"
                  title={tool.label}
                >
                  <tool.icon className="size-3.5" />
                </div>
              ))}
              <span className="ml-2 hidden border-l border-hh-cream/15 pl-3 font-mono text-[9px] tracking-[0.2em] text-hh-cream/50 uppercase sm:block">
                Insert // Layer
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] text-hh-cream/50 uppercase">
                <span className="size-2 animate-pulse bg-hh-pink" /> Rec
              </span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-hh-cream/50 uppercase">
                Autosaved
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_240px]">
            {/* canvas */}
            <div className="bg-hh-line-grid relative flex items-center justify-center p-8 sm:p-14">
              <span className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.2em] text-hh-cream/40 uppercase">
                Stage // 1200 × 750
              </span>

              <div className="relative w-full max-w-[300px] rotate-[-1deg] border-2 border-hh-ink bg-hh-cream p-4 text-hh-ink">
                <div className="relative flex aspect-[8/5] flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 bg-hh-sun" />
                      <span className="font-display text-[9px] font-extrabold tracking-[0.25em]">
                        HH GOA 2026
                      </span>
                    </div>
                    <span className="font-mono text-[6px] tracking-widest text-hh-ink/50 uppercase">
                      15.2993°N / 74.1240°E
                    </span>
                  </div>
                  <div>
                    <span className="block h-[3px] w-3/4 bg-hh-ink" />
                    <span className="mt-1.5 block h-[3px] w-1/2 bg-hh-forest/25" />
                  </div>
                  <div className="flex items-center justify-between border-t border-hh-ink/15 pt-1.5">
                    <span className="font-mono text-[6px] tracking-[0.25em] text-hh-ink/60 uppercase">
                      Serial // 001
                    </span>
                    <span className="truncate font-display text-[9px] font-extrabold tracking-[0.15em]">
                      NIMBUS LABS
                    </span>
                  </div>
                </div>

                {/* annotation: selected name layer */}
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-hh-pink px-2 py-0.5 font-mono text-[8px] font-bold tracking-[0.2em] text-hh-cream uppercase">
                  Name layer ◀
                </span>
              </div>

              <span className="absolute right-3 bottom-3 hidden font-mono text-[9px] tracking-[0.2em] text-hh-cream/40 uppercase sm:block">
                Export preview // crisp
              </span>
            </div>

            {/* layer panel */}
            <div className="border-t border-hh-cream/15 px-3 py-3 lg:border-t-0 lg:border-l">
              <div className="flex items-center gap-1.5 px-1.5 py-1">
                <Layers className="size-3.5 text-hh-cream/50" />
                <p className="font-mono text-[9px] tracking-[0.2em] text-hh-cream/50 uppercase">
                  Layers
                </p>
              </div>
              <ul className="mt-1 space-y-0.5">
                {LAYERS.map((layer) => (
                  <li
                    key={layer.name}
                    className={`flex items-center gap-2 border-l-2 px-2.5 py-1.5 text-[13px] ${
                      layer.active
                        ? "border-hh-sun bg-hh-cream/10 text-hh-cream"
                        : "border-transparent text-hh-cream/55"
                    }`}
                  >
                    <span className="font-mono text-[8px] text-hh-cream/40">{layer.index}</span>
                    {layer.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* status bar */}
          <div className="flex items-center justify-between border-t border-hh-cream/15 px-4 py-2">
            <span className="font-mono text-[9px] tracking-[0.2em] text-hh-cream/40 uppercase">
              X 120 // Y 240 // Zoom 100%
            </span>
            <span className="font-mono text-[9px] tracking-[0.2em] text-hh-cream/40 uppercase">
              QR // Verify link auto
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
