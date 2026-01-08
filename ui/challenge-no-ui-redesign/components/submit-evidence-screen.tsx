"use client"

import { useState } from "react"
import { ArrowLeft, Camera, Video, Upload, Clock, CheckCircle2, X } from "lucide-react"
import { BottomNav } from "./bottom-nav"
import { cn } from "@/lib/utils"

export function SubmitEvidenceScreen() {
  const [evidenceType, setEvidenceType] = useState<"photo" | "video">("photo")
  const [description, setDescription] = useState("")
  const [selfEval, setSelfEval] = useState<"completed" | "not-completed" | null>("completed")

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-semibold text-foreground">Submit Evidence</h1>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Challenge Info */}
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <h2 className="font-semibold text-foreground mb-1">wwwwwwwwwwww</h2>
          <p className="text-sm text-muted-foreground mb-2">
            Complete a creative project over 30 days with daily progress and iterations.
          </p>
          <p className="text-xs text-muted-foreground">
            Evidence Instructions: Submit daily project progress photos, sketches, or work-in-progress updates.
          </p>
          <div className="flex items-center gap-1 mt-2 text-destructive">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">0h 1m remaining</span>
          </div>
        </div>

        {/* Evidence Type */}
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <h2 className="font-semibold text-foreground mb-3">Evidence Type</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setEvidenceType("photo")}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                evidenceType === "photo" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
              )}
            >
              <Camera className={cn("w-8 h-8", evidenceType === "photo" ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("font-medium", evidenceType === "photo" ? "text-primary" : "text-muted-foreground")}>
                Photo
              </span>
              <span className="text-xs text-muted-foreground">JPG, PNG, GIF, WebP</span>
            </button>
            <button
              onClick={() => setEvidenceType("video")}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                evidenceType === "video" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
              )}
            >
              <Video className={cn("w-8 h-8", evidenceType === "video" ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("font-medium", evidenceType === "video" ? "text-primary" : "text-muted-foreground")}>
                Video
              </span>
              <span className="text-xs text-muted-foreground">MP4, WebM</span>
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <h2 className="font-semibold text-foreground mb-1">Upload Evidence (Optional)</h2>
          <p className="text-xs text-muted-foreground mb-3">
            You can upload a file, write a text description, or both. At least one is required.
          </p>
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium text-foreground mb-1">Drop files here or click to upload</p>
            <p className="text-sm text-muted-foreground mb-1">Max size: 30MB</p>
            <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF, WebP</p>
          </div>
        </div>

        {/* Text Description */}
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <h2 className="font-semibold text-foreground mb-1">Text Description (Required)</h2>
          <p className="text-xs text-muted-foreground mb-3">
            Please describe in detail how you completed the challenge (at least 20 characters).
          </p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please describe in detail how you completed the challenge... (at least 20 characters)"
            rows={4}
            className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground border border-border/50 outline-none focus:ring-2 focus:ring-primary/50 resize-none placeholder:text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground mt-1">{description.length} characters</p>
        </div>

        {/* Self Evaluation */}
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <h2 className="font-semibold text-foreground mb-1">Self Evaluation</h2>
          <p className="text-xs text-muted-foreground mb-3">
            Please honestly evaluate whether you successfully completed this challenge:
          </p>
          <div className="space-y-2">
            <button
              onClick={() => setSelfEval("completed")}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                selfEval === "completed"
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-border hover:border-emerald-500/50",
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  selfEval === "completed" ? "border-emerald-500 bg-emerald-500" : "border-muted-foreground",
                )}
              >
                {selfEval === "completed" && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
              <CheckCircle2
                className={cn("w-5 h-5", selfEval === "completed" ? "text-emerald-500" : "text-muted-foreground")}
              />
              <span
                className={cn("font-medium", selfEval === "completed" ? "text-emerald-500" : "text-muted-foreground")}
              >
                Successfully Completed
              </span>
            </button>
            <button
              onClick={() => setSelfEval("not-completed")}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                selfEval === "not-completed"
                  ? "border-destructive bg-destructive/10"
                  : "border-border hover:border-destructive/50",
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  selfEval === "not-completed" ? "border-destructive bg-destructive" : "border-muted-foreground",
                )}
              >
                {selfEval === "not-completed" && <X className="w-3 h-3 text-white" />}
              </div>
              <X
                className={cn("w-5 h-5", selfEval === "not-completed" ? "text-destructive" : "text-muted-foreground")}
              />
              <span
                className={cn(
                  "font-medium",
                  selfEval === "not-completed" ? "text-destructive" : "text-muted-foreground",
                )}
              >
                Not Completed
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* Submit Button */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <button
          disabled={description.length < 20}
          className={cn(
            "w-full py-3.5 rounded-xl font-semibold transition-colors",
            description.length >= 20
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground cursor-not-allowed",
          )}
        >
          Submit Evidence
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
