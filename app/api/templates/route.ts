import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import connectDB from "@/lib/db/mongodb";
import TemplateModel from "@/lib/models/template";
import { TEMPLATE_SEEDS } from "@/lib/constants";
import { buildTemplate } from "@/lib/templates";
import { saveTemplateSchema } from "@/lib/validations/project";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    await connectDB();

    const defaults = TEMPLATE_SEEDS.map((seed) => ({
      id: `default-${seed.slug}`,
      isDefault: true,
      slug: seed.slug,
      name: seed.name,
      category: seed.category,
      description: seed.description,
      accent: seed.accent,
      data: buildTemplate(seed),
    }));

    const saved = await TemplateModel.find({ user: user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
      .exec();

    const savedList = saved.map((t) => ({
      id: t._id.toString(),
      isDefault: false,
      name: t.name,
      accent: (t.data as { accent?: string }).accent ?? "#6366f1",
      data: t.data,
      createdAt: t.createdAt,
    }));

    return NextResponse.json({ templates: [...savedList, ...defaults] }, { status: 200 });
  } catch (error) {
    console.error("List templates failed:", error);
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

  const parsed = saveTemplateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const template = await TemplateModel.create({
      user: user.id,
      name: parsed.data.name,
      data: parsed.data.data,
    });

    return NextResponse.json(
      {
        template: {
          id: template._id.toString(),
          isDefault: false,
          name: template.name,
          accent: (template.data as { accent?: string }).accent ?? "#6366f1",
          data: template.data,
          createdAt: template.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save template failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}