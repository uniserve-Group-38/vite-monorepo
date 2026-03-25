import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSession } from "@/lib/auth-client"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FinancialSummary } from "@/components/financial-summary"
import { TrendingUp, Users, Loader2 } from "lucide-react"

type DashboardData = {
  stats: {
    today: number
    week: number
    month: number
    year: number
    total: number
  }
  bookings: Array<{
    id: string
    status: string
    service: { title: string }
    student: { name: string; email: string; image: string | null }
    conversation: { id: string } | null
  }>
}

export default function ProviderDashboardPage() {
  const navigate = useNavigate()
  const { data: session, isPending } = useSession()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isPending) return
    if (!session?.user) {
      navigate("/auth/sign-in")
      return
    }
    const role = (session.user as { role?: string }).role
    if (role !== "PROVIDER") {
      navigate("/")
      return
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/provider/dashboard`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [session, isPending, navigate])

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-lime-500" />
      </div>
    )
  }

  const bookings = data?.bookings ?? []
  const stats = data?.stats ?? { today: 0, week: 0, month: 0, year: 0, total: 0 }

  return (
    <main className="px-4 py-6 md:px-10 md:py-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="relative overflow-hidden rounded-2xl border-4 border-black bg-lime-100 px-6 py-5 shadow-[8px_8px_0_0_#000] md:px-8 md:py-6">
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.05)_0,rgba(0,0,0,0.05)_2px,transparent_2px,transparent_6px)]" />
          <div className="relative flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/60">
                Service Provider Console
              </p>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
                Pending bookings
                <span className="ml-3 inline-flex items-center rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-lime-300">
                  {bookings.length} new
                </span>
              </h1>
              <p className="mt-2 max-w-xl text-sm font-medium text-foreground/70">
                Manage students who have booked your services, chat with them, and mark services as completed
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-lime-600" />
              Earnings Overview
            </h2>
            <Link to="/dashboard/transactions" className="text-xs font-bold underline hover:text-lime-600">
              View Detailed Ledger
            </Link>
          </div>
          <FinancialSummary stats={stats} />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-black uppercase tracking-tight px-2 flex items-center gap-2">
            <Users className="w-5 h-5 text-pink-500" />
            Booking Queue
          </h2>
          <div className="grid gap-6">
            {bookings.length === 0 ? (
              <div className="rounded-2xl border-4 border-dashed border-black bg-white p-12 text-center shadow-[8px_8px_0_0_#000]">
                <p className="text-lg font-bold">No active bookings yet.</p>
                <p className="text-muted-foreground">When students book your services, they will appear here.</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden border-4 border-black bg-white shadow-[8px_8px_0_0_#000] rounded-2xl">
                  <CardHeader className="border-b-4 border-black bg-pink-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-black">{booking.service.title}</CardTitle>
                        <p className="text-sm font-bold text-muted-foreground">Booked by {booking.student.name}</p>
                      </div>
                      <Badge variant="outline" className="bg-yellow-300 border-2 border-black font-black">
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-black">
                          <AvatarImage src={booking.student.image || ""} />
                          <AvatarFallback className="font-bold">{booking.student.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-black">{booking.student.name}</p>
                          <p className="text-sm font-bold text-muted-foreground">{booking.student.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        {booking.conversation && (
                          <Link to={`/chat/${booking.conversation.id}`}>
                            <Button className="bg-cyan-300 transform transition-transform hover:-translate-y-1 active:translate-y-0 text-black border-2 border-black shadow-[4px_4px_0_0_#000] font-black hover:bg-cyan-400">
                              Chat with Student
                            </Button>
                          </Link>
                        )}
                        <Button variant="outline" className="border-2 border-black font-black hover:bg-lime-100 shadow-[4px_4px_0_0_#000] transform transition-transform hover:-translate-y-1 active:translate-y-0">
                          Mark Attended
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
