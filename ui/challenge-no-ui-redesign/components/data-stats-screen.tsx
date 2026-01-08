"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Trophy, Target, Star, Calendar, BarChart3, Users, ChevronDown } from "lucide-react"

const statsData = [
  {
    label: "Total Points",
    value: "1331",
    change: "+0 This Month",
    icon: Trophy,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    label: "Completion Rate",
    value: "0%",
    sub: "0/16 Completed",
    icon: Target,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    label: "Trust Points",
    value: "37",
    sub: "Trust Level: Average",
    icon: Star,
    color: "text-amber-400",
    bgColor: "bg-amber-50",
  },
  {
    label: "Active Days",
    value: "85",
    sub: "Joined on 2025/9/12",
    icon: Calendar,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
]

const recentActivity = [
  { action: "Created challenge", game: "Test Dispute", date: "12/1/2025" },
  { action: "Created challenge", game: "test 3", date: "12/1/2025" },
  { action: "Joined challenge", game: "Test Dispute", date: "12/1/2025" },
  { action: "Joined challenge", game: "test 3", date: "12/1/2025" },
  { action: "Joined challenge", game: "dispute", date: "12/1/2025" },
]

export function DataStatsScreen() {
  const [timeRange, setTimeRange] = useState("30days")
  const [pointsOpen, setPointsOpen] = useState(false)
  const [gameStatsOpen, setGameStatsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto px-4 py-6 pb-24 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Data Statistics</h1>
            <p className="text-muted-foreground">View your detailed activity data and achievement progress</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsData.map((stat, index) => (
            <Card key={index} className="bg-card border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                {stat.change && (
                  <p className="text-sm text-emerald-500 flex items-center gap-1 mt-1">
                    <span className="text-xs">↗</span> {stat.change}
                  </p>
                )}
                {stat.sub && <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Collapsible Sections */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Collapsible open={pointsOpen} onOpenChange={setPointsOpen}>
            <Card className="bg-card border-0 shadow-sm">
              <CollapsibleTrigger className="w-full">
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-base text-foreground">Points Details</CardTitle>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${pointsOpen ? "rotate-180" : ""}`}
                  />
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Participation Points</span>
                      <span className="font-medium text-foreground">1235</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trust Points</span>
                      <span className="font-medium text-foreground">37</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Labor Points</span>
                      <span className="font-medium text-foreground">59</span>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={gameStatsOpen} onOpenChange={setGameStatsOpen}>
            <Card className="bg-card border-0 shadow-sm">
              <CollapsibleTrigger className="w-full">
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-base text-foreground">Game Statistics</CardTitle>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${gameStatsOpen ? "rotate-180" : ""}`}
                  />
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Games Created</span>
                      <span className="font-medium text-foreground">9</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Games Joined</span>
                      <span className="font-medium text-foreground">4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Games Completed</span>
                      <span className="font-medium text-foreground">0</span>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-muted rounded-lg">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-base text-foreground">Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0 divide-y divide-border">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-blue-500">{activity.game}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          © 2025 ChallengeNo. Challenge? No pressure!
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
