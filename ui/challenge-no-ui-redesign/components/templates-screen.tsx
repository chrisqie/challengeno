"use client"

import { useState } from "react"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Users, Clock, Star, Crown, Check } from "lucide-react"

const templates = [
  {
    id: "1",
    name: "Book Club Reading Challenge",
    desc: "Read one book per week and participate in discussions to deepen understanding.",
    participants: 10,
    duration: "28 days",
    category: "LEARNING",
    isVip: false,
    isSelected: true,
  },
  {
    id: "2",
    name: "30-Day Creative Project",
    desc: "Complete a creative project over 30 days with daily progress and iterations.",
    participants: 6,
    duration: "28 days",
    category: "PERSONAL",
    isVip: false,
  },
  {
    id: "3",
    name: "Language Fluency Intensive",
    desc: "Intensive language learning program: 2 hours daily practice including speaking, listening...",
    participants: 8,
    duration: "28 days",
    category: "LEARNING",
    isVip: false,
  },
  {
    id: "4",
    name: "Leadership Skills Development",
    desc: "Develop leadership skills through daily practice: team management, decision making...",
    participants: 8,
    duration: "28 days",
    category: "WORK",
    isVip: false,
  },
  {
    id: "5",
    name: "Minimalist Lifestyle Challenge",
    desc: "Declutter and simplify life by removing one unnecessary item daily for 30 days.",
    participants: 8,
    duration: "30 days",
    category: "LIFESTYLE",
    isVip: false,
  },
  {
    id: "6",
    name: "Muscle Building Program",
    desc: "Follow comprehensive muscle building program with progressive overload training.",
    participants: 6,
    duration: "28 days",
    category: "FITNESS",
    isVip: false,
  },
  {
    id: "7",
    name: "Daily Exercise Challenge",
    desc: "Commit to at least 30 minutes of exercise daily, including running, gym, yoga, and other activities...",
    participants: 6,
    duration: "7 days",
    category: "FITNESS",
    isVip: false,
  },
  {
    id: "8",
    name: "Daily Reading Challenge",
    desc: "Commit to reading at least 30 minutes daily, develop good reading habits, enhance knowledge and thinking",
    participants: 10,
    duration: "7 days",
    category: "LEARNING",
    isVip: false,
  },
  {
    id: "9",
    name: "Language Learning Check-in (VIP)",
    desc: "Commit to 30 minutes of foreign language study daily, VIP users enjoy progress analysis and personalized suggestions",
    participants: 20,
    duration: "14 days",
    category: "LEARNING",
    isVip: true,
    isBasic: true,
  },
  {
    id: "10",
    name: "Advanced Fitness Tracking (VIP)",
    desc: "Professional fitness challenge with detailed data tracking and personalized recommendations, VIP exclusive features",
    participants: 20,
    duration: "14 days",
    category: "FITNESS",
    isVip: true,
    isBasic: true,
  },
]

const categories = ["All Categories", "LEARNING", "PERSONAL", "WORK", "LIFESTYLE", "FITNESS", "HEALTH", "VIP Template"]

export function TemplatesScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("All Categories")
  const [showVipOnly, setShowVipOnly] = useState(false)

  const filteredTemplates = templates.filter((t) => {
    if (showVipOnly && !t.isVip) return false
    if (category === "VIP Template" && !t.isVip) return false
    if (category !== "All Categories" && category !== "VIP Template" && t.category !== category) return false
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const getHeaderColor = (template: (typeof templates)[0]) => {
    if (template.isSelected) return "bg-blue-500/10 border-t-4 border-t-blue-500"
    if (template.isVip) return "bg-amber-500/10 border-t-4 border-t-amber-500"

    switch (template.category) {
      case "LEARNING":
        return "bg-purple-500/10 border-t-4 border-t-purple-500"
      case "PERSONAL":
        return "bg-green-500/10 border-t-4 border-t-green-500"
      case "WORK":
        return "bg-blue-500/10 border-t-4 border-t-blue-500"
      case "LIFESTYLE":
        return "bg-pink-500/10 border-t-4 border-t-pink-500"
      case "FITNESS":
        return "bg-orange-500/10 border-t-4 border-t-orange-500"
      case "HEALTH":
        return "bg-teal-500/10 border-t-4 border-t-teal-500"
      default:
        return "bg-gray-500/10 border-t-4 border-t-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-lg mx-auto px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/create">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-foreground">Select Game Template</h1>
          </div>
          <Badge className="bg-amber-100 text-amber-700 border-0">
            <Crown className="h-3 w-3 mr-1" />
            VIP Member
          </Badge>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={showVipOnly ? "default" : "outline"}
            onClick={() => setShowVipOnly(!showVipOnly)}
            className={showVipOnly ? "bg-amber-500 hover:bg-amber-600" : ""}
          >
            <Crown className="h-4 w-4 mr-2" />
            VIP Only
          </Button>
        </div>

        {/* Stats - translated */}
        <div className="flex gap-4 text-sm text-muted-foreground mb-6">
          <span>114 templates total</span>
          <span>Free templates: 107</span>
          <span className="text-amber-600">
            <Crown className="h-3 w-3 inline mr-1" />
            VIP templates: 7
          </span>
        </div>

        {/* Templates Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className={`border shadow-sm cursor-pointer transition-all hover:shadow-md ${
                template.isSelected ? "ring-2 ring-blue-500" : ""
              } ${getHeaderColor(template)}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {template.isSelected && (
                      <div className="p-1 bg-blue-500 rounded-full">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    {!template.isSelected && (
                      <Star
                        className={`h-5 w-5 ${template.isVip ? "text-amber-500 fill-amber-500" : "text-gray-400"}`}
                      />
                    )}
                  </div>
                  {template.isBasic && <Badge className="bg-blue-500 text-white border-0 text-xs">BASIC</Badge>}
                </div>
                <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{template.name}</h3>
                <p className="text-sm text-foreground/70 mb-3 line-clamp-2">{template.desc}</p>
                <div className="flex items-center justify-between text-xs text-foreground/60">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {template.participants}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {template.duration}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs border-foreground/20 text-foreground/70">
                    {template.category}
                  </Badge>
                </div>
                {template.isVip && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 font-medium">
                    <Crown className="h-3 w-3" />
                    <span>Requires VIP</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="pb-20 pt-8 text-center text-xs text-muted-foreground space-y-1">
        <p>ChallengeNo. Challenge? No pressure!</p>
        <p>© 2025 onFuture Studio</p>
      </footer>

      <BottomNav />
    </div>
  )
}
