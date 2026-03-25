"use client"

import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
    const { pathname } = useLocation()

    const routes = [
        {
            href: "/",
            label: "Home",
            active: pathname === "/",
        },
        {
            href: "/services",
            label: "Services",
            active: pathname === "/services",
        },
        {
            href: "/announcements",
            label: "Announcements",
            active: pathname === "/announcements",
        },
        {
            href: "/chat",
            label: "Messages",
            active: pathname.startsWith("/chat"),
        },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-white min-w-0">
            <div className="container flex h-14 sm:h-16 items-center max-w-7xl mx-auto px-3 sm:px-4 md:px-6 min-w-0">
                <div className="mr-2 sm:mr-4 hidden md:flex min-w-0">
                    <Link to="/" className="mr-4 sm:mr-6 flex items-center space-x-2 shrink-0">
                        <span className="hidden font-black text-lg sm:text-xl sm:inline-block">
                            Campus<span className="text-pink-500">Services</span>
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-bold">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                to={route.href}
                                className={cn(
                                    "transition-colors hover:text-pink-500",
                                    route.active
                                        ? "text-foreground font-black"
                                        : "text-foreground/60"
                                )}
                            >
                                {route.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end min-w-0">
                    <div className="w-full flex-1 md:w-auto md:flex-none min-w-0" />
                    <nav className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <Link to="/auth/sign-in">
                            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                                Log In
                            </Button>
                        </Link>
                        <Link to="/auth/sign-up">
                            <Button size="sm" className="text-xs sm:text-sm">
                                Get Started
                            </Button>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}
