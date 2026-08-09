"use client"

export interface ExportCardInput {
  fileName: string
  dataUrl: string
  verifyId?: string
  profile?: unknown
  template?: unknown
}

export interface ExportOptions {
  zip?: boolean
  zipName?: string
  pdf?: boolean
  pdfName?: string
}

export function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function recordExports(cards: ExportCardInput[], options?: ExportOptions) {
  const res = await fetch("/api/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cards,
      zip: options?.zip ?? false,
      zipName: options?.zipName,
      pdf: options?.pdf ?? false,
      pdfName: options?.pdfName,
    }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ?? "Export failed.");
  return data.cards as Array<{
    id: string;
    name: string;
    format: "png" | "jpg" | "pdf" | "zip";
    createdAt?: string;
  }>;
}