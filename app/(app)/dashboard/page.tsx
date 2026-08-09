import Link from "next/link"
import {
  CreditCard,
  FolderKanban,
  LayoutTemplate,
  Download,
  ShieldCheck,
  FileSpreadsheet,
  ArrowRight,
  History,
  FolderOpen,
} from "lucide-react"

import { getSessionUser } from "@/lib/auth/session"
import connectDB from "@/lib/db/mongodb"
import ProjectModel from "@/lib/models/project"
import GeneratedCardModel from "@/lib/models/generatedCard"
import TemplateModel from "@/lib/models/template"
import { TEMPLATE_SEEDS } from "@/lib/constants"
import type { ProfileData } from "@/types/template"
import { StatCard } from "@/components/dashboard/StatCard"
import { EmptyState } from "@/components/dashboard/EmptyState"
import { TemplateCard } from "@/components/templates/TemplateCard"

function formatDate(value: Date | undefined) {
  if (!value) return ""
  const diff = Date.now() - new Date(value).getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function DashboardPage() {
  const user = await getSessionUser()
  const firstName = user?.name.split(" ")[0] ?? "there"

  await connectDB()

  const [projectCount, cardCount, savedTemplateCount, recentProjects, recentCards] =
    await Promise.all([
      ProjectModel.countDocuments({ user: user!.id }),
      GeneratedCardModel.countDocuments({ user: user!.id }),
      TemplateModel.countDocuments({ user: user!.id }),
      ProjectModel.find({ user: user!.id }).sort({ updatedAt: -1 }).limit(4).lean().exec(),
      GeneratedCardModel.find({ user: user!.id }).sort({ createdAt: -1 }).limit(4).lean().exec(),
    ])

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs font-bold tracking-[0.25em] text-hh-sun uppercase">
            {"// Workspace"}
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-hh-cream sm:text-3xl">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-1 text-hh-cream/70">
            Pick a template and generate your next batch of ID cards.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            href="/import"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-hh-cream/30 px-4 py-2 text-sm font-semibold text-hh-cream transition-colors hover:border-hh-cream/60 hover:bg-hh-cream/10"
          >
            <FileSpreadsheet className="size-4" />
            Bulk import
          </Link>
          <Link
            href="/templates"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-hh-ink bg-hh-sun px-4 py-2 text-sm font-bold text-hh-ink shadow-[3px_4px_0_rgba(11,15,12,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-hh-sun-2 hover:shadow-[1px_2px_0_rgba(11,15,12,0.3)]"
          >
            <CreditCard className="size-4" />
            Create ID card
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total cards" value={cardCount} hint="Cards generated so far" icon={CreditCard} />
        <StatCard label="Projects" value={projectCount} hint="Saved projects" icon={FolderKanban} />
        <StatCard
          label="Templates"
          value={TEMPLATE_SEEDS.length + savedTemplateCount}
          hint="Available to start from"
          icon={LayoutTemplate}
        />
        <StatCard label="Recent exports" value={recentCards.length} hint="Latest downloads" icon={Download} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-hh-cream">Recent projects</h2>
            <Link
              href="/projects"
              className="flex items-center gap-1 font-mono text-xs font-bold tracking-[0.15em] text-hh-sun uppercase hover:underline"
            >
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <EmptyState
              icon={History}
              title="No projects yet"
              description="Start a new project from a template to see it here."
              action={
                <Link
                  href="/templates"
                  className="inline-flex items-center justify-center rounded-full border-2 border-hh-ink bg-hh-sun px-4 py-1.5 text-sm font-bold text-hh-ink shadow-[3px_4px_0_rgba(11,15,12,0.3)]"
                >
                  Start a project
                </Link>
              }
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {recentProjects.map((project) => {
                const profile = project.profile as ProfileData
                return (
                  <li key={project._id.toString()}>
                    <Link
                      href={`/generator?project=${project._id.toString()}`}
                      className="hh-sticker flex items-center gap-3 bg-hh-cream p-3.5 text-hh-ink transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-hh-forest text-hh-cream">
                        <FolderOpen className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-hh-ink">
                          {profile?.name || "Untitled"}
                        </p>
                        <p className="truncate text-xs text-hh-ink/60">
                          {project.name} · {formatDate(project.updatedAt)}
                        </p>
                      </div>
                      <ArrowRight className="size-4 shrink-0 text-hh-ink/50" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-hh-cream">Recent downloads</h2>
          </div>
          {recentCards.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="Nothing exported yet"
              description="PNG, PDF, and ZIP exports will appear here once you generate your first card."
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {recentCards.map((card) => (
                <li
                  key={card._id.toString()}
                  className="hh-sticker flex items-center gap-3 bg-hh-cream p-3.5 text-hh-ink"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-hh-forest text-hh-cream">
                    <Download className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-hh-ink">{card.name}</p>
                    <p className="truncate text-xs text-hh-ink/60">
                      {card.format.toUpperCase()} · {formatDate(card.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-hh-cream">Popular templates</h2>
            <p className="text-sm text-hh-cream/70">
              Pick a starting point — you can customize everything on canvas.
            </p>
          </div>
          <Link
            href="/templates"
            className="flex shrink-0 items-center gap-1 font-mono text-xs font-bold tracking-[0.15em] text-hh-sun uppercase hover:underline"
          >
            Browse all <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {TEMPLATE_SEEDS.map((template, index) => (
            <TemplateCard key={template.slug} template={template} index={index} />
          ))}
        </div>
      </section>
    </div>
  )
}
