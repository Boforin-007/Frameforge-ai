import { NextResponse } from "next/server";
import sharp from "sharp";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data." },
      { status: 400 }
    );
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No file provided." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File is too large. Maximum size is 5 MB." },
      { status: 413 }
    );
  }

  if (!ACCEPTED_TYPES.has(file.type)) {
    return NextResponse.json(
      {
        error: "Unsupported file type. Use JPEG, PNG, or WebP.",
      },
      { status: 415 }
    );
  }

  try {
    // Read uploaded image into memory.
    const buffer = Buffer.from(await file.arrayBuffer());

    // Process the image entirely in memory.
    // Nothing is written to the Vercel filesystem.
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

    // Preserve PNG as PNG.
    // Convert JPEG/WebP to WebP for a smaller payload.
    const isPng = meta.format === "png";

    const output = isPng
      ? await image.png().toBuffer()
      : await image.webp({ quality: 88 }).toBuffer();

    // Return the processed image directly to the browser.
    // This avoids writing to /public/uploads, which is not
    // a persistent writable filesystem on Vercel.
    const mimeType = isPng ? "image/png" : "image/webp";

    const dataUrl = `data:${mimeType};base64,${output.toString(
      "base64"
    )}`;

    return NextResponse.json(
      {
        url: dataUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong processing the image.",
      },
      { status: 500 }
    );
  }
}