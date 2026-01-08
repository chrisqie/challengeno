"use client"

import { ArrowLeft, Trophy, Star, Award, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"

export function PointsStatsScreen() {
  const totalPoints = 1294
  const monthlyChange = 26

  const pointTypes = [
    {
      type: "Participation Points",
      icon: Trophy,
      rank: 2,
      current: 1235,
      monthlyChange: 25,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      type: "Trust Points",
      icon: Star,
      rank: 12,
      current: 37,
      monthlyChange: -1,
      color: "bg-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      type: "Labor Points",
      icon: Award,
      rank: 4,
      current: 59,
      monthlyChange: 2,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
    },
  ]

  const monthlySources = [
    { label: "Create Games", points: 20 },
    { label: "Join Games", points: 5 },
    { label: "Peer Review", points: 2 },
    { label: "Marked as Breach", points: -1 },
  ]

  const pointsExplanation = [
    {
      type: "Participation Points (P Points)",
      color: "text-blue-500",
      rules: [
        "Create game: +10 points",
        "Join game: +5 points",
        "Complete game: +15 points",
        "Perfect completion: +5 points (bonus)",
      ],
    },
    {
      type: "Trust Points (T Points)",
      color: "text-amber-500",
      rules: [
        "Marked as compliant: +1-2 points",
        "Marked as breach: -2 to -5 points",
        "Successful appeal: +3 points",
        "Malicious dispute: -10 points",
      ],
    },
    {
      type: "Labor Points (L Points)",
      color: "text-emerald-500",
      rules: [
        "Peer review: +2 points",
        "Submit high quality evidence: +5 points",
        "Successful report: +5 points",
        "Assist arbitration: +15 points",
      ],
    },
  ]

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
            <h1 className="text-xl font-bold text-foreground">Points Statistics</h1>
            <p className="text-sm text-muted-foreground">View your points details and rankings</p>
          </div>
        </div>

        {/* Total Points */}
        <Card className="mb-4 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm text-muted-foreground">Total Points</h3>
                <p className="text-4xl font-bold text-foreground">{totalPoints}</p>
                <div className="mt-1 flex items-center gap-1 text-sm text-emerald-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>Monthly change: +{monthlyChange}</span>
                </div>
              </div>
              <Trophy className="h-8 w-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        {/* Points by Type */}
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          {pointTypes.map((point) => (
            <Card
              key={point.type}
              className={`border-2 border-l-4 shadow-sm`}
              style={{ borderLeftColor: point.color.replace("bg-", "#") }}
            >
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className={`rounded-lg p-2 ${point.bgColor}`}>
                    <point.icon className={`h-5 w-5 ${point.color.replace("bg-", "text-")}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Rank</p>
                    <p className="text-lg font-bold text-foreground">#{point.rank}</p>
                  </div>
                </div>
                <p className="mb-2 text-sm font-medium text-foreground">{point.type}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Current</p>
                    <p className="text-lg font-bold text-foreground">{point.current}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Monthly</p>
                    <p
                      className={`text-lg font-bold ${point.monthlyChange >= 0 ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {point.monthlyChange >= 0 ? "+" : ""}
                      {point.monthlyChange}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Monthly Sources */}
        <Card className="mb-4 border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold text-foreground">Monthly Points Sources</h3>
            <div className="space-y-3">
              {monthlySources.map((source) => (
                <div
                  key={source.label}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-foreground">{source.label}</span>
                  <span className={`font-semibold ${source.points >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {source.points >= 0 ? "+" : ""}
                    {source.points}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Points Explanation */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold text-foreground">Points Explanation</h3>
            <div className="space-y-6">
              {pointsExplanation.map((section) => (
                <div key={section.type}>
                  <h4 className={`mb-2 font-medium ${section.color}`}>{section.type}</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {section.rules.map((rule, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <footer className="text-center py-6 mt-4 space-y-1">
          <p className="text-xs text-muted-foreground/70">© 2025 ChallengeNo. Challenge? No pressure!</p>
        </footer>
      </main>

      <BottomNav />
    </div>
  )
}
