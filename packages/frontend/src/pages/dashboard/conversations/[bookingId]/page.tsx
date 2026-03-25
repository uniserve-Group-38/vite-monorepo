import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

export default function ConversationPage() {
  const navigate = useNavigate()
  const { bookingId } = useParams<{ bookingId: string }>()

  useEffect(() => {
    if (!bookingId) {
      navigate("/404")
      return
    }

    async function fetchAndRedirect() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/conversation`, {
          credentials: "include",
        })

        if (!res.ok) {
          navigate("/dashboard/bookings")
          return
        }

        const data = await res.json()

        if (data.conversationId) {
          navigate(`/chat/${data.conversationId}`)
        } else {
          navigate("/dashboard/bookings")
        }
      } catch {
        navigate("/dashboard/bookings")
      }
    }

    fetchAndRedirect()
  }, [bookingId, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent mx-auto mb-4" />
        <p className="font-bold">Loading conversation...</p>
      </div>
    </div>
  )
}
