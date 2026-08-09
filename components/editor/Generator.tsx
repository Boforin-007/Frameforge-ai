"use client"

import { useEffect, useRef, useState } from "react"
import {
  ArrowLeft,
  BookmarkPlus,
  Check,
  Download,
  Eye,
  FileText,
  ImageUp,
  Layers,
  Loader2,
  MoveDown,
  MoveUp,
  Plus,
  QrCode,
  Save,
  Trash2,
  Type,
  X,
} from "lucide-react"

import type {
  CardElement,
  CardTemplate,
  ProfileData,
} from "@/types/template"
import { TEMPLATE_SEEDS, VERIFY_BASE_URL, type TemplateSeed } from "@/lib/constants"
import {
  buildTemplate,
  moveElement,
  removeElement,
  uid,
  updateElement,
} from "@/lib/templates"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProfileForm } from "@/components/forms/ProfileForm"
import { downloadDataUrl, recordExports } from "@/lib/client-export"
import CanvasEditor, {
  type CanvasEditorHandle,
} from "@/components/editor/CanvasEditor"

type Step = "template" | "profile" | "editor"

const EMPTY_PROFILE: ProfileData = {
  name: "",
  id: "",
  designation: "",
  department: "",
  organization: "",
  email: "",
  phone: "",
  photoUrl: undefined,
  logoUrl: undefined,
}

function PickerCard({
  template,
  onSelect,
}: {
  template: TemplateSeed
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group hh-sticker block bg-hh-cream p-3 text-left text-hh-ink transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-hh-sun"
    >
      <div className="relative flex aspect-[1.586] w-full flex-col justify-between overflow-hidden bg-hh-cream p-4 ring-1 ring-hh-ink/15">
        <div className="pointer-events-none absolute inset-2 ring-1 ring-hh-ink/15" />
        <div className="relative flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-[0.22em] text-hh-ink/60 uppercase">
            {template.category}
          </span>
          <span className="size-2 bg-hh-forest" />
        </div>
        <div className="relative flex items-end justify-between">
          <span className="font-display text-sm font-extrabold tracking-tight text-hh-ink">
            {template.name.includes("—")
              ? template.name.split("—")[0].trim().toUpperCase()
              : template.name.toUpperCase()}
          </span>
          <span className="font-mono text-[9px] tracking-[0.22em] text-hh-ink/60 uppercase">FF</span>
        </div>
      </div>
      <div className="px-1 pt-3 pb-1">
        <p className="truncate font-display text-sm font-bold text-hh-ink group-hover:text-hh-forest">
          {template.name}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-hh-ink/60">
          {template.description}
        </p>
      </div>
    </button>
  )
}

function elementLabel(element: CardElement): string {
  switch (element.kind) {
    case "text":
      return element.text || "Text"
    case "image":
      return element.source === "photo" ? "Photo" : "Logo"
    case "qr":
      return "QR code"
    case "rect":
      return "Shape"
  }
}

