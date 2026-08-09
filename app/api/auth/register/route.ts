import { NextResponse } from "next/server";
import connectDB, { dbErrorMessage } from "@/lib/db/mongodb";
import UserModel from "@/lib/models/user";
import { hashPassword } from "@/lib/auth/password";
import { createSession, serializeUser } from "@/lib/auth/session";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, email, password, organization } = parsed.data;

  try {
    await connectDB();

    const existing = await UserModel.findOne({ email }).lean().exec();
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await UserModel.create({
      name,
      email,
      passwordHash,
      organization: organization ?? "",
    });

    await createSession(user);

    return NextResponse.json({ user: serializeUser(user) }, { status: 201 });
  } catch (error) {
    console.error("Register failed:", error);
    return NextResponse.json({ error: dbErrorMessage(error) }, { status: 503 });
  }
}