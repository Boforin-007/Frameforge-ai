import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import connectDB from "@/lib/db/mongodb";
import GeneratedCardModel, { CARD_FORMATS } from "@/lib/models/generatedCard";

const createCardSchema = z.object({
  name: z.string().trim().min(1).max(200),
  format: z.enum(CARD_FORMATS),
  fileName: z.string().trim().max(255).optional().default(""),
  sizeBytes: z.number().int().nonnegative().optional().default(0),
});

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    await connectDB();
    const cards = await GeneratedCardModel.find({ user: user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
      .exec();

    const list = cards.map((card) => ({
      id: card._id.toString(),
      name: card.name,
      format: card.format,
      fileName: card.fileName,
      sizeBytes: card.sizeBytes,
      createdAt: card.createdAt,
    }));

    return NextResponse.json({ cards: list }, { status: 200 });
  } catch (error) {
    console.error("List cards failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
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

  const parsed = createCardSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const card = await GeneratedCardModel.create({
      user: user.id,
      name: parsed.data.name,
      format: parsed.data.format,
      fileName: parsed.data.fileName,
      sizeBytes: parsed.data.sizeBytes,
    });

    return NextResponse.json(
      {
        card: {
          id: card._id.toString(),
          name: card.name,
          format: card.format,
          createdAt: card.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Record card failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}