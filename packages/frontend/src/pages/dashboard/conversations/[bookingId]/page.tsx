
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      service: true,
      conversation: { select: { id: true } },
    },
  })

  if (!booking) {
    window.location.href = "/404"
  }

  if (booking.conversation) {
    window.location.href = `/chat/${booking.conversation.id}`
  }

  window.location.href = "/dashboard/bookings"
}
