"use client"

import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { Home, Calendar, MessageSquare, Briefcase, CreditCard, Settings, ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Bookings",
    url: "/dashboard/bookings",
    icon: Calendar,
  },
  {
    title: "Services",
    url: "/dashboard/services",
    icon: Briefcase,
  },
  {
    title: "Transactions",
    url: "/dashboard/transactions",
    icon: CreditCard,
  },
  {
    title: "Chat",
    url: "/dashboard/chat",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const { pathname } = useLocation()
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchUnreadCount = () => {
    fetch(import.meta.env.VITE_API_URL + `/api/provider/unread-count`)
      .then((res) => res.json())
      .then((data) => setUnreadCount(data.unreadCount || 0))
      .catch(() => setUnreadCount(0))
  }

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000) // Polling every 30s
    
    const onRefetch = () => fetchUnreadCount()
    window.addEventListener("refetch-unread-count", onRefetch)
    
    return () => {
        clearInterval(interval)
        window.removeEventListener("refetch-unread-count", onRefetch)
    }
  }, [])

  return (
    <Sidebar collapsible="offcanvas" className="border-r-4 border-black font-semibold">
      <SidebarContent>
        <SidebarGroup>
          <div className="p-4 py-6 font-black tracking-tighter text-2xl">
            Service <span className="text-lime-500">Provider Panel</span>
          </div>
          <SidebarGroupLabel className="font-bold text-black/60">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} className={pathname === item.url ? "bg-lime-200 text-black border-2 border-black font-bold shadow-[2px_2px_0px_0px_#000]" : "hover:bg-lime-100 font-bold"}>
                    <Link to={item.url} className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-1" />
                        <span>{item.title}</span>
                      </div>
                      {item.title === "Chat" && unreadCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ring-1 ring-white animate-pulse mr-1">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <Link to="/">
            <div className="flex items-center justify-center gap-2 w-full bg-cyan-200 text-black border-4 border-black p-3 font-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              <ArrowLeft className="w-5 h-5" />
              <span>Explore Marketplace</span>
            </div>
          </Link>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
