"use client"

import { useState } from "react"
import { ArrowLeft, User, Lock, Bell, Shield, Crown, Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"

const settingsOptions = [
  {
    icon: User,
    title: "Personal Profile",
    description: "Manage your personal information",
    href: "/profile/edit",
  },
  {
    icon: Lock,
    title: "Change Password",
    description: "Change your login password",
    href: "/settings/password",
  },
  {
    icon: Bell,
    title: "Notification Settings",
    description: "Manage notification preferences",
    href: "/notifications/settings",
  },
  {
    icon: Shield,
    title: "Privacy Settings",
    description: "Manage privacy and security settings",
    href: "/settings/privacy",
  },
]

const themes = [
  {
    id: "light",
    name: "Light Mode",
    description: "Classic light theme",
    colors: ["#3B82F6", "#1E40AF", "#60A5FA"],
    gradient: "bg-blue-500",
    vip: false,
  },
  {
    id: "dark",
    name: "Dark Mode",
    description: "Eye-friendly dark theme",
    colors: ["#6366F1", "#4F46E5", "#818CF8"],
    gradient: "bg-indigo-400",
    vip: false,
  },
  {
    id: "blue-gradient",
    name: "Blue Gradient",
    description: "VIP exclusive blue gradient theme",
    colors: ["#93C5FD", "#3B82F6", "#F9A8D4"],
    gradient: "bg-gradient-to-r from-blue-300 via-blue-400 to-pink-300",
    vip: true,
  },
  {
    id: "purple-gradient",
    name: "Purple Gradient",
    description: "VIP exclusive purple gradient theme",
    colors: ["#C4B5FD", "#A78BFA", "#DDD6FE"],
    gradient: "bg-gradient-to-r from-purple-200 via-purple-300 to-purple-100",
    vip: true,
  },
  {
    id: "green-gradient",
    name: "Green Gradient",
    description: "VIP exclusive green gradient theme",
    colors: ["#6EE7B7", "#34D399", "#A7F3D0"],
    gradient: "bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-100",
    vip: true,
  },
]

export function SettingsScreen() {
  const [selectedTheme, setSelectedTheme] = useState("light")
  const isVip = false

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto max-w-6xl px-4 py-6 pb-24">
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Settings Options */}
          <Card className="border-0 shadow-sm bg-card">
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Settings Options</h2>
              <div className="space-y-2">
                {settingsOptions.map((option) => (
                  <Link
                    key={option.title}
                    href={option.href}
                    className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
                  >
                    <option.icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{option.title}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* VIP Upgrade Card */}
              <div className="mt-6 rounded-xl bg-amber-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  <span className="font-semibold text-amber-700">Upgrade VIP</span>
                </div>
                <p className="mb-3 text-sm text-amber-600">Unlock more features and personalization options</p>
                <Button className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600">
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Theme Selection */}
          <Card className="border-0 shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-full bg-blue-100 p-1">
                  <div className="h-4 w-4 rounded-full bg-blue-500" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Theme Selection</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {themes.map((theme) => {
                  const isSelected = selectedTheme === theme.id
                  const isLocked = theme.vip && !isVip

                  return (
                    <button
                      key={theme.id}
                      onClick={() => !isLocked && setSelectedTheme(theme.id)}
                      className={`relative rounded-xl border-2 p-3 text-left transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : isLocked
                            ? "border-border opacity-60"
                            : "border-border hover:border-muted-foreground/50"
                      }`}
                      disabled={isLocked}
                    >
                      {/* Theme Preview */}
                      <div className={`mb-3 h-20 rounded-lg ${theme.gradient}`}>
                        {theme.vip && (
                          <div className="flex h-full items-center justify-center">
                            <Crown className="h-6 w-6 text-amber-500" />
                          </div>
                        )}
                      </div>

                      {/* Color Dots */}
                      <div className="mb-2 flex gap-1">
                        {theme.colors.map((color, i) => (
                          <div key={i} className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                        ))}
                        {theme.vip && <span className="ml-2 text-xs text-muted-foreground">Requires VIP</span>}
                      </div>

                      {/* Theme Info */}
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{theme.name}</p>
                        {theme.vip && (
                          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-600">
                            VIP
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{theme.description}</p>

                      {/* Selected Indicator */}
                      {isSelected && (
                        <div className="absolute right-2 top-2 rounded-full bg-blue-500 p-1">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* VIP Themes Promo */}
              <div className="mt-6 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  <span className="font-semibold text-amber-700">Upgrade VIP to Unlock More Themes</span>
                </div>
                <p className="mb-3 text-sm text-amber-600">
                  VIP members can use all beautiful gradient themes to make your interface more personalized.
                </p>
                <Button className="bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600">
                  Upgrade to VIP
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="pt-8 pb-4 text-center">
          <p className="text-xs text-muted-foreground">ChallengeNo. Challenge? No pressure!</p>
          <p className="text-xs text-muted-foreground">© 2025 onFuture Studio</p>
        </footer>
      </main>

      <BottomNav />
    </div>
  )
}
