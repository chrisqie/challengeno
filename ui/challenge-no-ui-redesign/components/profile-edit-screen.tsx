"use client"

import { useState } from "react"
import { ArrowLeft, Mail, User, MapPin, Calendar, Phone, Globe, Heart, X, Save, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"

const interests = [
  "Fitness & Sports",
  "Reading & Learning",
  "Music & Art",
  "Travel & Exploration",
  "Cooking & Food",
  "Tech & Digital",
  "Gaming",
  "Photography",
  "DIY & Crafts",
  "Gardening",
  "Pet Care",
  "Movies & TV",
  "Fashion & Style",
  "Finance & Investing",
  "Volunteering",
]

export function ProfileEditScreen() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [bio, setBio] = useState("")
  const [privacySettings, setPrivacySettings] = useState({
    showEmail: true,
    showPhone: false,
    showLocation: true,
    showBirthday: false,
    allowFriendRequests: true,
    allowGameInvites: true,
  })

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest))
    } else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interest])
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container max-w-lg mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Edit Profile</h1>
            <p className="text-sm text-muted-foreground">Complete your profile to help others know you better</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/50 p-6 space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-medium text-muted-foreground">Avatar</p>
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src="/squirrel-avatar.png" />
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/30 hover:bg-destructive/10 bg-transparent"
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
            <p className="text-xs text-muted-foreground">Supports JPG, PNG. Max 5MB</p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </label>
              <Input defaultValue="admin@bet-together.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name
              </label>
              <Input defaultValue="System Administrator" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Location
              </label>
              <Input placeholder="Enter city or region" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Birthday
              </label>
              <Input type="date" defaultValue="1990-01-01" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone Number
              </label>
              <Input placeholder="Enter phone number (optional)" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                Personal Website
              </label>
              <Input placeholder="https://example.com" />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 200))}
              className="min-h-[100px] resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">{bio.length}/200</p>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              Interests (Select up to 5)
            </label>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selectedInterests.includes(interest)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:border-primary/50"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Selected {selectedInterests.length}/5 interests</p>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Privacy Settings
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Show Email Address
                </span>
                <Switch
                  checked={privacySettings.showEmail}
                  onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, showEmail: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Show Phone Number
                </span>
                <Switch
                  checked={privacySettings.showPhone}
                  onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, showPhone: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Show Location
                </span>
                <Switch
                  checked={privacySettings.showLocation}
                  onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, showLocation: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Show Birthday
                </span>
                <Switch
                  checked={privacySettings.showBirthday}
                  onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, showBirthday: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Allow Friend Requests</span>
                <Switch
                  checked={privacySettings.allowFriendRequests}
                  onCheckedChange={(checked) =>
                    setPrivacySettings({ ...privacySettings, allowFriendRequests: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Allow Game Invites</span>
                <Switch
                  checked={privacySettings.allowGameInvites}
                  onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, allowGameInvites: checked })}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Link href="/profile">
              <Button variant="outline">
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </Link>
            <Button className="bg-primary">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          © 2025 ChallengeNo. Challenge? No pressure!
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
