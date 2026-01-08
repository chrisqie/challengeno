import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { usersAPI, friendsAPI } from '../services/api'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  UserPlus,
  MessageCircle,
  Trophy,
  Users,
  Calendar,
  Award,
  Ban,
  UserMinus,
  Crown
} from 'lucide-react'

export default function UserProfilePage() {
  const { t } = useTranslation()
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // 获取用户信息
  const { data: userData, isLoading } = useQuery(
    ['user', username],
    () => usersAPI.getUserByUsername(username!),
    {
      enabled: !!username,
      select: (response) => response.data,
    }
  )

  // 获取好友关系状态
  const { data: friendshipData } = useQuery(
    ['friendship', userData?.id],
    () => friendsAPI.checkFriendship(userData!.id),
    {
      enabled: !!userData?.id,
      select: (response) => response.data,
    }
  )

  // 发送好友请求
  const sendRequestMutation = useMutation(
    () => friendsAPI.sendFriendRequest(username!),
    {
      onSuccess: () => {
        toast.success('好友请求已发送！')
        queryClient.invalidateQueries(['friendship', userData?.id])
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '发送失败')
      },
    }
  )

  // 删除好友
  const removeFriendMutation = useMutation(
    () => friendsAPI.removeFriend(friendshipData!.friendshipId),
    {
      onSuccess: () => {
        toast.success('已删除好友')
        queryClient.invalidateQueries(['friendship', userData?.id])
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '删除失败')
      },
    }
  )

  // 屏蔽用户
  const blockUserMutation = useMutation(
    () => friendsAPI.blockUser(userData!.id),
    {
      onSuccess: () => {
        toast.success(t('userProfile.blockSuccess'))
        queryClient.invalidateQueries(['friendship', userData?.id])
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || t('userProfile.blockFailed'))
      },
    }
  )

  const handleSendMessage = () => {
    if (friendshipData?.isFriend) {
      navigate(`/chat/${userData?.id}`)
    } else {
      toast.error(t('userProfile.friendsOnlyMessage'))
    }
  }

  const handleRemoveFriend = () => {
    if (confirm(t('userProfile.confirmRemoveFriend'))) {
      removeFriendMutation.mutate()
    }
  }

  const handleBlockUser = () => {
    if (confirm(t('userProfile.confirmBlock', { username }))) {
      blockUserMutation.mutate()
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8 text-gray-500">{t('common.loading')}</div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8 text-gray-500">用户不存在</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回</span>
      </button>

      {/* 用户头部 */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* 头像 */}
          <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white text-4xl font-bold">
              {userData.username.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* 用户信息 */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl font-bold text-gray-900">
                @{userData.username}
              </h1>
              {userData.isVip && (
                <Crown className="w-6 h-6 text-yellow-500" />
              )}
            </div>
            <p className="text-lg text-gray-600 mt-1">{userData.fullName}</p>
            
            {/* 统计数据 */}
            <div className="flex items-center gap-6 mt-4 justify-center sm:justify-start">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {userData.trustPoints}
                </div>
                <div className="text-sm text-gray-500">信任度</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {userData.totalGamesCreated}
                </div>
                <div className="text-sm text-gray-500">创建游戏</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {userData.totalGamesJoined}
                </div>
                <div className="text-sm text-gray-500">参与游戏</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {userData.gamesCompleted}
                </div>
                <div className="text-sm text-gray-500">完成游戏</div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-3 mt-6">
          {friendshipData?.isFriend ? (
            <>
              <button
                onClick={handleSendMessage}
                className="flex-1 sm:flex-none px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>发送消息</span>
              </button>
              <button
                onClick={handleRemoveFriend}
                disabled={removeFriendMutation.isLoading}
                className="flex-1 sm:flex-none px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <UserMinus className="w-4 h-4" />
                <span>删除好友</span>
              </button>
            </>
          ) : friendshipData?.status === 'PENDING' ? (
            <button
              disabled
              className="flex-1 sm:flex-none px-6 py-2 bg-yellow-100 text-yellow-700 rounded-lg cursor-not-allowed"
            >
              好友请求待处理
            </button>
          ) : friendshipData?.status === 'BLOCKED' ? (
            <button
              disabled
              className="flex-1 sm:flex-none px-6 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
            >
              已屏蔽
            </button>
          ) : (
            <button
              onClick={() => sendRequestMutation.mutate()}
              disabled={sendRequestMutation.isLoading}
              className="flex-1 sm:flex-none px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>添加好友</span>
            </button>
          )}
          
          <button
            onClick={handleBlockUser}
            disabled={blockUserMutation.isLoading}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Ban className="w-4 h-4" />
            <span>屏蔽</span>
          </button>
        </div>
      </div>

      {/* 详细信息 */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('userProfile.detailsTitle')}</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>{t('userProfile.joinedDate', { date: new Date(userData.createdAt).toLocaleDateString() })}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Award className="w-5 h-5" />
            <span>{t('userProfile.participationPoints', { points: userData.participationPoints })}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Trophy className="w-5 h-5" />
            <span>{t('userProfile.laborPoints', { points: userData.laborPoints })}</span>
          </div>
          {userData.isVip && (
            <div className="flex items-center gap-3 text-yellow-600">
              <Crown className="w-5 h-5" />
              <span>{t('userProfile.vipMember')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

