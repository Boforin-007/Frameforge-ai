import { NextResponse } from "next/server";
import { z } from "zod";
import { clearWorkspaceData, saveWorkspaceProfile } from "@/lib/store";
import { deleteAllExports } from "@/lib/exports";

const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  organization: z.string().trim().max(120).optional(),
  avatarUrl: z.string().trim().max(500).optional(),
});

export async function PATCH(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const profile = await saveWorkspaceProfile({
      ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
      ...(parsed.data.organization !== undefined
        ? { organization: parsed.data.organization }
        : {}),
      ...(parsed.data.avatarUrl !== undefined ? { avatarUrl: parsed.data.avatarUrl } : {}),
    });

    return NextResponse.json({ ok: true, profile }, { status: 200 });
  } catch (error) {
    console.error("Update profile failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await Promise.all([clearWorkspaceData(), deleteAllExports()]);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Reset workspace failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
