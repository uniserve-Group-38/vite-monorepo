"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Calendar, Clock, BarChart3, TrendingUp } from "lucide-react"

interface FinancialSummaryProps {
  stats: {
    today: number
    week: number
    month: number
    year: number
    total: number
  }
}

export function FinancialSummary({ stats }: FinancialSummaryProps) {
  const summaryItems = [
    {
      label: "Today's Earnings",
      value: stats.today,
      icon: Clock,
      color: "bg-lime-100 text-lime-700",
      border: "border-lime-200"
    },
    {
      label: "This Week",
      value: stats.week,
      icon: Calendar,
      color: "bg-cyan-100 text-cyan-700",
      border: "border-cyan-200"
    },
    {
      label: "This Month",
      value: stats.month,
      icon: BarChart3,
      color: "bg-purple-100 text-purple-700",
      border: "border-purple-200"
    },
    {
      label: "This Year",
      value: stats.year,
      icon: DollarSign,
      color: "bg-pink-100 text-pink-700",
      border: "border-pink-200"
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryItems.map((item) => (
        <Card key={item.label} className="border-4 border-black shadow-[4px_4px_0_0_#000] rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform">
          <CardHeader className={`flex flex-row items-center justify-between pb-2 ${item.color} border-b-2 border-black`}>
            <CardTitle className="text-xs font-black uppercase tracking-wider">{item.label}</CardTitle>
            <item.icon className="h-4 w-4" />
          </CardHeader>
          <CardContent className="pt-4 bg-white">
            <div className="text-2xl font-black">GH₵{item.value.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tighter flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Real-time balance
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
