"use client"

import type React from "react"
import { useState } from "react"
import { BottomNav } from "./bottom-nav"
import { Trophy, Clock, CheckCircle, Heart, Users, Calendar, MapPin, Share2 } from "lucide-react"
import { AppHeader } from "./app-header"

type TabType = "all" | "created" | "joined" | "favorites"

interface Challenge {
  id: string
  title: string
  creator: string
  trustLevel: number
  location: string
  description: string
  participants: { current: number; max: number }
  startDate: string
  progress: number
  likes: number
  status: "in_progress" | "dispute" | "peer_review" | "completed"
  hasStarted: boolean
}

const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Leadership Skills Development",
    creator: "@xunpeihu",
    trustLevel: 13,
    location: "Singapore Singapore",
    description: "Develop leadership skills through daily practice: team management, decision making, communication.",
    participants: { current: 1, max: 8 },
    startDate: "2025-12-06 上午08:47 (UTC+8)",
    progress: 13,
    likes: 0,
    status: "in_progress",
    hasStarted: true,
  },
  {
    id: "2",
    title: "Muscle Building Program",
    creator: "@xunpeihu",
    trustLevel: 13,
    location: "Beijing China",
    description: "Follow comprehensive muscle building program with progressive overload training.",
    participants: { current: 2, max: 6 },
    startDate: "2025-12-05 下午19:18 (UTC+8)",
    progress: 33,
    likes: 0,
    status: "dispute",
    hasStarted: true,
  },
  {
    id: "3",
    title: "Daily Healthy Cooking",
    creator: "@xunpeihu",
    trustLevel: 13,
    location: "Beijing China",
    description: "Cook one healthy meal daily to improve cooking skills and eating habits.",
    participants: { current: 1, max: 12 },
    startDate: "2025-12-05 下午19:10 (UTC+8)",
    progress: 8,
    likes: 0,
    status: "peer_review",
    hasStarted: true,
  },
]

const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "All", icon: <Trophy className="w-4 h-4" /> },
  { key: "created", label: "Created", icon: <Clock className="w-4 h-4" /> },
  { key: "joined", label: "Joined", icon: <CheckCircle className="w-4 h-4" /> },
  { key: "favorites", label: "Favorites", icon: <Heart className="w-4 h-4" /> },
]

function getStatusBadge(status: Challenge["status"]) {
  switch (status) {
    case "in_progress":
      return (
        <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full border border-blue-200">
          Game in Progress
        </span>
      )
    case "dispute":
      return (
        <span className="px-3 py-1 text-xs font-medium text-orange-600 bg-orange-50 rounded-full border border-orange-200">
          Dispute Processing
        </span>
      )
    case "peer_review":
      return (
        <span className="px-3 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded-full border border-purple-200">
          Peer Review in Progress
        </span>
      )
    case "completed":
      return (
        <span className="px-3 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-full border border-green-200">
          Completed
        </span>
      )
  }
}

export function MyGamesScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("all")

  return (
    <div className="min-h-screen bg-muted pb-20">
      <AppHeader />

      <main className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Challenges</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all challenges you created and joined</p>
        </div>

        <div className="flex bg-card rounded-xl p-1 border border-border">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {mockChallenges.map((challenge) => (
            <div key={challenge.id} className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <span className="text-white text-lg">🎯</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{challenge.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{challenge.creator}</span>
                      <span className="text-amber-500">👑</span>
                      <span>· Trust Level {challenge.trustLevel}</span>
                      <MapPin className="w-3 h-3 ml-1" />
                      <span>{challenge.location}</span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(challenge.status)}
              </div>

              <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>
                    {challenge.participants.current}/{challenge.participants.max} 人
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{challenge.startDate}</span>
                </div>
                {challenge.hasStarted && (
                  <div className="flex items-center gap-1 text-green-500 ml-auto">
                    <Clock className="w-4 h-4" />
                    <span>已开始</span>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Participation Progress</span>
                  <span className="text-muted-foreground">{challenge.progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{challenge.likes}</span>
                </button>
                <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-sm">
                  <Share2 className="w-4 h-4" />
                  <span>游戏</span>
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
