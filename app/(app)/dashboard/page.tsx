import { getSessionUser } from "@/lib/auth/session"
import { OneClickGenerator } from "@/components/dashboard/OneClickGenerator"

export default async function DashboardPage() {
  const user = await getSessionUser()
  return <OneClickGenerator defaultOrganization={user?.organization} />
}