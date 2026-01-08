import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { referralAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  Gift,
  Users,
  Copy,
  Share2,
  Trophy,
  Calendar,
  ExternalLink,
  Sparkles,
  Crown
} from 'lucide-react';

const ReferralPage: React.FC = () => {
  const { t } = useTranslation();
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const queryClient = useQueryClient();

  // 获取推荐统计
  const { data: stats, isLoading } = useQuery(
    'referral-stats',
    () => referralAPI.getReferralStats(),
    {
      select: (response) => response.data
    }
  );

  // 生成推荐码
  const generateCodeMutation = useMutation(
    () => referralAPI.generateReferralCode(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('referral-stats');
        toast.success(t('referral.codeGenerated'));
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || t('referral.generateFailed'));
      }
    }
  );

  // 生成分享链接
  const generateLinkMutation = useMutation(
    (data: { type: 'app' | 'game' | 'achievement'; targetId?: string }) =>
      referralAPI.generateShareLink(data),
    {
      onSuccess: async (response) => {
        const link = response.data.shareLink;
        setGeneratedLink(link);
        await copyToClipboard(link);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || t('referral.generateFailed'));
      }
    }
  );

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        toast.success(t('referral.copied'));
        return;
      }

      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        toast.success(t('referral.copied'));
      } else {
        throw new Error(t('referral.copyFailed'));
      }
    } catch (err) {
      console.error('Copy failed:', err);
      toast.error(t('referral.copyFailedManual'));
    }
  };



  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Gift className="w-8 h-8 text-yellow-600" />
        <h1 className="text-2xl font-bold text-gray-900">{t('referral.title')}</h1>
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-600" />
            {t('referral.myCode')}
          </h2>
          {!stats?.referralCode && (
            <button
              onClick={() => generateCodeMutation.mutate()}
              disabled={generateCodeMutation.isLoading}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
            >
              {generateCodeMutation.isLoading ? t('referral.generating') : t('referral.generateCode')}
            </button>
          )}
        </div>

        {stats?.referralCode ? (
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-white rounded-lg p-4 border border-yellow-300">
              <div className="text-2xl font-mono font-bold text-yellow-800 text-center">
                {stats.referralCode}
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(stats.referralCode)}
              className="p-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              title={t('referral.copyCode')}
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Gift className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t('referral.generateHint')}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('referral.stats.totalReferred')}</p>
              <p className="text-2xl font-bold text-blue-600">{stats?.totalReferred || 0}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('referral.stats.totalRewards')}</p>
              <p className="text-2xl font-bold text-green-600">{stats?.totalRewards || 0}</p>
            </div>
            <Trophy className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('referral.stats.pendingRewards')}</p>
              <p className="text-2xl font-bold text-orange-600">{stats?.pendingRewards || 0}</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-blue-600" />
          {t('referral.shareLink.title')}
        </h3>

        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-center">
                <div className="font-medium text-blue-900">{t('referral.shareLink.appTitle')}</div>
                <div className="text-sm text-blue-700 mt-1">{t('referral.shareLink.appDesc')}</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              generateLinkMutation.mutate({
                type: 'app'
              });
            }}
            disabled={generateLinkMutation.isLoading || !stats?.referralCode}
            className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-lg font-medium"
          >
            <ExternalLink className="w-5 h-5" />
            {generateLinkMutation.isLoading ? t('referral.generating') : t('referral.shareLink.generateButton')}
          </button>

          {generatedLink && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{t('referral.shareLink.linkLabel')}</span>
                <button
                  onClick={() => copyToClipboard(generatedLink)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  {t('referral.shareLink.copyAgain')}
                </button>
              </div>
              <div className="p-2 bg-white border rounded text-sm font-mono text-gray-800 break-all">
                {generatedLink}
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">{t('referral.shareLink.gameTipTitle')}</h4>
            <p className="text-sm text-yellow-700">
              {t('referral.shareLink.gameTipDesc')}
            </p>
          </div>
        </div>
      </div>

      {stats?.referredUsers && stats.referredUsers.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            {t('referral.referredUsers.title', { count: stats.referredUsers.length })}
          </h3>

          <div className="space-y-3">
            {stats.referredUsers.map((user: any) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {user.fullName?.charAt(0) || user.username?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">@{user.username}</p>
                    <p className="text-sm text-gray-500">{user.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {user.isVip && (
                    <div title={t('referral.referredUsers.vipUser')}>
                      <Crown className="w-4 h-4 text-yellow-500" />
                    </div>
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">{t('referral.rewards.title')}</h3>
        <ul className="space-y-2 text-blue-800">
          <li>{t('referral.rewards.item1')}</li>
          <li>{t('referral.rewards.item2')}</li>
          <li>{t('referral.rewards.item3')}</li>
          <li>{t('referral.rewards.item4')}</li>
        </ul>
      </div>
    </div>
  );
};

export default ReferralPage;
