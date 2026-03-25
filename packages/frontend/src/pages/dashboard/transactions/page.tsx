import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSession } from "@/lib/auth-client"
import { FinancialSummary } from "@/components/financial-summary"
import { ServiceStatsGrid } from "@/components/service-stats-grid"
import { Receipt, CreditCard, TrendingUp, Filter, Loader2 } from "lucide-react"

type Stats = {
  today: number
  week: number
  month: number
  year: number
  total: number
}

export default function TransactionsPage() {
  const navigate = useNavigate()
  const { data: session, isPending } = useSession()
  const [stats, setStats] = useState<Stats>({ today: 0, week: 0, month: 0, year: 0, total: 0 })
  const [serviceStats, setServiceStats] = useState<any[]>([])
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

    fetch(`${import.meta.env.VITE_API_URL}/api/provider/transactions`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats ?? { today: 0, week: 0, month: 0, year: 0, total: 0 })
        setServiceStats(d.serviceStats ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [session, isPending, navigate])

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-lime-500" />
      </div>
    )
  }

  return (
    <main className="px-4 py-6 md:px-10 md:py-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="relative overflow-hidden rounded-2xl border-4 border-black bg-white px-6 py-5 shadow-[8px_8px_0_0_#000] md:px-8 md:py-6">
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.02)_0,rgba(0,0,0,0.02)_2px,transparent_2px,transparent_6px)]" />
          <div className="relative flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="w-5 h-5 text-lime-600" />
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Financial Ledger</span>
              </div>
              <h1 className="text-3xl font-black leading-tight tracking-tighter md:text-5xl uppercase">
                Revenue <span className="text-lime-500">Summary</span>
              </h1>
              <p className="mt-2 max-w-xl text-sm font-bold text-foreground/60">
                Track your earnings across all services. Tap cards for detailed student payment history.
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-pink-500" />
              Earnings Overview
            </h2>
          </div>
          <FinancialSummary stats={stats} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-cyan-500" />
              Service Performance
            </h2>
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground">
              <Filter className="w-3 h-3" />
              Sorted by Recency
            </div>
          </div>
          <ServiceStatsGrid serviceStats={serviceStats} />
        </div>
      </section>
    </main>
  )
}
