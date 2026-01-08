"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Trophy, Gift, Settings, LogOut } from "lucide-react"

interface UserDropdownProps {
  user: {
    name: string
    username: string
    avatar?: string
    isVip?: boolean
  }
}

export function UserDropdown({ user }: UserDropdownProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const menuItems = [
    { icon: <Trophy className="w-5 h-5" />, label: "Achievements", href: "/achievements" },
    { icon: <Gift className="w-5 h-5" />, label: "Referral", href: "/referral" },
    { icon: <Settings className="w-5 h-5" />, label: "My Profile", href: "/profile" },
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-border hover:border-primary transition-colors"
      >
        {user.avatar ? (
          <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-card rounded-xl border border-border shadow-lg overflow-hidden z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{user.name}</span>
              {user.isVip && <span className="text-amber-500">👑</span>}
            </div>
            <p className="text-sm text-muted-foreground">{user.username}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  router.push(item.href)
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-foreground hover:bg-muted transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-border py-2">
            <button
              onClick={() => {
                // Handle logout
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-muted transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
