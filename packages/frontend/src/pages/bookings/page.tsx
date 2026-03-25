import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSession } from "@/lib/auth-client"
import { StudentBookings } from "@/components/student-bookings"
import { Loader2 } from "lucide-react"

export default function StudentBookingsPage() {
  const navigate = useNavigate()
  const { data: session, isPending } = useSession()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isPending) return
    if (!session?.user) {
      navigate("/auth/sign-in")
      return
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/bookings/my`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => { setBookings(Array.isArray(d) ? d : d.bookings ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [session, isPending, navigate])

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    )
  }

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
        <StudentBookings bookings={bookings} currentUserId={session?.user?.id ?? ""} />
      </section>
    </main>
  )
}