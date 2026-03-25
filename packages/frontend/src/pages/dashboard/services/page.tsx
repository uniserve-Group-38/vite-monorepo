import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { ProviderServicesManager } from "@/components/provider-services-manager"

export const dynamic = "force-dynamic"

export default async function ServicesPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user?.id) {
    return <div>Please log in</div>
  }

  const services = await prisma.service.findMany({
    where: {
      providerId: session.user.id,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="px-4 py-6 md:px-10 md:py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="relative overflow-hidden rounded-2xl border-4 border-black bg-purple-100 px-6 py-5 shadow-[8px_8px_0_0_#000] md:px-8 md:py-6">
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.05)_0,rgba(0,0,0,0.05)_2px,transparent_2px,transparent_6px)]" />
          <h1 className="relative text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            Service Management
          </h1>
          <p className="relative mt-2 max-w-xl text-sm font-medium text-foreground/70">
            Create, update, and manage the services you offer to students
          </p>
        </header>

        <ProviderServicesManager initialServices={services} />
      </div>
    </main>
  )
}
