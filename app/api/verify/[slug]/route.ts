import { NextResponse } from "next/server";
import { findCardByVerifyId } from "@/lib/store";
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
    const card = await findCardByVerifyId(slug);

    if (!card || !card.profile || !card.template) {
      return NextResponse.json({ error: "Card not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        card: {
          id: card.id,
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
