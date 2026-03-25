import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Send, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface SupportReplyFormProps {
    messageId: string
    existingReply: string | null
}

export function SupportReplyForm({ messageId, existingReply }: SupportReplyFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [replyText, setReplyText] = useState("")
    const navigate = useNavigate()

    async function handleReplySubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/support/${messageId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ reply: replyText }),
            })
            const result = await res.json()

            if (!res.ok || result.error) {
                toast.error(result.error ?? "Failed to submit reply.")
                setIsSubmitting(false)
            } else {
                toast.success("Reply sent successfully! Status changed to Resolved.")
                setReplyText("")
                setIsSubmitting(false)
                // Navigate to reload the page state
                navigate(0)
            }
        } catch {
            toast.error("Network error. Please try again.")
            setIsSubmitting(false)
        }
    }

    if (existingReply) {
        return (
            <div className="bg-green-50/50 p-6 border-4 border-black border-t-0 shadow-none">
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="text-green-600 w-6 h-6" />
                    <h3 className="font-black text-xl text-green-800 uppercase">Admin Reply Sent</h3>
                </div>
                <div className="bg-white p-4 border-2 border-black whitespace-pre-wrap font-medium">
                    {existingReply}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-yellow-50/50 p-6 border-4 border-black border-t-0 shadow-none">
            <h3 className="font-black text-xl mb-4 flex items-center gap-2">
                <Send className="w-5 h-5" />
                Write a Reply
            </h3>
            <form onSubmit={handleReplySubmit} className="space-y-4">
                <Textarea
                    placeholder="Type your response to the user here..."
                    className="border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-medium min-h-[150px] resize-y bg-white"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto h-12 px-8 text-base font-black uppercase tracking-wider bg-black text-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all"
                >
                    {isSubmitting ? "Sending Reply..." : "Send & Resolve"}
                </Button>
            </form>
        </div>
    )
}
