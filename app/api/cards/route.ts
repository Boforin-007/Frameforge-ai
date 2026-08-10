import { NextResponse } from "next/server";
import { z } from "zod";
import { CARD_FORMATS, getCards, recordCard } from "@/lib/store";

const createCardSchema = z.object({
  name: z.string().trim().min(1).max(200),
  format: z.enum(CARD_FORMATS),
  fileName: z.string().trim().max(255).optional().default(""),
  sizeBytes: z.number().int().nonnegative().optional().default(0),
});

export async function GET() {
  try {
    const cards = await getCards();

    const list = cards.map((card) => ({
      id: card.id,
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
    const card = await recordCard({
      name: parsed.data.name,
      format: parsed.data.format,
      fileName: parsed.data.fileName,
      sizeBytes: parsed.data.sizeBytes,
    });

    return NextResponse.json(
      {
        card: {
          id: card.id,
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
