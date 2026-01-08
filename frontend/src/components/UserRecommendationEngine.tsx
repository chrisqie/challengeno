import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { 
  Users, 
  Sparkles, 
  RefreshCw, 
  TrendingUp,
  MapPin,
  Calendar,
  Trophy,
  Gamepad2,
  Heart,
  UserPlus,
  X
} from 'lucide-react';
import { usersAPI, friendsAPI } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

interface RecommendationReason {
  type: 'mutual_friends' | 'similar_interests' | 'location' | 'trust_level' | 'activity_pattern' | 'game_history';
  description: string;
  score: number;
}

interface UserRecommendation {
  user: any;
  reasons: RecommendationReason[];
  totalScore: number;
}

interface UserRecommendationEngineProps {
  maxRecommendations?: number;
  showReasons?: boolean;
}

const UserRecommendationEngine: React.FC<UserRecommendationEngineProps> = ({
  maxRecommendations = 10,
  showReasons = true
}) => {
  const { user } = useAuthStore();
  const [dismissedUsers, setDismissedUsers] = useState<Set<string>>(new Set());

  // 获取推荐用户
  const { data: recommendations, isLoading, refetch } = useQuery(
    ['user-recommendations', user?.id],
    () => usersAPI.getRecommendations({
      userId: user?.id,
      limit: maxRecommendations + dismissedUsers.size,
      excludeIds: Array.from(dismissedUsers)
    }),
    {
      enabled: !!user?.id,
      select: (response) => response.data?.filter((rec: UserRecommendation) => 
        !dismissedUsers.has(rec.user.id)
      ).slice(0, maxRecommendations)
    }
  );

  // 发送好友请求
  const sendFriendRequest = async (userId: string, username: string) => {
    try {
      await friendsAPI.sendFriendRequest(username);
      toast.success(`已向 @${username} 发送好友请求`);
    } catch (error) {
      toast.error('发送好友请求失败');
    }
  };

  // 忽略推荐
  const dismissRecommendation = (userId: string) => {
    setDismissedUsers(prev => new Set([...prev, userId]));
    toast('已忽略该推荐', { icon: '👋' });
  };

  // 刷新推荐
  const refreshRecommendations = () => {
    setDismissedUsers(new Set());
    refetch();
    toast('正在刷新推荐...', { icon: '🔄' });
  };

  const getReasonIcon = (type: RecommendationReason['type']) => {
    switch (type) {
      case 'mutual_friends':
        return <Users className="w-4 h-4" />;
      case 'similar_interests':
        return <Heart className="w-4 h-4" />;
      case 'location':
        return <MapPin className="w-4 h-4" />;
      case 'trust_level':
        return <Trophy className="w-4 h-4" />;
      case 'activity_pattern':
        return <TrendingUp className="w-4 h-4" />;
      case 'game_history':
        return <Gamepad2 className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getReasonColor = (type: RecommendationReason['type']) => {
    switch (type) {
      case 'mutual_friends':
        return 'text-blue-600 bg-blue-50';
      case 'similar_interests':
        return 'text-pink-600 bg-pink-50';
      case 'location':
        return 'text-green-600 bg-green-50';
      case 'trust_level':
        return 'text-yellow-600 bg-yellow-50';
      case 'activity_pattern':
        return 'text-purple-600 bg-purple-50';
      case 'game_history':
        return 'text-indigo-600 bg-indigo-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrustBadge = (trustPoints: number) => {
    if (trustPoints >= 150) return { label: '钻石', color: 'text-purple-600 bg-purple-100' };
    if (trustPoints >= 100) return { label: '黄金', color: 'text-yellow-600 bg-yellow-100' };
    if (trustPoints >= 70) return { label: '白银', color: 'text-gray-600 bg-gray-100' };
    if (trustPoints >= 50) return { label: '青铜', color: 'text-orange-600 bg-orange-100' };
    return { label: '新手', color: 'text-green-600 bg-green-100' };
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
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
            <h2 className="text-lg font-semibold text-gray-900">为你推荐</h2>
          </div>
          <button
            onClick={refreshRecommendations}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="刷新推荐"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          基于你的兴趣和活动为你推荐可能认识的人
        </p>
      </div>

      {/* 推荐列表 */}
      <div className="p-4">
        {recommendations && recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((recommendation: UserRecommendation) => {
              const { user: recommendedUser, reasons, totalScore } = recommendation;
              const trustBadge = getTrustBadge(recommendedUser.trustPoints);
              
              return (
                <div
                  key={recommendedUser.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {recommendedUser.username.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            @{recommendedUser.username}
                          </h3>
                          {recommendedUser.isVip && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              VIP
                            </span>
                          )}
                          <span className={`px-2 py-0.5 text-xs rounded-full ${trustBadge.color}`}>
                            {trustBadge.label}
                          </span>
                        </div>
                        
                        {recommendedUser.fullName && (
                          <p className="text-sm text-gray-600 mb-2">{recommendedUser.fullName}</p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center">
                            <Trophy className="w-3 h-3 mr-1" />
                            {recommendedUser.trustPoints}
                          </span>
                          <span className="flex items-center">
                            <Gamepad2 className="w-3 h-3 mr-1" />
                            {recommendedUser.totalGamesJoined || 0}
                          </span>
                          {recommendedUser.location && (
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {recommendedUser.location}
                            </span>
                          )}
                        </div>

                        {/* 推荐原因 */}
                        {showReasons && reasons && reasons.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {reasons.slice(0, 3).map((reason, index) => (
                              <div
                                key={index}
                                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getReasonColor(reason.type)}`}
                                title={reason.description}
                              >
                                {getReasonIcon(reason.type)}
                                <span>{reason.description}</span>
                              </div>
                            ))}
                            {reasons.length > 3 && (
                              <span className="text-xs text-gray-500 px-2 py-1">
                                +{reasons.length - 3} 个原因
                              </span>
                            )}
                          </div>
                        )}

                        {/* 操作按钮 */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => sendFriendRequest(recommendedUser.id, recommendedUser.username)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <UserPlus className="w-4 h-4" />
                            <span>添加好友</span>
                          </button>
                          
                          <button
                            onClick={() => dismissRecommendation(recommendedUser.id)}
                            className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <X className="w-4 h-4" />
                            <span>忽略</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 推荐分数 */}
                    <div className="text-right">
                      <div className="text-xs text-gray-500">匹配度</div>
                      <div className="text-sm font-medium text-blue-600">
                        {Math.round(totalScore)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium mb-1">暂无推荐</p>
            <p className="text-sm">完善你的资料和参与更多游戏来获得更好的推荐</p>
            <button
              onClick={refreshRecommendations}
              className="mt-3 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              刷新推荐
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRecommendationEngine;
