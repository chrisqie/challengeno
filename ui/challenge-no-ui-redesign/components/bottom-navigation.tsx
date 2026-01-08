"use client"

import { Home, Plus, Trophy, Users, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/create", icon: Plus, label: "Create" },
  { href: "/my-games", icon: Trophy, label: "My Games" },
  { href: "/friends", icon: Users, label: "Friends", badge: "0" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors",
                isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-700",
              )}
            >
              <div className="relative">
                <item.icon className={cn("h-5 w-5", isActive && "text-blue-600")} />
                {item.badge && (
                  <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] text-slate-600">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={cn("font-medium", isActive && "text-blue-600")}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
