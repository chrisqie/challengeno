"use client"

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      {/* Spinner */}
      <div className="relative w-20 h-20 mb-6">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        {/* Spinning arc */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        {/* Inner circle */}
        <div className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-primary" />
        </div>
      </div>

      {/* Text */}
      <p className="text-lg text-foreground mb-4">正在初始化应用...</p>

      {/* Dots animation */}
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  )
}
