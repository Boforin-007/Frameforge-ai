import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteProject, getProject, renameProject } from "@/lib/store";

const renameSchema = z.object({
  name: z.string().trim().min(1).max(200),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const project = await getProject(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        project: {
          id: project.id,
          name: project.name,
          template: project.template,
          profile: project.profile,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get project failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = renameSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed." }, { status: 400 });
  }

  const { id } = await params;

  try {
    const ok = await renameProject(id, parsed.data.name);
    if (!ok) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Rename project failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const ok = await deleteProject(id);
    if (!ok) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Delete project failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
