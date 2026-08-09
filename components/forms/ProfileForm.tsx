"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, ImageUp, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { profileSchema, type ProfileInput } from "@/lib/validations/profile"
import type { ProfileData } from "@/types/template"

function UploadField({
  label,
  kind,
  value,
  onChange,
}: {
  label: string
  kind: "photo" | "logo"
  value?: string
  onChange: (url?: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setError(null)

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Use a JPEG, PNG, or WebP image.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.")
      return
    }

    setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-upload-kind": kind },
        body: form,
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.url) {
        setError(data?.error ?? "Upload failed.")
        return
      }
      onChange(data.url)
    } catch {
      setError("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {value ? (
        <div className="flex items-center gap-3">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border-2 border-hh-ink/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={label} className="size-full object-cover" />
          </div>
          <div>
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-hh-ink/25 px-3 py-1 text-xs font-semibold text-hh-ink transition-colors hover:bg-hh-ink/5"
            >
              <X className="size-3.5" />
              {kind === "photo" ? "Remove photo" : "Remove logo"}
            </button>
            <p className="mt-1 text-xs text-hh-ink/60">Uploaded successfully.</p>
          </div>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-hh-ink/30 bg-hh-ink/5 px-4 py-6 text-center transition-colors hover:border-hh-ink hover:bg-hh-ink/10">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {uploading ? (
            <Loader2 className="size-5 text-hh-ink/60" />
          ) : (
            <ImageUp className="size-5 text-hh-ink/60" />
          )}
          <span className="text-sm font-bold text-hh-ink">
            {kind === "photo" ? "Upload photo" : "Upload logo"}
          </span>
          <span className="text-xs text-hh-ink/60">JPEG, PNG, or WebP · max 5 MB</span>
        </label>
      )}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}

export function ProfileForm({
  initialValues,
  defaultOrganization,
  onBack,
  onSubmit,
}: {
  initialValues?: Partial<ProfileData>
  defaultOrganization?: string
  onBack?: () => void
  onSubmit: (data: ProfileData) => void
}) {
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(initialValues?.photoUrl)
  const [logoUrl, setLogoUrl] = useState<string | undefined>(initialValues?.logoUrl)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      id: initialValues?.id ?? "",
      designation: initialValues?.designation ?? "",
      department: initialValues?.department ?? "",
      organization: initialValues?.organization ?? defaultOrganization ?? "",
      email: initialValues?.email ?? "",
      phone: initialValues?.phone ?? "",
    },
  })

  function submit(values: ProfileInput) {
    onSubmit({
      name: values.name,
      id: values.id,
      designation: values.designation ?? "",
      department: values.department ?? "",
      organization: values.organization,
      email: values.email ?? "",
      phone: values.phone ?? "",
      photoUrl,
      logoUrl,
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.name?.message}>
          <Input id="name" placeholder="Priya Raman" aria-invalid={!!errors.name} {...register("name")} />
        </Field>
        <Field label="ID number" error={errors.id?.message}>
          <Input id="id" placeholder="NL-0294" aria-invalid={!!errors.id} {...register("id")} />
        </Field>
        <Field label="Designation / course" error={errors.designation?.message}>
          <Input id="designation" placeholder="Senior Product Designer" {...register("designation")} />
        </Field>
        <Field label="Department" error={errors.department?.message}>
          <Input id="department" placeholder="Design" {...register("department")} />
        </Field>
        <Field label="Organization" error={errors.organization?.message}>
          <Input id="organization" placeholder="Nimbus Labs" aria-invalid={!!errors.organization} {...register("organization")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input id="email" type="email" placeholder="priya@company.com" {...register("email")} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <Input id="phone" type="tel" placeholder="+91 98765 43210" {...register("phone")} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <UploadField label="Profile photo" kind="photo" value={photoUrl} onChange={setPhotoUrl} />
        <UploadField label="Organization logo" kind="logo" value={logoUrl} onChange={setLogoUrl} />
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-semibold text-hh-ink/70 transition-colors hover:bg-hh-ink/10 hover:text-hh-ink"
          >
            Back
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-hh-ink bg-hh-sun px-4 py-1.5 text-sm font-bold text-hh-ink shadow-[2px_3px_0_rgba(11,15,12,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-hh-sun-2"
        >
          Continue to editor
        </button>
      </div>
    </form>
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