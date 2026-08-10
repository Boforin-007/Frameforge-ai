"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AlertTriangle, Check, ImageUp, Loader2, Save, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SessionUser } from "@/lib/auth/session"

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(80),
  organization: z.string().trim().max(120),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function SettingsClient({ user }: { user: SessionUser }) {
  const router = useRouter()
  const [profileState, setProfileState] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [avatarUrl, setAvatarUrl] = useState<string>(user.avatarUrl ?? "")
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [resetOpen, setResetOpen] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, organization: user.organization },
  })

  async function uploadAvatar(file: File | undefined) {
    if (!file) return
    setAvatarError(null)
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setAvatarError("Use a JPEG, PNG, or WebP image.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Image must be under 5 MB.")
      return
    }
    setUploadingAvatar(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-upload-kind": "avatar" },
        body: form,
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.url) {
        setAvatarError(data?.error ?? "Upload failed.")
        return
      }
      const url = data.url
      const patch = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: url }),
      })
      if (!patch.ok) {
        setAvatarError("Saved the image but couldn’t update your profile.")
        return
      }
      setAvatarUrl(url)
      setProfileState("saved")
      router.refresh()
    } catch {
      setAvatarError("Upload failed. Please try again.")
    } finally {
      setUploadingAvatar(false)
    }
  }

  async function saveProfile(values: ProfileValues) {
    setProfileState("saving")
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error("Failed")
      setProfileState("saved")
      router.refresh()
    } catch {
      setProfileState("error")
    }
  }

  async function confirmReset() {
    setResetting(true)
    setResetError(null)
    try {
      const res = await fetch("/api/account", { method: "DELETE" })
      if (!res.ok) {
        setResetError("Couldn’t reset the workspace.")
        setResetting(false)
        return
      }
      setResetOpen(false)
      router.push("/dashboard")
      router.refresh()
    } catch {
      setResetError("Couldn’t reset the workspace.")
      setResetting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="hh-sticker bg-hh-cream p-6 text-hh-ink">
        <h2 className="font-display text-base font-bold text-hh-ink">Profile</h2>
        <p className="mt-0.5 text-sm text-hh-ink/60">Your photo, name, and organization.</p>
        <p className="mt-1.5 font-mono text-[10px] font-bold tracking-[0.2em] text-hh-ink/50 uppercase">
          Workspace since{" "}
          {new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </p>

        <div className="mt-5 flex items-center gap-4">
          {avatarUrl ? (
            <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-hh-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatarUrl} alt="Avatar" className="size-full object-cover" />
            </div>
          ) : (
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-hh-ink bg-hh-sun font-display text-lg font-extrabold text-hh-ink">
              {profileForm.getValues("name")?.slice(0, 2).toUpperCase() || "FF"}
            </span>
          )}
          <div className="flex flex-col gap-2">
            <label className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-hh-forest hover:underline">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => uploadAvatar(e.target.files?.[0])}
              />
              {uploadingAvatar ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ImageUp className="size-4" />
              )}
              {avatarUrl ? "Change photo" : "Upload photo"}
            </label>
            {avatarUrl && (
              <button
                type="button"
                className="flex items-center gap-1 text-left text-sm text-hh-ink/60 hover:text-hh-pink"
                onClick={async () => {
                  setAvatarUrl("")
                  await fetch("/api/account", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ avatarUrl: "" }),
                  }).catch(() => {})
                  router.refresh()
                }}
              >
                <X className="size-3.5" /> Remove
              </button>
            )}
            {avatarError && <p className="text-xs text-destructive">{avatarError}</p>}
          </div>
        </div>

        <form onSubmit={profileForm.handleSubmit(saveProfile)} className="mt-6 flex flex-col gap-4">
          <Field label="Full name" error={profileForm.formState.errors.name?.message}>
            <Input placeholder="Priya Raman" {...profileForm.register("name")} />
          </Field>
          <Field label="Organization" error={profileForm.formState.errors.organization?.message}>
            <Input placeholder="Nimbus Labs" {...profileForm.register("organization")} />
          </Field>
          <div className="flex items-center justify-between gap-3">
            {profileState === "error" && (
              <p className="text-xs text-destructive">Couldn’t save. Try again.</p>
            )}
            {profileState === "saved" && (
              <p className="flex items-center gap-1 text-xs text-verify">
                <Check className="size-3.5" /> Saved.
              </p>
            )}
            <span className="flex-1" />
            <button
              type="submit"
              disabled={profileState === "saving"}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-hh-ink bg-hh-sun px-4 py-1.5 text-sm font-bold text-hh-ink shadow-[2px_3px_0_rgba(11,15,12,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-hh-sun-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {profileState === "saving" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save profile
            </button>
          </div>
        </form>
      </section>

      <section className="hh-sticker bg-hh-cream p-6 text-hh-ink">
        <h2 className="font-display text-base font-bold text-hh-ink">Danger zone</h2>
        <p className="mt-0.5 text-sm text-hh-ink/60">
          Reset this workspace — deletes all projects, templates, and downloads stored on this
          machine. This can’t be undone.
        </p>
        {!resetOpen ? (
          <button
            type="button"
            onClick={() => setResetOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border-2 border-hh-pink/50 px-4 py-1.5 text-sm font-bold text-hh-pink transition-colors hover:border-hh-pink hover:bg-hh-pink/10"
          >
            <AlertTriangle className="size-4" /> Reset workspace
          </button>
        ) : (
          <div className="mt-4 flex max-w-md flex-col gap-3">
            {resetError && <p className="text-xs text-hh-pink">{resetError}</p>}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={confirmReset}
                disabled={resetting}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-hh-pink bg-hh-pink px-4 py-1.5 text-sm font-bold text-hh-cream transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
              >
                {resetting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <AlertTriangle className="size-4" />
                )}
                {resetting ? "Resetting…" : "Yes, reset everything"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setResetOpen(false)
                  setResetError(null)
                }}
                disabled={resetting}
                className="inline-flex items-center justify-center rounded-full border-2 border-hh-ink/25 px-4 py-1.5 text-sm font-semibold text-hh-ink transition-colors hover:bg-hh-ink/5 disabled:pointer-events-none disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
