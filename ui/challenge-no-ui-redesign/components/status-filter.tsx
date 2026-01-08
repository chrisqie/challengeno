"use client"

import { cn } from "@/lib/utils"
import { Filter, MapPin, Zap } from "lucide-react"
import { useState } from "react"

const statusTabs = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "featured", label: "Featured" },
  { id: "in-progress", label: "In Progress" },
  { id: "peer-review", label: "Peer Review" },
  { id: "completed", label: "Completed" },
]

const locationFilters = [
  { id: "all", label: "All", icon: null },
  { id: "local", label: "Local", icon: MapPin },
  { id: "tough", label: "Tough", icon: Zap },
]

interface StatusFilterProps {
  activeStatus: string
  onStatusChange: (id: string) => void
  activeLocation: string
  onLocationChange: (id: string) => void
}

export function StatusFilter({ activeStatus, onStatusChange, activeLocation, onLocationChange }: StatusFilterProps) {
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex gap-0.5 min-w-max">
            {statusTabs.map((tab) => {
              const isActive = activeStatus === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onStatusChange(tab.id)}
                  className={cn(
                    "px-2.5 py-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap rounded-md",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
        <button
          onClick={() => setShowFilterMenu(!showFilterMenu)}
          className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground hover:text-foreground flex-shrink-0 px-2 py-1.5 rounded-md hover:bg-muted/50"
        >
          <Filter className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>

      <div className="bg-primary/5 rounded-lg px-3 py-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-primary">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Location</span>
            </div>
            <div className="flex gap-1">
              {locationFilters.map((filter) => {
                const isActive = activeLocation === filter.id
                const Icon = filter.icon
                return (
                  <button
                    key={filter.id}
                    onClick={() => onLocationChange(filter.id)}
                    className={cn(
                      "flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-foreground border border-border hover:border-primary/50",
                    )}
                  >
                    {Icon && <Icon className="w-3 h-3" />}
                    <span className="hidden xs:inline sm:inline">{filter.label}</span>
                    {/* 手机端只显示icon时，All用文字 */}
                    {!Icon && <span>{filter.label}</span>}
                  </button>
                )
              })}
            </div>
          </div>
          <span className="text-[10px] sm:text-xs text-primary/80 hidden sm:block">
            Smart filtering based on your location
          </span>
        </div>
      </div>
    </div>
  )
}
