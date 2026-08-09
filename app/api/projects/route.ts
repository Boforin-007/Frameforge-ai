import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import connectDB from "@/lib/db/mongodb";
import ProjectModel from "@/lib/models/project";
import { saveProjectSchema } from "@/lib/validations/project";
import type { ProfileData } from "@/types/template";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    await connectDB();
    const projects = await ProjectModel.find({ user: user.id })
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean()
      .exec();

    const list = projects.map((p) => {
      const profile = p.profile as ProfileData;
      const template = p.template as { name?: string; slug?: string };
      return {
        id: p._id.toString(),
        name: p.name,
        personName: profile?.name ?? "",
        templateName: template?.name ?? "Custom template",
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });

    return NextResponse.json({ projects: list }, { status: 200 });
  } catch (error) {
    console.error("List projects failed:", error);
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

  const parsed = saveProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const project = await ProjectModel.create({
      user: user.id,
      name: parsed.data.name,
      template: parsed.data.template,
      profile: parsed.data.profile,
    });

    return NextResponse.json(
      {
        project: {
          id: project._id.toString(),
          name: project.name,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save project failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}