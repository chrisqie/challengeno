"use client"

import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingBag, Trophy, Clock } from "lucide-react"

const exchangeHistory = [
  {
    id: "1",
    name: "Custom Badge",
    desc: "Personal design badge",
    points: 100,
    pointType: "participation",
    date: "2025/10/18 11:20:08",
    status: "pending",
    image: "/wrapped-gift.png",
  },
]

export function ExchangeHistoryScreen() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto px-4 py-6 pb-24 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/shop">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Exchange History</h1>
              <p className="text-sm text-muted-foreground">View your points exchange history</p>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="p-6">
            {exchangeHistory.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No exchange records</p>
              </div>
            ) : (
              <div className="space-y-4">
                {exchangeHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-border rounded-lg bg-card"
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover bg-muted"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-foreground">
                        <Trophy className="h-4 w-4 text-blue-500" />
                        <span>Used {item.points} Participation Points</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">Exchange time: {item.date}</p>
                        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 w-fit">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 text-center text-sm text-muted-foreground bg-muted py-3 rounded-lg">
              {exchangeHistory.length} exchange records total, page 1 of 1
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          © 2025 ChallengeNo. Challenge? No pressure!
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
