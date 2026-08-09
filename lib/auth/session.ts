import { cookies } from "next/headers";
import type { User } from "@/lib/models/user";
import UserModel from "@/lib/models/user";
import connectDB from "@/lib/db/mongodb";
import {
  SESSION_COOKIE,
  TOKEN_MAX_AGE_SECONDS,
  signSessionToken,
  verifySessionToken,
} from "@/lib/auth/token";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  avatarUrl: string;
  createdAt: string;
}

export function serializeUser(
  user: Pick<User, "name" | "email" | "role" | "organization" | "avatarUrl" | "_id"> & {
    createdAt?: Date | string;
  }
): SessionUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    organization: user.organization ?? "",
    avatarUrl: user.avatarUrl ?? "",
    createdAt:
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : typeof user.createdAt === "string"
          ? user.createdAt
          : "",
  };
}

export async function createSession(user: Pick<User, "_id" | "name" | "email">) {
  const token = await signSessionToken({
    sub: user._id.toString(),
    email: user.email,
    name: user.name,
  });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TOKEN_MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  (await cookies()).set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  await connectDB();
  const user = await UserModel.findById(payload.sub).lean<User>().exec();
  if (!user) return null;

  return serializeUser(user);
}