import { useQuery } from 'react-query';
import { Crown, GamepadIcon, Users, Calendar } from 'lucide-react';
import { vipAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from 'react-i18next';

const VipUsageStats = () => {
  const { t } = useTranslation();
  const { data: vipUsage, isLoading } = useQuery(
    'vip-usage',
    () => vipAPI.getUsage(),
    {
      select: (response) => response.data,
      refetchInterval: 60000, // 每分钟刷新一次
    }
  );

  if (isLoading) {
    return <LoadingSpinner size="sm" />;
  }

  if (!vipUsage?.isVip) {
    return null;
  }

  const { usage, tier, expiresAt } = vipUsage;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <Crown className="w-5 h-5 text-purple-600 mr-2" />
        <h3 className="font-semibold text-purple-900">{t('vip.usageStats.title')}</h3>
        <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
          {tier}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <GamepadIcon className="w-4 h-4 text-purple-600 mr-1" />
            <span className="text-sm font-medium text-gray-700">{t('vip.usageStats.todayCreated')}</span>
          </div>
          <div className="text-lg font-bold text-purple-900">
            {usage.todayGamesCreated}
            <span className="text-sm font-normal text-gray-600">
              /{usage.maxDailyGames}
            </span>
          </div>
          {typeof usage.remainingGames === 'number' && usage.remainingGames <= 2 && (
            <div className="text-xs text-orange-600">
              {t('vip.usageStats.remaining', { count: usage.remainingGames })}
            </div>
          )}
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Users className="w-4 h-4 text-purple-600 mr-1" />
            <span className="text-sm font-medium text-gray-700">{t('vip.usageStats.todayJoined')}</span>
          </div>
          <div className="text-lg font-bold text-purple-900">
            {usage.todayGamesJoined}
            <span className="text-sm font-normal text-gray-600">
              /{usage.maxDailyJoins}
            </span>
          </div>
          {typeof usage.remainingJoins === 'number' && usage.remainingJoins <= 5 && (
            <div className="text-xs text-orange-600">
              {t('vip.usageStats.remaining', { count: usage.remainingJoins })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-purple-200">
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{t('vip.usageStats.expiresAt')}</span>
        </div>
        <span>{new Date(expiresAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default VipUsageStats;
