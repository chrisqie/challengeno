"use client"

import { Sparkles, Heart, Dumbbell, BookOpen, User, Cloud, Palette } from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "health", label: "Health", icon: Heart },
  { id: "fitness", label: "Fitness", icon: Dumbbell },
  { id: "learning", label: "Learning", icon: BookOpen },
  { id: "personal", label: "Personal", icon: User },
  { id: "weather", label: "Weather", icon: Cloud },
  { id: "custom", label: "Custom", icon: Palette },
]

interface CategoryTabsProps {
  active: string
  onChange: (id: string) => void
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
      <div className="flex gap-2 pb-1">
        {categories.map((category) => {
          const Icon = category.icon
          const isActive = active === category.id

          return (
            <button
              key={category.id}
              onClick={() => onChange(category.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{category.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
