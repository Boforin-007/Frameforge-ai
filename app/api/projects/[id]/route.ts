import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import connectDB from "@/lib/db/mongodb";
import ProjectModel from "@/lib/models/project";

const renameSchema = z.object({
  name: z.string().trim().min(1).max(200),
});

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
    const project = await ProjectModel.findOne({ _id: id, user: user.id }).lean().exec();
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        project: {
          id: project._id.toString(),
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

  const parsed = renameSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed." }, { status: 400 });
  }

  const { id } = await params;

  try {
    await connectDB();
    const result = await ProjectModel.updateOne(
      { _id: id, user: user.id },
      { $set: { name: parsed.data.name } }
    ).exec();
    if (result.matchedCount === 0) {
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
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  try {
    await connectDB();
    const result = await ProjectModel.deleteOne({ _id: id, user: user.id }).exec();
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Delete project failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}