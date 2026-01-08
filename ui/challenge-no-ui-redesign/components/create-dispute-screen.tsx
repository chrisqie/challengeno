"use client"

import { useState } from "react"
import { ChevronLeft, AlertTriangle, ChevronDown, Upload, ImageIcon, FileText } from "lucide-react"
import { BottomNav } from "./bottom-nav"

const guidelines = [
  "Disputes must be submitted within 48 hours after game completion",
  "Each game allows a maximum of 3 dispute submissions",
  "Please provide sufficient evidence to support your dispute (text or images)",
  "Malicious disputes will affect your trust points",
  "If rejected, you can resubmit a dispute",
  "Administrators will process your dispute within 7 business days",
]

const disputeTypes = ["Evidence Dispute", "Rule Violation", "Scoring Dispute", "Other"]

export function CreateDisputeScreen() {
  const [selectedGame, setSelectedGame] = useState("")
  const [selectedRespondent, setSelectedRespondent] = useState("")
  const [disputeType, setDisputeType] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [reasoning, setReasoning] = useState("")
  const [textEvidence, setTextEvidence] = useState("")
  const [showGameDropdown, setShowGameDropdown] = useState(false)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center gap-3 px-4 py-3">
          <button className="p-2 -ml-2 rounded-full hover:bg-secondary active:scale-95 transition">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Create Dispute</h1>
            <p className="text-xs text-muted-foreground">Submit a dispute for game results or behavior</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Guidelines Card */}
        <div className="p-4 bg-status-review/10 rounded-xl border border-status-review/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-status-review" />
            <span className="font-bold text-status-review">Dispute Guidelines</span>
          </div>
          <ul className="space-y-2">
            {guidelines.map((guideline, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-status-review mt-0.5">•</span>
                <span>{guideline}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Related Game */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Related Game <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setShowGameDropdown(!showGameDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 bg-secondary rounded-xl border border-border/50 text-left"
              >
                <span className={selectedGame ? "text-foreground" : "text-muted-foreground"}>
                  {selectedGame || "Select a game"}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Respondent */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Respondent <span className="text-muted-foreground">(Optional)</span>
            </label>
            <div className="relative">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-secondary rounded-xl border border-border/50 text-left">
                <span className="text-muted-foreground">Against entire game result</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              If disputing specific participants, select them; leave empty to dispute entire game result
            </p>
          </div>

          {/* Dispute Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Dispute Type <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 bg-secondary rounded-xl border border-border/50 text-left"
              >
                <span className={disputeType ? "text-foreground" : "text-muted-foreground"}>
                  {disputeType || "Evidence Dispute"}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              {showTypeDropdown && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-card rounded-lg border border-border shadow-lg overflow-hidden z-10">
                  {disputeTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setDisputeType(type)
                        setShowTypeDropdown(false)
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-secondary transition text-foreground"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dispute Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Dispute Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Briefly summarize the dispute content"
              maxLength={100}
              className="w-full px-4 py-3 bg-secondary rounded-xl border border-border/50 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-muted-foreground text-right">{title.length}/100 characters</p>
          </div>

          {/* Dispute Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Dispute Description <span className="text-destructive">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the specific situation in detail, including time, location, people involved, and sequence of events"
              maxLength={1000}
              className="w-full h-28 px-4 py-3 bg-secondary rounded-xl border border-border/50 text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-muted-foreground text-right">{description.length}/1000 characters</p>
          </div>

          {/* Dispute Reasoning */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Dispute Reasoning <span className="text-muted-foreground">(Optional)</span>
            </label>
            <textarea
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Explain why you believe the current result is unfair and your expected resolution"
              maxLength={500}
              className="w-full h-24 px-4 py-3 bg-secondary rounded-xl border border-border/50 text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-muted-foreground text-right">{reasoning.length}/500 characters</p>
          </div>

          {/* Text Evidence */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <label className="text-sm font-medium text-foreground">Text Evidence</label>
            </div>
            <textarea
              value={textEvidence}
              onChange={(e) => setTextEvidence(e.target.value)}
              placeholder="Provide text evidence supporting your dispute (e.g., chat records, rule explanations, timestamps)"
              maxLength={1000}
              className="w-full h-24 px-4 py-3 bg-secondary rounded-xl border border-border/50 text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-muted-foreground">
              {textEvidence.length}/1000 characters • At least text or image evidence required
            </p>
          </div>

          {/* Image Evidence */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
              <label className="text-sm font-medium text-foreground">Image Evidence</label>
            </div>
            <button className="w-full flex flex-col items-center justify-center gap-2 py-8 bg-secondary rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload image evidence (Max 5)</span>
              <span className="text-xs text-muted-foreground">Supports JPG, PNG, GIF formats</span>
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/95 backdrop-blur-xl border-t border-border/50">
        <div className="flex gap-3 max-w-lg mx-auto">
          <button className="flex-1 py-3 rounded-xl font-medium bg-secondary text-secondary-foreground active:scale-[0.98] transition">
            Cancel
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-primary text-primary-foreground active:scale-[0.98] transition">
            Submit Dispute
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
