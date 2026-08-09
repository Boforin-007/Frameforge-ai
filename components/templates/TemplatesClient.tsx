"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Bookmark,
  Check,
  LayoutTemplate,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { TEMPLATE_SEEDS, type TemplateSeed } from "@/lib/constants"
import { TemplateCard } from "@/components/templates/TemplateCard"
import { EmptyState } from "@/components/dashboard/EmptyState"

interface SavedTemplate {
  id: string
  name: string
  isDefault: boolean
  accent?: string
  data?: unknown
  createdAt?: string
}

type Tab = "browse" | "mine"

export function TemplatesClient() {
  const [tab, setTab] = useState<Tab>("browse")
  const [templates, setTemplates] = useState<SavedTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [savingRename, setSavingRename] = useState(false)

  useEffect(() => {
    if (tab !== "mine") return
    let cancelled = false
    fetch("/api/templates")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (cancelled) return
        setTemplates((data.templates ?? []).filter((t: SavedTemplate) => !t.isDefault))
        setError(null)
      })
      .catch(() => {
        if (!cancelled) setError("Couldn’t load your templates.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [tab])

  async function removeTemplate(id: string) {
    const res = await fetch(`/api/templates/${id}`, { method: "DELETE" })
    if (!res.ok) return
    setTemplates((list) => list.filter((t) => t.id !== id))
  }

  async function renameTemplate(id: string) {
    if (!editName.trim()) return
    setSavingRename(true)
    try {
      const res = await fetch(`/api/templates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      })
      if (!res.ok) throw new Error("Rename failed")
      setTemplates((list) =>
        list.map((t) => (t.id === id ? { ...t, name: editName.trim() } : t))
      )
      setEditingId(null)
    } catch {
      setError("Couldn’t rename that template.")
    } finally {
      setSavingRename(false)
    }
  }

  const seeds: TemplateSeed[] = TEMPLATE_SEEDS.map((s) => ({ ...s }))

  return (
    <div>
      <div className="mb-5 flex items-center gap-1 border-b border-hh-cream/15">
        <button
          type="button"
          onClick={() => setTab("browse")}
          className={cn(
            "flex items-center gap-1.5 border-b-2 px-3 pb-2 font-mono text-xs font-bold tracking-[0.15em] uppercase transition-colors",
            tab === "browse"
              ? "border-hh-sun text-hh-sun"
              : "border-transparent text-hh-cream/60 hover:text-hh-cream"
          )}
        >
          <LayoutTemplate className="size-4" /> Browse
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("mine")
            setLoading(true)
          }}
          className={cn(
            "flex items-center gap-1.5 border-b-2 px-3 pb-2 font-mono text-xs font-bold tracking-[0.15em] uppercase transition-colors",
            tab === "mine"
              ? "border-hh-sun text-hh-sun"
              : "border-transparent text-hh-cream/60 hover:text-hh-cream"
          )}
        >
          <Bookmark className="size-4" /> My templates
        </button>
        <span className="flex-1" />
        <Link
          href="/generator"
          className="mb-2 inline-flex shrink-0 items-center justify-center gap-1 rounded-full border-2 border-hh-ink bg-hh-sun px-3 py-1 text-xs font-bold text-hh-ink shadow-[2px_3px_0_rgba(11,15,12,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5"
        >
          <Plus className="size-3.5" /> New design
        </Link>
      </div>

      {tab === "browse" ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {seeds.map((template, index) => (
            <TemplateCard key={template.slug} template={template} index={index} />
          ))}
        </section>
      ) : (
        <section>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-hh-cream/70">
              <Loader2 className="size-4 animate-spin" /> Loading…
            </div>
          ) : error ? (
            <EmptyState icon={Bookmark} title="Something went wrong" description={error} />
          ) : templates.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No saved templates yet"
              description="Open a template in the editor, customize it, then press “Save template” to keep it here."
              action={
                <Link
                  href="/generator"
                  className="inline-flex items-center justify-center rounded-full border-2 border-hh-ink bg-hh-sun px-4 py-1.5 text-sm font-bold text-hh-ink shadow-[3px_4px_0_rgba(11,15,12,0.3)]"
                >
                  Start designing
                </Link>
              }
            />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {templates.map((t) => {
                const monogram =
                  t.name.replace(/[^A-Za-z0-9]/g, "").charAt(0) || "T"
                const isEditing = editingId === t.id
                return (
                  <li
                    key={t.id}
                    className="group flex flex-col hh-sticker bg-hh-cream p-3 text-hh-ink transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Link
                      href={`/generator?template=${t.id}`}
                      aria-label={`Edit ${t.name}`}
                      className="relative flex aspect-[1.586] w-full items-center justify-center overflow-hidden bg-hh-cream p-4"
                    >
                      <span className="pointer-events-none absolute -top-3 -right-1 font-display text-[72px] leading-none font-extrabold text-hh-forest/10">
                        {monogram}
                      </span>
                      <span className="relative truncate font-display text-[11px] font-extrabold text-hh-ink">
                        {t.name}
                      </span>
                    </Link>
                    <div className="flex items-center justify-between gap-2 px-1 pt-3 pb-1">
                      {isEditing ? (
                        <div className="flex min-w-0 flex-1 items-center gap-1.5">
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") renameTemplate(t.id)
                              if (e.key === "Escape") setEditingId(null)
                            }}
                            autoFocus
                            className="min-w-0 flex-1 rounded-full border-2 border-hh-ink/30 bg-transparent px-2.5 py-1 text-sm text-hh-ink outline-none focus:border-hh-ink"
                          />
                          <button
                            type="button"
                            aria-label="Save name"
                            onClick={() => renameTemplate(t.id)}
                            disabled={savingRename || !editName.trim()}
                            className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-hh-ink bg-hh-sun text-hh-ink transition-transform hover:scale-110 disabled:pointer-events-none disabled:opacity-50"
                          >
                            {savingRename ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Check className="size-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            aria-label="Cancel"
                            onClick={() => setEditingId(null)}
                            className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-hh-ink/20 text-hh-ink/60 transition-colors hover:bg-hh-ink/5"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Link
                            href={`/generator?template=${t.id}`}
                            className="min-w-0 flex-1 truncate font-display text-sm font-bold text-hh-ink hover:text-hh-forest"
                          >
                            {t.name}
                          </Link>
                          <div className="flex shrink-0 gap-1">
                            <button
                              type="button"
                              aria-label="Rename template"
                              onClick={() => {
                                setEditingId(t.id)
                                setEditName(t.name)
                              }}
                              className="flex size-7 items-center justify-center rounded-full border-2 border-hh-ink/20 text-hh-ink/60 transition-colors hover:bg-hh-ink/5"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              aria-label="Delete template"
                              onClick={() => removeTemplate(t.id)}
                              className="flex size-7 items-center justify-center rounded-full border-2 border-hh-ink/20 text-hh-ink/60 transition-colors hover:bg-hh-pink/15 hover:text-hh-pink"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
