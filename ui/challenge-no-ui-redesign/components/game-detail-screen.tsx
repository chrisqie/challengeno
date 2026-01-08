"use client"

import { useRouter } from "next/navigation"
import {
  Heart,
  Share2,
  Flag,
  Users,
  Calendar,
  Clock,
  Camera,
  CheckCircle2,
  Crown,
  MapPin,
  LogOut,
  User,
  Play,
  Send,
  UserCheck,
  Scale,
  Archive,
  Smile,
} from "lucide-react"
import { BottomNav } from "./bottom-nav"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { AppHeader } from "./app-header"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type GamePhase =
  | "created"
  | "joining"
  | "started"
  | "ended"
  | "evidence_submission"
  | "peer_review"
  | "arbitration"
  | "completed"

const gameFlowSteps = [
  { phase: "created", label: "Created", icon: User, color: "text-slate-400", time: "2025-11-15 10:00" },
  { phase: "joining", label: "Joining", icon: Users, color: "text-blue-400", time: "2025-11-16 14:30" },
  { phase: "started", label: "Started", icon: Play, color: "text-green-400", time: "2025-11-20 09:00" },
  { phase: "ended", label: "Ended", icon: Clock, color: "text-orange-400", time: "2025-12-20 18:00" },
  { phase: "evidence_submission", label: "Submit Evidence", icon: Camera, color: "text-amber-400", time: "Pending" },
  { phase: "peer_review", label: "Peer Review", icon: UserCheck, color: "text-purple-400", time: "Pending" },
  { phase: "arbitration", label: "Arbitration", icon: Scale, color: "text-red-400", time: "If Needed" },
  { phase: "completed", label: "Archived", icon: Archive, color: "text-emerald-400", time: "TBD" },
]

const participants = [
  { username: "某某", isCreator: true, trust: 13, avatar: "bg-amber-500" },
  { username: "System Administrator", isYou: true, trust: 1002, avatar: "bg-blue-500" },
]

const comments = [
  {
    id: 1,
    username: "System Administrator",
    badges: ["Admin", "VIP"],
    content: "right 👍",
    timestamp: "2025/12/9 09:39:10",
  },
  { id: 2, username: "test789", badges: ["VIP"], content: "test 🐵", timestamp: "2025/12/9 06:57:54" },
  {
    id: 3,
    username: "test789",
    badges: ["VIP"],
    content: "great work ,hope no 500 👍",
    timestamp: "2025/12/9 06:33:43",
  },
]

