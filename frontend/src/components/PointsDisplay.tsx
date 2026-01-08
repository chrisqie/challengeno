import React, { useEffect, useState } from 'react'
import { Trophy, Star, Target } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

interface PointsDisplayProps {
  className?: string
  showLabels?: boolean
  layout?: 'horizontal' | 'vertical' | 'grid'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * 积分显示组件 - 自动刷新积分数据
 */
const PointsDisplay: React.FC<PointsDisplayProps> = ({
  className = '',
  showLabels = true,
  layout = 'horizontal',
  size = 'md'
}) => {
  const { user, refreshUser } = useAuthStore()
  const [lastRefresh, setLastRefresh] = useState(Date.now())

  // 定期刷新积分数据
  useEffect(() => {
    if (!user) return

    const interval = setInterval(async () => {
      await refreshUser()
      setLastRefresh(Date.now())
    }, 30000) // 每30秒刷新一次

    return () => clearInterval(interval)
  }, [user, refreshUser])

  // 监听积分变化
  useEffect(() => {
    if (user) {
      console.log('积分数据更新:', {
        participation: user.participationPoints,
        trust: user.trustPoints,
        labor: user.laborPoints,
        timestamp: new Date().toLocaleTimeString()
      })
    }
  }, [user?.participationPoints, user?.trustPoints, user?.laborPoints])

  if (!user) return null

  const sizeClasses = {
    sm: {
      icon: 'w-4 h-4',
      text: 'text-sm',
      value: 'text-lg font-semibold',
      container: 'p-2'
    },
    md: {
      icon: 'w-5 h-5',
      text: 'text-sm',
      value: 'text-xl font-bold',
      container: 'p-3'
    },
    lg: {
      icon: 'w-6 h-6',
      text: 'text-base',
      value: 'text-2xl font-bold',
      container: 'p-4'
    }
  }

  const currentSize = sizeClasses[size]

  const points = [
    {
      label: '参与积分',
      value: user.participationPoints,
      icon: Trophy,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: '信任积分',
      value: user.trustPoints,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: '劳动积分',
      value: user.laborPoints,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ]

  const layoutClasses = {
    horizontal: 'flex space-x-4',
    vertical: 'flex flex-col space-y-4',
    grid: 'grid grid-cols-3 gap-4'
  }

  return (
    <div className={`${layoutClasses[layout]} ${className}`}>
      {points.map(({ label, value, icon: Icon, color, bgColor }) => (
        <div
          key={label}
          className={`${bgColor} rounded-lg ${currentSize.container} text-center flex-1`}
        >
          <Icon className={`${currentSize.icon} mx-auto mb-2 ${color}`} />
          <div className={`${currentSize.value} text-gray-900`}>
            {value.toLocaleString()}
          </div>
          {showLabels && (
            <div className={`${currentSize.text} text-gray-500 mt-1`}>
              {label}
            </div>
          )}
        </div>
      ))}
      
      {/* 调试信息（开发模式下显示） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 mt-2">
          最后更新: {new Date(lastRefresh).toLocaleTimeString()}
        </div>
      )}
    </div>
  )
}

export default PointsDisplay
