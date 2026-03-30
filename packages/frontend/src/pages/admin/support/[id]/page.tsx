import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ArrowLeft, User, Calendar, Tag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminMessageDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    
    const [message, setMessage] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchMessage = async () => {
            if (!id) return
            setIsLoading(true)
            try {
                // requires admin auth, we assume the user is logged in and token is in localStorage
                const token = localStorage.getItem("token")
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/support/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                if (!response.ok) {
                    if (response.status === 404) {
                        navigate("/404")
                        return
                    }
                    throw new Error("Failed to fetch support message")
                }
                const data = await response.json()
                setMessage(data)
            } catch (error) {
                console.error("Error fetching support message:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchMessage()
    }, [id, navigate])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
            </div>
        )
    }

    if (!message) return null

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
                                    {message.user?.name} ({message.user?.email})
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
