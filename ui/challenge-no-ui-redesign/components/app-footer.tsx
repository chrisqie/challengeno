import { Heart } from "lucide-react"

export function AppFooter() {
  return (
    <footer className="py-6 text-center text-sm text-muted-foreground">
      <p className="mb-1">© 2025 ChallengeNo. Challenge? No pressure!</p>
      <p className="flex items-center justify-center gap-1">
        Crafted with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> by onFuture Studio
      </p>
      <p className="mt-1 text-xs text-muted-foreground/70">
        This platform does not support cash/financial betting and prohibits such activities
      </p>
    </footer>
  )
}
