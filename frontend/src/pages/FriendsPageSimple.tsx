import React, { useState, useEffect } from 'react'
import { friendsAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Users, UserPlus, Check, X, Trash2 } from 'lucide-react'

export default function FriendsPage() {
  const [searchUsername, setSearchUsername] = useState('')
  const [friends, setFriends] = useState<any[]>([])
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 加载数据
  const loadData = async () => {
    try {
      setLoading(true)
      const [friendsRes, requestsRes] = await Promise.all([
        friendsAPI.getFriends(),
        friendsAPI.getPendingRequests()
      ])
      setFriends(friendsRes.data || [])
      setPendingRequests(requestsRes.data || [])
    } catch (error: any) {
      console.error('加载数据失败:', error)
      toast.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // 发送好友请求
  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchUsername.trim()) return

    try {
      await friendsAPI.sendFriendRequest(searchUsername.trim())
      toast.success('好友请求已发送！')
      setSearchUsername('')
    } catch (error: any) {
      toast.error(error.response?.data?.message || '发送失败')
    }
  }

  // 响应好友请求
  const handleRespond = async (friendshipId: string, accept: boolean) => {
    try {
      await friendsAPI.respondToFriendRequest(friendshipId, accept)
      toast.success(accept ? '已接受好友请求！' : '已拒绝好友请求')
      loadData() // 重新加载数据
    } catch (error: any) {
      toast.error(error.response?.data?.message || '操作失败')
    }
  }

  // 删除好友
  const handleRemoveFriend = async (friendshipId: string) => {
    try {
      await friendsAPI.removeFriend(friendshipId)
      toast.success('已删除好友')
      loadData() // 重新加载数据
    } catch (error: any) {
      toast.error(error.response?.data?.message || '删除失败')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8 text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Users className="w-8 h-8 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">好友管理</h1>
      </div>

      {/* 添加好友 */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">添加好友</h2>
        <form onSubmit={handleSendRequest} className="flex space-x-3">
          <input
            type="text"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            placeholder="输入用户名"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!searchUsername.trim()}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>发送请求</span>
          </button>
        </form>
      </div>

      {/* 待处理的好友请求 */}
      {pendingRequests && pendingRequests.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            待处理请求 ({pendingRequests.length})
          </h2>
          <div className="space-y-3">
            {pendingRequests.map((request: any) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {request.requester.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">@{request.requester.username}</p>
                    <p className="text-sm text-gray-500">{request.requester.fullName}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRespond(request.id, true)}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRespond(request.id, false)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 好友列表 */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          我的好友 ({friends?.length || 0})
        </h2>
        
        {friends && friends.length > 0 ? (
          <div className="space-y-3">
            {friends.map((friendship: any) => (
              <div key={friendship.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {friendship.friend.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">@{friendship.friend.username}</p>
                    <p className="text-sm text-gray-500">{friendship.friend.fullName}</p>
                    <p className="text-xs text-gray-400">信任度: {friendship.friend.trustPoints}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFriend(friendship.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>还没有好友，快去添加一些吧！</p>
          </div>
        )}
      </div>
    </div>
  )
}
