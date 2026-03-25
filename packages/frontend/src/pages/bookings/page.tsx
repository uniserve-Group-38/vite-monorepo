
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { StudentBookings } from "@/components/student-bookings"

export const dynamic = "force-dynamic"

export default async function StudentBookingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    window.location.href = "/auth/sign-in"
  }

  const userId = session.user.id

  // Fetch bookings where user is the STUDENT only
  const bookings = await prisma.booking.findMany({
    where: {
      studentId: userId,  // Only bookings where I'm the student
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
    <main className="px-4 py-6 md:px-10 md:py-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="relative overflow-hidden rounded-2xl border-4 border-black bg-white px-6 py-5 shadow-[8px_8px_0_0_#000] md:px-8 md:py-6">
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.05)_0,rgba(0,0,0,0.05)_2px,transparent_2px,transparent_6px)]" />
          <h1 className="relative text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            My Bookings
          </h1>
          <p className="relative mt-2 max-w-xl text-sm font-medium text-foreground/70">
            View your service bookings and make payments
          </p>
        </header>
        <StudentBookings bookings={bookings as any} currentUserId={userId} />
      </section>
    </main>
  )
}