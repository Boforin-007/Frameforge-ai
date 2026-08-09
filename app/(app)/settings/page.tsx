import { SettingsClient } from "@/components/settings/SettingsClient"

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="font-mono text-xs tracking-[0.25em] text-hh-sun uppercase">
          {"// Account"}
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-hh-cream sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-hh-cream/70">
          Manage your profile, organization, and password.
        </p>
      </section>

      <SettingsClient />
    </div>
  )
}