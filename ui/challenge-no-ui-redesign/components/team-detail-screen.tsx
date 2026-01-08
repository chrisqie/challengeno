"use client"

import { useState } from "react"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { AppFooter } from "@/components/app-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Globe, Users, Settings, Trophy, Gamepad2, Crown } from "lucide-react"

const teamData = {
  name: "first",
  type: "Casual Team",
  members: 1,
  maxMembers: 10,
  recentGames: 0,
  createdAt: "2025/12/6",
  memberList: [{ id: "1", name: "John Doe", joinedAt: "2025/12/6", isLeader: true }],
}

export function TeamDetailScreen() {
  const [activeTab, setActiveTab] = useState("info")

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto px-4 py-6 pb-24 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/teams">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Team Details</h1>
        </div>

        {/* Team Header Card */}
        <Card className="border-0 shadow-sm mb-6 bg-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Globe className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{teamData.name}</h2>
                  <p className="text-sm text-muted-foreground">{teamData.type}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>

            {/* Stats - split into 2 rows */}
            <div className="mb-6">
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-500">{teamData.members}</p>
                  <p className="text-xs text-muted-foreground">Members</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-500">{teamData.maxMembers}</p>
                  <p className="text-xs text-muted-foreground">Max</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-500">{teamData.recentGames}</p>
                  <p className="text-xs text-muted-foreground">Recent</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-500">{teamData.createdAt}</p>
                  <p className="text-xs text-muted-foreground">Date</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-500">Active</p>
                  <p className="text-xs text-muted-foreground">Created</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Users className="h-4 w-4 mr-2" />
                Invite
              </Button>
              <Button variant="outline" className="border-border/50 bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-transparent border-b w-full justify-start rounded-none h-auto p-0 mb-6">
                <TabsTrigger
                  value="info"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-500 px-4 pb-3"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Info
                </TabsTrigger>
                <TabsTrigger
                  value="games"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-500 px-4 pb-3 data-[state=inactive]:border-border/30"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Games
                </TabsTrigger>
                <TabsTrigger
                  value="available"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-500 px-4 pb-3 data-[state=inactive]:border-border/30"
                >
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  Available
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-0">
                <h3 className="font-semibold text-foreground mb-4">Team Members</h3>
                <div className="space-y-3">
                  {teamData.memberList.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            <Users className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{member.name}</span>
                            {member.isLeader && (
                              <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">
                                <Crown className="h-3 w-3 mr-1" />
                                Leader
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">Joined: {member.joinedAt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="games" className="mt-0">
                <div className="text-center py-12 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No team games yet</p>
                </div>
              </TabsContent>

              <TabsContent value="available" className="mt-0">
                <div className="text-center py-12 text-muted-foreground">
                  <Gamepad2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No available games</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <AppFooter />
      <BottomNavigation />
    </div>
  )
}
