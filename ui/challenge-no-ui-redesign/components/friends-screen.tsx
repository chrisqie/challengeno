"use client"

import type React from "react"
import { useState } from "react"
import { Sparkles, Ban, MoreVertical, Star, Users, Gamepad2 } from "lucide-react"
import { BottomNav } from "./bottom-nav"
import { cn } from "@/lib/utils"
import { AppHeader } from "./app-header"

const tabs = [
  { id: "friends", label: "My Friends" },
  { id: "recommended", label: "Recommended" },
  { id: "search", label: "Search Users" },
]

const friends = [
  {
    id: 1,
    username: "testuser123",
    name: "someone",
    level: "Silver",
    levelNum: 93,
    games: 7,
    since: "3 months ago",
    color: "bg-violet-500",
  },
  {
    id: 2,
    username: "testuser2",
    name: "Alex",
    level: "Silver",
    levelNum: 97,
    games: 6,
    since: "3 months ago",
    color: "bg-violet-500",
  },
  {
    id: 3,
    username: "domaintest001",
    name: "Domain Tester",
    level: "Newbie",
    levelNum: 10,
    games: 6,
    since: "2 months ago",
    color: "bg-emerald-500",
  },
]

export function FriendsScreen() {
  const [activeTab, setActiveTab] = useState("friends")
  const [filter, setFilter] = useState("all")

  return (
    <div className="min-h-screen bg-muted pb-20">
      <AppHeader />

      <div className="sticky top-14 z-30 bg-muted/95 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 py-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Friends</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Recommendations</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium">
                <Ban className="w-4 h-4" />
                <span className="hidden sm:inline">Blocked</span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 pb-3 max-w-lg mx-auto">
          <div className="flex bg-secondary/50 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="px-4 py-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">My Friends ({friends.length})</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm border-none outline-none"
          >
            <option value="all">All Friends</option>
            <option value="online">Online</option>
            <option value="recent">Recent</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="bg-card rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg",
                    friend.color,
                  )}
                >
                  {friend.username[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground truncate">@{friend.username}</span>
                    <Star className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{friend.name}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
                        friend.level === "Silver"
                          ? "bg-slate-500/20 text-slate-400"
                          : "bg-emerald-500/20 text-emerald-400",
                      )}
                    >
                      <Trophy className="w-3 h-3" />
                      {friend.level} {friend.levelNum}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Gamepad2 className="w-3 h-3" />
                      {friend.games} games
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Friends since {friend.since}</p>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <footer className="pt-8 pb-4 text-center">
          <p className="text-xs text-muted-foreground">ChallengeNo. Challenge? No pressure!</p>
          <p className="text-xs text-muted-foreground">© 2025 onFuture Studio</p>
        </footer>
      </main>

      <BottomNav />
    </div>
  )
}

function Trophy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
