import React from 'react';
import { Users, Crown, Trophy, Info } from 'lucide-react';

interface FriendsOnlyLimitInfoProps {
  isVip: boolean;
  participationPoints: number;
  currentMonthCount: number;
  className?: string;
}

const FriendsOnlyLimitInfo: React.FC<FriendsOnlyLimitInfoProps> = ({
  isVip,
  participationPoints,
  currentMonthCount,
  className = ''
}) => {
  // 计算当前用户的月度限制
  const getMonthlyLimit = () => {
    if (isVip) return 'Unlimited';
    if (participationPoints >= 1000) return 10;
    if (participationPoints >= 500) return 5;
    if (participationPoints >= 100) return 3;
    return 1;
  };

  // 获取用户等级名称
  const getUserTier = () => {
    if (isVip) return 'VIP Member';
    if (participationPoints >= 1000) return 'Advanced User';
    if (participationPoints >= 500) return 'Intermediate User';
    if (participationPoints >= 100) return 'Active User';
    return 'New User';
  };

  // 获取下一等级所需积分
  const getNextTierPoints = () => {
    if (isVip) return null;
    if (participationPoints >= 1000) return null;
    if (participationPoints >= 500) return 1000 - participationPoints;
    if (participationPoints >= 100) return 500 - participationPoints;
    return 100 - participationPoints;
  };

  const monthlyLimit = getMonthlyLimit();
  const userTier = getUserTier();
  const nextTierPoints = getNextTierPoints();
  const isLimitReached = typeof monthlyLimit === 'number' && currentMonthCount >= monthlyLimit;

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {isVip ? (
            <Crown className="w-5 h-5 text-yellow-600 mt-0.5" />
          ) : (
            <Users className="w-5 h-5 text-blue-600 mt-0.5" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-blue-900">Friends-Only Games</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isVip 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {userTier}
            </span>
          </div>
          
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-center justify-between">
              <span>Monthly limit:</span>
              <span className="font-medium">
                {typeof monthlyLimit === 'number' 
                  ? `${currentMonthCount}/${monthlyLimit}` 
                  : monthlyLimit
                }
              </span>
            </div>
            
            {isLimitReached && (
              <div className="flex items-center gap-2 text-amber-700 bg-amber-50 rounded p-2">
                <Info className="w-4 h-4" />
                <span className="text-xs">
                  Monthly limit reached. {nextTierPoints ? `Earn ${nextTierPoints} more points for higher limit` : 'Upgrade to VIP for unlimited access'}
                </span>
              </div>
            )}
            
            {!isVip && !isLimitReached && (
              <div className="space-y-1">
                <div className="text-xs text-blue-600">
                  <strong>Earn more points to increase your limit:</strong>
                </div>
                <div className="text-xs space-y-1 ml-2">
                  <div>• 100+ points: 3 games/month</div>
                  <div>• 500+ points: 5 games/month</div>
                  <div>• 1000+ points: 10 games/month</div>
                  <div className="flex items-center gap-1">
                    <Crown className="w-3 h-3 text-yellow-600" />
                    <span>VIP: Unlimited games</span>
                  </div>
                </div>
                
                {nextTierPoints && (
                  <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 rounded">
                    <Trophy className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-700">
                      <strong>{nextTierPoints} more points</strong> to unlock next tier!
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsOnlyLimitInfo;
