import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { friendsAPI } from '../services/api'
import toast from 'react-hot-toast'
import { ArrowLeft, UserPlus, Users as UsersIcon, Sparkles } from 'lucide-react'

export default function FriendRecommendationsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // 获取好友推荐
  const { data: recommendations, isLoading } = useQuery(
    'friendRecommendations',
    () => friendsAPI.getFriendRecommendations(),
    {
      select: (response) => response.data,
    }
  )

  // 发送好友请求
  const sendRequestMutation = useMutation(
    (username: string) => friendsAPI.sendFriendRequest(username),
    {
      onSuccess: () => {
        toast.success('好友请求已发送！')
        queryClient.invalidateQueries('friendRecommendations')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '发送失败')
      },
    }
  )

  const getReasonText = (reason: string, mutualFriends: number) => {
    if (reason === 'mutual_friends') {
      return `${mutualFriends} 个共同好友`
    } else if (reason === 'high_trust') {
      return '高信任度用户'
    }
    return '推荐用户'
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
        <Sparkles className="w-8 h-8 text-yellow-500" />
        <h1 className="text-2xl font-bold text-gray-900">好友推荐</h1>
      </div>

      {/* 推荐列表 */}
      <div className="card p-6">
        <p className="text-gray-600 mb-6">
          根据共同好友、游戏参与情况和信任度为您推荐以下用户
        </p>

        {recommendations && recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((user: any) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 space-y-3 sm:space-y-0"
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate(`/user/${user.username}`)}
                    className="w-12 h-12 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <span className="text-white text-lg font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/user/${user.username}`)}
                        className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                      >
                        @{user.username}
                      </button>
                      {user.isVip && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                          VIP
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{user.fullName}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-blue-600 font-medium">
                        {getReasonText(user.reason, user.mutualFriends)}
                      </span>
                      <span className="text-xs text-gray-500">
                        信任度: {user.trustPoints}
                      </span>
                      <span className="text-xs text-gray-500">
                        创建: {user.totalGamesCreated}
                      </span>
                      <span className="text-xs text-gray-500">
                        参与: {user.totalGamesJoined}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => sendRequestMutation.mutate(user.username)}
                  disabled={sendRequestMutation.isLoading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>添加好友</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UsersIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">暂无推荐用户</p>
            <p className="text-sm text-gray-400 mt-2">
              多参与游戏、添加好友，我们会为您推荐更多志同道合的伙伴
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

