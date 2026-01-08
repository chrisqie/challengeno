"use client"

import { TrendingUp, ChevronRight } from "lucide-react"

const trendingTopics = [
  { id: 1, name: "Fitness", count: 2341, color: "bg-primary" },
  { id: 2, name: "Reading", count: 1892, color: "bg-status-open" },
  { id: 3, name: "Meditation", count: 1456, color: "bg-accent" },
]

export function TrendingSection() {
  return (
    <div className="bg-card rounded-xl p-4 border border-border/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground text-sm">Trending Now</h3>
        </div>
        <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5">
          View All
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {trendingTopics.map((topic) => (
          <button
            key={topic.id}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
          >
            <span className={`w-2 h-2 rounded-full ${topic.color}`} />
            <span className="text-sm font-medium text-foreground">{topic.name}</span>
            <span className="text-xs text-muted-foreground">{(topic.count / 1000).toFixed(1)}k</span>
          </button>
        ))}
      </div>
    </div>
  )
}
