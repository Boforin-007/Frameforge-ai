import { getSessionUser } from "@/lib/auth/session"
import { GeneratorClient } from "@/components/editor/GeneratorClient"

export default async function GeneratorPage() {
  const user = await getSessionUser()
  return <GeneratorClient defaultOrganization={user?.organization} />
}