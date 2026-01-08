import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface LiveClockProps {
  className?: string
  showDate?: boolean
  showSeconds?: boolean
  compact?: boolean
}

const LiveClock = ({ 
  className = '', 
  showDate = true, 
  showSeconds = true, 
  compact = false 
}: LiveClockProps) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    ...(showSeconds && { second: '2-digit' })
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  }

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Clock className="w-4 h-4 text-gray-500" />
        <span className="font-mono text-sm">
          {currentTime.toLocaleTimeString('zh-CN', timeOptions)}
        </span>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100 ${className}`}>
      <div className="flex items-center justify-center space-x-2 text-blue-600 mb-1">
        <Clock className="w-4 h-4" />
        <span className="text-xs font-medium">当前时间</span>
      </div>
      <div className="text-lg font-mono font-bold text-blue-800 text-center">
        {currentTime.toLocaleTimeString('zh-CN', timeOptions)}
      </div>
      {showDate && (
        <div className="text-xs text-blue-600 mt-1 text-center">
          {currentTime.toLocaleDateString('zh-CN', dateOptions)}
        </div>
      )}
    </div>
  )
}

export default LiveClock
