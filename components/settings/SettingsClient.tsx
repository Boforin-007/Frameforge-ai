"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AlertTriangle, Check, ImageUp, Loader2, Save, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(80),
  organization: z.string().trim().max(120),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password.").max(128),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .max(128),
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: "New password must be different.",
    path: ["newPassword"],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export function SettingsClient() {
  const router = useRouter()
  const [profileState, setProfileState] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [passwordState, setPasswordState] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [memberSince, setMemberSince] = useState("")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", organization: "" },
  })
  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  })

  useEffect(() => {
    let cancelled = false
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (cancelled || !data.user) return
        profileForm.reset({
          name: data.user.name ?? "",
          organization: data.user.organization ?? "",
        })
        setAvatarUrl(data.user.avatarUrl ?? "")
        setMemberSince(data.user.createdAt ?? "")
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [profileForm])

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
    } catch {
      setProfileState("error")
    }
  }

  async function savePassword(values: PasswordValues) {
    setPasswordState("saving")
    setPasswordError(null)
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setPasswordError(data?.error ?? "Couldn’t update your password.")
        setPasswordState("error")
        return
      }
      passwordForm.reset()
      setPasswordState("saved")
    } catch {
      setPasswordState("error")
    }
  }

  async function confirmDelete() {
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await fetch("/api/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setDeleteError(data?.error ?? "Couldn’t delete your account.")
        setDeleting(false)
        return
      }
      router.push("/")
      router.refresh()
    } catch {
      setDeleteError("Couldn’t delete your account.")
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
      <section className="hh-sticker bg-hh-cream p-6 text-hh-ink">
        <h2 className="font-display text-base font-bold text-hh-ink">Profile</h2>
        <p className="mt-0.5 text-sm text-hh-ink/60">Your photo, name, and organization.</p>
        {memberSince && (
          <p className="mt-1.5 font-mono text-[10px] font-bold tracking-[0.2em] text-hh-ink/50 uppercase">
            Member since {new Date(memberSince).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          </p>
        )}

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
        <h2 className="font-display text-base font-bold text-hh-ink">Password</h2>
        <p className="mt-0.5 text-sm text-hh-ink/60">
          Update your password. You’ll be asked to enter it on your next sign-in.
        </p>
        <form
          onSubmit={passwordForm.handleSubmit(savePassword)}
          className="mt-5 flex flex-col gap-4"
        >
          <Field label="Current password" error={passwordForm.formState.errors.currentPassword?.message}>
            <Input type="password" placeholder="••••••••" {...passwordForm.register("currentPassword")} />
          </Field>
          <Field label="New password" error={passwordForm.formState.errors.newPassword?.message}>
            <Input type="password" placeholder="At least 8 characters" {...passwordForm.register("newPassword")} />
          </Field>
          <div className="flex items-center justify-between gap-3">
            {passwordState === "saved" && (
              <p className="flex items-center gap-1 text-xs text-verify">
                <Check className="size-3.5" /> Password updated.
              </p>
            )}
            {passwordState === "error" && (
              <p className="text-xs text-destructive">
                {passwordError ?? "Couldn’t update your password."}
              </p>
            )}
            <span className="flex-1" />
            <button
              type="submit"
              disabled={passwordState === "saving"}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-hh-ink/30 px-4 py-1.5 text-sm font-semibold text-hh-ink transition-colors hover:border-hh-ink hover:bg-hh-ink/5 disabled:pointer-events-none disabled:opacity-50"
            >
              {passwordState === "saving" && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Update password
            </button>
          </div>
        </form>
      </section>
      </div>

      <section className="hh-sticker bg-hh-cream p-6 text-hh-ink">
        <h2 className="font-display text-base font-bold text-hh-ink">Danger zone</h2>
        <p className="mt-0.5 text-sm text-hh-ink/60">
          Permanently delete your account and all your projects, templates, and downloads. This
          can’t be undone.
        </p>
        {!deleteOpen ? (
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border-2 border-hh-pink/50 px-4 py-1.5 text-sm font-bold text-hh-pink transition-colors hover:border-hh-pink hover:bg-hh-pink/10"
          >
            <AlertTriangle className="size-4" /> Delete account
          </button>
        ) : (
          <div className="mt-4 flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Enter your password to confirm</Label>
              <Input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && deletePassword) confirmDelete()
                }}
                placeholder="••••••••"
                autoFocus
                className="border-hh-ink/30"
              />
            </div>
            {deleteError && <p className="text-xs text-hh-pink">{deleteError}</p>}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting || !deletePassword}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-hh-pink bg-hh-pink px-4 py-1.5 text-sm font-bold text-hh-cream transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <AlertTriangle className="size-4" />
                )}
                {deleting ? "Deleting…" : "Permanently delete my account"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteOpen(false)
                  setDeletePassword("")
                  setDeleteError(null)
                }}
                disabled={deleting}
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