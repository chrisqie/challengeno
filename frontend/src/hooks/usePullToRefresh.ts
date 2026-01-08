import { useState, useEffect, useRef, useCallback } from 'react'
import { useQueryClient } from 'react-query'

interface PullToRefreshOptions {
  onRefresh?: () => Promise<void>
  threshold?: number
  maxPullDistance?: number
  refreshQueries?: string[][]
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  maxPullDistance = 150,
  refreshQueries = []
}: PullToRefreshOptions = {}) => {
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const queryClient = useQueryClient()

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // 只在页面顶部时启用下拉刷新
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (startY.current === 0 || window.scrollY > 0) return

    const currentY = e.touches[0].clientY
    const distance = currentY - startY.current

    if (distance > 0) {
      setIsPulling(true)
      // 使用阻尼效果,拉得越远越难拉
      const dampedDistance = Math.min(
        distance * 0.5,
        maxPullDistance
      )
      setPullDistance(dampedDistance)

      // 防止页面滚动
      if (distance > 10) {
        e.preventDefault()
      }
    }
  }, [maxPullDistance])

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      
      try {
        // 执行自定义刷新函数
        if (onRefresh) {
          await onRefresh()
        }

        // 刷新指定的查询
        for (const queryKey of refreshQueries) {
          await queryClient.invalidateQueries(queryKey)
        }
      } catch (error) {
        console.error('刷新失败:', error)
      } finally {
        setIsRefreshing(false)
      }
    }

    setIsPulling(false)
    setPullDistance(0)
    startY.current = 0
  }, [pullDistance, threshold, isRefreshing, onRefresh, refreshQueries, queryClient])

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return {
    isPulling,
    isRefreshing,
    pullDistance,
    progress: Math.min(pullDistance / threshold, 1)
  }
}

