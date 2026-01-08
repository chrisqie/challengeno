import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Phone,
  Globe,
  Heart,
  Save,
  X
} from 'lucide-react';
import AvatarUpload from './AvatarUpload';
import toast from 'react-hot-toast';

interface ProfileData {
  username: string;
  email: string;
  fullName: string;
  bio: string;
  location: string;
  birthDate: string;
  phone: string;
  website: string;
  interests: string[];
  avatar: string;
  // 隐私设置字段（扁平结构，匹配后端API）
  showEmail?: boolean;
  showPhone?: boolean;
  showLocation?: boolean;
  showBirthDate?: boolean;
  allowFriendRequests?: boolean;
  allowGameInvites?: boolean;
  // 兼容旧的嵌套结构
  privacy?: {
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    showBirthDate: boolean;
    allowFriendRequests: boolean;
    allowGameInvites: boolean;
  };
}

interface ProfileEditorProps {
  initialData?: Partial<ProfileData>;
  onSave: (data: ProfileData) => Promise<void>;
  onCancel: () => void;
}

const INTEREST_OPTIONS = [
  '健身运动', '阅读学习', '音乐艺术', '旅行探索', '美食烹饪',
  '科技数码', '游戏娱乐', '摄影拍照', '手工制作', '园艺种植',
  '宠物养护', '电影电视', '时尚穿搭', '理财投资', '公益志愿'
];

const ProfileEditor: React.FC<ProfileEditorProps> = ({
  initialData,
  onSave,
  onCancel
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialData?.interests || []
  );
  const [avatar, setAvatar] = useState(initialData?.avatar || '');
  const [privacy, setPrivacy] = useState({
    showEmail: initialData?.showEmail ?? initialData?.privacy?.showEmail ?? true,
    showPhone: initialData?.showPhone ?? initialData?.privacy?.showPhone ?? false,
    showLocation: initialData?.showLocation ?? initialData?.privacy?.showLocation ?? true,
    showBirthDate: initialData?.showBirthDate ?? initialData?.privacy?.showBirthDate ?? false,
    allowFriendRequests: initialData?.allowFriendRequests ?? initialData?.privacy?.allowFriendRequests ?? true,
    allowGameInvites: initialData?.allowGameInvites ?? initialData?.privacy?.allowGameInvites ?? true,
  });

  // 格式化日期为 YYYY-MM-DD 格式
  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProfileData>({
    defaultValues: {
      username: initialData?.username || '',
      email: initialData?.email || '',
      fullName: initialData?.fullName || '',
      bio: initialData?.bio || '',
      location: initialData?.location || '',
      birthDate: formatDateForInput(initialData?.birthDate || (initialData as any)?.dateOfBirth),
      phone: initialData?.phone || '',
      website: initialData?.website || '',
    }
  });

  const bio = watch('bio');

  // 处理兴趣选择
  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  // 处理隐私设置
  const updatePrivacy = (key: keyof typeof privacy, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  // 提交表单
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // 将隐私设置展开到根级别，匹配后端API期望的格式
      const submitData = {
        ...data,
        interests: selectedInterests,
        avatar,
        // 展开隐私设置到根级别
        showEmail: privacy.showEmail,
        showPhone: privacy.showPhone,
        showLocation: privacy.showLocation,
        showBirthDate: privacy.showBirthDate,
        allowFriendRequests: privacy.allowFriendRequests,
        allowGameInvites: privacy.allowGameInvites,
      };

      console.log('🔧 提交的数据:', submitData);

      await onSave(submitData);
      toast.success(t('profileEditor.saveSuccess'));
    } catch (error) {
      console.error('保存失败:', error);
      toast.error(t('profileEditor.saveFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">{t('profileEditor.title')}</h2>
        <p className="text-sm text-gray-600 mt-1">
          {t('profileEditor.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* 头像上传 */}
        <div className="flex flex-col items-center">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            {t('profileEditor.avatar')}
          </label>
          <AvatarUpload
            currentAvatar={avatar}
            onAvatarChange={setAvatar}
            size="lg"
          />
        </div>

        {/* 基本信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              邮箱
            </label>
            <input
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: '邮箱格式不正确'
                }
              })}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入邮箱地址（可选）"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              真实姓名
            </label>
            <input
              {...register('fullName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入真实姓名（可选）"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              所在地区
            </label>
            <input
              {...register('location')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入城市或地区"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              生日
            </label>
            <input
              {...register('birthDate')}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              手机号码
            </label>
            <input
              {...register('phone')}
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入手机号码（可选）"
            />
          </div>
        </div>

        {/* 个人网站 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="w-4 h-4 inline mr-1" />
            个人网站
          </label>
          <input
            {...register('website')}
            type="url"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com"
          />
        </div>

        {/* 个人简介 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            个人简介
          </label>
          <textarea
            {...register('bio')}
            rows={4}
            maxLength={200}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="介绍一下自己..."
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {bio?.length || 0}/200
          </div>
        </div>

        {/* 兴趣爱好 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Heart className="w-4 h-4 inline mr-1" />
            兴趣爱好 (最多选择5个)
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                disabled={!selectedInterests.includes(interest) && selectedInterests.length >= 5}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedInterests.includes(interest)
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            已选择 {selectedInterests.length}/5 个兴趣
          </p>
        </div>

        {/* 隐私设置 */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">隐私设置</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">显示邮箱地址</span>
              </div>
              <button
                type="button"
                onClick={() => updatePrivacy('showEmail', !privacy.showEmail)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy.showEmail ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.showEmail ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">显示手机号码</span>
              </div>
              <button
                type="button"
                onClick={() => updatePrivacy('showPhone', !privacy.showPhone)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy.showPhone ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.showPhone ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">显示所在地区</span>
              </div>
              <button
                type="button"
                onClick={() => updatePrivacy('showLocation', !privacy.showLocation)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy.showLocation ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.showLocation ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">显示生日</span>
              </div>
              <button
                type="button"
                onClick={() => updatePrivacy('showBirthDate', !privacy.showBirthDate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy.showBirthDate ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.showBirthDate ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">允许好友请求</span>
              <button
                type="button"
                onClick={() => updatePrivacy('allowFriendRequests', !privacy.allowFriendRequests)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy.allowFriendRequests ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.allowFriendRequests ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">允许游戏邀请</span>
              <button
                type="button"
                onClick={() => updatePrivacy('allowGameInvites', !privacy.allowGameInvites)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy.allowGameInvites ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.allowGameInvites ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4 inline mr-1" />
            {t('profileEditor.cancel')}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-1" />
            {isLoading ? t('profileEditor.saving') : t('profileEditor.save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;
