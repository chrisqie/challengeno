import { useState } from 'react';
import { useQuery } from 'react-query';
import { Crown, Check, Star, Zap, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { VIP_PLANS } from '../config/gameTemplates';
import { vipAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const VipPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: vipStatus, isLoading, refetch } = useQuery(
    'vip-status',
    () => vipAPI.getStatus(),
    {
      select: (response) => response.data,
    }
  );

  const { data: vipHistory } = useQuery(
    'vip-history',
    () => vipAPI.getHistory(),
    {
      select: (response) => response.data,
      enabled: !!user,
    }
  );

  const handleSubscribe = async (tier: string) => {
    if (!user) {
      toast.error(t('vip.pleaseLogin'));
      return;
    }

    setIsProcessing(true);
    try {
      await vipAPI.subscribe({ tier, paymentMethod: 'mock' });
      toast.success(t('vip.purchaseSuccess'));
      // 刷新VIP状态
      refetch();
      // 刷新用户状态，使VIP状态立即生效
      const { refreshUser } = useAuthStore.getState();
      await refreshUser();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('vip.purchaseFailed'));
    } finally {
      setIsProcessing(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BASIC': return 'from-blue-500 to-blue-600';
      case 'PREMIUM': return 'from-purple-500 to-purple-600';
      case 'ELITE': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'BASIC': return <Shield className="w-6 h-6" />;
      case 'PREMIUM': return <Star className="w-6 h-6" />;
      case 'ELITE': return <Crown className="w-6 h-6" />;
      default: return <Zap className="w-6 h-6" />;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('vip.back')}</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">{t('vip.title')}</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 当前VIP状态 */}
        {vipStatus?.isVip && vipStatus.tier && (
          <div className="mb-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-full">
              <Crown className="w-5 h-5" />
              <span className="font-medium">
                {t('vip.currentMember', { tier: t(VIP_PLANS[vipStatus.tier as keyof typeof VIP_PLANS]?.nameKey || VIP_PLANS[vipStatus.tier as keyof typeof VIP_PLANS]?.name) })}
              </span>
            </div>
            {vipStatus.expiresAt && (
              <p className="text-gray-600 mt-2">
                {t('vip.expiresAt')}: {new Date(vipStatus.expiresAt).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('vip.upgradeTitle')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('vip.upgradeSubtitle')}
          </p>
        </div>

        {/* VIP套餐 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {Object.entries(VIP_PLANS).map(([tier, plan]) => (
            <div
              key={tier}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                selectedTier === tier ? 'ring-4 ring-purple-500' : ''
              }`}
            >
              {tier === 'PREMIUM' && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-2 text-sm font-medium">
                  {t('vip.mostPopular')}
                </div>
              )}

              <div className={`bg-gradient-to-r ${getTierColor(tier)} text-white p-6 ${tier === 'PREMIUM' ? 'pt-12' : ''}`}>
                <div className="flex items-center justify-center mb-4">
                  {getTierIcon(tier)}
                </div>
                <h3 className="text-2xl font-bold text-center">{t(plan.nameKey)}</h3>
                <div className="text-center mt-4">
                  <span className="text-3xl font-bold">¥{plan.price}</span>
                  <span className="text-lg opacity-80">/{plan.duration}{t('vip.days')}</span>
                </div>
              </div>

              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {plan.benefitKeys.map((benefitKey, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{t(benefitKey)}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(tier)}
                  disabled={isProcessing || (vipStatus?.tier && vipStatus.tier === tier)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    vipStatus?.tier === tier
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : `bg-gradient-to-r ${getTierColor(tier)} text-white hover:opacity-90`
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      {t('vip.processing')}
                    </div>
                  ) : (vipStatus?.tier && vipStatus.tier === tier) ? (
                    t('vip.currentPlan')
                  ) : (
                    t('vip.buyNow')
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* VIP特权说明 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('vip.benefitsTitle')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('vip.benefits.moreCreation')}</h3>
              <p className="text-gray-600 text-sm">{t('vip.benefits.moreCreationDesc')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('vip.benefits.moreParticipation')}</h3>
              <p className="text-gray-600 text-sm">{t('vip.benefits.moreParticipationDesc')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('vip.benefits.exclusiveBadge')}</h3>
              <p className="text-gray-600 text-sm">{t('vip.benefits.exclusiveBadgeDesc')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('vip.benefits.prioritySupport')}</h3>
              <p className="text-gray-600 text-sm">{t('vip.benefits.prioritySupportDesc')}</p>
            </div>
          </div>
        </div>

        {/* VIP历史记录 */}
        {vipHistory && vipHistory.subscriptions && vipHistory.subscriptions.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('vip.purchaseHistory')}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('vip.table.plan')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('vip.table.purchaseDate')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('vip.table.validity')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('vip.table.amount')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('vip.table.status')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vipHistory.subscriptions.map((subscription: any) => (
                    <tr key={subscription.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {subscription.planName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(subscription.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(subscription.startDate).toLocaleDateString()} - {new Date(subscription.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ¥{subscription.paymentAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          subscription.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {subscription.isActive ? t('vip.table.active') : t('vip.table.expired')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 常见问题 */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('vip.faqTitle')}
          </h2>

          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">{t('vip.faq.billing.question')}</h3>
              <p className="text-gray-600">{t('vip.faq.billing.answer')}</p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">{t('vip.faq.cancel.question')}</h3>
              <p className="text-gray-600">{t('vip.faq.cancel.answer')}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('vip.faq.immediate.question')}</h3>
              <p className="text-gray-600">{t('vip.faq.immediate.answer')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VipPage;
