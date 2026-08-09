import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const EXPORT_ROOT = path.join(process.cwd(), "storage", "exports");

export function sanitizeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 160);
}

export function userExportDir(userId: string) {
  return path.join(EXPORT_ROOT, sanitizeSegment(userId));
}

export async function ensureUserExportDir(userId: string) {
  const dir = userExportDir(userId);
  await mkdir(dir, { recursive: true });
  return dir;
}

export function makeExportFileName(base: string) {
  const extension = path.extname(base) || ".png";
  const stem = sanitizeSegment(path.basename(base, extension) || "card");
  return `${Date.now()}-${randomUUID().slice(0, 8)}-${stem}${extension}`;
}

export async function writeExportFile(userId: string, storedName: string, data: Buffer) {
  const dir = await ensureUserExportDir(userId);
  const filePath = path.join(dir, storedName);
  await writeFile(filePath, data);
  return data.length;
}

/** Reads a previously stored export for a user. Returns null if missing. */
export async function readExportFile(userId: string, storedName: string) {
  const base = path.basename(storedName);
  if (base !== storedName || base.includes("..")) return null;
  const filePath = path.join(userExportDir(userId), base);
  try {
    return { data: await readFile(filePath), name: base };
  } catch {
    return null;
  }
}

/** Deletes a single stored export file for a user. Never throws. */
export async function deleteExportFile(userId: string, storedName: string) {
  const base = path.basename(storedName);
  if (base !== storedName || base.includes("..")) return;
  try {
    await rm(path.join(userExportDir(userId), base), { force: true });
  } catch {
    // File already gone — fine.
  }
}

/** Deletes the entire export directory for a user. Never throws. */
export async function deleteUserExportDir(userId: string) {
  try {
    await rm(userExportDir(userId), { recursive: true, force: true });
  } catch {
    // Nothing to delete — fine.
  }
}