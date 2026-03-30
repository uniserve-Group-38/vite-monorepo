import { Link } from "react-router-dom"
import { useState } from "react"
import { format } from "date-fns"
import { MessageCircle, CheckCircle2, Clock3, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const BookingStatus = { PENDING: "PENDING", ATTENDED: "ATTENDED" } as const
type BookingStatusType = typeof BookingStatus[keyof typeof BookingStatus]

type BookingWithRelations = {
  id: string
  status: BookingStatusType
  bookedAt: Date | string
  studentId: string
  service: { title: string; price?: string | null; category?: string }
  provider: { name: string }
  conversation: { id: string } | null
  transactions?: Array<{ status: string }>
}

interface StudentBookingsProps {
  bookings: BookingWithRelations[]
  currentUserId?: string
}

export function StudentBookings({ bookings: initial, currentUserId }: StudentBookingsProps) {
  const [bookings] = useState(initial)
  const [payingId, setPayingId] = useState<string | null>(null)

  const handlePayNow = async (booking: BookingWithRelations) => {
    try {
      setPayingId(booking.id)
      
      // Initialize payment
      const paymentResponse = await fetch(import.meta.env.VITE_API_URL + `/api/payments/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          studentId: booking.studentId,
        }),
      })

      const paymentData = await paymentResponse.json()

      if (paymentData.success) {
        // Redirect to Paystack
        window.location.href = paymentData.authorizationUrl
      } else {
        alert("Failed to initialize payment")
        setPayingId(null)
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Failed to initialize payment")
      setPayingId(null)
    }
  }

  if (!bookings.length) {
    return (
      <section className="rounded-2xl border-4 border-dashed border-black bg-white/70 p-6 text-center shadow-[6px_6px_0_0_#000]">
        <h2 className="text-xl font-extrabold uppercase tracking-[0.18em]">
          No bookings yet
        </h2>
        <p className="mt-2 text-sm text-foreground/70">
          When you book services, they&apos;ll show up here.
        </p>
      </section>
    )
  }

  const sortedBookings = [...bookings].sort((a, b) => {
    if (a.status === BookingStatus.PENDING && b.status === BookingStatus.ATTENDED) return -1
    if (a.status === BookingStatus.ATTENDED && b.status === BookingStatus.PENDING) return 1
    return new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()
  })

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {sortedBookings.map((booking, index) => {
          const hasPaid = booking.transactions?.some(t => t.status === "success")
          
          return (
            <article
              key={booking.id}
              className={cn(
                "group relative overflow-hidden rounded-2xl border-4 border-black bg-white p-4 shadow-[6px_6px_0_0_#000] transition-transform hover:-translate-y-1",
                index % 2 === 0 ? "bg-emerald-50" : "bg-amber-50",
              )}
            >
              <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.04)_0,rgba(0,0,0,0.04)_2px,transparent_2px,transparent_6px)] opacity-70" />
              <div className="relative flex flex-col gap-3">
                <header className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-extrabold uppercase tracking-[0.15em]">
                      {booking.service.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-foreground/70">
                      Provider:{" "}
                      <span className="font-semibold">
                        {booking.provider.name}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 border-2 border-black bg-yellow-200 px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em]"
                    >
                      <Clock3 className="h-3 w-3" />
                      {booking.status === BookingStatus.PENDING ? "Pending" : "Completed"}
                    </Badge>
                    {hasPaid && (
                      <Badge className="border-2 border-black bg-green-300 px-2 py-1 text-[10px] font-extrabold uppercase">
                        Paid
                      </Badge>
                    )}
                  </div>
                </header>

                <div className="flex items-center justify-between text-xs font-medium text-foreground/70">
                  <div className="flex flex-col">
                    <span className="uppercase tracking-[0.16em]">Booked on</span>
                    <span className="font-semibold">
                      {format(new Date(booking.bookedAt), "dd MMM yyyy, HH:mm")}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="uppercase tracking-[0.16em]">Amount</span>
                    <span className="font-semibold">
                      {booking.service.price}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  {booking.conversation ? (
                    <Link
                      to={`/chat/${booking.conversation.id}`}
                      className="flex flex-1 items-center justify-between rounded-xl border-2 border-black bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] shadow-[4px_4px_0_0_#000] transition-transform group-hover:-translate-y-0.5"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-[10px] text-lime-300">
                          {booking.provider.name.charAt(0).toUpperCase()}
                        </span>
                        Chat
                      </span>
                      <MessageCircle className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="flex flex-1 items-center justify-between rounded-xl border-2 border-black bg-gray-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground cursor-not-allowed">
                      <span className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Chat (unavailable)
                      </span>
                    </span>
                  )}

                  {/* Show Pay Now button if completed and not paid */}
                  {booking.status === BookingStatus.ATTENDED && !hasPaid && (
                    <Button
                      size="sm"
                      className="border-2 border-black bg-green-500 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.16em] shadow-[4px_4px_0_0_#000] hover:bg-green-400"
                      onClick={() => handlePayNow(booking)}
                      disabled={payingId === booking.id}
                    >
                      <DollarSign className="mr-1 h-3 w-3" />
                      {payingId === booking.id ? "Processing..." : "Pay Now"}
                    </Button>
                  )}

                  {/* Show paid status */}
                  {hasPaid && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-2 border-black bg-green-200 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-green-700 cursor-not-allowed opacity-70 shadow-none hover:bg-green-200"
                      disabled
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Paid
                    </Button>
                  )}

                  {/* Show waiting for completion status */}
                  {booking.status === BookingStatus.PENDING && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-2 border-black bg-yellow-200 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-yellow-800 cursor-not-allowed opacity-70 shadow-none hover:bg-yellow-200"
                      disabled
                    >
                      <Clock3 className="mr-1 h-3 w-3" />
                      Awaiting Service
                    </Button>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
