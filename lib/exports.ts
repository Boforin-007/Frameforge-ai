import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const EXPORT_ROOT = path.join(process.cwd(), "storage", "exports");

export function sanitizeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 160);
}

function exportDir() {
  return path.join(EXPORT_ROOT, "workspace");
}

async function ensureExportDir() {
  await mkdir(exportDir(), { recursive: true });
  return exportDir();
}

export function makeExportFileName(base: string) {
  const extension = path.extname(base) || ".png";
  const stem = sanitizeSegment(path.basename(base, extension) || "card");
  return `${Date.now()}-${randomUUID().slice(0, 8)}-${stem}${extension}`;
}

export async function writeExportFile(storedName: string, data: Buffer) {
  const dir = await ensureExportDir();
  await writeFile(path.join(dir, storedName), data);
  return data.length;
}

/** Reads a previously stored export file. Returns null if missing. */
export async function readExportFile(storedName: string) {
  const base = path.basename(storedName);
  if (base !== storedName || base.includes("..")) return null;
  const filePath = path.join(exportDir(), base);
  try {
    return { data: await readFile(filePath), name: base };
  } catch {
    return null;
  }
}

/** Deletes a single stored export file. Never throws. */
export async function deleteExportFile(storedName: string) {
  const base = path.basename(storedName);
  if (base !== storedName || base.includes("..")) return;
  try {
    await rm(path.join(exportDir(), base), { force: true });
  } catch {
    // File already gone — fine.
  }
}

/** Deletes the entire export directory. Never throws. */
export async function deleteAllExports() {
  try {
    await rm(exportDir(), { recursive: true, force: true });
  } catch {
    // Nothing to delete — fine.
  }
}
