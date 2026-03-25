import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Link } from "react-router-dom"
import { ArrowLeft, User, Calendar, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"


export const dynamic = 'force-dynamic'

export default async function AdminMessageDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params

    const message = await prisma.supportMessage.findUnique({
        where: { id },
        include: { user: true }
    })

    if (!message) {
        window.location.href = "/404"
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <main className="container py-8 max-w-4xl mx-auto px-4 md:px-6">
                <div className="mb-6 flex flex-col items-start gap-4">
                    <Link to="/admin/support">
                        <Button variant="outline" className="font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all mb-2">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Inbox
                        </Button>
                    </Link>
                    
                    <h1 className="text-4xl font-black tracking-tight uppercase">
                        Message Details
                    </h1>
                </div>

                <div className="flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
                    {/* Header Info */}
                    <div className="bg-cyan-100 border-4 border-black p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-3">
                            <h2 className="text-2xl font-black">{message.subject}</h2>
                            <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
                                <span className="flex items-center gap-1 bg-white px-2 py-1 border-2 border-black">
                                    <User className="w-4 h-4" />
                                    {message.user.name} ({message.user.email})
                                </span>
                                <span className="flex items-center gap-1 bg-white px-2 py-1 border-2 border-black">
                                    <Calendar className="w-4 h-4" />
                                    {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                            <Badge variant="outline" className={`font-black text-sm px-4 py-1 border-2 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                                message.status === 'Open' ? 'border-red-500 bg-red-100 text-red-800' :
                                message.status === 'In Progress' ? 'border-yellow-500 bg-yellow-100 text-yellow-800' :
                                'border-green-500 bg-green-100 text-green-800'
                            }`}>
                                STATUS: {message.status.toUpperCase()}
                            </Badge>
                        </div>
                    </div>

                    {/* Original Message Content */}
                    <div className="bg-white border-4 border-black border-t-0 p-6 md:p-8">
                        <div className="flex items-center gap-2 mb-4 border-b-2 border-black pb-2">
                            <Tag className="w-5 h-5" />
                            <h3 className="font-black text-xl">User Complaint:</h3>
                        </div>
                        <div className="font-medium text-lg leading-relaxed whitespace-pre-wrap">
                            {message.message}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
