"use client"

import { useId, useMemo, useRef, useState } from "react"
import {
  Check,
  Download,
  FileText,
  ImageUp,
  Loader2,
  MoveHorizontal,
  MoveVertical,
  QrCode,
  RotateCcw,
  Share2,
  X,
  ZoomIn,
} from "lucide-react"

import type {
  CardElement,
  CardTemplate,
  ImageElementConfig,
  ProfileData,
} from "@/types/template"
import { TEMPLATE_SEEDS, VERIFY_BASE_URL } from "@/lib/constants"
import { buildTemplate } from "@/lib/templates"
import CanvasEditor, {
  type CanvasEditorHandle,
} from "@/components/editor/CanvasEditor"
import { downloadDataUrl, recordExports } from "@/lib/client-export"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { roleTagline } from "@/lib/taglines"
import { GoaDecor } from "@/components/dashboard/GoaDecor"

function buildHhGoaTemplate(): CardTemplate {
  const seed = TEMPLATE_SEEDS[0]
  return buildTemplate(seed)
}

function generateCardId(seed: string): string {
  const hash = seed.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase()
  const token = hash.padEnd(4, "X")
  return `HH-2026-${token}`
}

interface PhotoAdjust {
  zoom: number
  x: number
  y: number
}

export function OneClickGenerator({
  defaultOrganization,
}: {
  defaultOrganization?: string
}) {
  const baseTemplate = useMemo(() => buildHhGoaTemplate(), [])
  const canvasRef = useRef<CanvasEditorHandle>(null)

  const [name, setName] = useState("")
  const id = generateCardId(useId())
  const [designation, setDesignation] = useState("")
  const [organization, setOrganization] = useState(defaultOrganization ?? "")
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined)
  const [adjust, setAdjust] = useState<PhotoAdjust>({ zoom: 1, x: 0, y: 0 })
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [exporting, setExporting] = useState<"png" | "pdf" | null>(null)
  const [sharing, setSharing] = useState(false)

  const profile: ProfileData = useMemo(
    () => ({
      name,
      id,
      designation,
      department: "",
      organization,
      email: "",
      phone: "",
      description: "",
      photoUrl,
      logoUrl: "/branding/goa-logo.svg",
    }),
    [name, id, designation, organization, photoUrl]
  )

  /** Apply the QR value + live photo adjustments onto the base template. */
  const template: CardTemplate = useMemo(() => {
    const value = `${VERIFY_BASE_URL}/${id || "hh-goa"}`
    return {
      ...baseTemplate,
      elements: baseTemplate.elements.map((el) => {
        if (el.kind === "qr") return { ...el, value }
        if (el.kind === "image" && el.source === "photo") {
          return {
            ...el,
            cropZoom: adjust.zoom,
            cropX: adjust.x,
            cropY: adjust.y,
          } satisfies ImageElementConfig
        }
        return el
      }),
    }
  }, [baseTemplate, id, adjust])

  const photoElement = useMemo(
    () =>
      (baseTemplate.elements.find(
        (el): el is ImageElementConfig =>
          el.kind === "image" && el.source === "photo"
      ) as CardElement | undefined) ?? null,
    [baseTemplate.elements]
  )

  async function handlePhoto(file: File | undefined) {
    if (!file) return
    setUploadError(null)
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadError("Use a JPEG, PNG, or WebP image.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5 MB.")
      return
    }
    setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-upload-kind": "photo" },
        body: form,
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.url) {
        setUploadError(data?.error ?? "Upload failed.")
        return
      }
      setPhotoUrl(data.url)
      setAdjust({ zoom: 1, x: 0, y: 0 })
    } catch {
      setUploadError("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  async function generate(format: "png" | "pdf") {
    setExporting(format)
    try {
      const mime = "image/png"
      const dataUrl = await canvasRef.current?.renderToDataUrl(4, mime)
      if (!dataUrl) return
      const baseName = name.trim() || id || "hh-goa-card"
      const fileName = `${baseName}.png`
      if (format === "png") {
        downloadDataUrl(dataUrl, fileName)
      }
      const records = await recordExports(
        [{ fileName, dataUrl, verifyId: id || undefined, profile, template }],
        format === "pdf" ? { pdf: true, pdfName: baseName } : undefined
      )
      if (format === "pdf") {
        const pdf = records.find((r) => r.format === "pdf")
        if (pdf) {
          const link = document.createElement("a")
          link.href = `/api/export/${pdf.id}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    } catch {
      // Keep the local download even if recording the export fails.
    } finally {
      setExporting(null)
    }
  }

  async function shareOnX() {
    setSharing(true)
    try {
      const dataUrl = await canvasRef.current?.renderToDataUrl(4, "image/png")
      if (!dataUrl) return
      const verifyUrl = `${VERIFY_BASE_URL}/${id || "hh-goa"}`
      const status = `${name.trim() || "HACKER HOUSE"} · ${roleTagline(designation)} — grab my Hacker House Goa ID → ${verifyUrl}`

      const hasShareFiles = typeof navigator !== "undefined" && "canShare" in navigator
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], `${name.trim() || "hh-goa-card"}.png`, {
        type: "image/png",
      })

      // Native share sheet (Android/iOS/Edge/Chrome) — X shows up as a target.
      if (hasShareFiles && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text: status })
          return
        } catch {
          // User dismissed the sheet — fall through to the web intent as a handy fallback.
        }
      }

      // Web fallback: open an X (Twitter) composer pre-filled with the status.
      const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(status)}`
      const win = window.open(intent, "_blank", "noopener,noreferrer")
      if (win) win.opener = null
    } catch {
      // Ignore share failures — nothing to download in this flow.
    } finally {
      setSharing(false)
    }
  }

  return (
    <div
      className="relative"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Goa decorative frame */}
      <GoaDecor />

      <div className="relative z-10 space-y-10">
        {/* ═════ MAIN HERO / GENERATOR — headline + live preview ═════ */}
        <section className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* LEFT — headline + quick form */}
          <div className="flex flex-col gap-6">
            <div>
              <div>
                <h1
                  className="font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] font-bold tracking-tight text-hh-sun uppercase"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  No bugs.
                  <br />
                  Just beaches.
                </h1>
              </div>
            </div>

            {/* ═════ QUICK GENERATION FORM — field data ═════ */}
            <section className="rounded-none border-2 border-hh-ink bg-hh-cream p-5 text-hh-ink shadow-[6px_8px_0_rgba(0,0,0,0.25)]">
              <div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="font-mono text-sm font-bold tracking-[0.2em] text-hh-ink/70 uppercase">
                      Full name
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="rounded-none border-2 border-hh-ink/30 text-base focus:border-hh-ink"
                      autoFocus
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="font-mono text-sm font-bold tracking-[0.2em] text-hh-ink/70 uppercase">
                      Role / designation
                    </Label>
                    <Input
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="Robotics Builder"
                      className="rounded-none border-2 border-hh-ink/30 text-base focus:border-hh-ink"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="font-mono text-sm font-bold tracking-[0.2em] text-hh-ink/70 uppercase">
                      Organization
                    </Label>
                    <Input
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Hacker House Goa"
                      className="rounded-none border-2 border-hh-ink/30 text-base focus:border-hh-ink"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t-2 border-dashed border-hh-ink/25 pt-3">
                  <span className="border-2 border-hh-ink bg-hh-sun px-2 py-1 font-mono text-[9px] font-bold tracking-[0.15em] text-hh-ink uppercase">
                    Tagline
                  </span>
                  <p className="min-w-0 flex-1 truncate text-sm font-semibold tracking-wide text-hh-ink/75 uppercase">
                    {"\"NO BUGS. JUST BEACHES.\""}
                  </p>
                </div>
              </div>
            </section>

            {/* ═════ PHOTO + CROP ═════ */}
            <section className="rounded-none border-2 border-hh-ink bg-hh-cream p-5 text-hh-ink shadow-[6px_8px_0_rgba(0,0,0,0.25)]">
              <div>
                {photoUrl ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-none border-2 border-hh-ink/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photoUrl}
                          alt="Profile photo"
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-[0.15em] text-hh-ink/60 uppercase">
                          <Check className="size-3 text-hh-forest" /> Photo
                          attached
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <label className="inline-flex cursor-pointer items-center gap-1 rounded-none border-2 border-hh-ink/25 px-2.5 py-1 text-[11px] font-semibold text-hh-ink transition-colors hover:bg-hh-ink/5">
                            <ImageUp className="size-3.5" />
                            <span>Replace</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="sr-only"
                              onChange={(e) => handlePhoto(e.target.files?.[0])}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setPhotoUrl(undefined)}
                            className="inline-flex items-center justify-center gap-1 rounded-none border-2 border-hh-ink/25 px-2.5 py-1 text-[11px] font-semibold text-hh-ink transition-colors hover:bg-hh-ink/5"
                          >
                            <X className="size-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    <AdjustSlider
                      icon={<ZoomIn className="size-3.5" />}
                      label="Zoom"
                      min={1}
                      max={4}
                      step={0.1}
                      value={adjust.zoom}
                      display={`${Math.round(adjust.zoom * 100)}%`}
                      onChange={(v) => setAdjust((a) => ({ ...a, zoom: v }))}
                    />
                    <AdjustSlider
                      icon={<MoveHorizontal className="size-3.5" />}
                      label="Pan left / right"
                      min={-1}
                      max={1}
                      step={0.02}
                      value={adjust.x}
                      onChange={(v) => setAdjust((a) => ({ ...a, x: v }))}
                    />
                    <AdjustSlider
                      icon={<MoveVertical className="size-3.5" />}
                      label="Pan up / down"
                      min={-1}
                      max={1}
                      step={0.02}
                      value={adjust.y}
                      onChange={(v) => setAdjust((a) => ({ ...a, y: v }))}
                    />

                    <button
                      type="button"
                      onClick={() => setAdjust({ zoom: 1, x: 0, y: 0 })}
                      className="inline-flex items-center justify-center gap-1.5 self-start rounded-none border-2 border-hh-ink/25 px-3 py-1.5 text-xs font-semibold text-hh-ink transition-colors hover:bg-hh-ink/5"
                    >
                      <RotateCcw className="size-3.5" /> Reset adjustment
                    </button>
                  </div>
                ) : (
                  <label className="animate-hh-bob hh-bob-1 flex cursor-pointer items-center justify-center gap-2 rounded-none border-2 border-dashed border-hh-ink/40 bg-hh-ink/5 px-4 py-3 text-center transition-colors hover:border-hh-ink hover:bg-hh-ink/10">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(e) => handlePhoto(e.target.files?.[0])}
                    />
                    {uploading ? (
                      <Loader2 className="size-4 animate-spin text-hh-ink/60" />
                    ) : (
                      <ImageUp className="size-4 text-hh-ink/60" />
                    )}
                    <span className="text-sm font-bold text-hh-ink">
                      Upload photo
                    </span>
                    <span className="text-xs text-hh-ink/60">
                      JPEG, PNG, WebP · max 5 MB
                    </span>
                  </label>
                )}
                {uploadError && (
                  <p className="mt-2 text-xs text-hh-pink">{uploadError}</p>
                )}
                {photoUrl && !photoElement && (
                  <p className="mt-2 text-xs text-hh-ink/60">
                    No photo slot on this template — adjustments won&apos;t show.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT — large live ID preview */}
          <div className="lg:sticky lg:top-24">
            <div className="mb-3 flex items-center gap-3">
              <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-hh-pink uppercase">
                {"// LIVE PREVIEW"}
              </p>
              <span className="h-px flex-1 bg-hh-cream/15" />
              <span className="border-2 border-hh-ink bg-hh-sun px-2 py-1 font-mono text-[9px] font-bold tracking-[0.15em] text-hh-ink uppercase">
                3:4 · Live
              </span>
            </div>
            <div className="bg-hh-line-grid relative flex w-full items-start justify-center overflow-auto rounded-none border-2 border-hh-ink bg-hh-forest/60 p-6 shadow-[0_24px_60px_-24px_rgba(7,38,24,0.9)] sm:p-8">
              <div className="shrink-0 border-2 border-hh-ink bg-hh-cream p-2">
                <CanvasEditor
                  ref={canvasRef}
                  template={template}
                  profile={profile}
                  selectedId={null}
                  onSelect={() => {}}
                  onUpdateElement={() => {}}
                  readOnly
                  fitWidth={400}
                />
              </div>
            </div>

            {/* ═════ DOWNLOAD / EXPORT ═════ */}
            <section className="mt-4 flex flex-col items-center gap-3 rounded-none border-2 border-hh-ink bg-hh-cream/95 p-4 text-hh-ink shadow-[6px_8px_0_rgba(0,0,0,0.25)]">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => generate("png")}
                  disabled={exporting !== null}
                  className="inline-flex items-center justify-center gap-1.5 rounded-none border-2 border-hh-ink bg-hh-sun px-4 py-2 text-sm font-display font-extrabold tracking-wide text-hh-ink uppercase shadow-[3px_4px_0_rgba(0,0,0,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-hh-sun-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  {exporting === "png" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Download className="size-4" />
                  )}
                  {exporting === "png" ? "Generating…" : "Download · PNG"}
                </button>
                <button
                  type="button"
                  onClick={() => generate("pdf")}
                  disabled={exporting !== null}
                  className="inline-flex items-center justify-center gap-1.5 rounded-none border-2 border-hh-ink/30 px-4 py-2 text-sm font-bold tracking-wide text-hh-ink uppercase transition-colors hover:border-hh-ink hover:bg-hh-ink/5 disabled:pointer-events-none disabled:opacity-50"
                >
                  {exporting === "pdf" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <FileText className="size-4" />
                  )}
                  {exporting === "pdf" ? "Exporting…" : "Download · PDF"}
                </button>
                <button
                  type="button"
                  onClick={shareOnX}
                  disabled={sharing}
                  className="inline-flex items-center justify-center gap-1.5 rounded-none border-2 border-hh-ink bg-hh-ink px-4 py-2 text-sm font-bold tracking-wide text-hh-cream uppercase transition-colors hover:bg-hh-forest disabled:pointer-events-none disabled:opacity-50"
                >
                  {sharing ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Share2 className="size-4" />
                  )}
                  Share on X
                </button>
              </div>
              <p className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] text-hh-ink/55 uppercase">
                <QrCode className="size-3.5" /> ID {id || "generating…"} · QR
                auto-embeds · verify.hhgoa.in/{id || "hh-goa"}
              </p>
            </section>
          </div>
        </section>
      </div>
    </div>
  )
}

function AdjustSlider({
  icon,
  label,
  min,
  max,
  step,
  value,
  display,
  onChange,
}: {
  icon: React.ReactNode
  label: string
  min: number
  max: number
  step: number
  value: number
  display?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-[0.15em] text-hh-ink/70 uppercase">
          {icon}
          {label}
        </span>
        {display && (
          <span className="font-mono text-[11px] font-semibold text-hh-ink">
            {display}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-none border-2 border-hh-ink/25 bg-hh-ink/10 accent-[#0b6839]"
      />
    </div>
  )
}
