import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSession } from "@/lib/auth-client"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { MarkAllReadOnView } from "../../chat/mark-all-read-on-view"

type Conversation = {
  id: string
  updatedAt: string
  booking: {
    studentId: string
    providerId: string
    student: { id: string; name: string; image: string | null }
    provider: { id: string; name: string; image: string | null }
    service: { title: string }
  }
  messages: Array<{ content: string; createdAt: string }>
}

export default function DashboardChatPage() {
  const navigate = useNavigate()
  const { data: session, isPending } = useSession()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isPending) return
    if (!session?.user) {
      navigate("/auth/sign-in")
      return
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/chat/conversations?role=provider`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => { setConversations(Array.isArray(d) ? d : d.conversations ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [session, isPending, navigate])

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    )
  }

  const userId = session?.user?.id ?? ""

  if (conversations.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4 md:px-10">
        <MarkAllReadOnView />
        <h1 className="text-3xl font-black mb-8">Messages</h1>
        <p className="mt-2 text-center font-bold text-muted-foreground w-full py-20 border-4 border-black border-dashed bg-white">
          Chats would be available when your services are booked.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 md:px-10">
      <MarkAllReadOnView />
      <Link to="/dashboard" className="inline-block mb-4">
        <Button variant="outline" className="border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-100 transition-all hover:-translate-y-1 active:translate-y-0">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Dashboard
        </Button>
      </Link>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">Messages</h1>
      </div>
      <div className="space-y-6">
        {conversations.map((conversation) => {
          const { booking, messages } = conversation
          const isStudent = booking.studentId === userId
          const chatPartner = isStudent ? booking.provider : booking.student
          const partnerRole = isStudent ? "Provider" : "Student"
          const latestMessage = messages[0]

          return (
            <Link key={conversation.id} to={`/dashboard/chat/${conversation.id}`} className="block">
              <Card className="hover:bg-pink-50 transition-all cursor-pointer border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none hover:-translate-y-1">
                <CardContent className="p-6 flex items-center space-x-6">
                  <Avatar className="h-14 w-14 border-2 border-black">
                    <AvatarImage src={chatPartner.image || ""} />
                    <AvatarFallback className="bg-yellow-300 font-bold">
                      {chatPartner.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="font-black text-lg truncate">{chatPartner.name}</h3>
                      {latestMessage && (
                        <span className="text-xs font-black text-muted-foreground whitespace-nowrap ml-2">
                          {new Date(latestMessage.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <p className="text-muted-foreground font-bold truncate max-w-[75%]">
                        {latestMessage ? latestMessage.content : `New conversation regarding: ${booking.service.title}`}
                      </p>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isStudent ? "bg-purple-200" : "bg-cyan-200"}`}>
                        {partnerRole}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
