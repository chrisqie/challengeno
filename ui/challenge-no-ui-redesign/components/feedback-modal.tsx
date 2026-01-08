"use client"

import { useState } from "react"
import { X, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

const feedbackTypes = [
  { value: "suggestion", label: "Feature Suggestion" },
  { value: "bug", label: "Bug Report" },
  { value: "other", label: "Other" },
]

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [type, setType] = useState("suggestion")
  const [description, setDescription] = useState("")
  const [email, setEmail] = useState("")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card rounded-2xl border border-border/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h2 className="text-lg font-semibold text-foreground">Feedback</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Feedback Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground border border-border/50 outline-none focus:ring-2 focus:ring-primary/50"
            >
              {feedbackTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Detailed Description <span className="text-destructive">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the issue or suggestion in detail..."
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground border border-border/50 outline-none focus:ring-2 focus:ring-primary/50 resize-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Contact Email (Optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Leave your email if you need a reply"
              className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground border border-border/50 outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!description.trim()}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors",
                description.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed",
              )}
            >
              <Send className="w-4 h-4" />
              Submit
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Your feedback is important to us. We will carefully consider every suggestion.
          </p>
        </div>
      </div>
    </div>
  )
}
