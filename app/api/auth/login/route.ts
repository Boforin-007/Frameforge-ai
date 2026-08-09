import { NextResponse } from "next/server";
import connectDB, { dbErrorMessage } from "@/lib/db/mongodb";
import UserModel from "@/lib/models/user";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, serializeUser } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  try {
    await connectDB();

    const user = await UserModel.findOne({ email })
      .select("+passwordHash")
      .lean()
      .exec();
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    await createSession(user);

    return NextResponse.json({ user: serializeUser(user) }, { status: 200 });
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json({ error: dbErrorMessage(error) }, { status: 503 });
  }
}