"use client"

import { useState, useRef, useEffect } from "react"
import { Globe, Check } from "lucide-react"

interface Language {
  code: string
  name: string
  nativeName: string
}

const languages: Language[] = [
  { code: "US", name: "English", nativeName: "English" },
  { code: "ES", name: "Español", nativeName: "Spanish" },
  { code: "JP", name: "日本語", nativeName: "Japanese" },
]

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(languages[0])
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Globe className="w-5 h-5" />
        <span className="text-xs text-muted-foreground">{selected.code.toLowerCase()}</span>
        <span>{selected.name}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-card rounded-xl border border-border shadow-lg overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setSelected(lang)
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
            >
              <span className="text-sm font-medium text-muted-foreground w-6">{lang.code}</span>
              <div className="flex-1">
                <p className="font-medium text-foreground">{lang.name}</p>
                <p className="text-xs text-muted-foreground">{lang.nativeName}</p>
              </div>
              {selected.code === lang.code && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
