import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp, Users, CheckCircle, Package } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const BookingStatus = { PENDING: "PENDING", ATTENDED: "ATTENDED" } as const
type BookingStatusType = typeof BookingStatus[keyof typeof BookingStatus]

type BookingWithRelations = {
  id: string
  status: BookingStatusType
  bookedAt: Date | string
  service: { price?: string | null; category?: string }
}

interface SalesAnalysisProps {
  bookings: BookingWithRelations[]
  totalServices: number
}

export function SalesAnalysis({ bookings, totalServices }: SalesAnalysisProps) {
  // --- Data Processing ---
  
  // Total Revenue (assuming service has a price field, but it's a string, so we try to parse it)
  // For demo purposes, we'll treat price as a number if it starts with $ or just a number string
  const calculateTotalRevenue = () => {
    return bookings
      .filter(b => b.status === BookingStatus.ATTENDED)
      .reduce((acc, curr) => {
        const priceStr = curr.service.price || "0"
        const priceNum = parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0
        return acc + priceNum
      }, 0)
  }

  const totalRevenue = calculateTotalRevenue()
  const completedBookings = bookings.filter(b => b.status === BookingStatus.ATTENDED).length
  const pendingBookings = bookings.filter(b => b.status === BookingStatus.PENDING).length

  // Revenue by Day (Last 7 Days)
  const getRevenueByDay = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: days[date.getDay()],
        revenue: 0,
        count: 0
      }
    })

    bookings
      .filter(b => b.status === BookingStatus.ATTENDED)
      .forEach(b => {
        const bDate = new Date(b.bookedAt)
        const dayDiff = Math.floor((new Date().getTime() - bDate.getTime()) / (1000 * 60 * 60 * 24))
        if (dayDiff < 7) {
            const priceStr = b.service.price || "0"
            const priceNum = parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0
            last7Days[6 - dayDiff].revenue += priceNum
            last7Days[6 - dayDiff].count += 1
        }
      })
    return last7Days
  }

  const chartData = getRevenueByDay()

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  // Category Popularity
  const getCategoryData = () => {
    const categories: Record<string, number> = {}
    bookings.forEach(b => {
      const cat = b.service.category || "Other"
      categories[cat] = (categories[cat] || 0) + 1
    })
    return Object.entries(categories)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  const categoryData = getCategoryData()

  const categoryConfig = {
    count: {
      label: "Bookings",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Stats Cards */}
      <Card className="bg-lime-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-black/60">Total Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-lime-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black">GH₵{totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground font-bold">Lifetime earnings</p>
        </CardContent>
      </Card>

      <Card className="bg-purple-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-black/60">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black">{completedBookings}</div>
          <p className="text-xs text-muted-foreground font-bold">Total bookings attended</p>
        </CardContent>
      </Card>

      <Card className="bg-amber-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-black/60">Pending</CardTitle>
          <Users className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black">{pendingBookings}</div>
          <p className="text-xs text-muted-foreground font-bold">Awaiting service</p>
        </CardContent>
      </Card>

      <Card className="bg-blue-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-black/60">Services</CardTitle>
          <Package className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black">{totalServices}</div>
          <p className="text-xs text-muted-foreground font-bold">Active service listings</p>
        </CardContent>
      </Card>

      {/* Charts */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="uppercase tracking-tighter font-black">7-Day Revenue Trend</CardTitle>
          <CardDescription>Daily earnings over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <AreaChart data={chartData} margin={{ left: -20, right: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#bef264"
                fill="#bef264"
                fillOpacity={0.4}
                strokeWidth={4}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="uppercase tracking-tighter font-black">Popular Categories</CardTitle>
          <CardDescription>Top 5 service categories by booking count</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={categoryConfig} className="h-[200px] w-full">
            <BarChart data={categoryData} margin={{ left: -20, right: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="#a855f7"
                radius={[4, 4, 0, 0]}
                stroke="#000"
                strokeWidth={2}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-bold leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground font-medium">
            Showing total bookings for the top 5 categories
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
