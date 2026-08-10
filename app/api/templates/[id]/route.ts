import { NextResponse } from "next/server";
import { TEMPLATE_SEEDS } from "@/lib/constants";
import { buildTemplate } from "@/lib/templates";
import { deleteTemplate, getTemplate, renameTemplate } from "@/lib/store";

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
    if (id.startsWith("default-")) {
      return NextResponse.json({ error: "Template not found." }, { status: 404 });
    }
    const ok = await renameTemplate(id, parsed.name);
    if (!ok) {
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
  const { id } = await params;

  try {
    if (id.startsWith("default-")) {
      return NextResponse.json({ error: "Template not found." }, { status: 404 });
    }
    const ok = await deleteTemplate(id);
    if (!ok) {
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
  const { id } = await params;

  try {
    const slug = id.replace(/^default-/, "");
    const seed = TEMPLATE_SEEDS.find((s) => s.slug === slug);
    if (id.startsWith("default-") && seed) {
      return NextResponse.json(
        { template: { id: `default-${seed.slug}`, name: seed.name, data: buildTemplate(seed) } },
        { status: 200 }
      );
    }

    const template = await getTemplate(id);
    if (!template) {
      return NextResponse.json({ error: "Template not found." }, { status: 404 });
    }

    return NextResponse.json(
      { template: { id: template.id, name: template.name, data: template.data } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get template failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
