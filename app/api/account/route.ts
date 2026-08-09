import { NextResponse } from "next/server";
import { z } from "zod";

import { getSessionUser, destroySession } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import connectDB, { dbErrorMessage } from "@/lib/db/mongodb";
import UserModel from "@/lib/models/user";
import ProjectModel from "@/lib/models/project";
import GeneratedCardModel from "@/lib/models/generatedCard";
import TemplateModel from "@/lib/models/template";
import { deleteUserExportDir } from "@/lib/exports";

const deleteAccountSchema = z.object({
  password: z.string().min(1, "Enter your password to confirm.").max(128),
});

const updateAccountSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  organization: z.string().trim().max(120).optional(),
  avatarUrl: z.string().trim().max(500).optional(),
  currentPassword: z.string().max(128).optional(),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters.")
    .max(128)
    .optional(),
});

export async function PATCH(request: Request) {
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

  const parsed = updateAccountSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const changes: Record<string, unknown> = {};
    if (parsed.data.name !== undefined) changes.name = parsed.data.name;
    if (parsed.data.organization !== undefined)
      changes.organization = parsed.data.organization;
    if (parsed.data.avatarUrl !== undefined)
      changes.avatarUrl = parsed.data.avatarUrl;

    if (parsed.data.newPassword) {
      if (!parsed.data.currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to change your password." },
          { status: 400 }
        );
      }
      const existing = await UserModel.findById(user.id).select("+passwordHash").lean().exec();
      if (!existing) {
        return NextResponse.json({ error: "Account not found." }, { status: 404 });
      }
      const ok = await verifyPassword(
        parsed.data.currentPassword,
        existing.passwordHash
      );
      if (!ok) {
        return NextResponse.json(
          { error: "Current password is incorrect." },
          { status: 400 }
        );
      }
      changes.passwordHash = await hashPassword(parsed.data.newPassword);
    }

    await UserModel.updateOne({ _id: user.id }, { $set: changes }).exec();

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Update account failed:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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

  const parsed = deleteAccountSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter your password to confirm." },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const existing = await UserModel.findById(user.id)
      .select("+passwordHash")
      .lean()
      .exec();
    if (!existing) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    const valid = await verifyPassword(parsed.data.password, existing.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Incorrect password. Nothing was deleted." },
        { status: 400 }
      );
    }

    await Promise.all([
      ProjectModel.deleteMany({ user: user.id }).exec(),
      GeneratedCardModel.deleteMany({ user: user.id }).exec(),
      TemplateModel.deleteMany({ user: user.id }).exec(),
    ]);
    await deleteUserExportDir(user.id);
    await UserModel.deleteOne({ _id: user.id }).exec();

    await destroySession();

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Delete account failed:", error);
    return NextResponse.json({ error: dbErrorMessage(error) }, { status: 503 });
  }
}