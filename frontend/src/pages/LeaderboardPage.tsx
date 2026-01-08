import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Trophy, Medal, Award, Users, Star, Target, Crown } from 'lucide-react';
import { pointsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const LeaderboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'participation' | 'trust' | 'labor' | 'total'>('total');

  const { data: leaderboard, isLoading } = useQuery(
    ['leaderboard', activeTab],
    () => pointsAPI.getLeaderboard(activeTab, 50),
    {
      select: (response) => response.data,
    }
  );

  const tabs = [
    {
      key: 'total' as const,
      name: t('leaderboard.tabs.total'),
      icon: Crown,
      color: 'yellow',
    },
    {
      key: 'participation' as const,
      name: t('leaderboard.tabs.participation'),
      icon: Users,
      color: 'blue',
    },
    {
      key: 'trust' as const,
      name: t('leaderboard.tabs.trust'),
      icon: Star,
      color: 'green',
    },
    {
      key: 'labor' as const,
      name: t('leaderboard.tabs.labor'),
      icon: Target,
      color: 'purple',
    },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-sm font-semibold text-gray-500">#{rank}</span>;
  };

  const getTabColor = (color: string, active: boolean) => {
    const colors = {
      yellow: active ? 'bg-yellow-500 text-white' : 'text-yellow-600 hover:bg-yellow-50',
      blue: active ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-50',
      green: active ? 'bg-green-500 text-white' : 'text-green-600 hover:bg-green-50',
      purple: active ? 'bg-purple-500 text-white' : 'text-purple-600 hover:bg-purple-50',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getPointValue = (user: any, type: string) => {
    switch (type) {
      case 'participation':
        return user.participationPoints;
      case 'trust':
        return user.trustPoints;
      case 'labor':
        return user.laborPoints;
      case 'total':
        return user.totalPoints || (user.participationPoints + user.trustPoints + user.laborPoints);
      default:
        return 0;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{t('leaderboard.title')}</h1>
              <p className="text-sm text-gray-500">{t('leaderboard.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 标签页 */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${getTabColor(tab.color, isActive)}`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* 排行榜 */}
        <div className="card">
          {leaderboard && leaderboard.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {leaderboard.map((user: any, index: number) => {
                const rank = index + 1;
                const points = getPointValue(user, activeTab);
                
                return (
                  <div
                    key={user.id}
                    className={`p-4 flex items-center space-x-4 ${
                      rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''
                    }`}
                  >
                    {/* 排名 */}
                    <div className="flex-shrink-0">
                      {getRankIcon(rank)}
                    </div>

                    {/* 用户信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary-600">
                            {user.username?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">@{user.username}</h3>
                          {user.fullName && (
                            <p className="text-sm text-gray-500">{user.fullName}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 积分 */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {points.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">{t('leaderboard.points')}</div>
                    </div>

                    {/* 详细积分（仅在总积分页面显示） */}
                    {activeTab === 'total' && (
                      <div className="hidden md:block text-right text-sm text-gray-500">
                        <div>P: {user.participationPoints}</div>
                        <div>T: {user.trustPoints}</div>
                        <div>L: {user.laborPoints}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>{t('leaderboard.noData')}</p>
            </div>
          )}
        </div>

        <div className="mt-6 card p-4">
          <h3 className="font-semibold text-gray-900 mb-3">{t('leaderboard.explanation.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-blue-600">{t('leaderboard.explanation.participation.title')}</span>
              </div>
              <p className="text-gray-600">{t('leaderboard.explanation.participation.description')}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-green-500" />
                <span className="font-medium text-green-600">{t('leaderboard.explanation.trust.title')}</span>
              </div>
              <p className="text-gray-600">{t('leaderboard.explanation.trust.description')}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-purple-600">{t('leaderboard.explanation.labor.title')}</span>
              </div>
              <p className="text-gray-600">{t('leaderboard.explanation.labor.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
