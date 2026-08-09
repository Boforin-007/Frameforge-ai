import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import connectDB from "@/lib/db/mongodb";
import GeneratedCardModel from "@/lib/models/generatedCard";
import { deleteExportFile } from "@/lib/exports";

export async function DELETE(
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
    if (!card) {
      return NextResponse.json({ error: "Download not found." }, { status: 404 });
    }

    if (card.fileName) {
      await deleteExportFile(user.id, card.fileName);
    }
    await GeneratedCardModel.deleteOne({ _id: card._id, user: user.id }).exec();

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Delete download failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
