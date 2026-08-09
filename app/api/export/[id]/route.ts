import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import connectDB from "@/lib/db/mongodb";
import GeneratedCardModel from "@/lib/models/generatedCard";
import { readExportFile } from "@/lib/exports";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  try {
    await connectDB();
    const card = await GeneratedCardModel.findOne({ _id: id, user: user.id })
      .lean()
      .exec();
    if (!card || !card.fileName) {
      return NextResponse.json({ error: "Download not found." }, { status: 404 });
    }

    const file = await readExportFile(user.id, card.fileName);
    if (!file) {
      return NextResponse.json({ error: "Download not found." }, { status: 404 });
    }

    const extension =
      card.format === "zip"
        ? "zip"
        : card.format === "pdf"
          ? "pdf"
          : card.format === "jpg"
            ? "jpg"
            : "png";
    const contentType =
      card.format === "zip"
        ? "application/zip"
        : card.format === "pdf"
          ? "application/pdf"
          : card.format === "jpg"
            ? "image/jpeg"
            : "image/png";
    const downloadName = `${card.name.replace(/[^a-zA-Z0-9 -]/g, "").trim() || "card"}.${extension}`;

    return new NextResponse(file.data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(downloadName)}"`,
        "Content-Length": String(file.data.length),
      },
    });
  } catch (error) {
    console.error("Download export failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}