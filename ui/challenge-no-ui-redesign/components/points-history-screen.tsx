"use client"

import { useState } from "react"
import { ArrowLeft, Trophy, Heart, Award, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { AppFooter } from "@/components/app-footer"

const pointRecords = [
  {
    id: 1,
    title: "Marked as Breach",
    type: "Trust Points (T)",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-50",
    time: "Today 19:52",
    game: "wwwwwwwwwww",
    change: -1,
  },
  {
    id: 2,
    title: "Create Game",
    type: "Participation Points (P)",
    icon: Trophy,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    time: "Today 19:11",
    game: "wwwwwwwwwww",
    change: 10,
  },
  {
    id: 3,
    title: "Create Game",
    type: "Participation Points (P)",
    icon: Trophy,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    time: "Today 08:42",
    game: "Leadership Skills Development",
    change: 10,
  },
  {
    id: 4,
    title: "Beginner Reward",
    type: "Participation Points (P)",
    icon: Trophy,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    time: "Yesterday 19:23",
    game: "Muscle Building Program",
    change: 10,
  },
  {
    id: 5,
    title: "Submit High Quality Evidence",
    type: "Labor Points (L)",
    icon: Award,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    time: "Yesterday 19:23",
    game: "Muscle Building Program",
    change: 5,
  },
  {
    id: 6,
    title: "Peer Review",
    type: "Labor Points (L)",
    icon: Award,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    time: "Yesterday 19:23",
    game: "Muscle Building Program",
    change: 2,
  },
  {
    id: 7,
    title: "Marked as Compliant",
    type: "Trust Points (T)",
    icon: Heart,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    time: "Yesterday 19:23",
    game: "Muscle Building Program",
    change: 3,
  },
  {
    id: 8,
    title: "Perfect Completion Reward",
    type: "Participation Points (P)",
    icon: Trophy,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    time: "Yesterday 19:23",
    game: "Muscle Building Program",
    change: 5,
  },
  {
    id: 9,
    title: "Complete Game",
    type: "Participation Points (P)",
    icon: Trophy,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    time: "Yesterday 19:23",
    game: "Muscle Building Program",
    change: 12,
  },
  {
    id: 10,
    title: "Create Game",
    type: "Participation Points (P)",
    icon: Trophy,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    time: "Yesterday 19:10",
    game: "Muscle Building Program",
    change: 10,
  },
  {
    id: 11,
    title: "Achievement: Veteran User",
    type: "Participation Points (P)",
    icon: Trophy,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    time: "Yesterday 19:08",
    game: null,
    change: 50,
  },
  {
    id: 12,
    title: "Create Game",
    type: "Participation Points (P)",
    icon: Trophy,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    time: "Yesterday 19:08",
    game: "Daily Healthy Cooking",
    change: 10,
  },
]

export function PointsHistoryScreen() {
  const [pointType, setPointType] = useState("all")
  const [timeRange, setTimeRange] = useState("all")

  const currentPoints = {
    participation: 117,
    trust: 12,
    labor: 7,
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto max-w-3xl px-4 py-6 pb-24">
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href="/profile" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Points History</h1>
            <p className="text-sm text-muted-foreground">View your points earning and usage records</p>
          </div>
        </div>

        {/* Current Points */}
        <Card className="mb-4 border-0 bg-card shadow-sm">
          <CardContent className="p-6">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">Current Points</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-blue-50 p-4 text-center">
                <Trophy className="mx-auto mb-2 h-6 w-6 text-blue-500" />
                <p className="text-2xl font-bold text-blue-600">{currentPoints.participation}</p>
                <p className="text-xs text-blue-500">Participation Points (P)</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4 text-center">
                <Heart className="mx-auto mb-2 h-6 w-6 text-amber-500" />
                <p className="text-2xl font-bold text-amber-600">{currentPoints.trust}</p>
                <p className="text-xs text-amber-500">Trust Points (T)</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-4 text-center">
                <Award className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
                <p className="text-2xl font-bold text-emerald-600">{currentPoints.labor}</p>
                <p className="text-xs text-emerald-500">Labor Points (L)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-4 border-0 bg-card shadow-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Point Type</label>
                <Select value={pointType} onValueChange={setPointType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="participation">Participation Points</SelectItem>
                    <SelectItem value="trust">Trust Points</SelectItem>
                    <SelectItem value="labor">Labor Points</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Time Range</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Points Records */}
        <Card className="border-0 bg-card shadow-sm">
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold text-foreground">Points Records ({pointRecords.length})</h3>
            <div className="space-y-1">
              {pointRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between border-b border-border py-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${record.bgColor}`}>
                      <record.icon className={`h-4 w-4 ${record.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{record.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.type} · {record.time}
                        {record.game && (
                          <>
                            {" · "}
                            <Link href="#" className="text-blue-500 hover:underline">
                              {record.game}
                            </Link>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1 font-semibold ${record.change >= 0 ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {record.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {record.change >= 0 ? "+" : ""}
                    {record.change}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-4">
          <AppFooter />
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
