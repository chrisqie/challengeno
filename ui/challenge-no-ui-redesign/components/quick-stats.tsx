"use client"

import { Flame, Trophy, TrendingUp } from "lucide-react"

interface QuickStatsProps {
  streak: number
  completed: number
  rank: number
}

export function QuickStats({ streak, completed, rank }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Streak */}
      <div className="bg-card rounded-xl p-3 border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Flame className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground">days</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{streak}</p>
        <p className="text-xs text-muted-foreground">Streak</p>
      </div>

      {/* Completed */}
      <div className="bg-card rounded-xl p-3 border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-status-active/15 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-status-active" />
          </div>
          <span className="text-xs text-muted-foreground">total</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{completed}</p>
        <p className="text-xs text-muted-foreground">Completed</p>
      </div>

      {/* Rank */}
      <div className="bg-card rounded-xl p-3 border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-accent" />
          </div>
          <span className="text-xs text-status-active">+12</span>
        </div>
        <p className="text-2xl font-bold text-foreground">#{rank}</p>
        <p className="text-xs text-muted-foreground">Global Rank</p>
      </div>
    </div>
  )
}
