"use client"

import { Home, Search, Plus, Trophy, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import Link from "next/link"

const navItems = [
  { id: "home", label: "Home", icon: Home, href: "/" },
  { id: "explore", label: "Explore", icon: Search, href: "/category" },
  { id: "create", label: "Create", icon: Plus, isAction: true, href: "/create" },
  { id: "leaderboard", label: "Ranks", icon: Trophy, href: "/leaderboard" },
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
]

export function BottomNav() {
  const [active, setActive] = useState("home")

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-card/95 backdrop-blur-xl border-t border-border/50">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2 pb-safe">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = active === item.id

            if (item.isAction) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setActive(item.id)}
                  className="flex items-center justify-center w-12 h-12 -mt-5 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 active:scale-95 transition-transform"
                >
                  <Icon className="w-6 h-6" strokeWidth={2.5} />
                  <span className="sr-only">{item.label}</span>
                </Link>
              )
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActive(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 px-3 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "scale-110")} strokeWidth={isActive ? 2.5 : 2} />
                <span className={cn("text-[10px]", isActive ? "font-semibold" : "font-medium")}>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
