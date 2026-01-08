"use client"

import { Heart, Users, Calendar, Clock, Share2, MapPin, Crown } from "lucide-react"
import { BottomNav } from "./bottom-nav"
import { cn } from "@/lib/utils"

const favorites = [
  {
    id: 1,
    title: "Daily Healthy Cooking",
    creator: "@xunpeihu",
    creatorLevel: 13,
    location: "Beijing China",
    description: "Cook one healthy meal daily to improve cooking skills and eating habits.",
    participants: "1/12",
    date: "2025-12-05",
    status: "Peer Review in Progress",
    statusColor: "text-amber-400",
    progress: 8,
    likes: 1,
    isVip: true,
  },
  {
    id: 2,
    title: "Creative Project Complete",
    creator: "@refer",
    creatorLevel: 10,
    location: "Singapore Singapore",
    description: "Complete a creative project: writing, drawing, music, etc.",
    participants: "1/6",
    date: "2025-12-01",
    status: "Game in Progress",
    statusColor: "text-emerald-400",
    progress: 17,
    likes: 3,
    isVip: false,
  },
]

export function FavoritesScreen() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <h1 className="text-xl font-bold text-foreground">My Favorite Challenges</h1>
        <p className="text-sm text-muted-foreground mt-1">View all your favorited challenges</p>
      </header>

      <main className="px-4 py-4">
        {/* Stats */}
        <div className="flex items-center gap-2 bg-card rounded-xl p-3 border border-border/50 mb-4">
          <Heart className="w-5 h-5 text-primary fill-primary" />
          <span className="text-sm text-foreground">Total {favorites.length} challenges favorited</span>
        </div>

        {/* Favorites list */}
        <div className="space-y-4">
          {favorites.map((challenge) => (
            <div key={challenge.id} className="bg-card rounded-xl border border-border/50 overflow-hidden">
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-lg">🎯</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{challenge.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{challenge.creator}</span>
                        {challenge.isVip && <Crown className="w-3 h-3 text-amber-400" />}
                        <span>· Trust Level {challenge.creatorLevel}</span>
                        <MapPin className="w-3 h-3" />
                        <span>{challenge.location}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={cn("text-xs font-medium px-2 py-1 rounded-full bg-secondary", challenge.statusColor)}
                  >
                    {challenge.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {challenge.participants}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {challenge.date}
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Participation Progress</span>
                    <span className="text-foreground">{challenge.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${challenge.progress}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                      <Heart className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-xs">{challenge.likes}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-emerald-400">
                      <Clock className="w-3.5 h-3.5" />
                      Started
                    </span>
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      <Share2 className="w-3.5 h-3.5" />
                      Game
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
