"use client"

import { useState } from "react"
import { ArrowLeft, Shield, Eye, Users, Database, Globe, Lock, Save } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { AppHeader } from "@/components/app-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { AppFooter } from "@/components/app-footer"

type VisibilityOption = "public" | "friends" | "private"

export function PrivacySettingsScreen() {
  const [profileVisibility, setProfileVisibility] = useState<VisibilityOption>("public")
  const [gameHistoryVisibility, setGameHistoryVisibility] = useState<VisibilityOption>("friends")
  const [socialSettings, setSocialSettings] = useState({
    allowFriendRequests: true,
    allowGameInvites: true,
    showOnlineStatus: true,
    allowPrivateMessages: true,
  })
  const [dataSettings, setDataSettings] = useState({
    dataCollection: true,
    marketingEmails: false,
  })

  const visibilityOptions: { value: VisibilityOption; label: string; icon: typeof Globe }[] = [
    { value: "public", label: "Public", icon: Globe },
    { value: "friends", label: "Friends Only", icon: Users },
    { value: "private", label: "Private", icon: Lock },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      <main className="container mx-auto max-w-3xl px-4 py-6 pb-24">
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href="/settings" className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <div>
              <h1 className="text-xl font-bold text-slate-900">Privacy Settings</h1>
              <p className="text-sm text-slate-500">Manage your privacy and data settings</p>
            </div>
          </div>
        </div>

        {/* Visibility Settings */}
        <Card className="mb-4 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-slate-900">Visibility Settings</h3>
            </div>

            {/* Profile Visibility */}
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-slate-700">Profile Visibility</p>
              <div className="grid grid-cols-3 gap-2">
                {visibilityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setProfileVisibility(option.value)}
                    className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
                      profileVisibility === option.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <option.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-slate-500">Control whether others can view your personal information</p>
            </div>

            {/* Game History Visibility */}
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Game History Visibility</p>
              <div className="grid grid-cols-3 gap-2">
                {visibilityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setGameHistoryVisibility(option.value)}
                    className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
                      gameHistoryVisibility === option.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <option.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Control whether others can view your game participation history
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Social Settings */}
        <Card className="mb-4 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-slate-900">Social Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Allow Friend Requests</p>
                  <p className="text-sm text-slate-500">Others can send you friend requests</p>
                </div>
                <Switch
                  checked={socialSettings.allowFriendRequests}
                  onCheckedChange={(checked) => setSocialSettings({ ...socialSettings, allowFriendRequests: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Allow Game Invites</p>
                  <p className="text-sm text-slate-500">Others can invite you to join games</p>
                </div>
                <Switch
                  checked={socialSettings.allowGameInvites}
                  onCheckedChange={(checked) => setSocialSettings({ ...socialSettings, allowGameInvites: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Show Online Status</p>
                  <p className="text-sm text-slate-500">Others can see if you are online</p>
                </div>
                <Switch
                  checked={socialSettings.showOnlineStatus}
                  onCheckedChange={(checked) => setSocialSettings({ ...socialSettings, showOnlineStatus: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Allow Private Messages</p>
                  <p className="text-sm text-slate-500">Others can send you private messages</p>
                </div>
                <Switch
                  checked={socialSettings.allowPrivateMessages}
                  onCheckedChange={(checked) => setSocialSettings({ ...socialSettings, allowPrivateMessages: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Settings */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-slate-900">Data Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Data Collection</p>
                  <p className="text-sm text-slate-500">Allow collecting usage data to improve services</p>
                </div>
                <Switch
                  checked={dataSettings.dataCollection}
                  onCheckedChange={(checked) => setDataSettings({ ...dataSettings, dataCollection: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Marketing Emails</p>
                  <p className="text-sm text-slate-500">Receive product updates and marketing information</p>
                </div>
                <Switch
                  checked={dataSettings.marketingEmails}
                  onCheckedChange={(checked) => setDataSettings({ ...dataSettings, marketingEmails: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </main>

      <AppFooter />
      <BottomNavigation />
    </div>
  )
}
