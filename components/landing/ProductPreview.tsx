import { Move3d, Palette, QrCode, Type, ImagePlus, Layers } from "lucide-react"

const TOOLS = [
  { icon: Move3d, label: "Move" },
  { icon: Type, label: "Text" },
  { icon: ImagePlus, label: "Image" },
  { icon: QrCode, label: "QR" },
  { icon: Palette, label: "Style" },
]

const LAYERS = [
  { name: "Background", active: false },
  { name: "Organization logo", active: false },
  { name: "Profile photo", active: false },
  { name: "Full name", active: true },
  { name: "Employee ID", active: false },
  { name: "QR code", active: false },
]

export function ProductPreview() {
  return (
    <section id="product-preview" className="border-t border-hh-cream/10 bg-hh-forest-deep py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-[0.3em] text-hh-sun uppercase">
            {"// The editor"}
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-hh-cream sm:text-4xl">
            One canvas, exactly what gets exported.
          </h2>
          <p className="mt-4 text-lg text-hh-cream/75">
            Arrange every element by hand — logo, photo, name, QR code — and
            the same layout renders server-side for a consistent, high-resolution
            export.
          </p>
        </div>

        <div className="mt-12 overflow-hidden border-2 border-hh-ink bg-hh-forest shadow-[8px_10px_0_rgba(0,0,0,0.25)]">
          {/* toolbar */}
          <div className="flex items-center justify-between border-b border-hh-cream/10 px-4 py-2.5">
            <div className="flex items-center gap-1">
              {TOOLS.map((tool) => (
                <div
                  key={tool.label}
                  className="flex size-7 items-center justify-center rounded-none text-hh-cream/60 first:bg-hh-sun first:text-hh-ink"
                  title={tool.label}
                >
                  <tool.icon className="size-3.5" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-hh-sun" />
              <span className="font-mono text-[11px] text-hh-cream/50">
                Autosaved
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_220px]">
            {/* canvas */}
            <div className="bg-hh-line-grid flex items-center justify-center p-8 sm:p-14">
              <div className="relative w-full max-w-[300px] rotate-[-1deg] hh-sticker bg-hh-cream p-4 text-hh-ink">
                <span className="pointer-events-none absolute -top-2 -left-2 size-3 rotate-45 bg-hh-pink" />
                <span className="absolute inset-2 border border-hh-ink/10" />
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
              </div>
            </div>

            {/* layer panel */}
            <div className="border-t border-hh-cream/10 px-3 py-3 lg:border-t-0 lg:border-l">
              <div className="flex items-center gap-1.5 px-1.5 py-1">
                <Layers className="size-3.5 text-hh-cream/50" />
                <p className="font-mono text-[10px] tracking-wide text-hh-cream/50 uppercase">
                  Layers
                </p>
              </div>
              <ul className="mt-1 space-y-0.5">
                {LAYERS.map((layer) => (
                  <li
                    key={layer.name}
                    className={`border-l-2 px-2.5 py-1.5 text-[13px] ${
                      layer.active
                        ? "border-hh-sun bg-hh-cream/10 text-hh-cream"
                        : "border-transparent text-hh-cream/55"
                    }`}
                  >
                    {layer.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
