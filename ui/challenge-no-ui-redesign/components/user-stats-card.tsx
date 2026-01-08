"use client"

import { Trophy, Users, Target, Flame } from "lucide-react"
import { Card } from "@/components/ui/card"

interface UserStatsCardProps {
  username: string
  created: number
  joined: number
  completed: number
}

export function UserStatsCard({ username, created, joined, completed }: UserStatsCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative bg-gradient-to-br from-primary/95 via-primary/85 to-primary/90 p-6 min-h-40">
        {/* Decorative animated elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/8 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        {/* Corner accent */}
        <div className="absolute top-3 left-3 w-1 h-8 bg-accent/30 rounded-full" />
        <div className="absolute bottom-3 right-3 w-8 h-1 bg-accent/30 rounded-full" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-primary-foreground/70 text-sm font-medium tracking-wide uppercase">Welcome back</p>
              <h2 className="text-primary-foreground font-bold text-2xl mt-1">{username}</h2>
              <p className="text-primary-foreground/60 text-xs mt-1">Keep pushing your limits</p>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/80 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl hover:bg-white/15 transition-colors cursor-pointer">
              <Flame className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold">Streak</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatItem icon={Target} label="Created" value={created} />
            <StatItem icon={Users} label="Joined" value={joined} />
            <StatItem icon={Trophy} label="Completed" value={completed} />
          </div>
        </div>
      </div>
    </Card>
  )
}

function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target
  label: string
  value: number
}) {
  return (
    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 text-center border border-white/10 hover:bg-white/20 transition-colors">
      <Icon className="w-5 h-5 text-primary-foreground/90 mx-auto mb-2" />
      <p className="text-primary-foreground font-bold text-2xl">{value}</p>
      <p className="text-primary-foreground/70 text-xs font-medium mt-0.5">{label}</p>
    </div>
  )
}
