"use client"

import { useState } from "react"
import { Gift, Copy, Users, Trophy, Calendar, ExternalLink, Lightbulb, Crown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { AppFooter } from "@/components/app-footer"

export function ReferralScreen() {
  const [copied, setCopied] = useState(false)
  const referralCode = "TESTINWUDU"

  const stats = [
    { label: "Total Referred", value: 2, icon: Users, color: "text-blue-500" },
    { label: "Total Rewards", value: 4, icon: Trophy, color: "text-amber-500" },
    { label: "Pending Rewards", value: 0, icon: Calendar, color: "text-orange-500" },
  ]

  const referredUsers = [
    { username: "@test456", name: "User One", date: "2025/10/30", isVip: true },
    { username: "@asdfdsaf", name: "Alt Account", date: "2025/10/27", isVip: false },
  ]

  const rewards = [
    "For each successful referral, you will receive 3 days VIP + 20 Participation Points",
    "Rewards will be automatically issued after the referred user completes registration",
    "VIP duration is cumulative, points can be redeemed in the shop",
    "The more you refer, the more rewards you get!",
  ]

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto max-w-3xl px-4 py-6 pb-24">
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-3">
          <Gift className="h-6 w-6 text-amber-500" />
          <h1 className="text-xl font-bold text-foreground">Refer Friends</h1>
        </div>

        {/* Referral Code */}
        <Card className="mb-4 border-0 bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-amber-400">✨</span>
              <h3 className="font-semibold text-foreground">My Referral Code</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border-2 border-dashed border-amber-200 bg-amber-50 p-3 text-center">
                <span className="text-lg font-bold tracking-wider text-amber-600">{referralCode}</span>
              </div>
              <Button onClick={handleCopy} className="h-12 w-12 bg-amber-500 hover:bg-amber-600">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-0 bg-card shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`h-6 w-6 ${stat.color} opacity-50`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Generate Share Link */}
        <Card className="mb-4 border-0 bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-foreground">Generate Share Link</h3>
            </div>
            <div className="mb-4 rounded-lg bg-muted p-4 text-center">
              <p className="font-medium text-foreground">Share APP to Invite Friends</p>
              <p className="text-sm text-muted-foreground">Invite friends to download and register, get VIP rewards</p>
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-600">
              <ExternalLink className="mr-2 h-4 w-4" />
              Generate Invite Link
            </Button>

            {/* Tip */}
            <div className="mt-4 rounded-lg bg-amber-50 p-4">
              <div className="mb-1 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span className="font-medium text-amber-700">Game Sharing Tip</span>
              </div>
              <p className="text-sm text-amber-600">
                Want to share a specific game? Go to the game details page and click the "Share Game" or "Share
                Achievement" button for easier sharing!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Referred Users */}
        <Card className="mb-4 border-0 bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-foreground">Referred Users ({referredUsers.length})</h3>
            </div>
            <div className="space-y-3">
              {referredUsers.map((user) => (
                <div key={user.username} className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {user.username[1].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{user.username}</p>
                      <p className="text-sm text-muted-foreground">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {user.isVip && <Crown className="h-4 w-4 text-amber-500" />}
                    {user.date}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Referral Rewards */}
        <Card className="border-0 bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Gift className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold text-foreground">Referral Rewards</h3>
            </div>
            <ul className="space-y-2">
              {rewards.map((reward, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-amber-700">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                  {reward}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6">
          <AppFooter />
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
