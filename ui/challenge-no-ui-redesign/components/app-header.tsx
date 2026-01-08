"use client"

import { useState } from "react"
import { Search, Moon, Sun, Crown, Settings, Bell, Store, UsersRound, Award, Gift, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function AppHeader() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const notificationCount = 29

  return (
    <header className="sticky top-0 z-50 bg-muted">
      <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <Link href="/" className="flex items-center shrink-0 mt-2">
          <Image
            src="/images/logo-icon.png"
            alt="ChallengeNo"
            width={110}
            height={40}
            className="w-[110px] h-auto object-contain"
            priority
          />
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-secondary">
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>

          {/* Notifications */}
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-secondary relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {notificationCount > 0 && (
                <Badge className="absolute right-1 top-1 h-4 w-4 rounded-full bg-red-500 p-0 text-[10px] flex items-center justify-center">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </Badge>
              )}
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-9 w-9 rounded-full overflow-hidden ring-2 ring-primary/50 ml-1">
                <Avatar className="h-full w-full">
                  <AvatarImage src="/squirrel-avatar.png" className="object-cover" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">SA</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* User Info */}
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">System Administrator</span>
                  <Crown className="h-4 w-4 text-amber-500" />
                </div>
                <p className="text-sm text-muted-foreground">@admin</p>
              </div>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setIsDarkMode(!isDarkMode)} className="cursor-pointer">
                {isDarkMode ? (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    Dark Mode
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Main Menu Items */}
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/achievements" className="flex items-center gap-2 cursor-pointer">
                  <Award className="h-4 w-4" />
                  Achievements
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/vip" className="flex items-center gap-2 cursor-pointer">
                  <Crown className="h-4 w-4 text-amber-500" />
                  VIP Membership
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/shop" className="flex items-center gap-2 cursor-pointer">
                  <Store className="h-4 w-4 text-emerald-500" />
                  Points Shop
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/teams" className="flex items-center gap-2 cursor-pointer">
                  <UsersRound className="h-4 w-4 text-blue-500" />
                  Teams
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/referral" className="flex items-center gap-2 cursor-pointer">
                  <Gift className="h-4 w-4 text-pink-500" />
                  Referral
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-red-500 cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
