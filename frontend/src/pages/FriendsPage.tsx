import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { friendsAPI, messagesAPI, usersAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Users, UserPlus, Check, X, Trash2, MessageCircle, Search, Ban, Sparkles, Filter } from 'lucide-react'
import EnhancedFriendSearch from '../components/EnhancedFriendSearch'
import FriendRelationshipManager from '../components/FriendRelationshipManager'
import SmartFriendRecommendations from '../components/SmartFriendRecommendations'

export default function FriendsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'friends' | 'search' | 'recommendations'>('friends')
  const [searchUsername, setSearchUsername] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [friends, setFriends] = useState<any[]>([])
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [friendsFilter, setFriendsFilter] = useState<'all' | 'online' | 'vip'>('all')

  const { data: conversationsData } = useQuery(
    'conversations',
    () => messagesAPI.getConversationList(),
    {
      refetchInterval: 10000,
      select: (response) => response.data,
    }
  )

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
      toast.error(t('friends.loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // 获取好友的未读消息数
  const getUnreadCount = (friendId: string) => {
    if (!conversationsData) return 0
    const conversation = conversationsData.find((c: any) => c.friend.id === friendId)
    return conversation?.unreadCount || 0
  }

  // 搜索用户
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    try {
      setSearching(true)
      const response = await usersAPI.searchUsers(searchQuery.trim())
      setSearchResults(response.data || [])
    } catch (error: any) {
      console.error('搜索失败:', error)
      toast.error(t('friends.searchFailed'))
    } finally {
      setSearching(false)
    }
  }

  const handleSendRequest = async (username: string, userId: string) => {
    try {
      await friendsAPI.sendFriendRequest(username)
      toast.success(t('friends.requestSent'))

      setSearchResults(prevResults =>
        prevResults.map(user =>
          user.id === userId
            ? { ...user, friendshipStatus: 'pending_sent' }
            : user
        )
      )
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('friends.sendFailed'))
    }
  }

  const getFriendshipButton = (user: any) => {
    switch (user.friendshipStatus) {
      case 'accepted':
        return (
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
            {t('friends.status.alreadyFriends')}
          </span>
        )
      case 'pending_sent':
        return (
          <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">
            {t('friends.status.requestSent')}
          </span>
        )
      case 'pending_received':
        return (
          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
            {t('friends.status.pendingConfirm')}
          </span>
        )
      case 'blocked':
        return (
          <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium">
            {t('friends.status.cannotAdd')}
          </span>
        )
      default:
        return (
          <button
            onClick={() => handleSendRequest(user.username, user.id)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('friends.addFriend')}</span>
          </button>
        )
    }
  }

  const handleRespond = async (friendshipId: string, accept: boolean) => {
    try {
      await friendsAPI.respondToFriendRequest(friendshipId, accept)
      toast.success(accept ? t('friends.requestAccepted') : t('friends.requestRejected'))
      loadData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('friends.operationFailed'))
    }
  }

  const handleRemoveFriend = async (friendshipId: string) => {
    if (!confirm(t('friends.confirmRemove'))) return

    try {
      await friendsAPI.removeFriend(friendshipId)
      toast.success(t('friends.friendRemoved'))
      loadData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('friends.removeFailed'))
    }
  }

  const handleBlockUser = async (userId: string, username: string) => {
    if (!confirm(t('friends.confirmBlock', { username }))) return

    try {
      await friendsAPI.blockUser(userId)
      toast.success(t('friends.userBlocked'))
      loadData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('friends.blockFailed'))
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8 text-gray-500">{t('friends.loading')}</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">{t('friends.title')}</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/friends/recommendations')}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">{t('friends.recommendations')}</span>
          </button>
          <button
            onClick={() => navigate('/friends/blocked')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Ban className="w-4 h-4" />
            <span className="hidden sm:inline">{t('friends.blockedList')}</span>
          </button>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="card p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'friends'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t('friends.tabs.myFriends')}
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'recommendations'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-1" />
            {t('friends.tabs.recommended')}
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'search'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t('friends.tabs.search')}
          </button>
        </div>
      </div>

      {/* 推荐好友Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <SmartFriendRecommendations />
        </div>
      )}

      {/* 搜索用户Tab */}
      {activeTab === 'search' && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            {t('friends.advancedSearch')}
          </h2>
          <EnhancedFriendSearch />
        </div>
      )}



      {/* 好友列表Tab */}
      {activeTab === 'friends' && (
        <>
          {/* 待处理的好友请求 */}
          {pendingRequests && pendingRequests.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('friends.pendingRequests', { count: pendingRequests.length })}
          </h2>
          <div className="space-y-3">
            {pendingRequests.map((request: any) => (
              <div key={request.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200 space-y-3 sm:space-y-0">
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
                <div className="flex space-x-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleRespond(request.id, true)}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    title={t('friends.accept')}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRespond(request.id, false)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    title={t('friends.reject')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleBlockUser(request.requester.id, request.requester.username)}
                    className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    title={t('friends.block')}
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('friends.myFriendsList', { count: friends?.length || 0 })}
          </h2>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={friendsFilter}
              onChange={(e) => setFriendsFilter(e.target.value as 'all' | 'online' | 'vip')}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('friends.filters.all')}</option>
              <option value="vip">{t('friends.filters.vip')}</option>
              <option value="online">{t('friends.filters.online')}</option>
            </select>
          </div>
        </div>

        {friends && friends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friends
              .filter((friendship: any) => {
                if (friendsFilter === 'vip') return friendship.friend.isVip;
                if (friendsFilter === 'online') return friendship.friend.isOnline; // 需要后端支持
                return true;
              })
              .map((friendship: any) => (
                <FriendRelationshipManager
                  key={friendship.id}
                  friend={{
                    ...friendship.friend,
                    createdAt: friendship.createdAt
                  }}
                  onUpdate={loadData}
                />
              ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{t('friends.noFriends')}</p>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}
