import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { SiteHeader } from "@/components/site-header"
import { Link } from "react-router-dom"
import { ArrowLeft, MessageSquare, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'

export default async function UserTicketsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        window.location.href = "/auth/sign-in"
    }

    const messages = await prisma.supportMessage.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="min-h-screen bg-gray-50/50">
            <SiteHeader />
            <main className="container py-6 sm:py-8 max-w-4xl mx-auto px-4 md:px-6 min-w-0">
                <div className="mb-6 sm:mb-8 flex flex-col items-start gap-3 sm:gap-4">
                    <Link to="/support">
                        <Button variant="outline" className="font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all mb-2 text-sm sm:text-base">
                            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                            Back to Support
                        </Button>
                    </Link>

                    <h1 className="inline-block text-2xl sm:text-4xl md:text-5xl font-black tracking-tight">
                        <span className="bg-yellow-300 border-4 border-black px-3 py-1.5 sm:px-4 sm:py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block -rotate-1 text-black">
                            MY TICKETS
                        </span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg font-bold mt-2 text-muted-foreground">
                        View the status and replies for your support requests.
                    </p>
                </div>

                <div className="space-y-4 sm:space-y-6">
                    {messages.length === 0 ? (
                        <div className="bg-white border-4 border-black border-dashed p-6 sm:p-8 md:p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
                            <h3 className="text-lg sm:text-xl font-black mb-2">No tickets found</h3>
                            <p className="text-muted-foreground font-medium text-sm sm:text-base mb-4 sm:mb-6">You haven't submitted any support requests yet.</p>
                            <Link to="/support">
                                <Button className="font-bold border-2 border-black bg-cyan-200 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all">
                                    Create New Ticket
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <Card key={msg.id} className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden hover:-translate-y-1 transition-transform duration-200">
                                <CardHeader className={`border-b-4 border-black ${msg.status === 'Resolved' ? 'bg-green-100' : 'bg-cyan-50'}`}>
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-xl font-black mb-2">{msg.subject}</CardTitle>
                                            <CardDescription className="flex items-center gap-2 font-bold text-black text-sm">
                                                <Clock className="w-4 h-4" />
                                                {format(new Date(msg.createdAt), 'MMM d, yyyy')}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline" className={`font-black text-sm px-4 py-1 border-2 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-fit ${
                                            msg.status === 'Open' ? 'border-red-500 bg-red-100 text-red-800' :
                                            msg.status === 'In Progress' ? 'border-yellow-500 bg-yellow-100 text-yellow-800' :
                                            'border-green-500 bg-green-100 text-green-800'
                                        }`}>
                                            {msg.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="p-6 border-b-2 border-dashed border-gray-300 bg-white">
                                        <h4 className="font-bold text-sm text-muted-foreground uppercase mb-2">Your Original Message</h4>
                                        <p className="font-medium whitespace-pre-wrap">{msg.message}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}
