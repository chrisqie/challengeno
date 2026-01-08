import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Sparkles, 
  Users, 
  Trophy, 
  Star, 
  UserPlus, 
  X, 
  RefreshCw,
  TrendingUp,
  GamepadIcon,
  Clock
} from 'lucide-react';
import { friendsAPI } from '../services/api';
import toast from 'react-hot-toast';

interface RecommendationReason {
  type: 'mutual_friends' | 'high_trust' | 'similar_interests' | 'active_player';
  label: string;
  icon: React.ReactNode;
  color: string;
}

const SmartFriendRecommendations: React.FC = () => {
  const queryClient = useQueryClient();
  const [dismissedUsers, setDismissedUsers] = useState<Set<string>>(new Set());

  // 获取好友推荐
  const { data: recommendations, isLoading, refetch } = useQuery(
    'friendRecommendations',
    () => friendsAPI.getFriendRecommendations(),
    {
      select: (response) => response.data,
      staleTime: 5 * 60 * 1000, // 5分钟内不重新获取
    }
  );

  // 发送好友请求
  const sendRequestMutation = useMutation(
    (username: string) => friendsAPI.sendFriendRequest(username),
    {
      onSuccess: () => {
        toast.success('好友请求已发送！');
        queryClient.invalidateQueries('friendRecommendations');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '发送失败');
      },
    }
  );

  const getRecommendationReason = (reason: string, mutualFriends: number): RecommendationReason => {
    switch (reason) {
      case 'mutual_friends':
        return {
          type: 'mutual_friends',
          label: `${mutualFriends} 个共同好友`,
          icon: <Users className="w-3 h-3" />,
          color: 'bg-blue-100 text-blue-800'
        };
      case 'high_trust':
        return {
          type: 'high_trust',
          label: '高信任度用户',
          icon: <Trophy className="w-3 h-3" />,
          color: 'bg-green-100 text-green-800'
        };
      case 'similar_interests':
        return {
          type: 'similar_interests',
          label: '兴趣相似',
          icon: <TrendingUp className="w-3 h-3" />,
          color: 'bg-purple-100 text-purple-800'
        };
      default:
        return {
          type: 'active_player',
          label: '活跃玩家',
          icon: <GamepadIcon className="w-3 h-3" />,
          color: 'bg-orange-100 text-orange-800'
        };
    }
  };

  const getTrustBadgeColor = (trustPoints: number) => {
    if (trustPoints >= 150) return 'bg-purple-100 text-purple-800';
    if (trustPoints >= 100) return 'bg-green-100 text-green-800';
    if (trustPoints >= 70) return 'bg-blue-100 text-blue-800';
    if (trustPoints >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getTrustLabel = (trustPoints: number) => {
    if (trustPoints >= 150) return '钻石';
    if (trustPoints >= 100) return '黄金';
    if (trustPoints >= 70) return '白银';
    if (trustPoints >= 50) return '青铜';
    return '新手';
  };

  const dismissRecommendation = (userId: string) => {
    setDismissedUsers(prev => new Set([...prev, userId]));
  };

  const filteredRecommendations = recommendations?.filter(
    (user: any) => !dismissedUsers.has(user.id)
  ) || [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!filteredRecommendations.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 text-sm">暂无推荐好友</p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center mx-auto"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          刷新推荐
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">推荐好友</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {filteredRecommendations.length}
            </span>
          </div>
          <button
            onClick={() => refetch()}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            title="刷新推荐"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 推荐列表 */}
      <div className="divide-y divide-gray-100">
        {filteredRecommendations.map((user: any) => {
          const reasonInfo = getRecommendationReason(user.reason, user.mutualFriends);
          
          return (
            <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  {/* 头像 */}
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    {user.isVip && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Star className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* 用户信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        @{user.username}
                      </p>
                    </div>
                    
                    {user.fullName && (
                      <p className="text-xs text-gray-600 truncate">{user.fullName}</p>
                    )}
                    
                    {/* 标签和统计 */}
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${reasonInfo.color}`}>
                        {reasonInfo.icon}
                        <span className="ml-1">{reasonInfo.label}</span>
                      </span>
                      
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTrustBadgeColor(user.trustPoints)}`}>
                        <Trophy className="w-3 h-3 mr-1" />
                        {getTrustLabel(user.trustPoints)}
                      </span>
                    </div>
                    
                    {/* 活跃度信息 */}
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-xs text-gray-500 flex items-center">
                        <GamepadIcon className="w-3 h-3 mr-1" />
                        {user.totalGamesCreated + user.totalGamesJoined} 场游戏
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        信任度 {user.trustPoints}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center space-x-2 ml-3">
                  <button
                    onClick={() => dismissRecommendation(user.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    title="不感兴趣"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => sendRequestMutation.mutate(user.username)}
                    disabled={sendRequestMutation.isLoading}
                    className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
                  >
                    <UserPlus className="w-3 h-3 mr-1" />
                    添加
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部提示 */}
      <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
        <p className="text-xs text-gray-500">
          推荐基于共同好友、信任度和活跃度计算
        </p>
      </div>
    </div>
  );
};

export default SmartFriendRecommendations;
