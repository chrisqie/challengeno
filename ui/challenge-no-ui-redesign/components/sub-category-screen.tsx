"use client"

import { useState } from "react"
import { BookOpen, Users, Clock, Star, ChevronRight, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { BottomNav } from "./bottom-nav"
import { AppHeader } from "./app-header"

const templates = [
  {
    id: 1,
    name: "Book Club Challenge",
    description: "In-depth reading + discussion, complete one book per week and share insights",
    participants: 10,
    duration: "28 days",
    featured: false,
  },
  {
    id: 2,
    name: "Daily Reading Challenge",
    description: "Commit to reading at least 30 minutes daily, build good reading habits",
    participants: 10,
    duration: "7 days",
    featured: false,
  },
  {
    id: 3,
    name: "Daily Reading 30 Min",
    description: "Read 30 minutes daily, cultivate reading habits",
    participants: 15,
    duration: "7 days",
    featured: false,
  },
  {
    id: 4,
    name: "Daily Reading 30 Min",
    description: "Read 30 minutes daily to build good reading habits and improve knowledge",
    participants: 10,
    duration: "7 days",
    featured: false,
  },
  {
    id: 5,
    name: "Read One Book a Week",
    description: "Read one book per week, enhance knowledge reserve",
    participants: 10,
    duration: "7 days",
    featured: false,
  },
]

const sortOptions = ["Popular", "Newest", "Duration"]

export function SubCategoryScreen() {
  const [activeSort, setActiveSort] = useState("Popular")

  return (
    <div className="min-h-screen bg-muted pb-20">
      <AppHeader />

      <main className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Learning & Growth</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-medium">Reading & Writing</span>
        </div>

        <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50">
          <div className="p-3 rounded-xl bg-primary/10">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-foreground">Reading & Writing</h2>
            <p className="text-sm text-muted-foreground">Reading, writing, note-taking</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">{templates.length}</span>
            <p className="text-xs text-muted-foreground">Templates</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {sortOptions.map((option) => (
            <button
              key={option}
              onClick={() => setActiveSort(option)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                activeSort === option
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              )}
            >
              {option}
            </button>
          ))}
          <button className="ml-auto p-2 rounded-full bg-secondary hover:bg-secondary/80 transition">
            <Filter className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <section>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Related Templates
          </h3>
          <div className="space-y-3">
            {templates.map((template) => (
              <button
                key={template.id}
                className="w-full flex items-start gap-3 p-4 bg-card rounded-xl border border-border/50 hover:border-primary/30 active:scale-[0.99] transition-all text-left group"
              >
                <div className="shrink-0 p-2 rounded-lg bg-secondary">
                  <Star
                    className={cn("w-5 h-5", template.featured ? "text-accent fill-accent" : "text-muted-foreground")}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm mb-1">{template.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{template.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {template.participants}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {template.duration}
                    </span>
                    <span className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-medium uppercase">
                      Learning
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1 group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </section>

        <footer className="pt-8 pb-4 text-center">
          <p className="text-xs text-muted-foreground">ChallengeNo. Challenge? No pressure!</p>
          <p className="text-xs text-muted-foreground">© 2025 onFuture Studio</p>
        </footer>
      </main>

      <BottomNav />
    </div>
  )
}
