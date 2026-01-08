"use client"

import { ArrowLeft, Sparkles, Crown, Shield } from "lucide-react"
import { BottomNav } from "./bottom-nav"
import { cn } from "@/lib/utils"

const recommendations = [
  {
    id: 1,
    username: "admin",
    name: "System Administrator",
    isVip: true,
    trustLevel: "High Trust User",
    trust: 1001,
    created: 9,
    joined: 4,
    color: "bg-blue-500",
  },
  {
    id: 2,
    username: "regular123",
    name: "Regular",
    isVip: false,
    trustLevel: "High Trust User",
    trust: 99,
    created: 1,
    joined: 4,
    color: "bg-rose-500",
  },
  {
    id: 3,
    username: "testuser1",
    name: "testuser1",
    isVip: true,
    trustLevel: "High Trust User",
    trust: 98,
    created: 0,
    joined: 2,
    color: "bg-violet-500",
  },
  {
    id: 4,
    username: "testuser3",
    name: "somebody",
    isVip: true,
    trustLevel: "High Trust User",
    trust: 98,
    created: 1,
    joined: 1,
    color: "bg-violet-500",
  },
  {
    id: 5,
    username: "asd432",
    name: "someone1",
    isVip: true,
    trustLevel: "High Trust User",
    trust: 93,
    created: 6,
    joined: 5,
    color: "bg-blue-500",
  },
  {
    id: 6,
    username: "test456",
    name: "fdsafsdf",
    isVip: true,
    trustLevel: "High Trust User",
    trust: 86,
    created: 23,
    joined: 11,
    color: "bg-violet-500",
  },
]

export function FriendRecommendationsScreen() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back to Friends</span>
        </button>
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-accent" />
          <h1 className="text-xl font-bold text-foreground">Friend Recommendations</h1>
        </div>
      </header>

      <main className="px-4 py-4">
        {/* Description card */}
        <div className="bg-card rounded-xl p-4 border border-border/50 mb-4">
          <p className="text-sm text-muted-foreground">
            Recommended users based on mutual friends, game participation, and trust level
          </p>
        </div>

        {/* Recommendations list */}
        <div className="space-y-3">
          {recommendations.map((user) => (
            <div key={user.id} className="bg-card rounded-xl p-4 border border-border/50">
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
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">@{user.username}</span>
                    {user.isVip && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-medium">
                        <Crown className="w-3 h-3" />
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                    {user.name}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400">{user.trustLevel}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Trust: {user.trust}</span>
                    <span>Created: {user.created}</span>
                    <span>Joined: {user.joined}</span>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium whitespace-nowrap">
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
