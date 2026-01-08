import { useCallback } from 'react'
import { useQueryClient } from 'react-query'
import { useAuthStore } from '../stores/authStore'

/**
 * 积分刷新Hook - 专门处理积分实时更新
 */
export const usePointsRefresh = () => {
  const queryClient = useQueryClient()
  const { refreshUser } = useAuthStore()

  // 立即刷新积分（游戏操作后调用）
  const refreshPointsImmediately = useCallback(async () => {
    console.log('🔄 立即刷新积分数据...')

    try {
      // 1. 刷新用户数据
      await refreshUser()

      // 2. 清除相关查询缓存
      queryClient.invalidateQueries(['user-profile'])
      queryClient.invalidateQueries(['games'])
      queryClient.invalidateQueries(['my-games'])

      console.log('✅ 积分数据刷新完成')
    } catch (error) {
      console.error('❌ 积分数据刷新失败:', error)
    }
  }, [refreshUser, queryClient])

  // 延迟刷新积分（用于确保后端处理完成）
  const refreshPointsWithDelay = useCallback((delay: number = 2000) => {
    console.log(`⏰ ${delay}ms后刷新积分数据...`)

    setTimeout(() => {
      refreshPointsImmediately()
    }, delay)
  }, [refreshPointsImmediately])

  return {
    refreshPointsImmediately,
    refreshPointsWithDelay
  }
}
