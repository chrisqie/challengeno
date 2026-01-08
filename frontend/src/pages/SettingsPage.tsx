import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Bell, Palette, Shield, Crown, Lock } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import ThemeSelector from '../components/ThemeSelector';
import { useTranslation } from 'react-i18next';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const isVip = user?.isVip && user?.vipExpiresAt && new Date(user.vipExpiresAt) > new Date();

  const settingSections = [
    {
      id: 'profile',
      title: t('settings.sections.profile.title'),
      icon: User,
      description: t('settings.sections.profile.description'),
      onClick: () => navigate('/profile'),
    },
    {
      id: 'password',
      title: t('settings.sections.password.title'),
      icon: Lock,
      description: t('settings.sections.password.description'),
      onClick: () => navigate('/change-password'),
    },
    {
      id: 'notifications',
      title: t('settings.sections.notifications.title'),
      icon: Bell,
      description: t('settings.sections.notifications.description'),
      onClick: () => navigate('/notifications/settings'),
    },
    {
      id: 'privacy',
      title: t('settings.sections.privacy.title'),
      icon: Shield,
      description: t('settings.sections.privacy.description'),
      onClick: () => navigate('/settings/privacy'),
    },
  ];

  if (isVip) {
    settingSections.push({
      id: 'vip',
      title: t('settings.sections.vip.title'),
      icon: Crown,
      description: t('settings.sections.vip.description'),
      onClick: () => navigate('/vip'),
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
              <h1 className="text-xl font-bold text-gray-900">{t('settings.title')}</h1>
              <p className="text-sm text-gray-600">{t('settings.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Settings Options */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('settings.options')}</h2>
              <div className="space-y-2">
                {settingSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={section.onClick}
                      className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Icon className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">{section.title}</div>
                        <div className="text-sm text-gray-600">{section.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {!isVip && (
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">升级VIP</span>
                  </div>
                  <p className="text-sm text-yellow-700 mb-3">
                    解锁更多功能和个性化选项
                  </p>
                  <button
                    onClick={() => navigate('/vip')}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    立即升级
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：主题选择 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ThemeSelector />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
