"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Check, FolderKanban, Loader2, Pencil, Search, Trash2, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/dashboard/EmptyState"

interface Project {
  id: string
  name: string
  personName: string
  templateName: string
  createdAt?: string
  updatedAt?: string
}

function formatDate(value?: string) {
  if (!value) return ""
  const date = new Date(value)
  const diff = Date.now() - date.getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

export function ProjectsClient() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [savingId, setSavingId] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  function loadProjects() {
    fetch("/api/projects")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        setProjects(data.projects ?? [])
        setError(null)
      })
      .catch(() => setError("Couldn’t load your projects."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProjects()
  }, [])

  async function renameProject(id: string) {
    if (!editName.trim()) return
    setSavingId(id)
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      })
      if (!res.ok) throw new Error("Rename failed")
      setProjects((list) =>
        list.map((p) => (p.id === id ? { ...p, name: editName.trim() } : p))
      )
      setEditingId(null)
    } catch {
      setError("Couldn’t rename that project.")
    } finally {
      setSavingId(null)
    }
  }

  async function deleteProject(id: string) {
    const confirmed = window.confirm("Delete this project? This can’t be undone.")
    if (!confirmed) return
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
    if (res.ok) {
      setProjects((list) => list.filter((p) => p.id !== id))
    } else {
      setError("Couldn’t delete that project.")
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return projects
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.personName || "").toLowerCase().includes(q) ||
        (p.templateName || "").toLowerCase().includes(q)
    )
  }, [projects, query])

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-sm text-hh-cream/70">
          <Loader2 className="size-4 animate-spin" /> Loading…
        </div>
      ) : error ? (
        <EmptyState icon={FolderKanban} title="Something went wrong" description={error} />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Open a template in the generator and press “Save project” to keep your designs here."
          action={
            <Link
              href="/generator"
              className="inline-flex items-center justify-center rounded-full border-2 border-hh-ink bg-hh-sun px-4 py-1.5 text-sm font-bold text-hh-ink shadow-[3px_4px_0_rgba(11,15,12,0.3)]"
            >
              Start a project
            </Link>
          }
        />
      ) : (
        <>
          <div className="relative sm:max-w-xs">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-hh-cream/60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects…"
              className="w-full rounded-full border-2 border-hh-cream/30 bg-transparent py-1.5 pr-3 pl-9 text-sm text-hh-cream outline-none placeholder:text-hh-cream/50 focus:border-hh-sun"
            />
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No matching projects"
              description="Try a different search term."
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {filtered.map((project) => (
                <li
                  key={project.id}
                  className="flex items-center gap-3 hh-sticker bg-hh-cream p-3.5 text-hh-ink transition-all duration-300 hover:-translate-y-0.5"
                >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-hh-forest text-hh-cream">
                <FolderKanban className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                {editingId === project.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") renameProject(project.id)
                        if (e.key === "Escape") setEditingId(null)
                      }}
                      className="h-8 max-w-sm border-hh-ink/30"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => renameProject(project.id)}
                      disabled={savingId === project.id}
                      aria-label="Save name"
                      className="flex size-8 items-center justify-center rounded-full border-2 border-hh-ink bg-hh-sun text-hh-ink transition-transform hover:scale-110 disabled:pointer-events-none disabled:opacity-50"
                    >
                      {savingId === project.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Check className="size-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      aria-label="Cancel"
                      className="flex size-8 items-center justify-center rounded-full border-2 border-hh-ink/20 text-hh-ink/60 transition-colors hover:bg-hh-ink/5"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="truncate text-sm font-bold text-hh-ink">{project.name}</p>
                    <p className="truncate text-xs text-hh-ink/60">
                      {project.personName || "Untitled person"} · {project.templateName} ·{" "}
                      {formatDate(project.updatedAt)}
                    </p>
                  </>
                )}
              </div>
              <div className="flex shrink-0 gap-1.5">
                <Link
                  href={`/generator?project=${project.id}`}
                  className="inline-flex items-center justify-center rounded-full border-2 border-hh-ink bg-hh-sun px-3 py-1 text-xs font-bold text-hh-ink transition-transform hover:scale-105"
                >
                  Open
                </Link>
                <button
                  type="button"
                  aria-label="Rename project"
                  onClick={() => {
                    setEditingId(project.id)
                    setEditName(project.name)
                  }}
                  className="flex size-8 items-center justify-center rounded-full border-2 border-hh-ink/20 text-hh-ink/60 transition-colors hover:bg-hh-ink/5"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Delete project"
                  onClick={() => deleteProject(project.id)}
                  className="flex size-8 items-center justify-center rounded-full border-2 border-hh-ink/20 text-hh-ink/60 transition-colors hover:bg-hh-pink/15 hover:text-hh-pink"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
