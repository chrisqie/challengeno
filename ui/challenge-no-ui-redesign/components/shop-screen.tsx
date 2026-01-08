"use client"

import { useState } from "react"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Heart, Zap, Target, Gift, Crown, ShoppingBag, Sparkles } from "lucide-react"

const userPoints = {
  participation: 1235,
  trust: 37,
  labor: 59,
  total: 1294,
}

const categories = [
  { id: "all", name: "All", icon: Gift },
  { id: "virtual", name: "Virtual Items", count: 2 },
  { id: "vip", name: "VIP", count: 3 },
  { id: "privilege", name: "Privileges", count: 4 },
  { id: "physical", name: "Physical Items", count: 3 },
]

const shopItems = [
  {
    id: "1",
    name: "VIP Membership 1 Month",
    desc: "Enjoy 1 month of VIP privileges including unlimited game creation, exclusive badge, priority support, etc.",
    points: 500,
    pointType: "labor",
    category: "vip",
    icon: Crown,
  },
  {
    id: "2",
    name: "VIP Membership 3 Months",
    desc: "Enjoy 3 months of VIP privileges, better value choice",
    points: 1200,
    pointType: "labor",
    category: "vip",
    icon: Crown,
  },
  {
    id: "3",
    name: "VIP Membership 1 Year",
    desc: "Annual VIP membership, the best value choice",
    points: 4000,
    pointType: "labor",
    category: "vip",
    icon: Crown,
  },
  {
    id: "4",
    name: "ChallengeNo Classic Mug",
    desc: "High-quality ceramic mug with ChallengeNo classic logo",
    points: 800,
    pointType: "participation",
    category: "physical",
    stock: 100,
    icon: Gift,
  },
  {
    id: "5",
    name: "ChallengeNo Logo T-Shirt",
    desc: "100% cotton T-shirt, comfortable and breathable, multiple sizes available",
    points: 1500,
    pointType: "participation",
    category: "physical",
    stock: 50,
    icon: Gift,
  },
  {
    id: "6",
    name: "ChallengeNo Sticker Pack",
    desc: "Exquisite sticker pack with 10 different waterproof sticker designs",
    points: 300,
    pointType: "participation",
    category: "physical",
    stock: 200,
    icon: Gift,
  },
  {
    id: "7",
    name: "Custom Badge",
    desc: "Design your own personal badge to show your unique personality",
    points: 1000,
    pointType: "trust",
    category: "virtual",
    icon: Sparkles,
  },
  {
    id: "8",
    name: "Colored Username",
    desc: "Display your username in a special color, more eye-catching",
    points: 600,
    pointType: "participation",
    category: "virtual",
    icon: Sparkles,
  },
  {
    id: "9",
    name: "Game Pin 1 Time",
    desc: "Pin your game to the top for 24 hours to get more attention",
    points: 200,
    pointType: "trust",
    category: "privilege",
    icon: Zap,
  },
]

export function ShopScreen() {
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredItems =
    activeCategory === "all" ? shopItems : shopItems.filter((item) => item.category === activeCategory)

  const getPointIcon = (type: string) => {
    switch (type) {
      case "participation":
        return <Trophy className="h-4 w-4 text-blue-500" />
      case "trust":
        return <Heart className="h-4 w-4 text-rose-500" />
      case "labor":
        return <Zap className="h-4 w-4 text-amber-500" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="container mx-auto px-4 py-6 pb-24 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-6 w-6 text-blue-500" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Points Shop</h1>
                <p className="text-sm text-muted-foreground">Exchange points for amazing gifts</p>
              </div>
            </div>
          </div>
          <Link href="/shop/history">
            <Button variant="outline">
              <Gift className="h-4 w-4 mr-2" />
              Exchange History
            </Button>
          </Link>
        </div>

        {/* Points Summary */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">My Points</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Trophy className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Participation Points</p>
                <p className="text-xl font-bold text-blue-500">{userPoints.participation}</p>
              </div>
              <div className="text-center p-3 bg-rose-50 rounded-lg">
                <Heart className="h-6 w-6 text-rose-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Trust Points</p>
                <p className="text-xl font-bold text-rose-500">{userPoints.trust}</p>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <Zap className="h-6 w-6 text-amber-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Labor Points</p>
                <p className="text-xl font-bold text-amber-500">{userPoints.labor}</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <Target className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Total Points</p>
                <p className="text-xl font-bold text-emerald-500">{userPoints.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground mr-2">Category:</span>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat.id)}
                  className={activeCategory === cat.id ? "bg-blue-500" : ""}
                >
                  {cat.icon && <cat.icon className="h-4 w-4 mr-1" />}
                  {cat.name}
                  {cat.count && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {cat.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shop Items Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <item.icon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.desc}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {getPointIcon(item.pointType)}
                    <span className="font-bold">{item.points}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.pointType === "participation" && "Participation Points"}
                      {item.pointType === "trust" && "Trust Points"}
                      {item.pointType === "labor" && "Labor Points"}
                    </span>
                  </div>
                  {item.stock && <span className="text-xs text-muted-foreground">Stock: {item.stock}</span>}
                </div>
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  <Gift className="h-4 w-4 mr-2" />
                  Exchange Now
                </Button>
              </CardContent>
            </Card>
          ))}
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
