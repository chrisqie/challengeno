"use client"

import { useState } from "react"
import { Plus, CheckCircle2, Clock, AlertTriangle, XCircle, Eye, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { BottomNav } from "./bottom-nav"
import { AppHeader } from "./app-header"

const tabs = ["All Disputes", "Initiated by Me", "Against Me"]

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  Resolved: { icon: CheckCircle2, color: "text-status-active", bg: "bg-status-active/10" },
  Pending: { icon: Clock, color: "text-status-review", bg: "bg-status-review/10" },
  "Under Review": { icon: AlertTriangle, color: "text-status-open", bg: "bg-status-open/10" },
  Cancelled: { icon: XCircle, color: "text-muted-foreground", bg: "bg-secondary" },
}

const disputes = [
  {
    id: 1,
    title: "Test Upload Image",
    game: "dispute",
    type: "Rule Violation",
    status: "Resolved",
    initiator: "@test789",
    respondent: "@qloutlook",
    date: "2025/12/2",
    description: "Victory more loss less delete send speed Fuji Da",
  },
  {
    id: 2,
    title: "Art Evaluation Dispute",
    game: "Test Dispute",
    type: "Rule Violation",
    status: "Under Review",
    initiator: "@test789",
    respondent: "@newbie",
    date: "2025/12/2",
    description: "Art creation quality assessment disagreement",
  },
  {
    id: 3,
    title: "Arbitration Issue",
    game: "Multi-arbitration Content Mod",
    type: "Evidence Dispute",
    status: "Pending",
    initiator: "@test789",
    respondent: null,
    date: "2025/11/8",
    description: "Reply dispute content",
  },
  {
    id: 4,
    title: "SA Generation Issue",
    game: "Dispute Test 1",
    type: "Evidence Dispute",
    status: "Pending",
    initiator: "@test789",
    respondent: null,
    date: "2025/11/7",
    description: "Legal interpretation issue",
  },
  {
    id: 5,
    title: "Test Old",
    game: "Creative Project 111111",
    type: "Evidence Dispute",
    status: "Resolved",
    initiator: "@test789",
    respondent: null,
    date: "2025/11/7",
    description: "Test old issue",
  },
]

export function DisputesListScreen() {
  const [activeTab, setActiveTab] = useState("All Disputes")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)

  return (
    <div className="min-h-screen bg-muted pb-20">
      {/* App Header */}
      <AppHeader />

      {/* Page Header */}
      <div className="sticky top-14 z-30 bg-muted/95 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <div>
            <h1 className="text-lg font-bold text-foreground">Dispute Management</h1>
            <p className="text-xs text-muted-foreground">View and manage your dispute requests</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary rounded-full text-primary-foreground text-sm font-medium active:scale-95 transition">
            <Plus className="w-4 h-4" />
            <span>Create</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 gap-1 max-w-lg mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-t-lg transition-all",
                activeTab === tab ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <main className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        {/* Filter Bar */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{disputes.length} disputes</span>
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg text-sm font-medium text-secondary-foreground"
            >
              {statusFilter}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showStatusDropdown && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-card rounded-lg border border-border shadow-lg overflow-hidden z-10">
                {["All Status", "Resolved", "Pending", "Under Review", "Cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status)
                      setShowStatusDropdown(false)
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-secondary transition",
                      statusFilter === status ? "text-primary font-medium" : "text-foreground",
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Disputes List */}
        <div className="space-y-3">
          {disputes.map((dispute) => {
            const StatusIcon = statusConfig[dispute.status]?.icon || Clock
            const statusColor = statusConfig[dispute.status]?.color || "text-muted-foreground"
            const statusBg = statusConfig[dispute.status]?.bg || "bg-secondary"

            return (
              <button
                key={dispute.id}
                className="w-full p-4 bg-card rounded-xl border border-border/50 hover:border-primary/30 active:scale-[0.99] transition-all text-left group"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{dispute.title}</h3>
                      <span
                        className={cn(
                          "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                          statusBg,
                          statusColor,
                        )}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {dispute.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Game: {dispute.game}</p>
                  </div>
                  <div className="flex items-center gap-1 text-primary shrink-0">
                    <Eye className="w-4 h-4" />
                    <span className="text-xs font-medium">View</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{dispute.description}</p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Type: {dispute.type}</span>
                  <span>Evidence: 0 items</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 text-xs">
                  <span className="text-muted-foreground">
                    Initiator: <span className="text-foreground font-medium">{dispute.initiator}</span>
                    {dispute.respondent && (
                      <>
                        {" → "}
                        <span className="text-foreground font-medium">{dispute.respondent}</span>
                      </>
                    )}
                  </span>
                  <span className="text-muted-foreground">{dispute.date}</span>
                </div>
              </button>
            )
          })}
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
