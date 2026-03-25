"use client"

import { useEffect, useRef, useState } from "react"
import { Send } from "lucide-react"

import type { Prisma } from "@/lib/generated/prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type ConversationWithMessages = Prisma.ConversationGetPayload<{
  include: { messages: true }
}>

interface ConversationShellProps {
  bookingId: string
  currentUserId: string
  initialConversation: ConversationWithMessages | null
}

interface MessagePayload {
  id: string
  content: string
  senderId: string
  createdAt: Date
}

export function ConversationShell({
  bookingId,
  currentUserId,
  initialConversation,
}: ConversationShellProps) {
  const [messages, setMessages] = useState<MessagePayload[]>(
    initialConversation?.messages ?? [],
  )
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed) return

    try {
      setSending(true)
      const res = await fetch(import.meta.env.VITE_API_URL + `/api/conversations/${bookingId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      })

      if (!res.ok) {
        console.error("Failed to send message")
        return
      }

      const data: MessagePayload = await res.json()
      setMessages((prev) => [...prev, data])
      setInput("")
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="flex min-h-[420px] flex-col gap-3 rounded-2xl border-4 border-black bg-white/90 p-4 shadow-[8px_8px_0_0_#000]">
      <div className="flex items-center justify-between border-b-2 border-dashed border-black pb-2 text-xs font-semibold uppercase tracking-[0.16em]">
        <span>Conversation thread</span>
        <span className="rounded-full bg-black px-2 py-1 text-[10px] text-lime-300">
          {messages.length} message{messages.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto rounded-xl border-2 border-black bg-neutral-100 p-3">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs font-medium text-foreground/70">
            No messages yet. Break the ice and say hello.
          </div>
        ) : (
          messages.map((message) => {
            const isMine = message.senderId === currentUserId
            return (
              <div
                key={message.id}
                className={cn(
                  "flex w-full",
                  isMine ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-xl border-2 border-black px-3 py-2 text-xs shadow-[3px_3px_0_0_#000]",
                    isMine
                      ? "bg-emerald-300 text-black"
                      : "bg-white text-foreground",
                  )}
                >
                  <p className="break-words">{message.content}</p>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form
        className="mt-2 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          void handleSend()
        }}
      >
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type a message…"
          className="h-11 border-2 border-black bg-white text-xs font-medium"
        />
        <Button
          type="submit"
          size="icon"
          className="h-11 w-11 border-2 border-black bg-black text-lime-300 shadow-[4px_4px_0_0_#000] hover:bg-black/90"
          disabled={sending}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </section>
  )
}

