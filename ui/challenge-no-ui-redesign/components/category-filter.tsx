"use client"

import { cn } from "@/lib/utils"
import { BookOpen, Dumbbell, Heart, Sparkles, Utensils } from "lucide-react"

const categories = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "fitness", label: "Fitness", icon: Dumbbell },
  { id: "learning", label: "Learning", icon: BookOpen },
  { id: "health", label: "Health", icon: Heart },
  { id: "lifestyle", label: "Lifestyle", icon: Utensils },
]

interface CategoryFilterProps {
  active: string
  onChange: (id: string) => void
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
      {categories.map((cat) => {
        const Icon = cat.icon
        const isActive = active === cat.id
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={cn(
              "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
              isActive
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            )}
          >
            <Icon className="w-4 h-4" />
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
