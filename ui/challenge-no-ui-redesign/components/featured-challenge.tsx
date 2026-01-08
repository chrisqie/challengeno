"use client"

import { Users, Trophy, ChevronRight } from "lucide-react"

interface FeaturedChallengeProps {
  id: string
  title: string
  subtitle: string
  participants: number
  coverImage: string
  prize: string
}

export function FeaturedChallenge({ title, subtitle, participants, coverImage, prize }: FeaturedChallengeProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden group cursor-pointer mt-4">
      {/* Background Image */}
      <div className="aspect-[16/9] relative">
        <img src={coverImage || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              FEATURED
            </span>
            <span className="px-2.5 py-1 bg-accent/90 text-accent-foreground text-xs font-bold rounded-full">
              {prize}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-white mb-1 leading-tight">{title}</h2>
          <p className="text-sm text-white/70 mb-3">{subtitle}</p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-black overflow-hidden">
                    <img
                      src={`/diverse-person-avatars.png?height=28&width=28&query=person avatar ${i}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <span className="text-white/80 text-sm flex items-center gap-1">
                <Users className="w-4 h-4" />
                {participants.toLocaleString()} joined
              </span>
            </div>

            <button className="flex items-center gap-1 text-white text-sm font-medium group-hover:text-primary transition-colors">
              Join Now
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
