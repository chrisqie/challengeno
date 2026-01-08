"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function WelcomeBanner() {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-6 text-center border border-border/50">
      <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to ChallengeNo</h1>
      <p className="text-muted-foreground mb-4">Challenge yourself, grow together. No pressure!</p>
      <div className="flex items-center justify-center gap-3">
        <Link href="/signup">
          <Button size="lg" className="rounded-full px-6">
            Sign Up Now
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="lg" className="rounded-full px-6 bg-transparent">
            Log In
          </Button>
        </Link>
      </div>
    </div>
  )
}
