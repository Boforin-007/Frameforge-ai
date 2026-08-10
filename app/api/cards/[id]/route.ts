import { NextResponse } from "next/server";
import { deleteCard, getCard } from "@/lib/store";
import { deleteExportFile } from "@/lib/exports";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const card = await getCard(id);
    if (!card) {
      return NextResponse.json({ error: "Download not found." }, { status: 404 });
    }

    if (card.fileName) {
      await deleteExportFile(card.fileName);
    }
    const ok = await deleteCard(id);
    if (!ok) {
      return NextResponse.json({ error: "Download not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Delete download failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
