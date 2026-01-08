import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  User,
  Edit3,
  Settings,
  Trophy,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Globe,
  Heart,
  Gamepad2,
  Users,
  Star,
  Shield
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { usersAPI } from '../services/api';
import ProfileEditor from '../components/ProfileEditor';
import LoadingSpinner from '../components/LoadingSpinner';
import LocationDisplay from '../components/LocationDisplay';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function EnhancedProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // 获取用户详细资料
  const { data: profile, isLoading } = useQuery(
    ['user-profile', user?.id],
    () => usersAPI.getProfile(user?.username || ''),
    {
      enabled: !!user?.username,
      select: (response) => response.data
    }
  );

  const updateProfileMutation = useMutation(
    (data: any) => usersAPI.updateProfile(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user-profile', user?.id]);
        setIsEditing(false);
        toast.success(t('enhancedProfile.updateSuccess'));
      },
      onError: () => {
        toast.error(t('enhancedProfile.updateError'));
      }
    }
  );

  const getTrustBadge = (trustPoints: number) => {
    if (trustPoints >= 150) return { label: t('enhancedProfile.trustBadges.diamond'), color: 'text-purple-600 bg-purple-100', icon: '💎' };
    if (trustPoints >= 100) return { label: t('enhancedProfile.trustBadges.gold'), color: 'text-yellow-600 bg-yellow-100', icon: '🥇' };
    if (trustPoints >= 70) return { label: t('enhancedProfile.trustBadges.silver'), color: 'text-gray-600 bg-gray-100', icon: '🥈' };
    if (trustPoints >= 50) return { label: t('enhancedProfile.trustBadges.bronze'), color: 'text-orange-600 bg-orange-100', icon: '🥉' };
    if (trustPoints >= 20) return { label: t('enhancedProfile.trustBadges.regular'), color: 'text-blue-600 bg-blue-100', icon: '👤' };
    return { label: t('enhancedProfile.trustBadges.newbie'), color: 'text-green-600 bg-green-100', icon: '🌱' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isEditing) {
    // 合并用户数据，优先使用authStore中的完整数据
    const combinedData = {
      ...profile,
      ...user, // authStore中的用户数据包含email和dateOfBirth
      // 确保字段名匹配
      birthDate: user?.dateOfBirth || profile?.dateOfBirth,
    };

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <ProfileEditor
            initialData={combinedData}
            onSave={async (data) => {
              await updateProfileMutation.mutateAsync(data);
            }}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  const trustBadge = getTrustBadge(profile?.trustPoints || user?.trustPoints || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 个人资料卡片 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* 头部背景 */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          
          {/* 个人信息 */}
          <div className="relative px-6 pb-6">
            {/* 头像 */}
            <div className="flex items-end justify-between -mt-16 mb-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="头像"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    (profile?.username || user?.username)?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                {(profile?.isVip || user?.isVip) && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    ⭐
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>{t('enhancedProfile.editProfile')}</span>
              </button>
            </div>

            {/* 基本信息 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile?.fullName || user?.fullName || `@${profile?.username || user?.username}`}
                </h1>

                {/* 会员级别标识 */}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${trustBadge.color}`}>
                  {trustBadge.icon} {trustBadge.label}
                </span>

                {(profile?.isVip || user?.isVip) && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    ⭐ {t('enhancedProfile.vipUser')}
                  </span>
                )}
              </div>
              
              {(profile?.fullName || user?.fullName) && (
                <p className="text-gray-600">@{profile?.username || user?.username}</p>
              )}
              
              {profile?.bio && (
                <p className="text-gray-700 max-w-2xl">{profile.bio}</p>
              )}

              {/* 联系信息 */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {/* 自动检测的地理位置 */}
                <div className="flex items-center space-x-1">
                  <LocationDisplay className="text-sm" showDetails={false} />
                </div>

                {profile?.location && profile.privacy?.showLocation !== false && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{t('enhancedProfile.setLocation')}: {profile.location}</span>
                  </div>
                )}
                
                {profile?.email && profile.privacy?.showEmail !== false && (
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                )}
                
                {profile?.phone && profile.privacy?.showPhone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                
                {profile?.website && (
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {t('enhancedProfile.website')}
                    </a>
                  </div>
                )}

                {profile?.birthDate && profile.privacy?.showBirthDate && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{t('enhancedProfile.birthday')} {new Date(profile.birthDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {profile?.interests && profile.interests.length > 0 && (
                <div className="pt-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Heart className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{t('enhancedProfile.interests')}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{profile?.trustPoints || user?.trustPoints || 0}</div>
            <div className="text-sm text-gray-600">{t('enhancedProfile.stats.trustPoints')}</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <Gamepad2 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{profile?.totalGamesJoined || user?.totalGamesJoined || 0}</div>
            <div className="text-sm text-gray-600">{t('enhancedProfile.stats.gamesJoined')}</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{profile?.friendsCount || 0}</div>
            <div className="text-sm text-gray-600">{t('enhancedProfile.stats.friendsCount')}</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{profile?.achievementsCount || 0}</div>
            <div className="text-sm text-gray-600">{t('enhancedProfile.stats.achievements')}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{t('enhancedProfile.recentActivity.title')}</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8 text-gray-500">
              <Gamepad2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>{t('enhancedProfile.recentActivity.empty')}</p>
              <p className="text-sm mt-1">{t('enhancedProfile.recentActivity.hint')}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mt-6 border border-blue-200">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">{t('enhancedProfile.privacy.title')}</h3>
              <p className="text-sm text-blue-800">
                {t('enhancedProfile.privacy.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
