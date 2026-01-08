"use client"

import { Heart, MessageCircle, Clock, Flame, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChallengeCardProps {
  id: string
  title: string
  author: string
  authorAvatar: string
  participants: string[]
  participantCount: number
  category: string
  progress: number
  status: "active" | "review" | "ended" | "open"
  likes: number
  comments: number
  coverImage: string
  daysLeft: number
  isHot?: boolean
}

const statusConfig = {
  active: { label: "Active", className: "bg-status-active/90 text-white" },
  review: { label: "Review", className: "bg-status-review/90 text-black" },
  ended: { label: "Completed", className: "bg-status-ended/90 text-white" },
  open: { label: "Open", className: "bg-status-open/90 text-white" },
}

export function ChallengeCard({
  title,
  author,
  authorAvatar,
  participants,
  participantCount,
  category,
  progress,
  status,
  likes,
  comments,
  coverImage,
  daysLeft,
  isHot,
}: ChallengeCardProps) {
  const statusInfo = statusConfig[status]

  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border/50 hover:border-border transition-all active:scale-[0.98]">
      {/* Image Section */}
      <div className="relative aspect-[2/1] overflow-hidden">
        <img src={coverImage || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold", statusInfo.className)}>
            {statusInfo.label}
          </span>
          {isHot && (
            <span className="px-2.5 py-1 bg-primary rounded-full text-xs font-bold text-primary-foreground flex items-center gap-1">
              <Flame className="w-3 h-3" />
              HOT
            </span>
          )}
        </div>

        {/* Bottom info on image */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white">
              {category}
            </span>
            {daysLeft > 0 && (
              <span className="flex items-center gap-1 text-xs text-white/90">
                <Clock className="w-3 h-3" />
                {daysLeft}d left
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-1">{title}</h3>

        {/* Author & Participants */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={authorAvatar || "/placeholder.svg"} alt={author} className="w-6 h-6 rounded-full object-cover" />
            <span className="text-sm text-muted-foreground">{author}</span>
          </div>

          {/* Participant Avatars */}
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {participants.slice(0, 3).map((avatar, i) => (
                <img
                  key={i}
                  src={avatar || "/placeholder.svg"}
                  alt=""
                  className="w-6 h-6 rounded-full border-2 border-card object-cover"
                />
              ))}
            </div>
            {participantCount > 3 && (
              <span className="ml-2 text-xs text-muted-foreground">+{(participantCount - 3).toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", progress === 100 ? "bg-status-active" : "bg-primary")}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-xs font-medium">{likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-medium">{comments}</span>
            </button>
          </div>
          <button className="flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all">
            View
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
