"use client"

import { MapPin, Filter, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const filters = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "featured", label: "Featured" },
  { id: "in-progress", label: "In Progress" },
  { id: "review", label: "Peer Review" },
  { id: "completed", label: "Completed" },
]

interface FilterBarProps {
  active: string
  onChange: (id: string) => void
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Status filters */}
      <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-1.5 pb-1">
          {filters.map((filter) => {
            const isActive = active === filter.id
            return (
              <button
                key={filter.id}
                onClick={() => onChange(filter.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                  isActive ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Location & Filter row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs gap-1.5 bg-transparent">
            <MapPin className="w-3.5 h-3.5" />
            <span>Location</span>
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
          <span className="text-xs text-muted-foreground">Smart filtering based on your location</span>
        </div>
        <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs gap-1.5">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter</span>
        </Button>
      </div>
    </div>
  )
}
