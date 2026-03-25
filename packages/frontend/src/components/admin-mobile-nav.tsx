"use client"

import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { adminNavItems } from "@/components/admin-sidebar"
import { cn } from "@/lib/utils"

export function AdminMobileNav() {
  const { pathname } = useLocation()

  return (
    <header className="md:hidden flex items-center justify-between gap-2 border-b-4 border-black bg-white px-4 py-3 sticky top-0 z-40 shrink-0">
      <Link to="/admin/dashboard" className="font-black text-lg tracking-tight truncate min-w-0">
        Campus<span className="text-pink-500">Services</span> Admin
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="h-10 w-10 border-2 border-black shrink-0" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full max-w-xs border-r-4 border-black p-0 [&>button]:hidden">
          <SheetTitle className="sr-only">Admin menu</SheetTitle>
          <nav className="flex flex-col gap-1 pt-6 px-4">
            {adminNavItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 font-bold text-sm border-2 rounded-none transition-all",
                    active
                      ? "bg-pink-100 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      : "border-transparent text-muted-foreground hover:bg-gray-100 hover:text-black"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
