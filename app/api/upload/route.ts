import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import sharp from "sharp";

import { getSessionUser } from "@/lib/auth/session";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const kind = request.headers.get("x-upload-kind") ?? "photo";

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File is too large. Maximum size is 5 MB." },
      { status: 413 }
    );
  }

  if (!ACCEPTED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPEG, PNG, or WebP." },
      { status: 415 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const image = sharp(buffer).rotate().resize({
      width: 1200,
      height: 1200,
      fit: "inside",
      withoutEnlargement: true,
    });
    const meta = await image.metadata();
    if (!meta.format) {
      return NextResponse.json(
        { error: "File is not a valid image." },
        { status: 415 }
      );
    }

    const isPng = meta.format === "png";
    const filename = `${kind}-${user.id}-${randomUUID()}.${isPng ? "png" : "webp"}`;
    const output = isPng ? await image.png().toBuffer() : await image.webp({ quality: 88 }).toBuffer();

    await mkdir(UPLOADS_DIR, { recursive: true });
    await writeFile(path.join(UPLOADS_DIR, filename), output);

    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: "Something went wrong processing the image." },
      { status: 500 }
    );
  }
}