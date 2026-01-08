"use client"

import { Search, Globe, Moon, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function VisitorHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <img src="/images/logo.png" alt="ChallengeNo" className="h-10 w-auto object-contain" />
        </Link>

        {/* Search Bar - Hidden on very small screens */}
        <div className="hidden sm:flex flex-1 max-w-xs mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search challenges..."
              className="w-full pl-9 h-9 bg-secondary/50 border-border/50"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1.5">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1 px-2 h-8">
                <Globe className="h-4 w-4" />
                <span className="text-xs">US English</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>US English</DropdownMenuItem>
              <DropdownMenuItem>Español</DropdownMenuItem>
              <DropdownMenuItem>日本語</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dark Mode Toggle */}
          <Button variant="ghost" size="icon" className="hidden sm:flex h-8 w-8">
            <Moon className="h-4 w-4" />
          </Button>

          {/* Auth Buttons */}
          <Link href="/login">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5">
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Log In</span>
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="h-8 gap-1.5">
              <UserPlus className="h-4 w-4" />
              <span>Sign Up</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
