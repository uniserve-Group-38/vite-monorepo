"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ChevronRight, 
  Users, 
  Receipt, 
  History, 
  Search,
  ArrowUpRight
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Student {
  id: string
  name: string
  email: string
  image: string | null
}

interface Transaction {
  id: string
  amount: number
  date: string
  student: Student
}

interface ServiceStat {
  id: string
  title: string
  category: string
  totalBookings: number
  totalEarnings: number
  transactions: Transaction[]
}

interface ServiceStatsGridProps {
  serviceStats: ServiceStat[]
}

export function ServiceStatsGrid({ serviceStats }: ServiceStatsGridProps) {
  const [selectedService, setSelectedService] = useState<ServiceStat | null>(null)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceStats.map((service) => (
          <Card 
            key={service.id} 
            className="group cursor-pointer border-4 border-black shadow-[8px_8px_0_0_#000] rounded-2xl overflow-hidden hover:-translate-y-1 transition-all"
            onClick={() => setSelectedService(service)}
          >
            <CardHeader className="border-b-4 border-black bg-yellow-50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black group-hover:text-lime-600 transition-colors">{service.title}</CardTitle>
                <Badge variant="outline" className="mt-1 border-2 border-black font-black uppercase text-[10px] bg-white">
                  {service.category}
                </Badge>
              </div>
              <ArrowUpRight className="w-6 h-6 text-black/20 group-hover:text-black transition-colors" />
            </CardHeader>
            <CardContent className="p-6 bg-white flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-pink-100 border-2 border-black rounded-lg">
                    <Users className="w-4 h-4 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Bookings</p>
                    <p className="text-xl font-black">{service.totalBookings}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-lime-100 border-2 border-black rounded-lg">
                    <Receipt className="w-4 h-4 text-lime-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Earnings</p>
                    <p className="text-xl font-black">GH₵{service.totalEarnings.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent className="max-w-2xl border-4 border-black rounded-3xl p-0 overflow-hidden bg-white shadow-[12px_12px_0_0_#000]">
          {selectedService && (
            <>
              <DialogHeader className="p-6 border-b-4 border-black bg-cyan-50">
                <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
                  {selectedService.title} <span className="text-cyan-600">History</span>
                </DialogTitle>
                <DialogDescription className="font-bold text-black/60">
                  Full booking and payment history for this service.
                </DialogDescription>
              </DialogHeader>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  {selectedService.transactions.length === 0 ? (
                    <div className="text-center py-10 border-4 border-dashed border-black rounded-2xl">
                      <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="font-bold">No payments recorded yet.</p>
                    </div>
                  ) : (
                    selectedService.transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 border-2 border-black rounded-xl bg-slate-50 hover:bg-white transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-black">
                            <AvatarImage src={tx.student.image || ""} />
                            <AvatarFallback className="font-bold">{tx.student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-black text-sm">{tx.student.name}</p>
                            <p className="text-[10px] font-bold text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-lime-600">GH₵{tx.amount.toLocaleString()}</p>
                          <Badge className="bg-white border-2 border-black text-black font-bold text-[9px] uppercase">Paid</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
