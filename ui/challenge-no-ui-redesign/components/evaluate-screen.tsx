"use client"

import { useState } from "react"
import { User, CheckCircle2, XCircle, ImageIcon, AlertCircle, ChevronRight, ChevronDown, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { BottomNav } from "./bottom-nav"
import { AppHeader } from "./app-header"

export function EvaluateScreen() {
  const [evaluation, setEvaluation] = useState<"completed" | "not-completed" | null>(null)
  const [reasoning, setReasoning] = useState("")
  const [showEvidence, setShowEvidence] = useState(true)

  return (
    <div className="min-h-screen bg-muted pb-24">
      {/* AppHeader */}
      <AppHeader />

      <main className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-lg font-bold text-foreground">Evaluate Participant</h1>
          <p className="text-xs text-muted-foreground">Review evidence and make judgment</p>
        </div>

        {/* Challenge Info Card */}
        <div className="p-4 bg-card rounded-xl border border-border/50">
          <h2 className="font-bold text-foreground mb-1">Creative Project Challenge</h2>
          <p className="text-sm text-muted-foreground">
            Complete a creative project over 30 days with daily progress and iterations.
          </p>
        </div>

        {/* Participant Card */}
        <div className="p-4 bg-card rounded-xl border border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">@xunpeihu</span>
                  <span className="px-1.5 py-0.5 bg-accent/20 text-accent text-[10px] font-bold rounded">Lv.13</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3 text-accent" />
                  <span>Trust Points: 13</span>
                </div>
              </div>
            </div>
            {/* Self Evaluation Badge */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive/10 border border-destructive/20">
              <XCircle className="w-4 h-4 text-destructive" />
              <span className="text-xs font-medium text-destructive">Self: Not Completed</span>
            </div>
          </div>
        </div>

        {/* Submitted Evidence Section */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="w-full flex items-center justify-between p-4"
          >
            <h3 className="font-semibold text-foreground">Submitted Evidence</h3>
            <ChevronDown
              className={cn("w-5 h-5 text-muted-foreground transition-transform", showEvidence && "rotate-180")}
            />
          </button>

          {showEvidence && (
            <div className="px-4 pb-4">
              <div className="flex flex-col items-center justify-center py-8 text-center bg-secondary/50 rounded-lg">
                <ImageIcon className="w-10 h-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">This user has not submitted evidence</p>
              </div>
            </div>
          )}
        </div>

        {/* Participant's Self Evaluation */}
        <div className="p-4 bg-status-review/10 rounded-xl border border-status-review/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-status-review shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">Participant&apos;s Self Evaluation</h4>
              <div className="flex items-center gap-1.5 mb-2">
                <XCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm text-destructive font-medium">
                  Believes they did not complete the challenge
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Please make your objective judgment based on the evidence and participant&apos;s self-evaluation
              </p>
            </div>
          </div>
        </div>

        {/* Your Evaluation */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Your Evaluation</h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setEvaluation("completed")}
              className={cn(
                "flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all active:scale-[0.98]",
                evaluation === "completed"
                  ? "border-status-active bg-status-active/10"
                  : "border-border/50 bg-card hover:border-status-active/50",
              )}
            >
              <CheckCircle2
                className={cn("w-5 h-5", evaluation === "completed" ? "text-status-active" : "text-muted-foreground")}
              />
              <span
                className={cn(
                  "font-medium",
                  evaluation === "completed" ? "text-status-active" : "text-muted-foreground",
                )}
              >
                Completed
              </span>
            </button>

            <button
              onClick={() => setEvaluation("not-completed")}
              className={cn(
                "flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all active:scale-[0.98]",
                evaluation === "not-completed"
                  ? "border-destructive bg-destructive/10"
                  : "border-border/50 bg-card hover:border-destructive/50",
              )}
            >
              <XCircle
                className={cn("w-5 h-5", evaluation === "not-completed" ? "text-destructive" : "text-muted-foreground")}
              />
              <span
                className={cn(
                  "font-medium",
                  evaluation === "not-completed" ? "text-destructive" : "text-muted-foreground",
                )}
              >
                Not Completed
              </span>
            </button>
          </div>

          {/* Reasoning Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Evaluation Reasoning <span className="text-muted-foreground">(Optional)</span>
            </label>
            <textarea
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Please explain your evaluation reasoning..."
              className="w-full h-24 px-4 py-3 bg-secondary rounded-xl border border-border/50 text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8 pb-4 text-center">
          <p className="text-xs text-muted-foreground">ChallengeNo. Challenge? No pressure!</p>
          <p className="text-xs text-muted-foreground">© 2025 onFuture Studio</p>
        </footer>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-muted/95 backdrop-blur-xl border-t border-border/50">
        <button
          disabled={!evaluation}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all max-w-lg mx-auto",
            evaluation
              ? "bg-primary text-primary-foreground active:scale-[0.98]"
              : "bg-primary/50 text-primary-foreground/50 cursor-not-allowed",
          )}
        >
          Submit Evaluation
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
