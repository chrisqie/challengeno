"use client"

import { useState } from "react"
import { BottomNav } from "./bottom-nav"
import { HomeHeader } from "./home-header"
import { FeaturedChallenge } from "./featured-challenge"
import { QuickStats } from "./quick-stats"
import { CategoryFilter } from "./category-filter"
import { ChallengeCard } from "./challenge-card"
import { TrendingSection } from "./trending-section"
import { StatusFilter } from "./status-filter"

const challenges = [
  {
    id: "1",
    title: "30-Day Reading Sprint",
    author: "Sarah K.",
    authorAvatar: "/professional-woman-avatar.png",
    participants: ["/young-man-avatar.png", "/woman-glasses-avatar.jpg", "/man-beard-avatar.png"],
    participantCount: 847,
    category: "Learning",
    progress: 68,
    status: "active" as const,
    likes: 234,
    comments: 56,
    coverImage: "/cozy-reading-books-coffee-aesthetic.jpg",
    daysLeft: 12,
    isHot: true,
  },
  {
    id: "2",
    title: "Morning Yoga Flow",
    author: "Alex Chen",
    authorAvatar: "/asian-man-fitness-avatar.jpg",
    participants: ["/fitness-woman-avatar.png", "/yoga-instructor-avatar.png", "/athletic-man-avatar.jpg"],
    participantCount: 1203,
    category: "Fitness",
    progress: 45,
    status: "active" as const,
    likes: 567,
    comments: 89,
    coverImage: "/sunrise-yoga-peaceful-morning-nature.jpg",
    daysLeft: 18,
    isHot: false,
  },
  {
    id: "3",
    title: "Zero Waste Week",
    author: "Emma Green",
    authorAvatar: "/eco-friendly-woman-avatar.jpg",
    participants: ["/environmental-activist-avatar.jpg", "/young-eco-avatar.jpg"],
    participantCount: 432,
    category: "Lifestyle",
    progress: 100,
    status: "ended" as const,
    likes: 189,
    comments: 34,
    coverImage: "/sustainable-living-eco-friendly-nature-green.jpg",
    daysLeft: 0,
    isHot: false,
  },
  {
    id: "4",
    title: "Learn Spanish Daily",
    author: "Miguel R.",
    authorAvatar: "/hispanic-man-teacher-avatar.jpg",
    participants: ["/student-woman-avatar.jpg", "/language-learner-avatar.jpg", "/young-professional-avatar.png"],
    participantCount: 2156,
    category: "Learning",
    progress: 23,
    status: "active" as const,
    likes: 892,
    comments: 167,
    coverImage: "/spanish-culture-books-learning-colorful.jpg",
    daysLeft: 45,
    isHot: true,
  },
]

const featuredChallenge = {
  id: "featured",
  title: "New Year Fitness Challenge",
  subtitle: "Transform your body in 90 days",
  participants: 12453,
  coverImage: "/fitness-motivation-workout-gym-dark-athletic.jpg",
  prize: "$500 Prize Pool",
}

export function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeStatus, setActiveStatus] = useState("all")
  const [activeLocation, setActiveLocation] = useState("all")

  const filteredChallenges =
    activeCategory === "all" ? challenges : challenges.filter((c) => c.category.toLowerCase() === activeCategory)

  return (
    <div className="min-h-screen bg-background pb-24">
      <HomeHeader />

      <main className="px-4 space-y-6 max-w-lg mx-auto">
        {/* Featured Challenge Hero */}
        <FeaturedChallenge {...featuredChallenge} />

        {/* Quick Stats */}
        <QuickStats streak={7} completed={12} rank={156} />

        {/* Trending Section */}
        <TrendingSection />

        {/* Category Filter */}
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

        {/* Status and Location Filter */}
        <StatusFilter
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          activeLocation={activeLocation}
          onLocationChange={setActiveLocation}
        />

        {/* Challenge Feed */}
        <section className="space-y-4 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Discover Challenges</h2>
            <button className="text-sm text-primary font-medium">See All</button>
          </div>
          {filteredChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} {...challenge} />
          ))}
        </section>

        <footer className="text-center py-6 space-y-1">
          <p className="text-xs text-muted-foreground/70">ChallengeNo. Challenge? No pressure!</p>
          <p className="text-xs text-muted-foreground/50">© 2025 onFuture Studio</p>
        </footer>
      </main>

      <BottomNav />
    </div>
  )
}
