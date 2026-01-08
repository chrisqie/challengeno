"use client"

import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastNotificationProps {
  type: "success" | "error" | "warning" | "info"
  message: string
  onClose?: () => void
}

export function ToastNotification({ type, message, onClose }: ToastNotificationProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }

  const styles = {
    success: "bg-slate-900 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-amber-500 text-white",
    info: "bg-blue-500 text-white",
  }

  const iconColors = {
    success: "text-emerald-400",
    error: "text-white",
    warning: "text-white",
    info: "text-white",
  }

  const Icon = icons[type]

  return (
    <div className={cn("flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg", styles[type])}>
      <Icon className={cn("h-5 w-5", iconColors[type])} />
      <span className="font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// Example usage component for demonstration
export function ToastDemo() {
  return (
    <div className="fixed right-4 top-4 z-50">
      <ToastNotification type="success" message="Login Successful!" />
    </div>
  )
}
