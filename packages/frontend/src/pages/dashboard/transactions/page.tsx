import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { FinancialSummary } from "@/components/financial-summary"
import { ServiceStatsGrid } from "@/components/service-stats-grid"
import { Role as RoleEnum } from "@/lib/generated/prisma/client"
import { Receipt, CreditCard, TrendingUp, Filter } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function TransactionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    window.location.href = "/auth/sign-in"
  }

  const role = (session.user as { role?: string }).role
  if (role !== RoleEnum.PROVIDER) {
    window.location.href = "/"
  }

  const userId = session.user.id

  // Fetch all transactions for this provider
  const transactions = await prisma.transaction.findMany({
    where: {
      providerId: userId,
      status: "paid", // Only count successful payments
    },
    include: {
      booking: {
        include: {
          service: true,
          student: {
            select: { id: true, name: true, email: true, image: true }
          }
        }
      }
    },
    orderBy: { paidAt: "desc" },
  })

  // --- Financial Stats Aggregation ---
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfYear = new Date(now.getFullYear(), 0, 1)

  const stats = {
    today: 0,
    week: 0,
    month: 0,
    year: 0,
    total: 0
  }

  transactions.forEach(tx => {
    const amount = tx.providerEarnings
    const paidAt = tx.paidAt ? new Date(tx.paidAt) : new Date(tx.createdAt)
    
    stats.total += amount
    if (paidAt >= today) stats.today += amount
    if (paidAt >= startOfWeek) stats.week += amount
    if (paidAt >= startOfMonth) stats.month += amount
    if (paidAt >= startOfYear) stats.year += amount
  })

  // --- Service Stats Grouping ---
  const serviceMap = new Map<string, any>()

  transactions.forEach(tx => {
    const service = tx.booking.service
    if (!serviceMap.has(service.id)) {
      serviceMap.set(service.id, {
        id: service.id,
        title: service.title,
        category: service.category,
        totalBookings: 0,
        totalEarnings: 0,
        transactions: []
      })
    }

    const sStat = serviceMap.get(service.id)
    sStat.totalBookings += 1
    sStat.totalEarnings += tx.providerEarnings
    sStat.transactions.push({
      id: tx.id,
      amount: tx.providerEarnings,
      date: tx.paidAt || tx.createdAt,
      student: tx.booking.student
    })
  })

  const serviceStats = Array.from(serviceMap.values())

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
                Track your earnings across all services. Taps cards for detailed student payment history.
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

