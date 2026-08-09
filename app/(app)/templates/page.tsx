import { TemplatesClient } from "@/components/templates/TemplatesClient"

export default function TemplatesPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs tracking-[0.25em] text-hh-sun uppercase">
            {"// Library"}
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-hh-cream sm:text-3xl">
            Templates
          </h1>
          <p className="mt-1 text-hh-cream/70">
            Choose a template to open the editor and make it your own.
          </p>
        </div>
      </section>

      <TemplatesClient />
    </div>
  )
}