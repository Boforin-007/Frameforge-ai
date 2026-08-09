import { ProjectsClient } from "@/components/projects/ProjectsClient"

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="font-mono text-xs tracking-[0.25em] text-hh-sun uppercase">
          {"// Workspace"}
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-hh-cream sm:text-3xl">
          Projects
        </h1>
        <p className="mt-1 text-hh-cream/70">
          Every design you save, ready to reopen and keep editing.
        </p>
      </section>

      <ProjectsClient />
    </div>
  )
}