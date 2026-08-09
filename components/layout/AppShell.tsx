"use client"

import type { ReactNode } from "react"

import { Sidebar } from "@/components/layout/Sidebar"
import type { SessionUser } from "@/lib/auth/session"

export function AppShell({
  user,
  children,
}: {
  user: SessionUser
  children: ReactNode
}) {
  return (
    <div className="min-h-full bg-hh-forest text-hh-cream">
      <Sidebar user={user} />
      <div className="flex min-h-full flex-col lg:pl-64">
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
