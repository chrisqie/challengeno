"use client"

import { useState } from "react"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Globe, Crown } from "lucide-react"

const myTeams = [
  {
    id: "1",
    name: "first",
    description: "No description",
    type: "Casual Team",
    members: 1,
    maxMembers: 10,
    isLeader: true,
  },
]

const discoverTeams = [
  {
    id: "2",
    name: "Fitness Warriors",
    description: "Daily workout challenges",
    type: "Fitness Team",
    members: 8,
    maxMembers: 20,
    isLeader: false,
  },
  {
    id: "3",
    name: "Book Club",
    description: "Read together, grow together",
    type: "Learning Team",
    members: 15,
    maxMembers: 30,
    isLeader: false,
  },
]

export function TeamsScreen() {
  const [activeTab, setActiveTab] = useState("my-teams")

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="container mx-auto px-4 py-6 pb-24 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-500" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Teams</h1>
                <p className="text-sm text-muted-foreground">Complete challenges with friends</p>
              </div>
            </div>
          </div>
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-xs px-3 h-8">
            Create Team
          </Button>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-transparent border-b w-full justify-start rounded-none h-auto p-0 mb-6">
                <TabsTrigger
                  value="my-teams"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-500 px-4 pb-3"
                >
                  My Teams
                </TabsTrigger>
                <TabsTrigger
                  value="discover"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-500 px-4 pb-3"
                >
                  Discover Teams
                </TabsTrigger>
              </TabsList>

              <TabsContent value="my-teams" className="mt-0">
                {myTeams.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>You haven't joined any teams yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myTeams.map((team) => (
                      <Card key={team.id} className="border shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">{team.name}</span>
                                {team.isLeader && (
                                  <Badge className="bg-amber-100 text-amber-700 border-0">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Leader
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{team.description}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Globe className="h-4 w-4" />
                                <span>{team.type}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                {team.members}/{team.maxMembers} members
                              </p>
                              <Link href={`/teams/${team.id}`}>
                                <Button variant="link" className="text-blue-500 p-0 h-auto mt-2">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="discover" className="mt-0">
                <div className="space-y-4">
                  {discoverTeams.map((team) => (
                    <Card key={team.id} className="border shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <span className="font-semibold text-foreground">{team.name}</span>
                            <p className="text-sm text-muted-foreground">{team.description}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Globe className="h-4 w-4" />
                              <span>{team.type}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {team.members}/{team.maxMembers} members
                            </p>
                            <Button
                              size="sm"
                              className="mt-2 text-blue-500 border-blue-500 bg-transparent hover:bg-blue-50 text-xs px-3 h-7"
                            >
                              Join Team
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <footer className="pt-8 pb-4 text-center">
        <p className="text-xs text-muted-foreground">ChallengeNo. Challenge? No pressure!</p>
        <p className="text-xs text-muted-foreground">© 2025 onFuture Studio</p>
      </footer>
      <BottomNav />
    </div>
  )
}
