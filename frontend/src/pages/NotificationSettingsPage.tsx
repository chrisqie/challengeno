import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Mail, Smartphone, Clock, Shield, Save, RotateCcw, BarChart3, Users, Trophy, AlertTriangle, Crown } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { notificationSettingsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

interface NotificationSettings {
  inAppEnabled: boolean;
  emailEnabled: boolean;
  emailFrequency: 'IMMEDIATE' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'DISABLED';
  pushEnabled: boolean;
  gameInvites: boolean;
  gameUpdates: boolean;
  friendRequests: boolean;
  achievements: boolean;
  systemUpdates: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  // 添加缺失的属性
  friendAccepted: boolean;
  gameStarted: boolean;
  gameCompleted: boolean;
  evidenceRequired: boolean;
  systemNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
}

const NotificationSettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [settings, setSettings] = useState<NotificationSettings>({
    inAppEnabled: true,
    emailEnabled: true,
    emailFrequency: 'IMMEDIATE',
    pushEnabled: true,
    gameInvites: true,
    gameUpdates: true,
    friendRequests: true,
    achievements: true,
    systemUpdates: true,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    // 添加缺失的默认值
    friendAccepted: true,
    gameStarted: true,
    gameCompleted: true,
    evidenceRequired: true,
    systemNotifications: true,
    emailNotifications: true,
    pushNotifications: true,
  });

  // 加载通知设置
  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await notificationSettingsAPI.getSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('加载通知设置失败:', error);
      toast.error('加载设置失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载通知统计
  const loadStats = async () => {
    try {
      const response = await notificationSettingsAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('加载统计失败:', error);
    }
  };

  useEffect(() => {
    loadSettings();
    if (showStats) {
      loadStats();
    }
  }, [showStats]);

  // 保存设置
  const handleSave = async () => {
    try {
      setSaving(true);
      await notificationSettingsAPI.updateSettings(settings);
      toast.success('设置已保存');
    } catch (error) {
      console.error('保存设置失败:', error);
      toast.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  // 重置设置
  const handleReset = async () => {
    try {
      setSaving(true);
      const response = await notificationSettingsAPI.resetSettings();
      setSettings(response.data);
      toast.success('设置已重置为默认值');
    } catch (error) {
      console.error('重置设置失败:', error);
      toast.error('重置失败');
    } finally {
      setSaving(false);
    }
  };

  // 更新设置
  const updateSetting = (key: keyof NotificationSettings, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Bell className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">通知设置</h1>
            <p className="text-sm text-gray-500">管理您的通知偏好</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span>统计</span>
          </button>
          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* 通知统计 */}
      {showStats && stats && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">通知统计（最近30天）</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">总通知数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.unread}</div>
              <div className="text-sm text-gray-600">未读通知</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.total > 0 ? Math.round((1 - stats.unread / stats.total) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">已读率</div>
            </div>
          </div>
        </div>
      )}

      {/* 通知类型设置 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">通知类型</h2>
        <div className="space-y-4">
          {/* 好友相关通知 */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-medium text-gray-900">好友请求</h3>
                <p className="text-sm text-gray-500">收到新的好友请求时通知</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.friendRequests}
                onChange={(e) => updateSetting('friendRequests', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-green-500" />
              <div>
                <h3 className="font-medium text-gray-900">好友通过</h3>
                <p className="text-sm text-gray-500">好友请求被接受时通知</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.friendAccepted}
                onChange={(e) => updateSetting('friendAccepted', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* 游戏相关通知 */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Trophy className="w-5 h-5 text-green-500" />
              <div>
                <h3 className="font-medium text-gray-900">游戏开始</h3>
                <p className="text-sm text-gray-500">参与的游戏开始时通知</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.gameStarted}
                onChange={(e) => updateSetting('gameStarted', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <div>
                <h3 className="font-medium text-gray-900">游戏完成</h3>
                <p className="text-sm text-gray-500">游戏结束和结果公布时通知</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.gameCompleted}
                onChange={(e) => updateSetting('gameCompleted', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <h3 className="font-medium text-gray-900">提交证据</h3>
                <p className="text-sm text-gray-500">需要提交证据时通知</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.evidenceRequired}
                onChange={(e) => updateSetting('evidenceRequired', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* 系统通知 */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <Crown className="w-5 h-5 text-purple-500" />
              <div>
                <h3 className="font-medium text-gray-900">系统通知</h3>
                <p className="text-sm text-gray-500">系统更新和重要公告</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.systemNotifications}
                onChange={(e) => updateSetting('systemNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 通知方式设置 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">通知方式</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h3 className="font-medium text-gray-900">邮件通知</h3>
              <p className="text-sm text-gray-500">通过邮件接收重要通知</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium text-gray-900">推送通知</h3>
              <p className="text-sm text-gray-500">浏览器推送通知</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? (
            <LoadingSpinner size="sm" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? '保存中...' : '保存设置'}</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
