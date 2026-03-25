 "use client"

 import { Link } from "react-router-dom"
 import { useLocation } from "react-router-dom"
 import { cn } from "@/lib/utils"
 import { LayoutDashboard, LifeBuoy, Megaphone, PlusCircle } from "lucide-react"

 export const adminNavItems = [
   {
     title: "Dashboard",
     href: "/admin/dashboard",
     icon: LayoutDashboard,
   },
   {
     title: "Support Inbox",
     href: "/admin/support",
     icon: LifeBuoy,
   },
   {
     title: "Announcements",
     href: "/admin/announcements",
     icon: Megaphone,
   },
   {
     title: "New Announcement",
     href: "/admin/announcements/create",
     icon: PlusCircle,
   },
 ]

 export function AdminSidebar() {
   const { pathname } = useLocation()

   return (
     <aside className="w-64 border-r-4 border-black bg-white flex flex-col min-h-screen sticky top-0 hidden md:flex">
       <div className="p-6 border-b-4 border-black">
         <Link to="/admin/dashboard" className="flex flex-col gap-1">
           <span className="font-black text-xs tracking-widest text-muted-foreground">
             ADMIN PANEL
           </span>
           <span className="font-black text-xl tracking-tight">
             Campus<span className="text-pink-500">Services</span>
           </span>
         </Link>
       </div>

       <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
         {adminNavItems.map((item) => {
           const active =
             pathname === item.href ||
             (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))

           return (
             <Link
               key={item.href}
               to={item.href}
               className={cn(
                 "flex items-center gap-3 px-4 py-3 font-bold text-sm transition-all border-2 rounded-none",
                 active
                   ? "bg-pink-100 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                   : "border-transparent text-muted-foreground hover:bg-gray-100 hover:text-black"
               )}
             >
               <item.icon className="w-5 h-5" />
               {item.title}
             </Link>
           )
         })}
       </nav>

       <div className="p-4 border-t-4 border-black bg-purple-50 text-xs font-bold text-muted-foreground">
         <p className="leading-snug">
           You&apos;re in the{" "}
           <span className="font-black text-black">admin area</span>. Changes here
           affect the entire platform.
         </p>
       </div>
     </aside>
   )
 }