export function Generator({
  defaultOrganization,
  projectId,
  templateParam,
}: {
  defaultOrganization?: string
  projectId?: string
  templateParam?: string
}) {
  const initialSeed = (() => {
    if (!templateParam) return null
    return (
      TEMPLATE_SEEDS.find(
        (s) => s.slug === templateParam || `default-${s.slug}` === templateParam
      ) ?? null
    )
  })()

  const [step, setStep] = useState<Step>(initialSeed ? "profile" : "template")
  const [template, setTemplate] = useState<CardTemplate | null>(
    initialSeed ? buildTemplate(initialSeed) : null
  )
  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [loadState, setLoadState] = useState<"idle" | "loading" | "error">(
    projectId || (templateParam && !initialSeed) ? "loading" : "idle"
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [templateSaveOpen, setTemplateSaveOpen] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [savingTemplate, setSavingTemplate] = useState(false)
  const [templateSaved, setTemplateSaved] = useState(false)
  const canvasRef = useRef<CanvasEditorHandle>(null)

  useEffect(() => {
    if (projectId) {
      fetch(`/api/projects/${projectId}`)
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((data) => {
          const project = data.project
          if (!project) throw new Error("No project")
          setTemplate(project.template)
          setProfile(project.profile)
          setSelectedId(null)
          setStep("editor")
          setLoadState("idle")
        })
        .catch(() => setLoadState("error"))
      return
    }

    if (templateParam && !initialSeed) {
      fetch(`/api/templates/${templateParam}`)
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((data) => {
          setTemplate(data.template.data)
          setStep("profile")
          setLoadState("idle")
        })
        .catch(() => setLoadState("error"))
    }
  }, [projectId, templateParam, initialSeed])

  if (loadState === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="flex items-center gap-2 text-sm text-hh-cream/70">
          <Loader2 className="size-4 animate-spin" /> Loading project…
        </p>
      </div>
    )
  }

  if (loadState === "error") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-hh-cream">Couldn’t load that project.</p>
          <button
            type="button"
            className="mt-3 inline-flex items-center justify-center rounded-full border-2 border-hh-cream/30 px-4 py-1.5 text-sm font-semibold text-hh-cream transition-colors hover:border-hh-cream/60 hover:bg-hh-cream/10"
            onClick={() => {
              setLoadState("idle")
              setStep("template")
            }}
          >
            Start a new card
          </button>
        </div>
      </div>
    )
  }

  async function saveProject() {
    if (!template) return
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${profile.name || "Untitled"} · ${template.name}`,
          template,
          profile,
        }),
      })
      if (!res.ok) throw new Error("Save failed")
      const data = await res.json()
      const projectId = data?.project?.id
      if (projectId) {
        const url = new URL(window.location.href)
        url.searchParams.set("project", projectId)
        window.history.replaceState({}, "", url)
      }
      setSaved(true)
    } catch {
      setSaved(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleExport(format: "png" | "jpg" | "pdf") {
    if (!template) return
    setExporting(true)
    try {
      const mime = format === "jpg" ? "image/jpeg" : "image/png"
      const dataUrl = await canvasRef.current?.renderToDataUrl(4, mime)
      if (!dataUrl) return
      const ext = format === "jpg" ? "jpg" : "png"
      const fileName = `${profile.name || profile.id || "card"}.${ext}`
      if (format !== "pdf") {
        downloadDataUrl(dataUrl, fileName)
      }
      const records = await recordExports(
        [{ fileName, dataUrl, verifyId: profile.id || undefined, profile, template }],
        format === "pdf"
          ? { pdf: true, pdfName: profile.name || profile.id || "card" }
          : undefined
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
      setExporting(false)
    }
  }

  async function saveTemplateAs() {
    if (!template || !templateName.trim()) return
    setSavingTemplate(true)
    setTemplateSaved(false)
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateName.trim(),
          data: template,
        }),
      })
      if (!res.ok) throw new Error("Save failed")
      setTemplateSaved(true)
    } catch {
      setTemplateSaved(false)
    } finally {
      setSavingTemplate(false)
    }
  }

  function chooseTemplate(seed: TemplateSeed) {
    const built = buildTemplate(seed)
    setTemplate(built)
    setSelectedId(null)
    setStep("profile")
  }

  function handleProfileSubmit(data: ProfileData) {
    setProfile(data)
    setSaved(false)
    setSelectedId(null)
    setStep("editor")
  }

  function updateElementState(element: CardElement) {
    setSaved(false)
    setTemplate((t) => (t ? updateElement(t, element) : t))
  }

  function addElement(element: CardElement) {
    setSaved(false)
    setTemplate((t) => (t ? { ...t, elements: [...t.elements, element] } : t))
    setSelectedId(element.id)
  }

  function addText() {
    addElement({
      id: uid("text"),
      kind: "text",
      text: "{{name}}",
      x: 200,
      y: 160,
      width: 200,
      height: 40,
      fontSize: 26,
      fontWeight: 700,
      color: "#0f172a",
      align: "left",
      verticalAlign: "middle",
    })
  }

  function addImage(source: "photo" | "logo") {
    addElement({
      id: uid("img"),
      kind: "image",
      source,
      x: 220,
      y: 120,
      width: 120,
      height: 120,
      cornerRadius: 12,
    })
  }

  function addDivider() {
    if (!template) return
    addElement({
      id: uid("rect"),
      kind: "rect",
      x: 40,
      y: 180,
      width: 160,
      height: 4,
      fill: template.accent,
      cornerRadius: 2,
    })
  }

  function addQr() {
    addElement({
      id: uid("qr"),
      kind: "qr",
      value: `${VERIFY_BASE_URL}/${profile.id || "verify"}`,
      x: 230,
      y: 120,
      width: 120,
      height: 120,
    })
  }

  const selected = template?.elements.find((el) => el.id === selectedId) ?? null

  if (step === "template") {
    return (
      <div className="space-y-8">
        <section>
          <p className="font-mono text-xs tracking-[0.25em] text-hh-sun uppercase">{"// Create"}</p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-hh-cream sm:text-3xl">
            Choose a template
          </h1>
          <p className="mt-1 text-hh-cream/70">
            Pick a starting layout — you can customize every element on the canvas.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {TEMPLATE_SEEDS.map((seed) => (
            <PickerCard key={seed.slug} template={seed} onSelect={() => chooseTemplate(seed)} />
          ))}
        </section>
      </div>
    )
  }

  if (step === "profile") {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-[0.25em] text-hh-sun uppercase">{"// Step 2 of 3"}</p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-hh-cream">
              Add profile data
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-hh-cream/70">
            <Check className="size-4 text-hh-sun" />
            {template?.name}
          </div>
        </section>

        <div className="hh-sticker bg-hh-cream p-6 text-hh-ink sm:p-8">
          <ProfileForm
            initialValues={profile.name ? profile : undefined}
            defaultOrganization={defaultOrganization}
            onBack={() => setStep("template")}
            onSubmit={handleProfileSubmit}
          />
        </div>
      </div>
    )
  }

  if (!template) return null

  return (
    <div className="space-y-4">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setStep("profile")}
            aria-label="Back to profile"
            className="flex size-9 items-center justify-center rounded-full border-2 border-hh-cream/30 text-hh-cream transition-colors hover:border-hh-cream/60 hover:bg-hh-cream/10"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <p className="font-mono text-xs tracking-[0.25em] text-hh-sun uppercase">{template.name}</p>
            <h1 className="font-display text-xl font-bold tracking-tight text-hh-cream">
              {profile.name || "Your card"}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              previewMode
                ? "border-hh-sun text-hh-sun"
                : "border-hh-cream/30 text-hh-cream hover:bg-hh-cream/10"
            }`}
          >
            {previewMode ? <ImageUp className="size-4" /> : <Eye className="size-4" />}
            {previewMode ? "Editing" : "Preview"}
          </button>
          <button
            type="button"
            onClick={() => setStep("profile")}
            className="inline-flex items-center rounded-full border-2 border-hh-cream/30 px-3.5 py-1.5 text-sm font-semibold text-hh-cream transition-colors hover:bg-hh-cream/10"
          >
            Edit details
          </button>
          <button
            type="button"
            onClick={saveProject}
            disabled={saving || saved}
            className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-60 ${
              saved
                ? "border-hh-sun text-hh-sun"
                : "border-hh-ink bg-hh-sun text-hh-ink shadow-[2px_3px_0_rgba(11,15,12,0.3)] hover:bg-hh-sun-2"
            }`}
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : saved ? (
              <Check className="size-4" />
            ) : (
              <Save className="size-4" />
            )}
            {saving ? "Saving…" : saved ? "Saved" : "Save project"}
          </button>
          <button
            type="button"
            onClick={() => {
              setTemplateName(template ? `${template.name} — custom` : "")
              setTemplateSaved(false)
              setTemplateSaveOpen(true)
            }}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-hh-cream/30 px-3.5 py-1.5 text-sm font-semibold text-hh-cream transition-colors hover:bg-hh-cream/10"
          >
            <BookmarkPlus className="size-4" />
            Save template
          </button>
          <button
            type="button"
            onClick={() => handleExport("pdf")}
            disabled={exporting}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-hh-cream/30 px-3.5 py-1.5 text-sm font-semibold text-hh-cream transition-colors hover:bg-hh-cream/10 disabled:pointer-events-none disabled:opacity-60"
          >
            {exporting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FileText className="size-4" />
            )}
            {exporting ? "Exporting…" : "PDF"}
          </button>
          <button
            type="button"
            onClick={() => handleExport("jpg")}
            disabled={exporting}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-hh-cream/30 px-3.5 py-1.5 text-sm font-semibold text-hh-cream transition-colors hover:bg-hh-cream/10 disabled:pointer-events-none disabled:opacity-60"
          >
            {exporting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ImageUp className="size-4" />
            )}
            {exporting ? "Exporting…" : "JPG"}
          </button>
          <button
            type="button"
            onClick={() => handleExport("png")}
            disabled={exporting}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-hh-ink bg-hh-sun px-3.5 py-1.5 text-sm font-bold text-hh-ink shadow-[2px_3px_0_rgba(11,15,12,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-hh-sun-2 disabled:pointer-events-none disabled:opacity-60"
          >
            {exporting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            {exporting ? "Exporting…" : "Export PNG"}
          </button>
        </div>
      </section>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Canvas */}
        <div className="flex flex-1 items-start justify-center overflow-auto rounded-2xl bg-line-grid bg-paper p-6 sm:p-10">
          <div
            className="shrink-0 rounded-xl border-2 border-black/10 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.45)]"
            style={{ borderColor: selectedId ? "#0b6839" : undefined }}
          >
            <CanvasEditor
              ref={canvasRef}
              template={template}
              profile={profile}
              selectedId={previewMode ? null : selectedId}
              onSelect={setSelectedId}
              onUpdateElement={updateElementState}
              readOnly={previewMode}
            />
          </div>
        </div>

        {/* Panel */}
        <aside className="flex w-full flex-col gap-4 hh-sticker bg-hh-cream p-4 text-hh-ink lg:w-[300px]">
          <div>
            <p className="flex items-center gap-1.5 px-1 font-mono text-[10px] tracking-[0.2em] text-hh-ink/60 uppercase">
              <Layers className="size-3.5" /> Layers
            </p>
            <ul className="mt-2 space-y-1">
              {[...template.elements].reverse().map((el) => {
                const isSelected = el.id === selectedId
                return (
                  <li
                    key={el.id}
                    className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-[13px] ${
                      isSelected
                        ? "bg-hh-forest text-hh-cream"
                        : "text-hh-ink/60 hover:bg-hh-ink/5"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(isSelected ? null : el.id)}
                      className="min-w-0 flex-1 truncate text-left"
                    >
                      {elementLabel(el)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplate((t) => (t ? moveElement(t, el.id, "up") : t))}
                      className={isSelected ? "text-hh-cream/70 hover:text-hh-cream" : "text-hh-ink/50 hover:text-hh-ink"}
                      aria-label={`Move ${el.id} up`}
                    >
                      <MoveUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplate((t) => (t ? moveElement(t, el.id, "down") : t))}
                      className={isSelected ? "text-hh-cream/70 hover:text-hh-cream" : "text-hh-ink/50 hover:text-hh-ink"}
                      aria-label={`Move ${el.id} down`}
                    >
                      <MoveDown className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTemplate((t) => (t ? removeElement(t, el.id) : t))
                        if (selectedId === el.id) setSelectedId(null)
                      }}
                      className={isSelected ? "text-hh-cream/70 hover:text-hh-pink" : "text-hh-ink/50 hover:text-hh-pink"}
                      aria-label={`Delete ${el.id}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2 border-t-2 border-dashed border-hh-ink/20 pt-4">
            <button type="button" onClick={addText} className="inline-flex items-center gap-1 rounded-full border-2 border-hh-ink/25 px-2.5 py-1 text-xs font-semibold text-hh-ink transition-colors hover:bg-hh-ink/5">
              <Type className="size-3.5" /> Text
            </button>
            <button type="button" onClick={() => addImage("logo")} className="inline-flex items-center gap-1 rounded-full border-2 border-hh-ink/25 px-2.5 py-1 text-xs font-semibold text-hh-ink transition-colors hover:bg-hh-ink/5">
              <ImageUp className="size-3.5" /> Logo
            </button>
            <button type="button" onClick={() => addImage("photo")} className="inline-flex items-center gap-1 rounded-full border-2 border-hh-ink/25 px-2.5 py-1 text-xs font-semibold text-hh-ink transition-colors hover:bg-hh-ink/5">
              <ImageUp className="size-3.5" /> Photo
            </button>
            <button type="button" onClick={addDivider} className="inline-flex items-center gap-1 rounded-full border-2 border-hh-ink/25 px-2.5 py-1 text-xs font-semibold text-hh-ink transition-colors hover:bg-hh-ink/5">
              <Plus className="size-3.5" /> Shape
            </button>
            <button type="button" onClick={addQr} className="inline-flex items-center gap-1 rounded-full border-2 border-hh-ink/25 px-2.5 py-1 text-xs font-semibold text-hh-ink transition-colors hover:bg-hh-ink/5">
              <QrCode className="size-3.5" /> QR
            </button>
          </div>

          <div className="flex-1 border-t-2 border-dashed border-hh-ink/20 pt-4">
            <PropertiesPanel element={selected} onUpdate={updateElementState} />
          </div>
        </aside>
      </div>

      {templateSaveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm hh-sticker bg-hh-cream p-5 text-hh-ink">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-base font-bold text-hh-ink">Save as template</p>
                <p className="text-sm text-hh-ink/60">Reuse this exact layout for future cards.</p>
              </div>
              <button
                type="button"
                onClick={() => setTemplateSaveOpen(false)}
                className="rounded-full p-1 text-hh-ink/60 hover:bg-hh-ink/10"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-4 space-y-2">
              <Label className="text-xs text-hh-ink/60">Template name</Label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g. Sales — North"
                className="border-hh-ink/30"
                autoFocus
              />
              {templateSaved && (
                <p className="flex items-center gap-1 text-xs text-hh-forest">
                  <Check className="size-3.5" /> Saved to My Templates.
                </p>
              )}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setTemplateSaveOpen(false)}
                className="inline-flex items-center justify-center rounded-full border-2 border-hh-ink/25 px-4 py-1.5 text-sm font-semibold text-hh-ink transition-colors hover:bg-hh-ink/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveTemplateAs}
                disabled={savingTemplate || !templateName.trim()}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-hh-ink bg-hh-sun px-4 py-1.5 text-sm font-bold text-hh-ink shadow-[2px_3px_0_rgba(11,15,12,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-hh-sun-2 disabled:pointer-events-none disabled:opacity-50"
              >
                {savingTemplate && <Loader2 className="size-4 animate-spin" />}
                Save template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PropertiesPanel({
  element,
  onUpdate,
}: {
  element: CardElement | null
  onUpdate: (element: CardElement) => void
}) {
  if (!element) {
    return (
      <p className="px-1 text-sm text-hh-ink/60">
        Select a layer to edit its position and style. Drag elements on the canvas to move them.
      </p>
    )
  }

  const number = (value: number) => (Number.isFinite(value) ? value : 0)
  const patch = (changes: Partial<CardElement>) =>
    onUpdate({ ...element, ...changes } as CardElement)

  return (
    <div className="flex flex-col gap-3">
      <p className="px-1 font-mono text-[10px] tracking-[0.2em] text-hh-ink/60 uppercase">
        Properties
      </p>

      <div className="grid grid-cols-2 gap-3">
        <Field label="X">
          <Input type="number" className="border-hh-ink/30" value={number(element.x)} onChange={(e) => patch({ x: Number(e.target.value) || 0 })} />
        </Field>
        <Field label="Y">
          <Input type="number" className="border-hh-ink/30" value={number(element.y)} onChange={(e) => patch({ y: Number(e.target.value) || 0 })} />
        </Field>
        <Field label="Width">
          <Input type="number" className="border-hh-ink/30" value={number(element.width)} onChange={(e) => patch({ width: Math.max(6, Number(e.target.value) || 6) })} />
        </Field>
        <Field label="Height">
          <Input type="number" className="border-hh-ink/30" value={number(element.height)} onChange={(e) => patch({ height: Math.max(6, Number(e.target.value) || 6) })} />
        </Field>
      </div>

      {element.kind === "text" && (
        <>
          <Field label="Content — use {{name}}, {{id}}, {{designation}}, {{department}}, {{organization}}, {{email}}, {{phone}}">
            <textarea
              value={element.text}
              onChange={(e) => patch({ text: e.target.value })}
              rows={2}
              className="min-w-0 rounded-lg border border-hh-ink/30 bg-transparent px-3 py-1.5 text-sm text-hh-ink outline-none transition-[color,box-shadow] focus-visible:border-hh-forest focus-visible:ring-[3px] focus-visible:ring-hh-forest/40"
            />
          </Field>
          <Field label="Font size">
            <Input type="number" className="border-hh-ink/30" value={element.fontSize} onChange={(e) => patch({ fontSize: Number(e.target.value) || 12 })} />
          </Field>
          <Field label="Weight">
            <div className="flex gap-2">
              {([400, 600, 700] as const).map((weight) => (
                <button
                  key={weight}
                  type="button"
                  onClick={() => patch({ fontWeight: weight })}
                  className={`flex-1 rounded-lg border-2 px-2 py-1.5 text-xs font-semibold transition-colors ${
                    element.fontWeight === weight
                      ? "border-hh-ink bg-hh-forest text-hh-cream"
                      : "border-hh-ink/25 text-hh-ink/60 hover:bg-hh-ink/5"
                  }`}
                >
                  {weight}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Color">
              <input
                type="color"
                value={element.color}
                onChange={(e) => patch({ color: e.target.value })}
                className="h-9 w-full cursor-pointer rounded-lg border-2 border-hh-ink/25 bg-transparent px-1"
              />
            </Field>
            <Field label="Align">
              <select
                value={element.align}
                onChange={(e) => patch({ align: e.target.value as typeof element.align })}
                className="h-9 w-full rounded-lg border-2 border-hh-ink/25 bg-transparent px-2 text-sm text-hh-ink focus-visible:border-hh-forest focus-visible:ring-[3px] focus-visible:ring-hh-forest/40"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </Field>
          </div>
        </>
      )}

      {element.kind === "qr" && (
        <Field label="QR content (link or text)">
          <Input
            className="border-hh-ink/30"
            value={element.value}
            onChange={(e) => patch({ value: e.target.value })}
            placeholder={VERIFY_BASE_URL}
          />
        </Field>
      )}

      {element.kind === "rect" && (
        <Field label="Color">
          <input
            type="color"
            value={element.fill}
            onChange={(e) => patch({ fill: e.target.value })}
            className="h-9 w-full cursor-pointer rounded-lg border-2 border-hh-ink/25 bg-transparent px-1"
          />
        </Field>
      )}

      {element.kind === "image" && (
        <p className="text-xs text-hh-ink/60">
          This slot renders your {element.source === "photo" ? "profile photo" : "organization logo"}.
        </p>
      )}
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-hh-ink/60">{label}</Label>
      {children}
    </div>
  )
}
