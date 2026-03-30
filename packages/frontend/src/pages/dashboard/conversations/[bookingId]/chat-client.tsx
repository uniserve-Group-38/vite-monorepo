"use client"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type MessageWithSender = {
  id: string
  content: string
  senderId: string
  conversationId: string
  createdAt: Date | string
  sender: any
}

interface ChatClientProps {
  bookingId: string
  currentUserId: string
  initialMessages: MessageWithSender[]
  otherUserName: string
}

export function ChatClient({
  bookingId,
  currentUserId,
  initialMessages,
  otherUserName,
}: ChatClientProps) {
  const [messages, setMessages] = useState<MessageWithSender[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    const content = newMessage.trim()
    setNewMessage("")
    setIsSending(true)

    // Optimistic insert
    const optimisticMessage: MessageWithSender = {
      id: "temp-" + Date.now(),
      content,
      senderId: currentUserId,
      conversationId: "temp-conv",
      createdAt: new Date(),
      sender: {
        id: currentUserId,
        name: "You",
        email: "",
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        phoneNumber: null,
        location: null,
        bio: null,
        role: "PROVIDER"
      },
    }

    setMessages((prev) => [...prev, optimisticMessage])

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + `/api/conversations/${bookingId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      })
      if (!res.ok) {
        throw new Error("Failed to send message")
      }
    } catch (err) {
       console.error(err)
       // Rollback on fail
       setMessages((prev) => prev.filter(m => m.id !== optimisticMessage.id))
    }
    
    setIsSending(false)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border-4 border-black bg-white shadow-[8px_8px_0_0_#000]">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.02)_0,rgba(0,0,0,0.02)_2px,transparent_2px,transparent_8px)]">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center flex-col gap-3 text-center opacity-70">
            <p className="text-sm font-semibold uppercase tracking-[0.16em]">
              No messages yet
            </p>
            <p className="text-xs">
              Say hello to {otherUserName} and coordinate the service details!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message) => {
              const isMe = message.senderId === currentUserId

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex flex-col gap-1 max-w-[80%]",
                    isMe ? "self-end items-end" : "self-start items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl border-2 border-black px-4 py-2 text-sm shadow-[3px_3px_0_0_#000]",
                      isMe ? "bg-lime-300 text-black rounded-tr-sm" : "bg-white rounded-tl-sm"
                    )}
                  >
                    {message.content}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/50 mx-1">
                    {format(new Date(message.createdAt), "HH:mm")}
                  </span>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="border-t-4 border-black bg-amber-50 p-4">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${otherUserName}...`}
            className="flex-1 rounded-xl border-2 border-black bg-white focus-visible:ring-black px-4 py-6 text-base font-medium shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.05)]"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="h-full rounded-xl border-2 border-black bg-lime-400 px-6 py-6 font-extrabold uppercase tracking-widest shadow-[4px_4px_0_0_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-y-1 active:shadow-none"
          >
            <span className="sr-only md:not-sr-only md:mr-2">Send</span>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
