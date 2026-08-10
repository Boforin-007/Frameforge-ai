import type { ReactNode } from "react"

import { getSessionUser } from "@/lib/auth/session"
import { AppShell } from "@/components/layout/AppShell"

export const dynamic = "force-dynamic"

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser()

  return <AppShell user={user}>{children}</AppShell>
}
