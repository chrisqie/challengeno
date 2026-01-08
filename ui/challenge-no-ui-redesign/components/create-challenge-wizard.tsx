"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Check,
  AlertTriangle,
  Heart,
  Brain,
  Trophy,
  FileText,
  Settings,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { BottomNav } from "./bottom-nav"
import { AppHeader } from "./app-header"

const steps = [
  { id: 1, name: "Safety Notice", icon: Shield },
  { id: 2, name: "Choose Template", icon: FileText },
  { id: 3, name: "Configure Details", icon: Settings },
  { id: 4, name: "Confirm & Publish", icon: Send },
]

const safetyPoints = [
  { icon: Trophy, title: "Within Your Capacity", desc: "Set reasonable goals based on your abilities" },
  { icon: Check, title: "Gradual Progress", desc: "Start with small goals and gradually improve" },
  { icon: Heart, title: "Health First", desc: "Stop immediately if you feel unwell and consult a doctor" },
  { icon: Shield, title: "Safety First", desc: "Follow professional guidance and avoid dangerous behaviors" },
]

export function CreateChallengeWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  return (
    <div className="min-h-screen bg-muted pb-20">
      <AppHeader />

      <div className="sticky top-14 z-30 bg-muted/95 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = step.id === currentStep
            const isCompleted = step.id < currentStep
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                      isCompleted
                        ? "bg-status-active text-white"
                        : isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] mt-1 whitespace-nowrap",
                      isActive ? "text-primary font-medium" : "text-muted-foreground",
                    )}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn("w-8 h-0.5 mx-1 -mt-4", step.id < currentStep ? "bg-status-active" : "bg-border")}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <main className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-accent/10 to-primary/5 rounded-xl border border-accent/20">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 text-accent" />
                <Trophy className="w-5 h-5 text-accent" />
                <span className="font-bold text-foreground">Moderation over success, health over winning</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {safetyPoints.map((point) => {
                  const Icon = point.icon
                  return (
                    <div key={point.title} className="flex items-start gap-2">
                      <div className="p-1 rounded bg-status-active/20 shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-status-active" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-foreground">{point.title}</h4>
                        <p className="text-xs text-muted-foreground">{point.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="p-4 bg-destructive/10 rounded-xl border border-destructive/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <span className="font-bold text-destructive">Disclaimer</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This platform only provides challenge recording and social interaction services. It does not assume any
                responsibility for any physical injury, health problems, or other losses caused by participating in
                challenges.
              </p>
              <button className="text-sm text-primary font-medium mt-2">View detailed terms</button>
            </div>

            <div className="p-4 bg-status-open/10 rounded-xl border border-status-open/20">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-status-open" />
                <span className="font-bold text-status-open">Mental Health is Equally Important</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Maintain a positive attitude and enjoy the challenge process. If you feel too stressed or anxious,
                please adjust your goals appropriately or seek help. Remember: participation and trying itself is
                success!
              </p>
            </div>

            <label className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border/50 cursor-pointer">
              <button
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                  agreedToTerms ? "bg-primary border-primary" : "border-border",
                )}
              >
                {agreedToTerms && <Check className="w-3 h-3 text-primary-foreground" />}
              </button>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  I have carefully read and fully understand the above safety reminders and disclaimer
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  I confirm that I will participate in challenges reasonably according to my own situation and take
                  responsibility for my actions
                </p>
              </div>
            </label>
          </div>
        )}

        {currentStep === 2 && (
          <div className="p-8 bg-card rounded-xl border border-border/50 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-bold text-foreground mb-1">Choose Template</h3>
            <p className="text-sm text-muted-foreground">Select from existing templates or create custom</p>
          </div>
        )}

        {currentStep === 3 && (
          <div className="p-8 bg-card rounded-xl border border-border/50 text-center">
            <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-bold text-foreground mb-1">Configure Details</h3>
            <p className="text-sm text-muted-foreground">Set duration, participants, rules and more</p>
          </div>
        )}

        {currentStep === 4 && (
          <div className="p-8 bg-card rounded-xl border border-border/50 text-center">
            <Send className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-bold text-foreground mb-1">Confirm & Publish</h3>
            <p className="text-sm text-muted-foreground">Review and publish your challenge</p>
          </div>
        )}

        <footer className="pt-8 pb-4 text-center">
          <p className="text-xs text-muted-foreground">ChallengeNo. Challenge? No pressure!</p>
          <p className="text-xs text-muted-foreground">© 2025 onFuture Studio</p>
        </footer>
      </main>

      <div className="fixed bottom-16 left-0 right-0 p-4 bg-muted/95 backdrop-blur-xl border-t border-border/50">
        <div className="flex gap-3 max-w-lg mx-auto">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all",
              currentStep === 1
                ? "bg-secondary text-muted-foreground cursor-not-allowed"
                : "bg-secondary text-secondary-foreground active:scale-[0.98]",
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
            disabled={currentStep === 1 && !agreedToTerms}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all",
              currentStep === 1 && !agreedToTerms
                ? "bg-primary/50 text-primary-foreground/50 cursor-not-allowed"
                : "bg-primary text-primary-foreground active:scale-[0.98]",
            )}
          >
            {currentStep === 4 ? "Publish" : "Next"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
