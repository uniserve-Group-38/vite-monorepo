"use client";

import { useEffect, useState, useRef } from "react";
import { pusherClient } from "@/lib/pusherClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, CheckCheck, MapPin, MapPinned, ExternalLink } from "lucide-react";

type Message = {
  id: string;
  senderId: string;
  message: string;
  timestamp: string;
  readAt?: string | null;
};

interface ChatRoomProps {
  conversationId: string;
  currentUserId: string;
  studentId: string;
  initialMessages: Message[];
  partnerName?: string;
}

export default function ChatRoom({
  conversationId,
  currentUserId,
  studentId,
  initialMessages,
  partnerName = "Partner",
}: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const byId = new Map<string, Message>();
    initialMessages.forEach((m) => byId.set(m.id, m));
    return Array.from(byId.values()).sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  });
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // When any participant opens the conversation, mark all incoming messages as read
  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + `/api/messages/mark-read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId }),
    })
      .then((res) => {
        if (res.ok) {
          setMessages((prev) =>
            prev.map((m) =>
              m.senderId !== currentUserId ? { ...m, readAt: new Date().toISOString() } : m
            )
          );
          window.dispatchEvent(new CustomEvent("refetch-unread-count"));
        }
      })
      .catch(() => {});
  }, [conversationId, currentUserId]);

  useEffect(() => {
    const channel = pusherClient.subscribe(conversationId);

    channel.bind("new-message", (incomingMessage: Message) => {
      setMessages((prev) => {
        const messageExists = prev.some((msg) => msg.id === incomingMessage.id);
        if (messageExists) return prev;
        const msg = { ...incomingMessage, readAt: incomingMessage.readAt ?? null };
        const next = [...prev, msg].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        const fromOther = msg.senderId !== currentUserId;
        if (fromOther) {
          fetch(import.meta.env.VITE_API_URL + `/api/messages/mark-read`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conversationId }),
          }).then(() => {
            setMessages((p) =>
              p.map((m) => (m.id === msg.id ? { ...m, readAt: new Date().toISOString() } : m))
            );
            window.dispatchEvent(new CustomEvent("refetch-unread-count"));
          });
        }
        return next;
      });
    });

    channel.bind("messages-read", (payload: { readAt: string }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.senderId === currentUserId ? { ...m, readAt: payload.readAt } : m
        )
      );
    });

    return () => {
      pusherClient.unsubscribe(conversationId);
      channel.unbind("new-message");
      channel.unbind("messages-read");
    };
  }, [conversationId, currentUserId, studentId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);

    const optimisticMessage: Message = {
      id: crypto.randomUUID(),
      senderId: currentUserId,
      message: newMessage,
      timestamp: new Date().toISOString(),
      readAt: currentUserId === studentId ? null : undefined,
    };

    // Add locally to the UI immediately for a snappy feel
    setMessages((prev) => [...prev, optimisticMessage]);
    const messageToSend = newMessage;
    setNewMessage("");

    try {
      // POST the real message to the server
      await fetch(import.meta.env.VITE_API_URL + `/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          senderId: currentUserId,
          conversationId,
          id: optimisticMessage.id,
        }),
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optional: Handle error by removing optimistic message or showing a toast
    } finally {
      setIsLoading(false);
    }
  };

  const shareLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        const optimisticMessage: Message = {
          id: crypto.randomUUID(),
          senderId: currentUserId,
          message: mapUrl,
          timestamp: new Date().toISOString(),
          readAt: currentUserId === studentId ? null : undefined,
        };

        setMessages((prev) => [...prev, optimisticMessage]);

        try {
          await fetch(import.meta.env.VITE_API_URL + `/api/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: mapUrl,
              senderId: currentUserId,
              conversationId,
              id: optimisticMessage.id,
            }),
          });
        } catch (error) {
          console.error("Failed to share location:", error);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        alert("Error getting location: " + error.message);
      }
    );
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-background">
      {/* Messages Feed */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        ref={scrollRef}
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No messages yet. Say hello!
          </div>
        ) : (
          Object.entries(
            messages.reduce((groups: { [key: string]: Message[] }, message) => {
              const date = new Date(message.timestamp).toLocaleDateString();
              if (!groups[date]) groups[date] = [];
              groups[date].push(message);
              return groups;
            }, {})
          ).map(([date, groupMessages]) => (
            <div key={date} className="space-y-4">
              <div className="flex justify-center my-4">
                <span className="text-xs font-black bg-muted px-3 py-1 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                  {date === new Date().toLocaleDateString() ? "Today" : date}
                </span>
              </div>
              {groupMessages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                const sentByStudent = msg.senderId === studentId;
                const isRead = !!msg.readAt;
                const showReadStatus = sentByStudent;
                return (
                  <div
                    key={msg.id}
                    className={`flex w-full flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <span className={`text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1 ${isMe ? "mr-1" : "ml-1"}`}>
                      {isMe ? "You" : partnerName}
                    </span>
                    <div
                      className={`max-w-[75%] rounded-lg p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                        isMe
                          ? "bg-pink-300 text-black"
                          : "bg-white text-black"
                      }`}
                    >
                      {msg.message.startsWith("https://www.google.com/maps") ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <div className="w-10 h-10 flex-shrink-0 bg-white rounded-full border-2 border-black flex items-center justify-center overflow-hidden">
                              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" fill="#4285F4"/>
                                <path d="M12 2c3.87 0 7 3.13 7 7 0 5.25-7 13-7 13S5 14.25 5 9c0-3.87 3.13-7 7-7z" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-black uppercase">Shared Location</span>
                              <span className="text-[10px] text-muted-foreground font-bold italic">Tap to view on Google Maps</span>
                            </div>
                          </div>
                          <a 
                            href={msg.message} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-yellow-300 hover:bg-yellow-400 text-black font-black py-1.5 px-3 rounded border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 active:translate-y-0 text-xs"
                          >
                            <ExternalLink className="w-3 h-3" />
                            OPEN GOOGLE MAPS
                          </a>
                        </div>
                      ) : (
                        <p className="text-sm font-bold">{msg.message}</p>
                      )}
                      <div className="flex items-center justify-end gap-1.5 mt-1">
                        <span className="text-[10px] font-black opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && (
                          <span
                            className="flex items-center gap-0.5 text-[10px] font-bold"
                            title={isRead ? "Read by partner" : "Delivered"}
                          >
                            {isRead ? (
                              <>
                                <CheckCheck className="w-3.5 h-3.5 text-blue-500" aria-hidden />
                                <span className="text-blue-600">Read</span>
                              </>
                            ) : (
                              <>
                                <CheckCheck className="w-3.5 h-3.5 text-muted-foreground" aria-hidden />
                                <span className="text-muted-foreground">Delivered</span>
                              </>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Input Area - Enter sends, same as Send button */}
      <div className="border-t p-4">
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e as unknown as React.FormEvent);
              }
            }}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
            autoComplete="off"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={shareLocation} 
            disabled={isLoading}
            className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-100 p-2 flex items-center gap-2"
            title="Share Location"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" fill="#4285F4"/>
              <path d="M12 2c3.87 0 7 3.13 7 7 0 5.25-7 13-7 13S5 14.25 5 9c0-3.87 3.13-7 7-7z" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[10px] font-black uppercase hidden sm:inline">Share Location</span>
          </Button>
          <Button type="submit" disabled={isLoading || !newMessage.trim()} className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
