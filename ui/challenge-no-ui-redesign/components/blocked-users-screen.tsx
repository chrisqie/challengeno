"use client"

import { ArrowLeft, Ban } from "lucide-react"
import { BottomNav } from "./bottom-nav"
import { cn } from "@/lib/utils"

const blockedUsers = [{ id: 1, username: "testuser4", name: "Test", blockedDate: "2025/10/1", color: "bg-slate-500" }]

export function BlockedUsersScreen() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back to Friends</span>
        </button>
        <div className="flex items-center gap-3">
          <Ban className="w-6 h-6 text-destructive" />
          <h1 className="text-xl font-bold text-foreground">Blocked List</h1>
        </div>
      </header>

      <main className="px-4 py-4">
        {blockedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Ban className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No blocked users</p>
          </div>
        ) : (
          <div className="space-y-3">
            {blockedUsers.map((user) => (
              <div key={user.id} className="bg-destructive/10 rounded-xl p-4 border border-destructive/20">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg",
                      user.color,
                    )}
                  >
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-foreground truncate block">@{user.username}</span>
                    <p className="text-sm text-muted-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">Blocked: {user.blockedDate}</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-medium whitespace-nowrap">
                    Unblock
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
