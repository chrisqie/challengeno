"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { BottomNav } from "./bottom-nav"
import { Trophy, Users, Star, Hammer } from "lucide-react"
import { AppHeader } from "./app-header"

type TabType = "total" | "participation" | "trust" | "labor"

interface LeaderboardUser {
  rank: number
  username: string
  displayName: string
  avatar: string
  totalPoints: number
  participationPoints: number
  trustPoints: number
  laborPoints: number
}

const mockUsers: LeaderboardUser[] = [
  {
    rank: 1,
    username: "@admin",
    displayName: "System Administrator",
    avatar: "A",
    totalPoints: 3598,
    participationPoints: 1361,
    trustPoints: 1003,
    laborPoints: 1233,
  },
  {
    rank: 2,
    username: "@test789",
    displayName: "test789",
    avatar: "T",
    totalPoints: 1331,
    participationPoints: 1233,
    trustPoints: 17,
    laborPoints: 59,
  },
  {
    rank: 3,
    username: "@newbie",
    displayName: "newbie",
    avatar: "N",
    totalPoints: 803,
    participationPoints: 612,
    trustPoints: 72,
    laborPoints: 119,
  },
  {
    rank: 4,
    username: "@test456",
    displayName: "fdsafsdf",
    avatar: "T",
    totalPoints: 501,
    participationPoints: 386,
    trustPoints: 86,
    laborPoints: 29,
  },
  {
    rank: 5,
    username: "@emailtest",
    displayName: "只是测试邮件",
    avatar: "E",
    totalPoints: 394,
    participationPoints: 275,
    trustPoints: 56,
    laborPoints: 63,
  },
  {
    rank: 6,
    username: "@asd432",
    displayName: "someone1",
    avatar: "A",
    totalPoints: 238,
    participationPoints: 135,
    trustPoints: 93,
    laborPoints: 10,
  },
  {
    rank: 7,
    username: "@regular123",
    displayName: "普通",
    avatar: "R",
    totalPoints: 229,
    participationPoints: 114,
    trustPoints: 99,
    laborPoints: 16,
  },
  {
    rank: 8,
    username: "@testuser2",
    displayName: "某某",
    avatar: "T",
    totalPoints: 207,
    participationPoints: 110,
    trustPoints: 97,
    laborPoints: 0,
  },
  {
    rank: 9,
    username: "@testuser123",
    displayName: "someone",
    avatar: "T",
    totalPoints: 148,
    participationPoints: 55,
    trustPoints: 93,
    laborPoints: 0,
  },
  {
    rank: 10,
    username: "@qloutlook",
    displayName: "测试邮件",
    avatar: "Q",
    totalPoints: 127,
    participationPoints: 83,
    trustPoints: 0,
    laborPoints: 44,
  },
  {
    rank: 11,
    username: "@xunpeihu",
    displayName: "某某",
    avatar: "X",
    totalPoints: 127,
    participationPoints: 107,
    trustPoints: 13,
    laborPoints: 7,
  },
  {
    rank: 12,
    username: "@testuser4",
    displayName: "测试",
    avatar: "T",
    totalPoints: 117,
    participationPoints: 20,
    trustPoints: 97,
    laborPoints: 0,
  },
]

const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
  { key: "total", label: "Total Points", icon: <Trophy className="w-4 h-4" /> },
  { key: "participation", label: "Participation Points", icon: <Users className="w-4 h-4" /> },
  { key: "trust", label: "Trust Points", icon: <Star className="w-4 h-4" /> },
  { key: "labor", label: "Labor Points", icon: <Hammer className="w-4 h-4" /> },
]

function getRankDisplay(rank: number) {
  if (rank === 1) return <span className="text-2xl">🥇</span>
  if (rank === 2) return <span className="text-2xl">🥈</span>
  if (rank === 3) return <span className="text-2xl">🥉</span>
  return <span className="text-sm text-muted-foreground font-medium">#{rank}</span>
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-amber-500",
    "bg-pink-500",
    "bg-cyan-500",
    "bg-red-500",
    "bg-indigo-500",
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export function LeaderboardScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("total")

  const getPoints = (user: LeaderboardUser) => {
    switch (activeTab) {
      case "total":
        return user.totalPoints
      case "participation":
        return user.participationPoints
      case "trust":
        return user.trustPoints
      case "labor":
        return user.laborPoints
    }
  }

  const sortedUsers = [...mockUsers].sort((a, b) => getPoints(b) - getPoints(a))

  return (
    <div className="min-h-screen bg-muted pb-20">
      <AppHeader />

      <div className="sticky top-14 z-30 bg-muted/95 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="max-w-lg mx-auto">
          <h1 className="text-lg font-semibold text-foreground">Points Leaderboard</h1>
          <p className="text-xs text-muted-foreground">View community points rankings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="px-4">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {sortedUsers.map((user, index) => (
            <div
              key={user.username}
              className={`flex items-center gap-4 p-4 ${
                index !== sortedUsers.length - 1 ? "border-b border-border" : ""
              } ${index < 3 ? "bg-amber-50/50 dark:bg-amber-900/10" : ""}`}
            >
              {/* Rank */}
              <div className="w-10 flex justify-center">{getRankDisplay(index + 1)}</div>

              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-full ${getAvatarColor(user.avatar)} flex items-center justify-center text-white font-medium`}
              >
                {user.avatar}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{user.username}</p>
                <p className="text-sm text-muted-foreground truncate">{user.displayName}</p>
              </div>

              {/* Points */}
              <div className="text-right">
                <p className="font-bold text-foreground">{getPoints(user).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>

              {/* Breakdown */}
              <div className="text-right text-xs text-muted-foreground w-16">
                <p>P: {user.participationPoints}</p>
                <p>T: {user.trustPoints}</p>
                <p>L: {user.laborPoints}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Points Explanation */}
        <div className="mt-6 bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-3">Points Explanation</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-500 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Participation Points (P)</span>
              </div>
              <p className="text-xs text-muted-foreground">Earned by creating and participating in challenges</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-amber-500 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">Trust Points (T)</span>
              </div>
              <p className="text-xs text-muted-foreground">Credit score based on commitment performance</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-green-500 mb-1">
                <Hammer className="w-4 h-4" />
                <span className="text-sm font-medium">Labor Points (L)</span>
              </div>
              <p className="text-xs text-muted-foreground">Earned through community contributions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 max-w-lg mx-auto">
        <footer className="pt-8 pb-4 text-center">
          <p className="text-xs text-muted-foreground">ChallengeNo. Challenge? No pressure!</p>
          <p className="text-xs text-muted-foreground">© 2025 onFuture Studio</p>
        </footer>
      </div>

      <BottomNav />
    </div>
  )
}
