import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Trophy,
  Heart,
  Briefcase,
  Filter,
  Calendar
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const PointsHistoryPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('all');

  // 获取积分历史数据
  const { data: pointsHistory, isLoading, error } = useQuery(
    ['points-history', filterType, timeRange],
    async () => {
      const response = await api.get('/points/history', {
        params: {
          limit: 100,
          type: filterType !== 'all' ? filterType : undefined,
          timeRange: timeRange !== 'all' ? timeRange : undefined
        }
      });
      return response.data;
    },
    {
      enabled: !!user,
      staleTime: 30000, // 30秒内不重新请求
    }
  );

  // 处理加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // 处理错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{t('pointsHistory.loadError')}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('pointsHistory.reload')}
          </button>
        </div>
      </div>
    );
  }

  const historyData = pointsHistory || [];


  const getPointTypeInfo = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PARTICIPATION':
        return {
          icon: Trophy,
          label: t('pointsHistory.types.participation'),
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        };
      case 'TRUST':
        return {
          icon: Heart,
          label: t('pointsHistory.types.trust'),
          color: 'text-red-600',
          bgColor: 'bg-red-100'
        };
      case 'LABOR':
        return {
          icon: Briefcase,
          label: t('pointsHistory.types.labor'),
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        };
      default:
        return {
          icon: Trophy,
          label: t('pointsHistory.types.points'),
          color: 'text-gray-600',
          bgColor: 'bg-gray-100'
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return t('pointsHistory.time.today') + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 2) {
      return t('pointsHistory.time.yesterday') + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays <= 7) {
      return t('pointsHistory.time.daysAgo', { days: diffDays - 1 });
    } else {
      return date.toLocaleDateString();
    }
  };

  // 过滤历史数据
  const filteredHistory = historyData.filter((item: any) => {
    // 积分类型过滤
    if (filterType !== 'all' && item.pointType?.toUpperCase() !== filterType.toUpperCase()) {
      return false;
    }

    // 时间范围过滤
    if (timeRange !== 'all') {
      const itemDate = new Date(item.createdAt);
      const now = new Date();

      switch (timeRange) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return itemDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return itemDate >= monthAgo;
        case 'quarter':
          const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          return itemDate >= quarterAgo;
        default:
          return true;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t('pointsHistory.title')}</h1>
              <p className="text-sm text-gray-600">{t('pointsHistory.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('pointsHistory.currentPoints')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{user?.participationPoints || 0}</div>
              <div className="text-sm text-blue-700">{t('pointsHistory.types.participation')}</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{user?.trustPoints || 0}</div>
              <div className="text-sm text-red-700">{t('pointsHistory.types.trust')}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Briefcase className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{user?.laborPoints || 0}</div>
              <div className="text-sm text-green-700">{t('pointsHistory.types.labor')}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('pointsHistory.filters.typeLabel')}
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('pointsHistory.filters.allTypes')}</option>
                <option value="PARTICIPATION">{t('pointsHistory.types.participation')}</option>
                <option value="TRUST">{t('pointsHistory.types.trust')}</option>
                <option value="LABOR">{t('pointsHistory.types.labor')}</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('pointsHistory.filters.timeLabel')}
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('pointsHistory.filters.allTime')}</option>
                <option value="week">{t('pointsHistory.filters.lastWeek')}</option>
                <option value="month">{t('pointsHistory.filters.lastMonth')}</option>
                <option value="quarter">{t('pointsHistory.filters.lastQuarter')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('pointsHistory.recordsCount', { count: filteredHistory.length })}
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredHistory.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>{t('pointsHistory.noRecords')}</p>
              </div>
            ) : (
              filteredHistory.map((record: any) => {
                const typeInfo = getPointTypeInfo(record.pointType || 'PARTICIPATION');
                const Icon = typeInfo.icon;
                const isPositive = record.change > 0;

                return (
                  <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${typeInfo.bgColor}`}>
                          <Icon className={`w-5 h-5 ${typeInfo.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{record.reason}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">{typeInfo.label}</span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-500">{formatDate(record.createdAt)}</span>
                            {record.game && (
                              <>
                                <span className="text-sm text-gray-400">•</span>
                                <span className="text-sm text-blue-600">{record.game.title}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`font-semibold ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {isPositive ? '+' : ''}{record.change}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsHistoryPage;
