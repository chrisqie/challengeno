"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <div className="flex items-center h-full mt-2">
          <div className="relative" style={{ width: "110px" }}>
            <Image
              src="/images/logo-icon.png"
              alt="ChallengeNo"
              width={110}
              height={50}
              className="h-auto w-[110px] object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-secondary">
            <Search className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-secondary relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            <span className="sr-only">Notifications</span>
          </Button>
          <button className="h-9 w-9 rounded-full overflow-hidden ring-2 ring-primary/50 ml-1">
            <img src="/placeholder.svg?height=36&width=36" alt="Profile" className="h-full w-full object-cover" />
          </button>
        </div>
      </div>
    </header>
  )
}
