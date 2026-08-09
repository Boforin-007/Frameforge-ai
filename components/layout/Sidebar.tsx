"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  LayoutTemplate,
  PenTool,
  Download,
  Settings,
  LogOut,
  Loader2,
  FileSpreadsheet,
  FolderKanban,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { APP_NAV } from "@/lib/constants"
import type { SessionUser } from "@/lib/auth/session"

const NAV_ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  FolderKanban,
  LayoutTemplate,
  PenTool,
  FileSpreadsheet,
  Download,
  Settings,
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function Logomark() {
  return (
    <span
      aria-hidden
      className="relative flex size-7 items-center justify-center rounded-none bg-hh-sun"
    >
      <span className="absolute inset-[3px] rounded-none border border-hh-ink/30" />
      <span className="font-display text-xs font-bold text-hh-ink">F</span>
    </span>
  )
}

export function Sidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } finally {
      setLoggingOut(false)
    }
  }

  const nav = (
    <nav className="flex flex-col gap-0.5">
      {APP_NAV.map((item) => {
        const Icon = NAV_ICONS[item.icon]
        const active =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-none border-l-2 px-3 py-2 text-sm font-medium text-hh-cream/70 transition-colors hover:bg-hh-cream/10 hover:text-hh-cream",
              active
                ? "border-hh-sun bg-hh-cream/10 text-hh-cream"
                : "border-transparent"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-hh-cream/10 bg-hh-forest text-hh-cream lg:flex">
        <div className="flex h-14 items-center gap-2.5 border-b border-hh-cream/10 px-4">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Logomark />
            <span className="font-display text-[15px] font-semibold tracking-tight">
              FrameForge <span className="text-hh-sun">AI</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">{nav}</div>

        <div className="flex items-center gap-2.5 border-t border-hh-cream/10 p-3">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt=""
              className="size-8 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-hh-sun text-xs font-semibold text-hh-ink">
              {initials(user.name)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-hh-cream">{user.name}</p>
            <p className="truncate text-xs text-hh-cream/50">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex size-8 shrink-0 items-center justify-center rounded-none text-hh-cream/60 transition-colors hover:bg-hh-cream/10 hover:text-hh-cream disabled:opacity-50"
            aria-label="Sign out"
          >
            {loggingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 border-b border-hh-cream/10 bg-hh-forest text-hh-cream lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Logomark />
            <span className="font-display text-[15px] font-semibold tracking-tight">
              FrameForge <span className="text-hh-sun">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt=""
                className="size-8 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-8 items-center justify-center rounded-full bg-hh-sun text-xs font-semibold text-hh-ink">
                {initials(user.name)}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex size-8 items-center justify-center rounded-none text-hh-cream/60 hover:bg-hh-cream/10 hover:text-hh-cream disabled:opacity-50"
              aria-label="Sign out"
            >
              {loggingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile nav strip */}
      <div className="sticky top-14 z-40 border-b border-hh-cream/10 bg-hh-forest px-3 text-hh-cream lg:hidden">
        <nav className="flex gap-1 overflow-x-auto py-2">{nav}</nav>
      </div>
    </>
  )
}
