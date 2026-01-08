import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Award, Users, Star, Trophy, Target } from 'lucide-react';
import { pointsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTranslation } from 'react-i18next';

const PointsStatsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery(
    'points-detailed-stats',
    () => pointsAPI.getDetailedStats(),
    {
      select: (response) => response.data,
    }
  );

  const { data: rankings } = useQuery(
    'points-rankings',
    () => pointsAPI.getRankings(),
    {
      select: (response) => response.data,
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const pointTypes = [
    {
      key: 'participation',
      name: t('pointsStats.types.participation.name'),
      icon: Users,
      color: 'blue',
      current: stats?.participationPoints || 0,
      monthly: stats?.monthly?.participation || 0,
      rank: rankings?.participation || 0,
      description: t('pointsStats.types.participation.description')
    },
    {
      key: 'trust',
      name: t('pointsStats.types.trust.name'),
      icon: Star,
      color: 'green',
      current: stats?.trustPoints || 0,
      monthly: stats?.monthly?.trust || 0,
      rank: rankings?.trust || 0,
      description: t('pointsStats.types.trust.description')
    },
    {
      key: 'labor',
      name: t('pointsStats.types.labor.name'),
      icon: Target,
      color: 'purple',
      current: stats?.laborPoints || 0,
      monthly: stats?.monthly?.labor || 0,
      rank: rankings?.labor || 0,
      description: t('pointsStats.types.labor.description')
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      purple: 'bg-purple-500 text-white',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getBackgroundClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      purple: 'bg-purple-50 border-purple-200',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

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
              <h1 className="text-xl font-semibold text-gray-900">{t('pointsStats.title')}</h1>
              <p className="text-sm text-gray-500">{t('pointsStats.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 总积分卡片 */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('pointsStats.totalPoints')}</h2>
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {stats?.totalPoints || 0}
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">
              {t('pointsStats.monthlyChange')}:
              <span className={`ml-1 font-medium ${
                (stats?.monthly?.participation || 0) + (stats?.monthly?.trust || 0) + (stats?.monthly?.labor || 0) >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {((stats?.monthly?.participation || 0) + (stats?.monthly?.trust || 0) + (stats?.monthly?.labor || 0)) > 0 ? '+' : ''}
                {(stats?.monthly?.participation || 0) + (stats?.monthly?.trust || 0) + (stats?.monthly?.labor || 0)}
              </span>
            </span>
          </div>
        </div>

        {/* 积分类型详情 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pointTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div key={type.key} className={`card p-6 border-2 ${getBackgroundClasses(type.color)}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${getColorClasses(type.color)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">排名</div>
                    <div className="text-lg font-semibold text-gray-900">#{type.rank}</div>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{type.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{t('pointsStats.currentPoints')}</span>
                    <span className="font-semibold text-gray-900">{type.current}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{t('pointsStats.monthlyChange')}</span>
                    <span className={`font-medium ${
                      type.monthly >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {type.monthly > 0 ? '+' : ''}{type.monthly}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 积分来源统计 */}
        {stats?.reasonStats && Object.keys(stats.reasonStats).length > 0 && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('pointsStats.monthlySource')}</h2>
            <div className="space-y-3">
              {Object.entries(stats.reasonStats)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 8)
                .map(([reason, points]) => (
                  <div key={reason} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{reason}</span>
                    <span className={`font-medium ${
                      (points as number) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {(points as number) > 0 ? '+' : ''}{points as number}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 积分说明 */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('pointsStats.explanation.title')}</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-blue-600 mb-2">{t('pointsStats.explanation.participation.title')}</h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• {t('pointsStats.explanation.participation.createGame')}</li>
                <li>• {t('pointsStats.explanation.participation.joinGame')}</li>
                <li>• {t('pointsStats.explanation.participation.completeGame')}</li>
                <li>• {t('pointsStats.explanation.participation.perfectCompletion')}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-green-600 mb-2">{t('pointsStats.explanation.trust.title')}</h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• {t('pointsStats.explanation.trust.approved')}</li>
                <li>• {t('pointsStats.explanation.trust.rejected')}</li>
                <li>• {t('pointsStats.explanation.trust.appealSuccess')}</li>
                <li>• {t('pointsStats.explanation.trust.maliciousDispute')}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-purple-600 mb-2">{t('pointsStats.explanation.labor.title')}</h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• {t('pointsStats.explanation.labor.peerReview')}</li>
                <li>• {t('pointsStats.explanation.labor.qualityEvidence')}</li>
                <li>• {t('pointsStats.explanation.labor.reportViolation')}</li>
                <li>• {t('pointsStats.explanation.labor.arbitration')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsStatsPage;
