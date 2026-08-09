import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import connectDB from "@/lib/db/mongodb";
import TemplateModel from "@/lib/models/template";
import { TEMPLATE_SEEDS } from "@/lib/constants";
import { buildTemplate } from "@/lib/templates";

const renameSchema = (body: unknown) => {
  const value = (body as { name?: unknown })?.name;
  if (typeof value !== "string") return { ok: false as const };
  const name = value.trim();
  if (!name || name.length > 120) return { ok: false as const };
  return { ok: true as const, name };
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = renameSchema(body);
  if (!parsed.ok) {
    return NextResponse.json(
      { error: "Template name must be 1–120 characters." },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const result = await TemplateModel.updateOne(
      { _id: id, user: user.id, isDefault: { $ne: true } },
      { $set: { name: parsed.name } }
    ).exec();
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Template not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Rename template failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

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
    const result = await TemplateModel.deleteOne({ _id: id, user: user.id }).exec();
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Template not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Delete template failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

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

    const slug = id.replace(/^default-/, "");
    const seed = TEMPLATE_SEEDS.find((s) => s.slug === slug);
    if (id.startsWith("default-") && seed) {
      return NextResponse.json(
        { template: { id: `default-${seed.slug}`, name: seed.name, data: buildTemplate(seed) } },
        { status: 200 }
      );
    }

    const template = await TemplateModel.findOne({ _id: id, user: user.id }).lean().exec();
    if (!template) {
      return NextResponse.json({ error: "Template not found." }, { status: 404 });
    }

    return NextResponse.json(
      { template: { id: template._id.toString(), name: template.name, data: template.data } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get template failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}