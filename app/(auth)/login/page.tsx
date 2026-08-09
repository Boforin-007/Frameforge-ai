import Link from "next/link"

import { LoginForm } from "@/components/forms/LoginForm"

export default function LoginPage() {
  return (
    <div className="relative hh-sticker bg-hh-cream p-6 text-hh-ink sm:p-7">
      <span aria-hidden className="absolute top-0 left-0 h-1 w-full rounded-t-[0.75rem] bg-hh-forest" />
      <span
        aria-hidden
        className="absolute -top-3 left-10 size-5 rounded-full border-2 border-hh-cream bg-hh-pink shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.25em] text-hh-ink/50 uppercase">
            {"// Sign in"}
          </span>
          <span className="size-2 bg-hh-sun" />
        </div>
        <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-hh-ink">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-hh-ink/70">
          Sign in to your FrameForge AI workspace.
        </p>

        <div className="mt-6">
          <LoginForm />
        </div>

        <p className="mt-5 border-t border-hh-ink/15 pt-4 text-center text-sm text-hh-ink/70">
          New to FrameForge AI?{" "}
          <Link href="/register" className="font-bold text-hh-forest hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
