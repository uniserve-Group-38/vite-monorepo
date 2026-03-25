"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

/** Render bold (**text**) and inline code (`code`) within a line */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="bg-gray-100 rounded px-1 text-xs font-mono">{part.slice(1, -1)}</code>;
    return part;
  });
}

/** Parse markdown text into structured React elements */
function MarkdownMessage({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  const bulletBuffer: string[] = [];
  const numberedBuffer: string[] = [];

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return;
    elements.push(
      <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-0.5 my-1 pl-1">
        {bulletBuffer.map((b, i) => <li key={i}>{renderInline(b)}</li>)}
      </ul>
    );
    bulletBuffer.length = 0;
  };

  const flushNumbered = () => {
    if (numberedBuffer.length === 0) return;
    elements.push(
      <ol key={`ol-${elements.length}`} className="list-decimal list-inside space-y-0.5 my-1 pl-1">
        {numberedBuffer.map((b, i) => <li key={i}>{renderInline(b)}</li>)}
      </ol>
    );
    numberedBuffer.length = 0;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const bulletMatch = line.match(/^[-*•]\s+(.+)/);
    const numberedMatch = line.match(/^\d+\.\s+(.+)/);

    if (bulletMatch) {
      flushNumbered();
      bulletBuffer.push(bulletMatch[1]);
    } else if (numberedMatch) {
      flushBullets();
      numberedBuffer.push(numberedMatch[1]);
    } else if (line.trim() === "") {
      flushBullets();
      flushNumbered();
      elements.push(<div key={`gap-${elements.length}`} className="h-1" />);
    } else {
      flushBullets();
      flushNumbered();
      elements.push(
        <p key={`p-${elements.length}`} className="leading-relaxed">
          {renderInline(line)}
        </p>
      );
    }
  }
  flushBullets();
  flushNumbered();

  return <div className="text-sm space-y-0.5">{elements}</div>;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm Mckoj, the **Uniserve AI Assistant**😎.\n\nAsk me anything about campus services — laundry, grooming, tech support, food delivery, and more!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: inputValue };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + `/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "No response received." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! Something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Support Chat"
        className={cn(
          "fixed bottom-6 right-6 p-4 rounded-full bg-cyan-500 text-white shadow-xl hover:bg-cyan-600 hover:scale-110 transition-all duration-300 z-50",
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        )}
      >
        <MessageCircle size={22} />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 w-80 sm:w-96 rounded-2xl shadow-2xl bg-white border-2 border-black flex flex-col overflow-hidden transition-all duration-300 z-50 origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        )}
        style={{ height: "500px", maxHeight: "80vh" }}
      >
        {/* Header */}
        <div className="bg-cyan-400 p-4 border-b-2 border-black flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white border border-black flex items-center justify-center">
              <Bot size={18} className="text-cyan-600" />
            </div>
            <h3 className="font-bold text-black text-lg">AI Support</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-black hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "flex items-end gap-2 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "w-6 h-6 rounded-full shrink-0 flex items-center justify-center border border-black",
                  msg.role === "user" ? "bg-amber-300" : "bg-cyan-300"
                )}
              >
                {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
              </div>

              {/* Bubble */}
              <div
                className={cn(
                  "p-3 rounded-2xl text-sm border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
                  msg.role === "user"
                    ? "bg-amber-100 rounded-br-none"
                    : "bg-white rounded-bl-none"
                )}
              >
                {msg.role === "assistant" ? (
                  <MarkdownMessage content={msg.content} />
                ) : (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex items-end gap-2 max-w-[85%] mr-auto">
              <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center border border-black bg-cyan-300">
                <Bot size={14} />
              </div>
              <div className="p-3 rounded-2xl bg-white text-sm border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-bl-none flex gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-3 border-t-2 border-black bg-white flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about our services..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
            className="w-9 h-9 rounded-full bg-cyan-400 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-600 transition-colors shadow-sm shrink-0"
          >
            <Send size={14} className="text-white ml-0.5" />
          </button>
        </form>
      </div>
    </>
  );
}
