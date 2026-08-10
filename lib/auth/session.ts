import { getWorkspaceProfile } from "@/lib/store";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  avatarUrl: string;
  createdAt: string;
}

const DEMO_ID = "local";
const DEMO_EMAIL = "crew@hhgoa.in";
const DEMO_CREATED_AT = "2026-08-01T00:00:00.000Z";

/**
 * The app runs as a single local workspace — no accounts or login.
 * The "user" is the workspace profile edited in Settings.
 */
export async function getSessionUser(): Promise<SessionUser> {
  const profile = await getWorkspaceProfile();
  return {
    id: DEMO_ID,
    name: profile.name || "HH Goa Creator",
    email: DEMO_EMAIL,
    role: "user",
    organization: profile.organization || "Hacker House Goa",
    avatarUrl: profile.avatarUrl ?? "",
    createdAt: DEMO_CREATED_AT,
  };
}
