"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  FileText,
  FolderOpen,
  Loader2,
  Upload,
} from "lucide-react"

import { Label } from "@/components/ui/label"
import CanvasEditor, {
  type CanvasEditorHandle,
} from "@/components/editor/CanvasEditor"
import { TEMPLATE_SEEDS, VERIFY_BASE_URL, type TemplateSeed } from "@/lib/constants"
import { buildTemplate } from "@/lib/templates"
import type { CardElement, CardTemplate, ProfileData } from "@/types/template"
import { parseCsv, suggestMapping, type CsvField } from "@/lib/csv"
import { preloadImage } from "@/hooks/useImage"
import { prewarmQr } from "@/lib/qr"
import { recordExports } from "@/lib/client-export"

const FIELDS: Array<{ key: CsvField; label: string }> = [
  { key: "name", label: "Name" },
  { key: "id", label: "ID number" },
  { key: "designation", label: "Designation / course" },
  { key: "department", label: "Department" },
  { key: "organization", label: "Organization" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "photoUrl", label: "Photo (URL)" },
  { key: "logoUrl", label: "Logo (URL)" },
]

function slugify(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "card"
  )
}

function templateForProfile(template: CardTemplate, profile: ProfileData): CardTemplate {
  const elements: CardElement[] = template.elements.map((el) => {
    if (el.kind === "qr") {
      return {
        ...el,
        value:
          el.value && el.value.trim()
            ? el.value.trim()
            : `${VERIFY_BASE_URL}/${profile.id || "verify"}`,
      };
    }
    return el;
  });
  return { ...template, elements };
}

