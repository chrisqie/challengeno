"use client"

import { useState } from "react"
import { BookOpen, Globe, Lightbulb, GraduationCap, Users, Clock, Star, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { BottomNav } from "./bottom-nav"
import { AppHeader } from "./app-header"

const subcategories = [
  { id: "reading", name: "Reading & Writing", description: "Reading, writing, note-taking", icon: BookOpen, count: 12 },
  {
    id: "language",
    name: "Language Learning",
    description: "Foreign language learning, speaking practice",
    icon: Globe,
    count: 18,
  },
  {
    id: "skill",
    name: "Skill Development",
    description: "Programming, design, instruments, etc.",
    icon: Lightbulb,
    count: 24,
  },
  { id: "exam", name: "Exam Preparation", description: "Preparation for various exams", icon: GraduationCap, count: 8 },
]

const templates = [
  {
    id: 1,
    name: "Book Club Challenge",
    description: "In-depth reading + discussion, complete one book per week",
    participants: 10,
    duration: "28 days",
    featured: true,
  },
  {
    id: 2,
    name: "Language Fluency Boost",
    description: "Full language study: listening, speaking, reading, writing",
    participants: 8,
    duration: "28 days",
    featured: false,
  },
  {
    id: 3,
    name: "Daily Reading Challenge",
    description: "Read at least 30 minutes daily, build good reading habits",
    participants: 10,
    duration: "7 days",
    featured: false,
  },
  {
    id: 4,
    name: "English Study Check-in",
    description: "Study English 30 minutes daily: vocabulary, listening, grammar",
    participants: 15,
    duration: "7 days",
    featured: false,
  },
  {
    id: 5,
    name: "Daily Reading 30 Min",
    description: "Read 30 minutes daily, cultivate reading habits",
    participants: 15,
    duration: "7 days",
    featured: false,
  },
  {
    id: 6,
    name: "Coding Challenge",
    description: "Practice coding 1 hour daily, improve technical skills",
    participants: 12,
    duration: "7 days",
    featured: false,
  },
]

export function CategoryScreen() {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-muted pb-20">
      <AppHeader />

      <main className="px-4 py-4 space-y-6 max-w-lg mx-auto">
        {/* Category Title */}
        <div className="pt-2">
          <h1 className="text-xl font-bold text-foreground">Learning & Growth</h1>
          <p className="text-sm text-muted-foreground">Knowledge learning and skill improvement</p>
        </div>

        {/* Subcategories Section */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Subcategories</h2>
          <div className="grid grid-cols-2 gap-3">
            {subcategories.map((sub) => {
              const Icon = sub.icon
              return (
                <button
                  key={sub.id}
                  className="flex flex-col items-start p-4 bg-card rounded-xl border border-border/50 hover:border-primary/30 hover:bg-card/80 active:scale-[0.98] transition-all text-left group"
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-0.5">{sub.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{sub.description}</p>
                  <span className="text-xs text-primary mt-2 font-medium">{sub.count} templates</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* All Templates Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">All Templates</h2>
            <span className="text-xs text-muted-foreground">{templates.length} available</span>
          </div>
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
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground text-sm truncate">{template.name}</h3>
                    {template.featured && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-accent/20 text-accent rounded">VIP</span>
                    )}
                  </div>
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

        <footer className="pt-6 pb-4 text-center">
          <p className="text-xs text-muted-foreground">ChallengeNo. Challenge? No pressure!</p>
          <p className="text-xs text-muted-foreground">© 2025 onFuture Studio</p>
        </footer>
      </main>

      <BottomNav />
    </div>
  )
}
