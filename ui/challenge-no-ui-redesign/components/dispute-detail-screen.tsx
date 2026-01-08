"use client"

import { useState } from "react"
import { CheckCircle2, FileText, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { BottomNav } from "./bottom-nav"
import { AppHeader } from "./app-header"

const disputeData = {
  title: "Test Upload Image",
  status: "Resolved",
  type: "Rule Violation",
  game: "dispute",
  createdAt: "2025/12/2 05:05:11",
  resolvedAt: "2025/12/2 05:06:57",
  initiator: "@test789",
  respondent: "@qloutlook",
  handler: "@admin",
  description: "Victory more loss less delete send speed Fuji Da",
  resolution: "Partially Supported",
  evidence: [],
}

export function DisputeDetailScreen() {
  const [showEvidence, setShowEvidence] = useState(true)

  return (
    <div className="min-h-screen bg-muted pb-20">
      <AppHeader />

      <main className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">{disputeData.title}</h1>
            <p className="text-xs text-muted-foreground">Dispute Details</p>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-active/10 text-status-active text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Resolved
          </span>
        </div>

        <div className="p-4 bg-card rounded-xl border border-border/50 space-y-4">
          <h3 className="font-bold text-foreground">Dispute Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Dispute Type</p>
              <p className="text-sm font-medium text-foreground">{disputeData.type}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Initiator</p>
              <p className="text-sm font-medium text-primary">{disputeData.initiator}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Related Game</p>
              <p className="text-sm font-medium text-foreground">{disputeData.game}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Respondent</p>
              <p className="text-sm font-medium text-primary">{disputeData.respondent}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Created</p>
              <p className="text-sm font-medium text-foreground">{disputeData.createdAt}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Handler</p>
              <p className="text-sm font-medium text-primary">{disputeData.handler}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Resolved</p>
              <p className="text-sm font-medium text-foreground">{disputeData.resolvedAt}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <h4 className="text-sm font-semibold text-foreground mb-2">Dispute Description</h4>
            <p className="text-sm text-muted-foreground">{disputeData.description}</p>
          </div>

          <div className="p-3 bg-status-active/10 rounded-lg border border-status-active/20">
            <h4 className="text-sm font-semibold text-status-active mb-1">Resolution Result</h4>
            <p className="text-sm text-muted-foreground">{disputeData.resolution}</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="w-full flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">Evidence Materials</h3>
              <span className="px-2 py-0.5 bg-secondary rounded text-xs text-muted-foreground">
                {disputeData.evidence.length}
              </span>
            </div>
            <ChevronDown
              className={cn("w-5 h-5 text-muted-foreground transition-transform", showEvidence && "rotate-180")}
            />
          </button>

          {showEvidence && (
            <div className="px-4 pb-4">
              <div className="flex flex-col items-center justify-center py-10 text-center bg-secondary/50 rounded-lg">
                <FileText className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">No Evidence Materials</p>
                <p className="text-xs text-muted-foreground">No evidence was submitted for this dispute</p>
              </div>
            </div>
          )}
        </div>

        <footer className="pt-8 pb-4 text-center">
          <p className="text-xs text-muted-foreground">ChallengeNo. Challenge? No pressure!</p>
          <p className="text-xs text-muted-foreground">© 2025 onFuture Studio</p>
        </footer>
      </main>

      <BottomNav />
    </div>
  )
}
