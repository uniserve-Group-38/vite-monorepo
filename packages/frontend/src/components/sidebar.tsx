"use client"

import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import {
    Briefcase,
    Bell,
    LogOut,
    User as UserIcon,
    Settings,
    LifeBuoy,
    MessageCircle,
    Calendar,
    ShoppingCart
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/lib/auth-client"
import { useCartStore } from "@/lib/cart-store"

interface SidebarProps {
    /** When true, sidebar is always visible (e.g. inside mobile sheet). When false, hidden on mobile, visible on md+. */
    forceVisible?: boolean
}

export function Sidebar({ forceVisible }: SidebarProps = {}) {
    const { pathname } = useLocation()
    const { data: session, isPending } = useSession()
    const [unreadCount, setUnreadCount] = useState(0)
    const { getTotalItems } = useCartStore()
    const cartItemCount = getTotalItems()

    const fetchUnreadCount = () => {
        if (!session?.user?.id) return
        fetch(import.meta.env.VITE_API_URL + `/api/messages/unread-count`)
            .then((res) => res.json())
            .then((data) => setUnreadCount(Number(data.count) || 0))
            .catch(() => setUnreadCount(0))
    }

    useEffect(() => {
        if (!session?.user?.id) {
            setUnreadCount(0)
            return
        }
        fetchUnreadCount()
        const interval = setInterval(fetchUnreadCount, 30000)
        const onRefetch = () => {
            fetch(import.meta.env.VITE_API_URL + `/api/messages/unread-count`)
                .then((res) => res.json())
                .then((data) => setUnreadCount(Number(data.count) || 0))
                .catch(() => setUnreadCount(0))
        }
        window.addEventListener("refetch-unread-count", onRefetch)
        return () => {
            clearInterval(interval)
            window.removeEventListener("refetch-unread-count", onRefetch)
        }
    }, [session?.user?.id])

    useEffect(() => {
        if (session?.user?.id && pathname.startsWith("/chat")) {
            fetchUnreadCount()
        }
    }, [pathname, session?.user?.id])

    const navItems = [
        {
            title: "Services",
            href: "/services",
            icon: Briefcase,
            active: pathname.startsWith("/services"),
        },
        {
            title: "Cart",
            href: "/cart",
            icon: ShoppingCart,
            active: pathname.startsWith("/cart"),
        },
        {
            title: "My Bookings",
            href: "/bookings",
            icon: Calendar,
            active: pathname.startsWith("/bookings"),
        },
        {
            title: "Announcements",
            href: "/announcements",
            icon: Bell,
            active: pathname.startsWith("/announcements"),
        },
        {
            title: "Messages",
            href: "/chat",
            icon: MessageCircle,
            active: pathname.startsWith("/chat"),
        },
        {
            title: "Support",
            href: "/support",
            icon: LifeBuoy, 
            active: pathname.startsWith("/support"),
        },
    ]

    return (
        <aside className={cn(
            "w-56 border-r-4 border-black bg-white flex flex-col h-screen sticky top-0",
            !forceVisible && "hidden md:flex"
        )}>
            {/* Logo */}
            <div className="p-6 border-b-4 border-black">
                <Link to="/" className="flex items-center gap-1">
                    <span className="font-black text-xl tracking-tight">
                        Campus<span className="text-pink-500">Services</span>
                    </span>
                </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 font-bold text-sm transition-all border-2 relative",
                            item.active
                                ? "bg-pink-100 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                                : "border-transparent text-muted-foreground hover:bg-gray-100 hover:text-black"
                        )}
                    >
                        <item.icon className="w-5 h-5 shrink-0" />
                        <span className="flex-1 truncate">{item.title}</span>
                        {item.href === "/chat" && (Number(unreadCount) || 0) > 0 && (
                            <span
                                className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ring-2 ring-white animate-pulse"
                                title={`${unreadCount} unread message${unreadCount === 1 ? "" : "s"}`}
                            >
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                        {item.href === "/cart" && cartItemCount > 0 && (
                            <span
                                className="flex h-6 min-w-6 items-center justify-center rounded-full bg-green-500 px-1.5 text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ring-2 ring-white"
                                title={`${cartItemCount} item${cartItemCount === 1 ? "" : "s"} in cart`}
                            >
                                {cartItemCount > 99 ? "99+" : cartItemCount}
                            </span>
                        )}
                    </Link>
                ))}
            </div>

            {/* Auth Section */}
            <div className="p-4 border-t-4 border-black bg-purple-50">
                {isPending ? (
                    <div className="h-12 flex items-center justify-center">
                        <span className="font-bold text-sm text-muted-foreground animate-pulse">Loading...</span>
                    </div>
                ) : session?.user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="w-full h-auto flex items-center justify-start gap-3 p-2 hover:bg-purple-200 border-2 border-transparent hover:border-black transition-all"
                            >
                                <Avatar className="h-9 w-9 border-2 border-black">
                                    <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                                    <AvatarFallback className="bg-yellow-300 font-bold">
                                        {session.user.name?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4" />}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-start overflow-hidden flex-1">
                                    <span className="text-sm font-black truncate w-full text-left">
                                        {session.user.name}
                                    </span>
                                    <span className="text-xs font-bold text-muted-foreground truncate w-full text-left">
                                        {session.user.email}
                                    </span>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none" align="end" forceMount>
                            <DropdownMenuLabel className="font-black">My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-black" />
                            <DropdownMenuItem asChild className="font-bold cursor-pointer focus:bg-pink-100 py-2">
                                <Link to="/account">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="font-bold text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer py-2"
                                onClick={async () => {
                                    await signOut({
                                        fetchOptions: {
                                            onSuccess: () => {
                                                window.location.href = "/" // Redirect to home after logout
                                            }
                                        }
                                    })
                                }}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="flex flex-col gap-2">
                        <Link to="/auth/sign-in" className="w-full">
                            <Button variant="outline" className="w-full font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all">
                                Log In
                            </Button>
                        </Link>
                        <Link to="/auth/sign-up" className="w-full">
                            <Button className="w-full bg-black text-white font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </aside>
    )
}
