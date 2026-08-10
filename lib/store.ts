import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const CARD_FORMATS = ["png", "jpg", "pdf", "zip"] as const;
export type CardFormat = (typeof CARD_FORMATS)[number];

const DATA_DIR = path.join(process.cwd(), "storage", "data");

export interface WorkspaceProfile {
  name: string;
  organization: string;
  avatarUrl: string;
}

export interface StoredProject {
  id: string;
  name: string;
  template: unknown;
  profile: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface StoredTemplate {
  id: string;
  name: string;
  data: unknown;
  isDefault: boolean;
  createdAt: string;
}

export interface StoredCard {
  id: string;
  name: string;
  format: CardFormat;
  fileName: string;
  sizeBytes: number;
  verifyId: string;
  profile?: unknown;
  template?: unknown;
  createdAt: string;
}

async function ensureDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(path.join(DATA_DIR, file), "utf-8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeJson(file: string, value: unknown) {
  await ensureDir();
  await writeFile(path.join(DATA_DIR, file), JSON.stringify(value, null, 2), "utf-8");
}

function nowIso() {
  return new Date().toISOString();
}

// ---- Workspace profile -----------------------------------------------------

export async function getWorkspaceProfile(): Promise<WorkspaceProfile> {
  const profile = await readJson<Partial<WorkspaceProfile> | null>("profile.json", null);
  return {
    name: profile?.name ?? "HH Goa Creator",
    organization: profile?.organization ?? "Hacker House Goa",
    avatarUrl: profile?.avatarUrl ?? "",
  };
}

export async function saveWorkspaceProfile(
  changes: Partial<WorkspaceProfile>
): Promise<WorkspaceProfile> {
  const current = await getWorkspaceProfile();
  const next = { ...current, ...changes };
  await writeJson("profile.json", next);
  return next;
}

// ---- Projects --------------------------------------------------------------

export async function getProjects(): Promise<StoredProject[]> {
  const list = await readJson<StoredProject[]>("projects.json", []);
  if (!Array.isArray(list)) return [];
  return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getProject(id: string): Promise<StoredProject | null> {
  const list = await getProjects();
  return list.find((p) => p.id === id) ?? null;
}

export async function saveProject(input: {
  name: string;
  template: unknown;
  profile: unknown;
}): Promise<StoredProject> {
  const list = await getProjects();
  const now = nowIso();
  const project: StoredProject = {
    id: randomUUID(),
    name: input.name,
    template: input.template,
    profile: input.profile,
    createdAt: now,
    updatedAt: now,
  };
  await writeJson("projects.json", [project, ...list]);
  return project;
}

export async function renameProject(id: string, name: string): Promise<boolean> {
  const list = await getProjects();
  const index = list.findIndex((p) => p.id === id);
  if (index === -1) return false;
  list[index] = { ...list[index], name, updatedAt: nowIso() };
  await writeJson("projects.json", list);
  return true;
}

export async function deleteProject(id: string): Promise<boolean> {
  const list = await getProjects();
  const next = list.filter((p) => p.id !== id);
  if (next.length === list.length) return false;
  await writeJson("projects.json", next);
  return true;
}

// ---- Templates -------------------------------------------------------------

export async function getTemplates(): Promise<StoredTemplate[]> {
  const list = await readJson<StoredTemplate[]>("templates.json", []);
  if (!Array.isArray(list)) return [];
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getTemplate(id: string): Promise<StoredTemplate | null> {
  const list = await getTemplates();
  return list.find((t) => t.id === id) ?? null;
}

export async function saveTemplate(input: {
  name: string;
  data: unknown;
}): Promise<StoredTemplate> {
  const list = await getTemplates();
  const template: StoredTemplate = {
    id: randomUUID(),
    name: input.name,
    data: input.data,
    isDefault: false,
    createdAt: nowIso(),
  };
  await writeJson("templates.json", [template, ...list]);
  return template;
}

export async function renameTemplate(id: string, name: string): Promise<boolean> {
  const list = await getTemplates();
  const index = list.findIndex((t) => t.id === id);
  if (index === -1) return false;
  list[index] = { ...list[index], name };
  await writeJson("templates.json", list);
  return true;
}

export async function deleteTemplate(id: string): Promise<boolean> {
  const list = await getTemplates();
  const next = list.filter((t) => t.id !== id);
  if (next.length === list.length) return false;
  await writeJson("templates.json", next);
  return true;
}

// ---- Cards / downloads -----------------------------------------------------

export async function getCards(): Promise<StoredCard[]> {
  const list = await readJson<StoredCard[]>("cards.json", []);
  if (!Array.isArray(list)) return [];
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getCard(id: string): Promise<StoredCard | null> {
  const list = await getCards();
  return list.find((c) => c.id === id) ?? null;
}

export async function findCardByVerifyId(verifyId: string): Promise<StoredCard | null> {
  const list = await getCards();
  return list.find((c) => c.verifyId === verifyId) ?? null;
}

export async function recordCard(input: {
  name: string;
  format: CardFormat;
  fileName: string;
  sizeBytes: number;
  verifyId?: string;
  profile?: unknown;
  template?: unknown;
}): Promise<StoredCard> {
  const list = await getCards();
  const card: StoredCard = {
    id: randomUUID(),
    name: input.name,
    format: input.format,
    fileName: input.fileName,
    sizeBytes: input.sizeBytes,
    verifyId: input.verifyId ?? "",
    profile: input.profile,
    template: input.template,
    createdAt: nowIso(),
  };
  await writeJson("cards.json", [card, ...list]);
  return card;
}

export async function deleteCard(id: string): Promise<boolean> {
  const list = await getCards();
  const next = list.filter((c) => c.id !== id);
  if (next.length === list.length) return false;
  await writeJson("cards.json", next);
  return true;
}

// ---- Reset -----------------------------------------------------------------

export async function clearWorkspaceData() {
  await Promise.all([
    writeJson("projects.json", []),
    writeJson("templates.json", []),
    writeJson("cards.json", []),
  ]);
}
