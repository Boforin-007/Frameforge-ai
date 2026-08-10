import { NextResponse } from "next/server";
import { saveProjectSchema } from "@/lib/validations/project";
import { getProjects, saveProject } from "@/lib/store";
import type { ProfileData } from "@/types/template";

export async function GET() {
  const projects = await getProjects();

  const list = projects.map((p) => {
    const profile = p.profile as ProfileData;
    const template = p.template as { name?: string; slug?: string };
    return {
      id: p.id,
      name: p.name,
      personName: profile?.name ?? "",
      templateName: template?.name ?? "Custom template",
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  });

  return NextResponse.json({ projects: list }, { status: 200 });
}

export async function POST(request: Request) {
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
    const project = await saveProject({
      name: parsed.data.name,
      template: parsed.data.template,
      profile: parsed.data.profile,
    });

    return NextResponse.json(
      {
        project: {
          id: project.id,
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