function downloadSampleCsv() {
  const sample = [
    "Name,ID,Designation,Department,Organization,Email,Phone",
    "Priya Raman,NL-0294,Senior Product Designer,Design,Nimbus Labs,priya@nimbus.ai,+91 98765 43210",
    "Arjun Mehta,AC-1103,Backend Engineer,Engineering,Nimbus Labs,arjun@nimbus.ai,+91 91234 56780",
  ].join("\n");
  const url = URL.createObjectURL(new Blob([sample], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "cards-template.csv";
  link.click();
  URL.revokeObjectURL(url);
}

type Step = "template" | "upload" | "generate"

export function BulkClient() {
  const [step, setStep] = useState<Step>("template")
  const [template, setTemplate] = useState<CardTemplate | null>(null)
  const [headers, setHeaders] = useState<string[]>([])
  const [rawRows, setRawRows] = useState<string[][]>([])
  const [mapping, setMapping] = useState<Record<CsvField, number | undefined>>(suggestMapping([]))
  const [fileName, setFileName] = useState<string>("")

  const [index, setIndex] = useState(0)
  const [rendered, setRendered] = useState<Array<{ profile: ProfileData; dataUrl: string }>>([])
  const [finalizing, setFinalizing] = useState(false)
  const [immediateUrls, setImmediateUrls] = useState<string[]>([])
  const [includePdf, setIncludePdf] = useState(false)
  const [result, setResult] = useState<{ zipId?: string; pdfId?: string; count: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<CanvasEditorHandle>(null)
  const runningRef = useRef(false)
  const finalizingRef = useRef(false)

  const profiles = useMemo<ProfileData[]>(() => {
    if (!headers.length || !rawRows.length) return [];
    return rawRows.map((row) => {
      const get = (field: CsvField) => {
        const idx = mapping[field];
        return idx !== undefined && idx < row.length ? (row[idx] ?? "").trim() : "";
      };
      return {
        name: get("name"),
        id: get("id"),
        designation: get("designation"),
        department: get("department"),
        organization: get("organization"),
        email: get("email"),
        phone: get("phone"),
        photoUrl: get("photoUrl") || undefined,
        logoUrl: get("logoUrl") || undefined,
      };
    });
  }, [headers, rawRows, mapping])

  useEffect(() => {
    if (step !== "generate" || runningRef.current || index >= profiles.length) return;
    runningRef.current = true;
    const timer = setTimeout(async () => {
      const url = await canvasRef.current?.renderToDataUrl(2);
      runningRef.current = false;
      if (!url) return;
      setRendered((list) => [...list, { profile: profiles[index], dataUrl: url }]);
      setIndex((i) => i + 1);
    }, 120);
    return () => {
      clearTimeout(timer);
      runningRef.current = false;
    };
  }, [step, index, profiles])

  useEffect(() => {
    if (
      step !== "generate" ||
      index < profiles.length ||
      rendered.length === 0 ||
      result ||
      finalizingRef.current
    )
      return;
    finalizingRef.current = true;
    (async () => {
      setFinalizing(true);
      try {
        const cards = rendered.map((r, i) => ({
          fileName: `${slugify(r.profile.name || "card")}-${i + 1}.png`,
          dataUrl: r.dataUrl,
          verifyId: r.profile.id || undefined,
          profile: r.profile,
          template: templateForProfile(template as CardTemplate, r.profile),
        }));
        const recs = await recordExports(cards, {
          zip: true,
          zipName: slugify(template?.name || "cards"),
          pdf: includePdf,
          pdfName: slugify(template?.name || "cards"),
        });
        const zip = recs.find((r) => r.format === "zip");
        const pdf = recs.find((r) => r.format === "pdf");
        setResult({ zipId: zip?.id, pdfId: pdf?.id, count: cards.length });
        setError(null);
      } catch {
        setError("Export failed. Please try again.");
      } finally {
        finalizingRef.current = false;
        setFinalizing(false);
      }
    })();
    return () => {
      finalizingRef.current = false;
    };
  }, [step, index, profiles, rendered, result, template, includePdf])

  function handleFile(file: File | undefined) {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const rows = parseCsv(text);
      if (rows.length < 2) {
        setError("That CSV doesn’t look right — it needs a header row and at least one person.");
        return;
      }
      setError(null);
      setHeaders(rows[0]);
      setRawRows(rows.slice(1));
      setMapping(suggestMapping(rows[0]));
    };
    reader.readAsText(file);
  }

  async function startGeneration() {
    if (!template || !profiles.length) return;
    setError(null);
    setIndex(0);
    setRendered([]);
    setResult(null);
    setFinalizing(false);
    runningRef.current = false;
    finalizingRef.current = false;

    try {
      const urls = new Set<string>();
      profiles.forEach((p) => {
        if (p.photoUrl) urls.add(p.photoUrl);
        if (p.logoUrl) urls.add(p.logoUrl);
      });
      template.elements.forEach((el) => {
        if (el.kind === "image" && el.source === "upload" && el.url) urls.add(el.url);
      });
      const settled = await Promise.allSettled([...urls].map((url) => preloadImage(url)));
      const ok = new Set<string>();
      settled.forEach((r, i) => {
        if (r.status === "fulfilled") ok.add([...urls][i]);
      });
      setImmediateUrls([...ok]);

      const qr = template.elements.find((el) => el.kind === "qr");
      await prewarmQr(
        profiles.map((p) => ({
          value: `${VERIFY_BASE_URL}/${p.id || "verify"}`,
          fgColor: qr && qr.kind === "qr" ? qr.fgColor : undefined,
          bgColor: qr && qr.kind === "qr" ? qr.bgColor : undefined,
          size: 620,
        }))
      );
    } catch {
      // Continue anyway; the renderer waits or times out gracefully.
    }

    setStep("generate");
  }

  function pickTemplate(seed: TemplateSeed) {
    setTemplate(buildTemplate(seed));
    setStep("upload");
  }

  const current = step === "generate" && index < profiles.length ? profiles[index] : null;
  const rowTemplate = template && current ? templateForProfile(template, current) : null;

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-[0.25em] text-hh-sun uppercase">{"// Bulk import"}</p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-hh-cream sm:text-3xl">
            Generate a batch of cards
          </h1>
          <p className="mt-1 text-hh-cream/70">
            {step === "template" && "Pick a template — every card in the batch will share this design."}
            {step === "upload" && "Upload a spreadsheet of people, then map the columns."}
            {step === "generate" && "Rendering your cards… this takes a moment."}
          </p>
        </div>
        <div className="hidden shrink-0 items-center gap-1.5 text-sm text-hh-cream/70 sm:flex">
          <Check className="size-4 text-hh-sun" />
          {template?.name ?? "No template"}
        </div>
      </section>

      {step === "template" && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {TEMPLATE_SEEDS.map((seed) => (
            <button
              key={seed.slug}
              type="button"
              onClick={() => pickTemplate(seed)}
              className="group hh-sticker block bg-hh-cream p-3 text-left text-hh-ink transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-hh-sun"
            >
              <div className="relative flex aspect-[1.586] w-full flex-col justify-between overflow-hidden bg-hh-cream p-4 ring-1 ring-hh-ink/15">
                <div className="pointer-events-none absolute inset-2 ring-1 ring-hh-ink/15" />
                <span className="relative font-mono text-[9px] tracking-[0.22em] text-hh-ink/60 uppercase">
                  {seed.category}
                </span>
                <div className="relative flex items-end justify-between">
                  <span className="size-2 bg-hh-forest" />
                  <span className="truncate font-display text-sm font-extrabold tracking-tight text-hh-ink uppercase">
                    {seed.name.replace(/[—].*/, "").trim()}
                  </span>
                </div>
              </div>
              <div className="px-1 pt-3 pb-1">
                <p className="truncate font-display text-sm font-bold text-hh-ink">{seed.name}</p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-hh-ink/60">
                  {seed.description}
                </p>
              </div>
            </button>
          ))}
        </section>
      )}

      {step === "upload" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setStep("template")}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-hh-cream/30 px-3 py-1 text-xs font-semibold text-hh-cream transition-colors hover:bg-hh-cream/10"
            >
              <ArrowLeft className="size-3.5" /> Change template
            </button>
            <span className="text-sm text-hh-cream/70">{template?.name}</span>
          </div>

          <div className="hh-sticker bg-hh-cream p-6 text-hh-ink">
            <Label className="text-sm font-bold">Spreadsheet (CSV)</Label>
            <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-hh-ink/30 bg-hh-ink/5 px-6 py-10 text-center transition-colors hover:border-hh-ink hover:bg-hh-ink/10">
              <input
                type="file"
                accept=".csv,text/csv,text/plain"
                className="sr-only"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <Upload className="size-5 text-hh-ink/60" />
              <span className="text-sm font-bold text-hh-ink">
                {fileName ? `Loaded ${fileName}` : "Click to upload a CSV file"}
              </span>
              <span className="text-xs text-hh-ink/60">
                One column per field, one row per person. Include a header row.
              </span>
            </label>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-hh-ink/60">
                {headers.length
                  ? `${profiles.length} people found across ${headers.length} columns.`
                  : "No file loaded yet."}
              </p>
              <button
                type="button"
                onClick={downloadSampleCsv}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-hh-ink/25 px-3 py-1 text-xs font-semibold text-hh-ink transition-colors hover:bg-hh-ink/5"
              >
                <Download className="size-3.5" /> Sample CSV
              </button>
            </div>
          </div>

          {headers.length > 0 && (
            <>
              <div className="hh-sticker bg-hh-cream p-6 text-hh-ink">
                <h2 className="font-display text-sm font-bold text-hh-ink">Map columns</h2>
                <p className="mt-0.5 text-xs text-hh-ink/60">
                  We auto-matched the headers — adjust if anything looks off.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {FIELDS.map((field) => (
                    <div key={field.key} className="flex flex-col gap-1">
                      <span className="text-xs text-hh-ink/60">{field.label}</span>
                      <select
                        value={mapping[field.key] ?? -1}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setMapping((m) => ({
                            ...m,
                            [field.key]: value >= 0 ? value : undefined,
                          }));
                        }}
                        className="h-8 rounded-lg border-2 border-hh-ink/25 bg-transparent px-2 text-sm text-hh-ink focus-visible:border-hh-forest focus-visible:ring-[3px] focus-visible:ring-hh-forest/40"
                      >
                        <option value={-1}>— Skip —</option>
                        {headers.map((h, i) => (
                          <option key={i} value={i}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hh-sticker bg-hh-cream p-6 text-hh-ink">
                <h2 className="font-display text-sm font-bold text-hh-ink">Preview</h2>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b-2 border-hh-ink/15 text-xs text-hh-ink/60">
                        {FIELDS.filter((f) => mapping[f.key] !== undefined).map((f) => (
                          <th key={f.key} className="px-2 py-1.5 font-medium">
                            {f.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {profiles.slice(0, 5).map((p, i) => (
                        <tr key={i} className="border-b border-hh-ink/10 last:border-0">
                          {FIELDS.filter((f) => mapping[f.key] !== undefined).map((f) => (
                            <td key={f.key} className="max-w-[160px] truncate px-2 py-1.5">
                              {f.key === "photoUrl" || f.key === "logoUrl"
                                ? p[f.key] || "—"
                                : p[f.key as "name"] || "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep("template")}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-hh-cream/30 px-3.5 py-1.5 text-sm font-semibold text-hh-cream transition-colors hover:bg-hh-cream/10"
            >
              <ArrowLeft className="size-3.5" /> Back
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-hh-cream/70">
                <input
                  type="checkbox"
                  checked={includePdf}
                  onChange={(e) => setIncludePdf(e.target.checked)}
                  className="size-4 rounded border-hh-cream/40 bg-transparent accent-[#0b6839]"
                />
                Also export a PDF
              </label>
              <button
                type="button"
                onClick={startGeneration}
                disabled={!profiles.length}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-hh-ink bg-hh-sun px-4 py-1.5 text-sm font-bold text-hh-ink shadow-[2px_3px_0_rgba(11,15,12,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-hh-sun-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Generate {profiles.length} cards
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "generate" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-hh-cream/70">
              {result ? (
                <span className="flex items-center gap-1.5 font-medium text-hh-sun">
                  <Check className="size-4" /> Generated {result.count} cards.
                </span>
              ) : (
                <>
                  Rendering card{" "}
                  <span className="font-bold text-hh-cream">
                    {Math.min(index + 1, profiles.length)}
                  </span>{" "}
                  of {profiles.length}
                </>
              )}
            </p>
            <div className="h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-hh-cream/15">
              <div
                className="h-full rounded-full bg-hh-sun transition-all"
                style={{
                  width: `${profiles.length ? (Math.min(index, profiles.length) / profiles.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="flex justify-center rounded-2xl bg-line-grid bg-paper p-8">
            {current && rowTemplate ? (
              <div
                key={index}
                className="shrink-0 rounded-xl border-2 border-black/10 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.45)]"
              >
                <CanvasEditor
                  ref={canvasRef}
                  template={rowTemplate}
                  profile={current}
                  selectedId={null}
                  onSelect={() => {}}
                  onUpdateElement={() => {}}
                  readOnly
                  immediateUrls={immediateUrls}
                />
              </div>
            ) : finalizing ? (
              <div className="flex items-center gap-2 py-16 text-sm text-hh-cream/70">
                <Loader2 className="size-4 animate-spin" /> Finalizing…
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <span className="flex size-12 items-center justify-center rounded-full border-2 border-hh-ink bg-hh-sun text-hh-ink">
                  <FolderOpen className="size-5" />
                </span>
                <div>
                  <p className="font-display text-base font-bold text-hh-cream">
                    {result ? `${result.count} cards ready` : "Done"}
                  </p>
                  <p className="mt-1 text-sm text-hh-cream/70">
                    {error ??
                      "Your batch ZIP is saved. Grab it here or find it any time on the Downloads page."}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {result?.zipId && (
                    <a
                      href={`/api/export/${result.zipId}`}
                      className="inline-flex items-center gap-1.5 rounded-full border-2 border-hh-ink bg-hh-sun px-4 py-1.5 text-sm font-bold text-hh-ink shadow-[2px_3px_0_rgba(11,15,12,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-hh-sun-2"
                    >
                      <Download className="size-4" /> Download ZIP
                    </a>
                  )}
                  {result?.pdfId && (
                    <a
                      href={`/api/export/${result.pdfId}`}
                      className="inline-flex items-center gap-1.5 rounded-full border-2 border-hh-cream/30 px-4 py-1.5 text-sm font-semibold text-hh-cream transition-colors hover:bg-hh-cream/10"
                    >
                      <FileText className="size-4" /> Download PDF
                    </a>
                  )}
                  <Link
                    href="/downloads"
                    className="inline-flex items-center gap-1.5 rounded-full border-2 border-hh-cream/30 px-4 py-1.5 text-sm font-semibold text-hh-cream transition-colors hover:bg-hh-cream/10"
                  >
                    <FolderOpen className="size-4" /> View downloads
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
