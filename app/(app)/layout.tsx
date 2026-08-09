import { redirect } from "next/navigation"
import type { ReactNode } from "react"

import { getSessionUser } from "@/lib/auth/session"
import { AppShell } from "@/components/layout/AppShell"

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  return <AppShell user={user}>{children}</AppShell>
}