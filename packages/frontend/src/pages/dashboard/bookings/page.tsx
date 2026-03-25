import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ProviderBookings } from "@/components/provider-bookings"
import { headers } from "next/headers"


export const dynamic = "force-dynamic"

export default async function BookingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    window.location.href = "/auth/sign-in"
  }

  const userId = session.user.id

  // Fetch bookings where user is the PROVIDER only
  const bookings = await prisma.booking.findMany({
    where: {
      providerId: userId,  // Only bookings where I'm the provider
    },
    include: {
      student: true,
      service: true,
      provider: true,
      conversation: { select: { id: true } },
      transactions: true,
    },
    orderBy: [
      { status: "desc" },
      { bookedAt: "desc" },
    ],
  })

  return (
    <main className="px-3 sm:px-4 py-4 sm:py-6 md:px-10 md:py-10 min-w-0">
      <section className="mx-auto flex max-w-5xl flex-col gap-4 sm:gap-6">
        <header className="relative overflow-hidden rounded-xl sm:rounded-2xl border-4 border-black bg-white px-4 py-4 sm:px-6 sm:py-5 shadow-[6px_6px_0_0_#000] md:px-8 md:py-6">
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.05)_0,rgba(0,0,0,0.05)_2px,transparent_2px,transparent_6px)]" />
          <h1 className="relative text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            My Bookings
          </h1>
          <p className="relative mt-1 sm:mt-2 max-w-xl text-xs sm:text-sm font-medium text-foreground/70">
            View your bookings - both as student and service provider
          </p>
        </header>
        <ProviderBookings bookings={bookings as any} currentUserId={userId} />
      </section>
    </main>
  )
}
