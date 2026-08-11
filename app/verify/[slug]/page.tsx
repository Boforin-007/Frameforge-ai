"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { BadgeCheck, Ban, CalendarDays, Loader2, ShieldCheck } from "lucide-react"

import CanvasEditor from "@/components/editor/CanvasEditor"
import HHGoaBackground from "@/components/landing/HHGoaBackground"
import type { CardTemplate, ProfileData } from "@/types/template"

interface VerifyCard {
  id: string
  name: string
  profile: ProfileData
  template: CardTemplate
  createdAt?: string
}

export default function VerifyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  return <VerifyCardView slug={slug} />
}

function VerifyCardView({ slug }: { slug: string }) {
  const [card, setCard] = useState<VerifyCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    fetch(`/api/verify/${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (!cancelled) {
          setCard(data.card)
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) setError("This card could not be found or verified.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  const profile = card?.profile

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-hh-forest">
      <HHGoaBackground />

      <header className="relative z-30 border-b border-hh-cream/10 bg-hh-forest/70 text-hh-cream backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="relative flex size-7 items-center justify-center rounded-none bg-hh-sun">
              <span className="absolute inset-[3px] rounded-none border border-hh-ink/30" />
              <span className="font-display text-xs font-bold text-hh-ink">H</span>
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight">
              HACKER <span className="text-hh-sun">HOUSE</span>
            </span>
          </Link>
          <span className="flex items-center gap-1.5 font-mono text-xs font-bold tracking-[0.15em] text-hh-sun uppercase">
            <ShieldCheck className="size-3.5" /> Verification
          </span>
        </div>
      </header>

      <main className="relative z-30 mx-auto w-full max-w-3xl flex-1 px-4 py-10 text-hh-cream sm:py-16">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-24 text-sm text-hh-cream/80">
            <Loader2 className="size-4 animate-spin" /> Verifying card…
          </div>
        ) : error || !card ? (
          <div className="relative flex flex-col items-center justify-center gap-3 py-24 text-center">
            <span className="hh-icon-tile hh-icon-tile--pink flex size-12 items-center justify-center">
              <Ban className="size-5" />
            </span>
            <p className="font-display text-lg font-bold text-hh-cream">Card not found</p>
            <p className="max-w-sm text-sm text-hh-cream/70">
              {error ??
                "This card hasn’t been issued through HACKER HOUSE, or the link is incorrect."}
            </p>
            <Link
              href="/"
              className="mt-2 rounded-full border-2 border-hh-ink bg-hh-sun px-4 py-1.5 font-display text-sm font-bold text-hh-ink shadow-[3px_4px_0_rgba(11,15,12,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5"
            >
              Go to HACKER HOUSE
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="hh-icon-tile hh-icon-tile--sun flex size-10 items-center justify-center">
                <BadgeCheck className="size-5" />
              </span>
              <div>
                <p className="font-display text-lg font-bold text-hh-cream">
                  Verified credential
                </p>
                <p className="text-sm text-hh-cream/70">
                  This card is genuine and issued by {profile?.organization || "HACKER HOUSE"}.
                </p>
              </div>
            </div>

            <div className="relative hh-sticker bg-hh-forest p-6 sm:p-8">
              <div className="shrink-0 bg-hh-cream p-2">
                <CanvasEditor
                  template={card.template}
                  profile={card.profile}
                  selectedId={null}
                  onSelect={() => {}}
                  onUpdateElement={() => {}}
                  readOnly
                />
              </div>
            </div>

            <div className="relative hh-sticker grid gap-3 bg-hh-cream p-6 text-hh-ink sm:grid-cols-2">
              {[
                ["Full name", profile?.name],
                ["ID number", profile?.id],
                ["Designation", profile?.designation],
                ["Department", profile?.department],
                ["Organization", profile?.organization],
                ["Email", profile?.email],
                ["Phone", profile?.phone],
              ]
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={String(label)}>
                    <p className="font-mono text-[10px] tracking-[0.2em] text-hh-ink/50 uppercase">
                      {label}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-hh-ink">{value}</p>
                  </div>
                ))}
            </div>

            {card.createdAt && (
              <p className="flex items-center justify-center gap-1.5 font-mono text-xs text-hh-cream/70">
                <CalendarDays className="size-3.5" />
                Issued{" "}
                {new Date(card.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
