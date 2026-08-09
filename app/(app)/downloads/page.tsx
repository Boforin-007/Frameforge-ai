"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Download,
  FileArchive,
  FileImage,
  FileText,
  Loader2,
  Search,
  Trash2,
} from "lucide-react"

import { EmptyState } from "@/components/dashboard/EmptyState"
import { cn } from "@/lib/utils"

interface CardRecord {
  id: string
  name: string
  format: "png" | "jpg" | "pdf" | "zip"
  fileName?: string
  sizeBytes?: number
  createdAt?: string
}

type FormatFilter = "all" | "png" | "jpg" | "pdf" | "zip"

const FORMATS: FormatFilter[] = ["all", "png", "jpg", "pdf", "zip"]

function formatSize(bytes?: number) {
  if (!bytes) return ""
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function DownloadsPage() {
  const [cards, setCards] = useState<CardRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [formatFilter, setFormatFilter] = useState<FormatFilter>("all")

  useEffect(() => {
    let cancelled = false
    fetch("/api/cards")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (!cancelled) {
          setCards(data.cards ?? [])
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) setError("Couldn’t load your downloads.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function deleteCard(id: string) {
    const confirmed = window.confirm("Delete this download? This can’t be undone.")
    if (!confirmed) return
    const res = await fetch(`/api/cards/${id}`, { method: "DELETE" })
    if (res.ok) {
      setCards((list) => list.filter((c) => c.id !== id))
    } else {
      setError("Couldn’t delete that download.")
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return cards.filter((card) => {
      if (formatFilter !== "all" && card.format !== formatFilter) return false
      if (q && !card.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [cards, query, formatFilter])

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs font-bold tracking-[0.25em] text-hh-sun uppercase">
            {"// History"}
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-hh-cream sm:text-3xl">
            Downloads
          </h1>
          <p className="mt-1 text-hh-cream/70">
            Every PNG, JPG, PDF, and ZIP export you generate, in one place.
          </p>
        </div>
        <Link
          href="/generator"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border-2 border-hh-cream/30 px-4 py-2 text-sm font-semibold text-hh-cream transition-colors hover:border-hh-cream/60 hover:bg-hh-cream/10"
        >
          <Download className="size-4" />
          Export another
        </Link>
      </section>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-sm text-hh-cream/70">
          <Loader2 className="size-4 animate-spin" /> Loading…
        </div>
      ) : error ? (
        <EmptyState icon={Download} title="Something went wrong" description={error} />
      ) : cards.length === 0 ? (
        <EmptyState
          icon={Download}
          title="No exports yet"
          description="Generated cards will appear here so you can re-download them anytime."
          action={
            <Link
              href="/generator"
              className="inline-flex items-center justify-center rounded-full border-2 border-hh-ink bg-hh-sun px-4 py-1.5 text-sm font-bold text-hh-ink shadow-[3px_4px_0_rgba(11,15,12,0.3)]"
            >
              Export a card
            </Link>
          }
        />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-hh-cream/60" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search downloads…"
                className="w-full rounded-full border-2 border-hh-cream/30 bg-transparent py-1.5 pr-3 pl-9 text-sm text-hh-cream outline-none placeholder:text-hh-cream/50 focus:border-hh-sun"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {FORMATS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormatFilter(f)}
                  className={cn(
                    "rounded-full border-2 px-3 py-1 font-mono text-[11px] font-bold tracking-[0.15em] uppercase transition-colors",
                    formatFilter === f
                      ? "border-hh-ink bg-hh-sun text-hh-ink"
                      : "border-hh-cream/30 text-hh-cream hover:bg-hh-cream/10"
                  )}
                >
                  {f === "all" ? "All" : f}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No matching downloads"
              description="Try a different search term or format filter."
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {filtered.map((card) => {
                const Icon =
                  card.format === "zip"
                    ? FileArchive
                    : card.format === "pdf"
                      ? FileText
                      : FileImage
                return (
                  <li
                    key={card.id}
                    className="hh-sticker flex items-center gap-3 bg-hh-cream p-3.5 text-hh-ink"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-hh-forest text-hh-cream">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-hh-ink">{card.name}</p>
                      <p className="truncate font-mono text-xs text-hh-ink/60">
                        {card.format.toUpperCase()}
                        {card.sizeBytes ? ` · ${formatSize(card.sizeBytes)}` : ""}
                        {card.createdAt ? ` · ${formatDate(card.createdAt)}` : ""}
                      </p>
                    </div>
                    <Link
                      href={`/api/export/${card.id}`}
                      className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full border-2 border-hh-ink bg-hh-sun px-3 py-1 text-xs font-bold text-hh-ink shadow-[2px_3px_0_rgba(11,15,12,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5"
                    >
                      <Download className="size-3.5" />
                      Download
                    </Link>
                    <button
                      type="button"
                      aria-label="Delete download"
                      onClick={() => deleteCard(card.id)}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-hh-ink/20 text-hh-ink/60 transition-colors hover:bg-hh-pink/15 hover:text-hh-pink"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