export function GameDetailScreen() {
  const router = useRouter()
  const [currentPhase] = useState<GamePhase>("evidence_submission")
  const [commentText, setCommentText] = useState("")

  const getCurrentPhaseIndex = () => {
    return gameFlowSteps.findIndex((step) => step.phase === currentPhase)
  }

  const progressPercentage = ((getCurrentPhaseIndex() + 1) / gameFlowSteps.length) * 100

  return (
    <div className="min-h-screen bg-muted pb-20">
      <AppHeader />

      <main className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>🎯 个人发展</span>
          <span>&gt;</span>
          <span className="text-foreground">wwwwwwwwwwww</span>
        </div>

        {/* Title Card */}
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-foreground mb-2">wwwwwwwwwwww</h1>
            <p className="text-sm text-muted-foreground mb-3">
              Complete a creative project over 30 days with daily progress and iterations.
            </p>
            <div className="w-full h-40 rounded-lg overflow-hidden mb-3">
              <img
                src="https://pixabay.com/get/g729acbc5e5c5e1ed0f1c7e3f51fbf43afe7c6c8a2f2a9a78ab3f56e5ae3cd91c3fbdf59a8f8e9f8c0e5b2b5d7c8a9f0e5d8c_1280.jpg"
                alt="Creative project workspace"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-secondary text-muted-foreground text-xs hover:bg-secondary/80">
                <Heart className="w-3.5 h-3.5" />
                <span>0</span>
              </button>
              <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90">
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
              <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-destructive/20 text-destructive text-xs hover:bg-destructive/30">
                <Flag className="w-3.5 h-3.5" />
                <span>Report</span>
              </button>
            </div>
          </div>

          <TooltipProvider>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 cursor-help">
                    <User className="w-4 h-4" />
                    <span>@xunpeihu</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Challenge Creator</p>
                </TooltipContent>
              </Tooltip>
              <Crown className="w-4 h-4 text-amber-400" />
              <span>· Trust 13</span>
              <MapPin className="w-3.5 h-3.5" />
              <span>Singapore</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs">Public</span>
            </div>
          </TooltipProvider>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-primary/70" />
              <div className="text-lg font-bold text-foreground">2/6</div>
              <div className="text-xs text-muted-foreground">Participants</div>
            </div>
            <div className="text-center">
              <Calendar className="w-5 h-5 mx-auto mb-1 text-primary/70" />
              <div className="text-lg font-bold text-foreground">0</div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
            <div className="col-span-2 flex items-center justify-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground">Personal</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10">
                <Camera className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-medium text-foreground">Photo</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Participation Progress</span>
              <span className="text-foreground font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="flex gap-1">
              {gameFlowSteps.map((step, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-2 flex-1 rounded-full transition-colors",
                    index <= getCurrentPhaseIndex() ? "bg-primary" : "bg-secondary",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border/50">
          <h2 className="font-semibold text-foreground mb-4">Game Progress</h2>
          <div className="space-y-1.5">
            {gameFlowSteps.map((step, index) => {
              const Icon = step.icon
              const isActive = step.phase === currentPhase
              const isPast = index < getCurrentPhaseIndex()
              const isFuture = index > getCurrentPhaseIndex()

              return (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-help",
                          isActive && "bg-amber-500/20 border border-amber-500/30",
                          isPast && "opacity-60",
                          isFuture && "opacity-40",
                        )}
                      >
                        <Icon className={cn("w-5 h-5", isActive ? "text-amber-500" : step.color)} />
                        <span
                          className={cn(
                            "flex-1 text-sm font-medium",
                            isActive ? "text-amber-500" : isPast ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {step.label}
                        </span>
                        <span className="text-xs text-muted-foreground">{step.time}</span>
                        {isPast && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {isActive && <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{step.label} Phase</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
        </div>

        {/* Status Banner */}
        <div className="bg-emerald-500/20 rounded-xl p-3 border border-emerald-500/30">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-emerald-400">You have joined this challenge</p>
              <div className="text-xs text-emerald-400/70 space-y-0.5">
                <p>
                  Evidence: <span className="text-red-400">Not Submitted</span>
                </p>
                <p>
                  Result: <span className="text-amber-400">Waiting for completion</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Evidence Requirements */}
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Evidence Requirements</h2>
            <button
              onClick={() => router.push("/evidence/submit")}
              className="px-3 py-1.5 bg-amber-500 text-white text-xs rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              Submit
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Submit daily project progress photos, sketches, or work-in-progress updates.
          </p>
        </div>

        {/* Participants */}
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-semibold text-foreground">Participants</h2>
          </div>
          <div className="space-y-3">
            {participants.map((p, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                    p.avatar,
                  )}
                >
                  {p.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{p.username}</span>
                    {p.isCreator && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs">Creator</span>
                    )}
                    {p.isYou && <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-xs">You</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">Trust: {p.trust}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Button */}
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-destructive/20 text-destructive font-medium hover:bg-destructive/30 transition-colors">
          <LogOut className="w-5 h-5" />
          Leave Challenge
        </button>

        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
            <Send className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold text-foreground">评论 ({comments.length})</h2>
          </div>

          {/* Comments List */}
          <div className="px-4 py-3 space-y-4 max-h-80 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-purple-500/50 flex items-center justify-center text-white text-sm font-bold">
                  {comment.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground text-sm">{comment.username}</span>
                    {comment.badges.map((badge) => (
                      <span
                        key={badge}
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-medium",
                          badge === "Admin" && "bg-red-500/20 text-red-400",
                          badge === "VIP" && "bg-amber-500/20 text-amber-400",
                        )}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-foreground mb-1">{comment.content}</p>
                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <div className="px-4 py-3 border-t border-border/50 bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                <Smile className="w-5 h-5 text-muted-foreground" />
              </button>
              <span className="text-xs text-muted-foreground">0/1000</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="发表你的评论..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                发表评论
              </button>
            </div>
          </div>
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
