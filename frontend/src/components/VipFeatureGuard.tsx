import { ReactNode } from 'react';
import { useQuery } from 'react-query';
import { Crown, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { vipAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

interface VipFeatureGuardProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
}

const VipFeatureGuard = ({ 
  feature, 
  children, 
  fallback, 
  showUpgradePrompt = true 
}: VipFeatureGuardProps) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: featureCheck, isLoading } = useQuery(
    ['vip-feature-check', feature],
    () => vipAPI.checkFeature(feature),
    {
      select: (response) => response.data,
      enabled: !!user,
    }
  );

  if (isLoading) {
    return <LoadingSpinner size="sm" />;
  }

  if (!featureCheck?.hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showUpgradePrompt) {
      return (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Crown className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            VIP专属功能
          </h3>
          <p className="text-gray-600 mb-4">
            此功能需要VIP会员权限才能使用
          </p>
          <button
            onClick={() => navigate('/vip')}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
          >
            <Crown className="w-4 h-4 mr-2" />
            立即升级VIP
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
        <Lock className="w-5 h-5 text-gray-400 mr-2" />
        <span className="text-gray-500">需要VIP权限</span>
      </div>
    );
  }

  return <>{children}</>;
};

export default VipFeatureGuard;
