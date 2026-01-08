import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  TrendingUp,
  Trophy,
  Target,
  Star,
  Calendar,
  Users,
  Clock,
  Award,
  Activity,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { pointsAPI, gamesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

interface UserGameStats {
  totalCreated: number;
  totalJoined: number;
  totalCompleted: number;
  successRate: number;
  averageParticipants: number;
  favoriteCategory: string;
  recentActivity: Array<{
    date: string;
    action: string;
    gameTitle: string;
  }>;
  monthlyStats: {
    created: number;
    joined: number;
    completed: number;
  };
  categoryStats: Array<{
    category: string;
    count: number;
    successRate: number;
  }>;
}

const UserStatsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);

  // 获取积分统计
  const { data: pointsStats, isLoading: pointsLoading } = useQuery(
    ['user-points-stats', user?.id],
    () => pointsAPI.getStats(),
    {
      enabled: !!user,
      select: (response) => response.data,
    }
  );

  // 获取游戏统计
  const { data: gameStats, isLoading: gameLoading } = useQuery<UserGameStats>(
    ['user-game-stats', user?.id, selectedPeriod],
    () => gamesAPI.getUserGameStats(selectedPeriod).then(response => response.data),
    {
      enabled: !!user,
    }
  );

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  if (!user) return null;

  if (pointsLoading || gameLoading) {
    return <LoadingSpinner />;
  }

  const totalPoints = user.participationPoints + user.trustPoints + user.laborPoints;
  const completionRate = user.totalGamesJoined > 0 
    ? Math.round((user.gamesCompleted / user.totalGamesJoined) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('userStats.title')}</h1>
            <p className="text-gray-600">{t('userStats.subtitle')}</p>
          </div>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">{t('userStats.period.last7Days')}</option>
            <option value="30d">{t('userStats.period.last30Days')}</option>
            <option value="90d">{t('userStats.period.last90Days')}</option>
            <option value="all">{t('userStats.period.allTime')}</option>
          </select>
        </div>

        {/* 概览统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('userStats.overview.totalPoints')}</p>
                <p className="text-2xl font-bold text-gray-900">{totalPoints}</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">{t('userStats.overview.thisMonth', { points: pointsStats?.monthly?.total || 0 })}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('userStats.overview.completionRate')}</p>
                <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">{t('userStats.overview.completed', { completed: user.gamesCompleted, total: user.totalGamesJoined })}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('userStats.overview.trustPoints')}</p>
                <p className="text-2xl font-bold text-gray-900">{user.trustPoints}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">{t('userStats.overview.trustLevel')}: {user.trustPoints >= 120 ? t('userStats.overview.excellent') : user.trustPoints >= 100 ? t('userStats.overview.good') : t('userStats.overview.average')}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('userStats.overview.activeDays')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">{t('userStats.overview.joinedOn', { date: new Date(user.createdAt).toLocaleDateString() })}</span>
            </div>
          </div>
        </div>

        {/* 详细统计区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 积分详情 */}
          <div className="bg-white rounded-lg shadow">
            <div 
              className="flex items-center justify-between p-6 cursor-pointer"
              onClick={() => toggleSection('points')}
            >
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                {t('userStats.details.pointsTitle')}
              </h3>
              {expandedSections.includes('points') ? 
                <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                <ChevronDown className="w-5 h-5 text-gray-400" />
              }
            </div>
            
            {expandedSections.includes('points') && (
              <div className="px-6 pb-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Activity className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-xl font-bold text-blue-600">{user.participationPoints}</div>
                    <div className="text-sm text-blue-600">{t('userStats.details.participationPoints')}</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Star className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                    <div className="text-xl font-bold text-yellow-600">{user.trustPoints}</div>
                    <div className="text-sm text-yellow-600">{t('userStats.details.trustPoints')}</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Zap className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <div className="text-xl font-bold text-green-600">{user.laborPoints}</div>
                    <div className="text-sm text-green-600">{t('userStats.details.laborPoints')}</div>
                  </div>
                </div>
                
                {pointsStats?.recentHistory && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t('userStats.details.recentChanges')}</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {pointsStats.recentHistory.slice(0, 5).map((record: any, index: number) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{record.reason}</span>
                          <span className={`font-medium ${record.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {record.change > 0 ? '+' : ''}{record.change}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 游戏统计 */}
          <div className="bg-white rounded-lg shadow">
            <div 
              className="flex items-center justify-between p-6 cursor-pointer"
              onClick={() => toggleSection('games')}
            >
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                {t('userStats.details.gamesTitle')}
              </h3>
              {expandedSections.includes('games') ? 
                <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                <ChevronDown className="w-5 h-5 text-gray-400" />
              }
            </div>
            
            {expandedSections.includes('games') && (
              <div className="px-6 pb-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">{user.totalGamesCreated}</div>
                    <div className="text-sm text-purple-600">{t('userStats.details.gamesCreated')}</div>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <div className="text-xl font-bold text-indigo-600">{user.totalGamesJoined}</div>
                    <div className="text-sm text-indigo-600">{t('userStats.details.gamesJoined')}</div>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-xl font-bold text-emerald-600">{user.gamesCompleted}</div>
                    <div className="text-sm text-emerald-600">{t('userStats.details.gamesCompleted')}</div>
                  </div>
                </div>

                {gameStats?.categoryStats && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t('userStats.details.categoryStats')}</h4>
                    <div className="space-y-2">
                      {gameStats.categoryStats.slice(0, 3).map((category: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{category.category}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{t('userStats.details.times', { count: category.count })}</span>
                            <span className="text-xs text-gray-500">({t('userStats.details.successRate', { rate: category.successRate })})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {gameStats?.recentActivity && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                <Clock className="w-5 h-5 mr-2 text-gray-600" />
                {t('userStats.details.recentActivity')}
              </h3>
              <div className="space-y-3">
                {gameStats.recentActivity.slice(0, 5).map((activity: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.gameTitle}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStatsPage;
