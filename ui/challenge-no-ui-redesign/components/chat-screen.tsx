"use client"

import { useState } from "react"
import { ArrowLeft, Clock, MoreVertical, Smile, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppHeader } from "./app-header"
import { BottomNav } from "./bottom-nav"

const messages = [
  { id: 1, text: "sdf", time: "03:52", isMine: true },
  { id: 2, text: "sadff", time: "03:52", isMine: true, emoji: "🐶" },
  { id: 3, text: "sadf😊", time: "04:00", isMine: false },
  { id: 4, text: "sadfsf 😀", time: "04:38", isMine: true },
  { id: 5, text: "🐹", time: "16:35", isMine: true, isRead: true },
  { id: 6, text: "😀 Master but is", time: "09:27", isMine: true, isRead: true },
]

export function ChatScreen() {
  const [message, setMessage] = useState("")

  return (
    <div className="min-h-screen bg-muted flex flex-col pb-24">
      <AppHeader />

      {/* Chat Header - below AppHeader */}
      <div className="sticky top-14 z-30 bg-card/95 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold">
            T
          </div>
          <div className="flex-1">
            <h1 className="font-semibold text-foreground">someone</h1>
            <p className="text-xs text-muted-foreground">@testuser123</p>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <Clock className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <main className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="space-y-3 max-w-lg mx-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex", msg.isMine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5",
                  msg.isMine
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border/50 text-foreground rounded-bl-md",
                )}
              >
                <p className="text-sm break-words">{msg.text}</p>
                <div className={cn("flex items-center gap-1 mt-1", msg.isMine ? "justify-end" : "justify-start")}>
                  <span
                    className={cn("text-[10px]", msg.isMine ? "text-primary-foreground/70" : "text-muted-foreground")}
                  >
                    {msg.time}
                  </span>
                  {msg.isMine && msg.isRead && <span className="text-[10px] text-primary-foreground/70">✓✓</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Input */}
      <div className="sticky bottom-20 bg-card/95 backdrop-blur-xl border-t border-border/50 px-4 py-3 pb-safe">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <Smile className="w-6 h-6 text-muted-foreground" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-secondary rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button className="p-2 rounded-full bg-primary text-primary-foreground">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
