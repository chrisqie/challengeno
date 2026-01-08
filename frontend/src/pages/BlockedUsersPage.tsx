import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { friendsAPI } from '../services/api'
import toast from 'react-hot-toast'
import { ArrowLeft, Ban, Unlock } from 'lucide-react'

export default function BlockedUsersPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // 获取屏蔽列表
  const { data: blockedUsers, isLoading } = useQuery(
    'blockedUsers',
    () => friendsAPI.getBlockedUsers(),
    {
      select: (response) => response.data,
    }
  )

  // 取消屏蔽
  const unblockMutation = useMutation(
    (userId: string) => friendsAPI.unblockUser(userId),
    {
      onSuccess: () => {
        toast.success('已取消屏蔽')
        queryClient.invalidateQueries('blockedUsers')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '操作失败')
      },
    }
  )

  const handleUnblock = (userId: string, username: string) => {
    if (confirm(`确定要取消屏蔽 @${username} 吗？`)) {
      unblockMutation.mutate(userId)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8 text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/friends')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回好友列表</span>
      </button>

      {/* 标题 */}
      <div className="flex items-center gap-3">
        <Ban className="w-8 h-8 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">屏蔽列表</h1>
      </div>

      {/* 屏蔽列表 */}
      <div className="card p-6">
        {blockedUsers && blockedUsers.length > 0 ? (
          <div className="space-y-3">
            {blockedUsers.map((item: any) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-red-50 rounded-lg border border-red-200 space-y-3 sm:space-y-0"
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate(`/user/${item.user.username}`)}
                    className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <span className="text-white font-medium">
                      {item.user.username.charAt(0).toUpperCase()}
                    </span>
                  </button>
                  <div>
                    <button
                      onClick={() => navigate(`/user/${item.user.username}`)}
                      className="font-medium text-gray-900 hover:text-primary-600 transition-colors"
                    >
                      @{item.user.username}
                    </button>
                    <p className="text-sm text-gray-600">{item.user.fullName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      屏蔽时间：{new Date(item.blockedAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleUnblock(item.user.id, item.user.username)}
                  disabled={unblockMutation.isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Unlock className="w-4 h-4" />
                  <span>取消屏蔽</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Ban className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">暂无屏蔽用户</p>
            <p className="text-sm text-gray-400 mt-2">
              屏蔽的用户将无法与您互动
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

