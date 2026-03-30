import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSession } from "@/lib/auth-client"
import ChatRoom from "../../../chat/[conversationId]/ChatRoom"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"

type ChatMessage = {
  id: string
  senderId: string
  message: string
  timestamp: string
  readAt: string | null
}

type ConversationData = {
  conversationId: string
  currentUserId: string
  studentId: string
  partnerName: string
  initialMessages: ChatMessage[]
}

export default function DashboardChatRoomPage() {
  const navigate = useNavigate()
  const { conversationId } = useParams<{ conversationId: string }>()
  const { data: session, isPending } = useSession()
  const [data, setData] = useState<ConversationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isPending) return
    if (!session?.user) {
      navigate("/auth/sign-in")
      return
    }
    if (!conversationId) {
      navigate("/dashboard/chat")
      return
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/chat/${conversationId}`, {
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) throw new Error("Not found or no permission")
        return r.json()
      })
      .then((d) => { setData(d); setLoading(false) })
      .catch((e) => { setError(e.message); setLoading(false) })
  }, [session, isPending, navigate, conversationId])

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">
          {error ?? "You do not have permission to view this conversation."}
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 md:px-10">
      <Link to="/dashboard/chat" className="inline-block mb-4">
        <Button variant="outline" className="border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-100 transition-all hover:-translate-y-1 active:translate-y-0 text-xs py-1 h-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Messages
        </Button>
      </Link>
      <h1 className="text-2xl font-bold mb-6">Chat with {data.partnerName}</h1>
      <ChatRoom
        conversationId={data.conversationId}
        currentUserId={data.currentUserId}
        studentId={data.studentId}
        initialMessages={data.initialMessages}
        partnerName={data.partnerName}
      />
    </div>
  )
}
