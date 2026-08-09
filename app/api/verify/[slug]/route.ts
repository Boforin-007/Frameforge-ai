import { NextResponse } from "next/server";

import connectDB from "@/lib/db/mongodb";
import GeneratedCardModel from "@/lib/models/generatedCard";
import type { ProfileData, CardTemplate } from "@/types/template";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug.trim()) {
    return NextResponse.json({ error: "Missing card ID." }, { status: 400 });
  }

  try {
    await connectDB();
    const card = await GeneratedCardModel.findOne({ verifyId: slug })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!card || !card.profile || !card.template) {
      return NextResponse.json({ error: "Card not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        card: {
          id: card._id.toString(),
          name: card.name,
          profile: card.profile as ProfileData,
          template: card.template as CardTemplate,
          createdAt: card.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify lookup failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}