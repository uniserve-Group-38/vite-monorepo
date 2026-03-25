import { Sidebar } from "@/components/sidebar"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ChatBot } from "@/components/chat/bot"

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-white">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Header & Sidebar */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                <header className="md:hidden flex items-center justify-between p-4 border-b-4 border-black bg-white sticky top-0 z-10">
                    <span className="font-black text-xl tracking-tight">
                        Campus<span className="text-pink-500">Services</span>
                    </span>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="border-2 border-black">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-56 border-r-4 border-black [&>button]:hidden">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <Sidebar forceVisible />
                        </SheetContent>
                    </Sheet>
                </header>

                <main className="flex-1 overflow-y-auto w-full">
                    {children}
                </main>
            </div>
            <ChatBot />
        </div>
    )
}
