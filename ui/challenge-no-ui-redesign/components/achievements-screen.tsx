"use client"

import { useState } from "react"
import { Trophy, CheckCircle2, Lock, Share2, Star, Users, Heart, Target, Crown, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { BottomNav } from "./bottom-nav"
import { AppHeader } from "./app-header"

const stats = [
  { label: "Total", value: 12, icon: Trophy, color: "text-accent" },
  { label: "Unlocked", value: 2, icon: CheckCircle2, color: "text-status-active" },
  { label: "Locked", value: 10, icon: Lock, color: "text-muted-foreground" },
]

const categories = ["All", "Unlocked", "Locked", "Participation", "Creation", "Social", "Trust", "Milestone"]

const achievements = [
  {
    id: 1,
    name: "Rising Star",
    description: "Reach 1000 total points",
    icon: Star,
    rarity: "Rare",
    category: "Milestone",
    unlocked: true,
    unlockedDate: "2025/11/5",
    reward: "+100 Points",
    progress: 100,
  },
  {
    id: 2,
    name: "Veteran User",
    description: "Registered for over 30 days",
    icon: Crown,
    rarity: "Rare",
    category: "Milestone",
    unlocked: true,
    unlockedDate: "2025/10/20",
    reward: "+50 Points",
    progress: 100,
  },
  {
    id: 3,
    name: "Challenge Creator",
    description: "Create your first challenge",
    icon: Target,
    rarity: "Common",
    category: "Creation",
    unlocked: false,
    reward: "+25 Points",
    progress: 0,
  },
  {
    id: 4,
    name: "Social Butterfly",
    description: "Add 10 friends",
    icon: Users,
    rarity: "Uncommon",
    category: "Social",
    unlocked: false,
    reward: "+75 Points",
    progress: 30,
  },
  {
    id: 5,
    name: "Trusted Member",
    description: "Reach Trust Level 50",
    icon: Heart,
    rarity: "Epic",
    category: "Trust",
    unlocked: false,
    reward: "+200 Points",
    progress: 26,
  },
  {
    id: 6,
    name: "Challenge Champion",
    description: "Complete 50 challenges",
    icon: Award,
    rarity: "Legendary",
    category: "Participation",
    unlocked: false,
    reward: "+500 Points",
    progress: 4,
  },
]

const rarityColors: Record<string, string> = {
  Common: "bg-secondary text-secondary-foreground",
  Uncommon: "bg-status-active/20 text-status-active",
  Rare: "bg-status-open/20 text-status-open",
  Epic: "bg-purple-500/20 text-purple-400",
  Legendary: "bg-accent/20 text-accent",
}

export function AchievementsScreen() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredAchievements = achievements.filter((a) => {
    if (activeCategory === "All") return true
    if (activeCategory === "Unlocked") return a.unlocked
    if (activeCategory === "Locked") return !a.unlocked
    return a.category === activeCategory
  })

  return (
    <div className="min-h-screen bg-muted pb-20">
      <AppHeader />

      <div className="sticky top-14 z-30 bg-muted/95 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-accent" />
            <div>
              <h1 className="text-lg font-bold text-foreground">Achievements</h1>
              <p className="text-xs text-muted-foreground">Track your progress</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary rounded-full text-primary-foreground text-sm font-medium active:scale-95 transition">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      <main className="px-4 py-4 space-y-5 max-w-lg mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center p-3 bg-card rounded-xl border border-border/50"
              >
                <Icon className={cn("w-6 h-6 mb-1", stat.color)} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <span className={cn("text-xl font-bold", stat.color)}>{stat.value}</span>
              </div>
            )
          })}
        </div>

        {/* Progress Bar */}
        <div className="p-4 bg-card rounded-xl border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Collection Progress</span>
            <span className="text-sm font-bold text-primary">17%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full w-[17%]" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">2 of 12 achievements unlocked</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredAchievements.map((achievement) => {
            const Icon = achievement.icon
            return (
              <div
                key={achievement.id}
                className={cn(
                  "relative p-4 bg-card rounded-xl border transition-all",
                  achievement.unlocked
                    ? "border-primary/30 bg-gradient-to-br from-card to-primary/5"
                    : "border-border/50 opacity-75",
                )}
              >
                {/* Rarity Badge */}
                <span
                  className={cn(
                    "absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold",
                    rarityColors[achievement.rarity],
                  )}
                >
                  {achievement.rarity}
                </span>

                {/* Icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                    achievement.unlocked ? "bg-accent/20" : "bg-secondary",
                  )}
                >
                  <Icon className={cn("w-6 h-6", achievement.unlocked ? "text-accent" : "text-muted-foreground")} />
                </div>

                {/* Info */}
                <h3 className="font-semibold text-foreground text-sm mb-0.5">{achievement.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{achievement.description}</p>

                {/* Status */}
                {achievement.unlocked ? (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-status-active">
                      <CheckCircle2 className="w-3 h-3" />
                      Unlocked
                    </span>
                    <button className="p-1 rounded-full hover:bg-secondary">
                      <Share2 className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground font-medium">{achievement.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/60 rounded-full transition-all"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Reward */}
                <div className="mt-2 pt-2 border-t border-border/50">
                  <span className="text-xs font-medium text-primary">{achievement.reward}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <footer className="pt-8 pb-4 text-center">
          <p className="text-xs text-muted-foreground">ChallengeNo. Challenge? No pressure!</p>
          <p className="text-xs text-muted-foreground">© 2025 onFuture Studio</p>
        </footer>
      </main>

      <BottomNav />
    </div>
  )
}
