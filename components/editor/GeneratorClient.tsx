"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"

const Generator = dynamic(
  () => import("@/components/editor/Generator").then((m) => m.Generator),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-hh-cream/70">Loading editor…</p>
      </div>
    ),
  }
)

export function GeneratorClient({
  defaultOrganization,
}: {
  defaultOrganization?: string
}) {
  return (
    <Suspense fallback={null}>
      <GeneratorWithParams defaultOrganization={defaultOrganization} />
    </Suspense>
  )
}

function GeneratorWithParams({
  defaultOrganization,
}: {
  defaultOrganization?: string
}) {
  const searchParams = useSearchParams()
  const projectId = searchParams.get("project")
  const template = searchParams.get("template")

  return (
    <Generator
      defaultOrganization={defaultOrganization}
      projectId={projectId ?? undefined}
      templateParam={template ?? undefined}
    />
  )
}