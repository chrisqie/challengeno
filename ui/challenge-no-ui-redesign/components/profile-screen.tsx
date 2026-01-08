"use client"

import {
  Trophy,
  Star,
  Calendar,
  Users,
  Clock,
  Heart,
  BarChart3,
  Crown,
  Zap,
  Award,
  MapPin,
  Mail,
  Edit,
  Gamepad2,
  Diamond,
  Shield,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { AppHeader } from "@/components/app-header"
import { BottomNavigation as BottomNav } from "@/components/bottom-navigation"
import { AppFooter } from "@/components/app-footer"

export function ProfileScreen() {
  const user = {
    name: "System Administrator",
    username: "@admin",
    email: "admin@bet-together.com",
    location: "Chiyoda City, Tokyo, Japan",
    countryCode: "JP",
    avatar: "/squirrel-avatar.png",
    isVip: true,
    isDiamond: true,
    vipExpiry: "2025/10/13",
    joinedDate: "2025/9/12",
    level: 14,
    levelProgress: 66,
    pointsToNextLevel: 34,
  }

  const profileStats = [
    { label: "Trust Points", value: 1001, icon: Trophy, color: "text-amber-500", bgColor: "bg-amber-500/15" },
    { label: "Games Joined", value: 4, icon: Gamepad2, color: "text-blue-500", bgColor: "bg-blue-500/15" },
    { label: "Friends", value: 0, icon: Users, color: "text-emerald-500", bgColor: "bg-emerald-500/15" },
    { label: "Achievements", value: 0, icon: Star, color: "text-purple-500", bgColor: "bg-purple-500/15" },
  ]

  const recentActivity: { action: string; name: string; date: string }[] = []

  const pointsStats = [
    { label: "Participation Points", value: 1366, icon: Trophy, color: "text-blue-500" },
    { label: "Trust Points", value: 1002, icon: Star, color: "text-amber-500" },
    { label: "Labor Points", value: 1235, icon: Award, color: "text-emerald-500" },
  ]

  const challengeStats = [
    { label: "Created", value: 9, color: "text-blue-600", bgColor: "bg-blue-500/15" },
    { label: "Joined", value: 4, color: "text-emerald-600", bgColor: "bg-emerald-500/15" },
    { label: "Completed", value: 0, color: "text-amber-600", bgColor: "bg-amber-500/15" },
  ]

  const activityStats = [
    { label: "Days Since Joined", value: 84, icon: Calendar, bgColor: "bg-blue-500/15", iconColor: "text-blue-500" },
    { label: "Daily Average", value: "0.2", icon: Users, bgColor: "bg-emerald-500/15", iconColor: "text-emerald-500" },
    { label: "Total Points", value: 3603, icon: Trophy, bgColor: "bg-amber-500/15", iconColor: "text-amber-500" },
    { label: "Current Level", value: 14, icon: Clock, bgColor: "bg-orange-500/15", iconColor: "text-orange-500" },
  ]

  const achievements = [
    { name: "Points Star", description: "Total points reached 1000", rarity: "Rare", icon: Star },
    { name: "Veteran User", description: "Registered for over 30 days", rarity: "Rare", icon: Award },
  ]

  const quickLinks = [
    {
      label: "Points Statistics",
      description: "View detailed points data",
      href: "/points/stats",
      icon: BarChart3,
      color: "text-blue-500",
      bgColor: "bg-blue-500/15",
    },
    {
      label: "Leaderboard",
      description: "View community rankings",
      href: "/leaderboard",
      icon: Crown,
      color: "text-amber-500",
      bgColor: "bg-amber-500/15",
    },
    {
      label: "My Favorites",
      description: "View favorite challenges",
      href: "/my-games?tab=favorites",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-500/15",
    },
    {
      label: "Dispute Records",
      description: "View and manage disputes",
      href: "/disputes",
      icon: Zap,
      color: "text-orange-500",
      bgColor: "bg-orange-500/15",
    },
  ]

  return (
    <div className="min-h-screen bg-muted pb-24">
      <AppHeader />

      <main className="px-4 space-y-4 max-w-lg mx-auto py-6">
        {/* Profile Header Card */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          {/* Purple Gradient Banner */}
          <div className="relative h-28 bg-gradient-to-r from-violet-500 via-purple-500 to-violet-400">
            <div className="absolute -bottom-10 left-4">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-card shadow-lg">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                {user.isVip && (
                  <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 shadow">
                    <Star className="h-3 w-3 fill-white text-white" />
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-3 right-3">
              <Link href="/profile/edit">
                <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90 h-8 text-xs">
                  <Edit className="h-3.5 w-3.5" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* User Info */}
          <div className="pt-14 pb-4 px-4">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
              {user.isDiamond && (
                <span className="flex items-center gap-1 rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-600">
                  <Diamond className="h-3 w-3" />
                  Diamond
                </span>
              )}
              {user.isVip && (
                <span className="flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-medium text-white">
                  <Star className="h-3 w-3 fill-white" />
                  VIP
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{user.username}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span className="font-medium">{user.countryCode}</span>
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          {profileStats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border border-border/50 p-3 text-center">
              <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border/50 p-4">
          <h3 className="font-semibold text-foreground mb-3">Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-foreground text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.name}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.date}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <Gamepad2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">No recent activity</p>
              <p className="text-xs text-muted-foreground">
                Your activity records will appear here after joining games
              </p>
            </div>
          )}
        </div>

        {/* Privacy Protection Banner */}
        <div className="bg-primary/10 rounded-xl p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground text-sm">Privacy Protection</h4>
            <p className="text-xs text-muted-foreground">
              You can control which information is visible to other users when editing your profile.
            </p>
          </div>
        </div>

        {/* Points Statistics */}
        <div className="bg-card rounded-xl border border-border/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Points Statistics</h3>
            <Link href="/points/history" className="text-xs text-primary font-medium flex items-center gap-0.5">
              View History
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {pointsStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`flex items-center justify-center gap-1 ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                  <span className="text-lg font-bold">{stat.value}</span>
                </div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Challenge Statistics */}
        <div className="bg-card rounded-xl border border-border/50 p-4">
          <h3 className="font-semibold text-foreground mb-3">Challenge Statistics</h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {challengeStats.map((stat) => (
              <div key={stat.label} className={`rounded-lg ${stat.bgColor} p-3 text-center`}>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Completion Rate</span>
              <span className="font-medium text-foreground">0%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "0%" }} />
            </div>
          </div>
        </div>

        {/* Activity Statistics */}
        <div className="bg-card rounded-xl border border-border/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">Activity Statistics</h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {activityStats.map((stat) => (
              <div key={stat.label} className={`rounded-lg ${stat.bgColor} p-2.5 text-center`}>
                <stat.icon className={`mx-auto mb-1 h-4 w-4 ${stat.iconColor}`} />
                <p className="text-base font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="bg-card rounded-xl border border-border/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Achievement Badges</h3>
            <span className="text-xs text-muted-foreground">2 / 2 Unlocked</span>
          </div>
          <div className="space-y-2">
            {achievements.map((achievement) => (
              <div key={achievement.name} className="flex items-center justify-between rounded-lg bg-amber-500/10 p-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <achievement.icon className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    <span className="inline-block mt-1 rounded bg-purple-500/15 px-1.5 py-0.5 text-xs text-purple-600 font-medium">
                      {achievement.rarity}
                    </span>
                  </div>
                </div>
                <Award className="h-5 w-5 text-amber-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-card rounded-xl border border-border/50 p-4">
          <h3 className="font-semibold text-foreground mb-3">Quick Links</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-2.5 rounded-lg bg-secondary/50 p-3 transition-colors hover:bg-secondary"
              >
                <div className={`w-8 h-8 rounded-lg ${link.bgColor} flex items-center justify-center`}>
                  <link.icon className={`h-4 w-4 ${link.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{link.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* User Level */}
        <div className="bg-card rounded-xl border border-border/50 p-4">
          <h3 className="font-semibold text-foreground mb-3">User Level</h3>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {user.level}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium text-foreground">Level {user.level}</span>
                <span className="text-muted-foreground text-xs">{user.levelProgress}/100</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${user.levelProgress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{user.pointsToNextLevel} points to next level</p>
            </div>
          </div>
        </div>

        <footer className="pt-8 pb-4 text-center">
          <p className="text-xs text-muted-foreground">ChallengeNo. Challenge? No pressure!</p>
          <p className="text-xs text-muted-foreground">© 2025 onFuture Studio</p>
        </footer>
      </main>

      <AppFooter />
      <BottomNav />
    </div>
  )
}
