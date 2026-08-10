import { getSessionUser } from "@/lib/auth/session"
import { SettingsClient } from "@/components/settings/SettingsClient"

export default async function SettingsPage() {
  const user = await getSessionUser()

  return (
    <div className="space-y-8">
      <section>
        <p className="font-mono text-xs tracking-[0.25em] text-hh-sun uppercase">
          {"// Workspace"}
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-hh-cream sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-hh-cream/70">
          Manage your profile, organization, and local workspace data.
        </p>
      </section>

      <SettingsClient user={user} />
    </div>
  )
}
