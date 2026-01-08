import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  Eye, 
  EyeOff, 
  Users, 
  Globe, 
  Lock,
  UserCheck,
  Save
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

interface PrivacySettings {
  profileVisibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
  gameHistoryVisibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
  allowFriendRequests: boolean;
  allowGameInvites: boolean;
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  showAchievements: boolean;
  showStatistics: boolean;
  dataCollection: boolean;
  marketingEmails: boolean;
}

const PrivacySettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'PUBLIC',
    gameHistoryVisibility: 'FRIENDS_ONLY',
    allowFriendRequests: true,
    allowGameInvites: true,
    showOnlineStatus: true,
    allowDirectMessages: true,
    showAchievements: true,
    showStatistics: true,
    dataCollection: true,
    marketingEmails: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // 这里应该调用API保存设置
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
      toast.success('隐私设置已保存');
    } catch (error) {
      toast.error('保存失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return <Globe className="w-4 h-4" />;
      case 'FRIENDS_ONLY':
        return <Users className="w-4 h-4" />;
      case 'PRIVATE':
        return <Lock className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return '公开';
      case 'FRIENDS_ONLY':
        return '仅好友';
      case 'PRIVATE':
        return '私密';
      default:
        return '公开';
    }
  };

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
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                隐私设置
              </h1>
              <p className="text-sm text-gray-600">管理您的隐私和数据设置</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 可见性设置 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            可见性设置
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                个人资料可见性
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['PUBLIC', 'FRIENDS_ONLY', 'PRIVATE'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setSettings(prev => ({ ...prev, profileVisibility: option as any }))}
                    className={`
                      flex items-center gap-2 p-3 border rounded-lg transition-colors
                      ${settings.profileVisibility === option
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                  >
                    {getVisibilityIcon(option)}
                    <span className="text-sm font-medium">{getVisibilityLabel(option)}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                控制其他用户是否可以查看您的个人资料信息
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                游戏历史可见性
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['PUBLIC', 'FRIENDS_ONLY', 'PRIVATE'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setSettings(prev => ({ ...prev, gameHistoryVisibility: option as any }))}
                    className={`
                      flex items-center gap-2 p-3 border rounded-lg transition-colors
                      ${settings.gameHistoryVisibility === option
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                  >
                    {getVisibilityIcon(option)}
                    <span className="text-sm font-medium">{getVisibilityLabel(option)}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                控制其他用户是否可以查看您的游戏参与历史
              </p>
            </div>
          </div>
        </div>

        {/* 社交设置 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            社交设置
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">允许好友请求</h3>
                <p className="text-sm text-gray-500">其他用户可以向您发送好友请求</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, allowFriendRequests: !prev.allowFriendRequests }))}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${settings.allowFriendRequests ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              >
                <span className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${settings.allowFriendRequests ? 'translate-x-6' : 'translate-x-1'}
                `} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">允许游戏邀请</h3>
                <p className="text-sm text-gray-500">其他用户可以邀请您参与游戏</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, allowGameInvites: !prev.allowGameInvites }))}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${settings.allowGameInvites ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              >
                <span className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${settings.allowGameInvites ? 'translate-x-6' : 'translate-x-1'}
                `} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">显示在线状态</h3>
                <p className="text-sm text-gray-500">其他用户可以看到您是否在线</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, showOnlineStatus: !prev.showOnlineStatus }))}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${settings.showOnlineStatus ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              >
                <span className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${settings.showOnlineStatus ? 'translate-x-6' : 'translate-x-1'}
                `} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">允许私信</h3>
                <p className="text-sm text-gray-500">其他用户可以向您发送私信</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, allowDirectMessages: !prev.allowDirectMessages }))}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${settings.allowDirectMessages ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              >
                <span className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${settings.allowDirectMessages ? 'translate-x-6' : 'translate-x-1'}
                `} />
              </button>
            </div>
          </div>
        </div>

        {/* 数据设置 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            数据设置
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">数据收集</h3>
                <p className="text-sm text-gray-500">允许收集使用数据以改善服务</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, dataCollection: !prev.dataCollection }))}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${settings.dataCollection ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              >
                <span className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${settings.dataCollection ? 'translate-x-6' : 'translate-x-1'}
                `} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">营销邮件</h3>
                <p className="text-sm text-gray-500">接收产品更新和营销信息</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, marketingEmails: !prev.marketingEmails }))}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${settings.marketingEmails ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              >
                <span className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${settings.marketingEmails ? 'translate-x-6' : 'translate-x-1'}
                `} />
              </button>
            </div>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            {isLoading ? '保存中...' : '保存设置'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsPage;
