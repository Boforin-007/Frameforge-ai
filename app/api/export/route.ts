import { NextResponse } from "next/server";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth/session";
import connectDB from "@/lib/db/mongodb";
import GeneratedCardModel from "@/lib/models/generatedCard";
import { makeExportFileName, writeExportFile } from "@/lib/exports";
import { createZip } from "@/lib/zip";

const exportFileSchema = z.object({
  fileName: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .regex(/\.(png|jpg)$/i, "Invalid file name."),
  dataUrl: z.string().regex(/^data:image\/(png|jpeg);/, "Invalid image data."),
  verifyId: z.string().trim().max(120).optional(),
  profile: z.unknown().optional(),
  template: z.unknown().optional(),
});

const exportPayloadSchema = z.object({
  cards: z.array(exportFileSchema).min(1).max(200),
  zip: z.boolean().optional(),
  zipName: z.string().trim().max(160).optional(),
  pdf: z.boolean().optional(),
  pdfName: z.string().trim().max(160).optional(),
});

function dataUrlToBuffer(dataUrl: string) {
  const comma = dataUrl.indexOf(",");
  return Buffer.from(comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl, "base64");
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = exportPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const records = [];
    const zipEntries: { name: string; data: Buffer }[] = [];

    for (const file of parsed.data.cards) {
      const isJpg = /\.jpg$/i.test(file.fileName);
      const format = isJpg ? "jpg" : "png";
      const buffer = dataUrlToBuffer(file.dataUrl);
      const storedName = makeExportFileName(file.fileName);
      await writeExportFile(user.id, storedName, buffer);

      const displayName = file.fileName
        .replace(/\.(png|jpg)$/i, "")
        .replace(/[-_]+/g, " ")
        .trim();
      const card = await GeneratedCardModel.create({
        user: user.id,
        name: displayName || "Card",
        format,
        fileName: storedName,
        sizeBytes: buffer.length,
        verifyId: file.verifyId ?? "",
        profile: file.profile,
        template: file.template,
      });
      records.push({
        id: card._id.toString(),
        name: card.name,
        format,
        createdAt: card.createdAt,
      });

      zipEntries.push({ name: file.fileName, data: buffer });
    }

    if (parsed.data.zip) {
      const zipName = (parsed.data.zipName || "cards").replace(/\.zip$/i, "") || "cards";
      const storedZipName = makeExportFileName(`${zipName}.zip`);
      const zipBuffer = createZip(zipEntries);
      await writeExportFile(user.id, storedZipName, zipBuffer);

      const zipCard = await GeneratedCardModel.create({
        user: user.id,
        name: `${zipName} — ${records.length} cards`,
        format: "zip",
        fileName: storedZipName,
        sizeBytes: zipBuffer.length,
      });
      records.push({
        id: zipCard._id.toString(),
        name: zipCard.name,
        format: "zip",
        createdAt: zipCard.createdAt,
      });
    }

    if (parsed.data.pdf) {
      const { buildPdf } = await import("@/lib/pdf");
      const pdfName = (parsed.data.pdfName || "cards").replace(/\.pdf$/i, "") || "cards";
      const storedPdfName = makeExportFileName(`${pdfName}.pdf`);
      const pdfBuffer = await buildPdf(zipEntries.map((entry) => entry.data));
      await writeExportFile(user.id, storedPdfName, pdfBuffer);

      const pdfCard = await GeneratedCardModel.create({
        user: user.id,
        name: `${pdfName} — ${records.length} cards`,
        format: "pdf",
        fileName: storedPdfName,
        sizeBytes: pdfBuffer.length,
      });
      records.push({
        id: pdfCard._id.toString(),
        name: pdfCard.name,
        format: "pdf",
        createdAt: pdfCard.createdAt,
      });
    }

    return NextResponse.json({ cards: records }, { status: 201 });
  } catch (error) {
    console.error("Export failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}