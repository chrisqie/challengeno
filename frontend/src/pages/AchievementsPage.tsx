import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Trophy,
  Star,
  Crown,
  Award,
  Target,
  Users,
  Heart,
  Zap,
  ArrowLeft,
  Lock,
  CheckCircle,
  Share2
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { achievementsAPI, referralAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  type: string;
  rarity: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: any;
  reward: any;
}

const AchievementsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [highlightAchievementId, setHighlightAchievementId] = useState<string | null>(null);

  // 复制到剪贴板的通用函数
  const copyToClipboard = async (text: string) => {
    try {
      // 优先使用现代剪贴板API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      // 降级方案：使用传统方法
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

      return successful;
    } catch (err) {
      console.error('复制失败:', err);
      return false;
    }
  };

  // 分享单个成就
  const shareAchievement = async (achievementId: string, achievementName: string) => {
    try {
      const response = await referralAPI.generateShareLink({
        type: 'user_achievement',
        targetId: achievementId
      });
      const shareLink = response.data.shareLink;

      const success = await copyToClipboard(shareLink);
      if (success) {
        toast.success(t('achievements.shareLinkCopied', { name: achievementName }));
      } else {
        toast.error(t('achievements.copyFailed'));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('achievements.shareFailed'));
    }
  };

  // 分享成就总览
  const shareAchievementsOverview = async () => {
    try {
      const response = await referralAPI.generateShareLink({
        type: 'achievements_overview'
      });
      const shareLink = response.data.shareLink;

      const success = await copyToClipboard(shareLink);
      if (success) {
        toast.success(t('achievements.overviewLinkCopied'));
      } else {
        toast.error(t('achievements.copyFailed'));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('achievements.shareFailed'));
    }
  };

  // 加载成就数据
  const loadAchievements = async () => {
    try {
      setLoading(true);
      const response = await achievementsAPI.getUserAchievements();
      setAchievements(response.data || []);
    } catch (error: any) {
      console.error('加载成就失败:', error);
      toast.error(t('achievements.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  // 处理URL参数中的高亮成就
  useEffect(() => {
    const highlightId = searchParams.get('highlight');
    if (highlightId) {
      setHighlightAchievementId(highlightId);
      // 3秒后移除高亮效果
      setTimeout(() => {
        setHighlightAchievementId(null);
      }, 3000);
    }
  }, [searchParams]);

  // 获取分类图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PARTICIPATION': return <Target className="w-5 h-5" />;
      case 'CREATION': return <Zap className="w-5 h-5" />;
      case 'SOCIAL': return <Users className="w-5 h-5" />;
      case 'TRUST': return <Heart className="w-5 h-5" />;
      case 'MILESTONE': return <Crown className="w-5 h-5" />;
      case 'SPECIAL': return <Star className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  // 获取分类名称
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'PARTICIPATION': return t('achievements.categories.participation');
      case 'CREATION': return t('achievements.categories.creation');
      case 'SOCIAL': return t('achievements.categories.social');
      case 'TRUST': return t('achievements.categories.trust');
      case 'MILESTONE': return t('achievements.categories.milestone');
      case 'SPECIAL': return t('achievements.categories.special');
      default: return t('achievements.categories.other');
    }
  };

  // 获取稀有度颜色
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return 'text-gray-600 bg-gray-100';
      case 'RARE': return 'text-blue-600 bg-blue-100';
      case 'EPIC': return 'text-purple-600 bg-purple-100';
      case 'LEGENDARY': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // 获取稀有度名称
  const getRarityName = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return t('achievements.rarity.common');
      case 'RARE': return t('achievements.rarity.rare');
      case 'EPIC': return t('achievements.rarity.epic');
      case 'LEGENDARY': return t('achievements.rarity.legendary');
      default: return t('achievements.rarity.common');
    }
  };

  // 筛选成就
  const filteredAchievements = achievements.filter(achievement => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'unlocked') return achievement.unlocked;
    if (selectedCategory === 'locked') return !achievement.unlocked;
    return achievement.category === selectedCategory;
  });

  // 获取统计数据
  const stats = {
    total: achievements.length,
    unlocked: achievements.filter(a => a.unlocked).length,
    locked: achievements.filter(a => !a.unlocked).length,
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Trophy className="w-8 h-8 text-yellow-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('achievements.title')}</h1>
            <p className="text-sm text-gray-500">{t('achievements.subtitle')}</p>
          </div>
        </div>

        {/* Share Achievements Overview Button */}
        <button
          onClick={shareAchievementsOverview}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          title={t('achievements.shareAchievementsTitle')}
        >
          <Share2 className="w-4 h-4" />
          <span>{t('achievements.shareAchievements')}</span>
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 text-center">
          <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">{t('achievements.stats.total')}</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">{t('achievements.stats.unlocked')}</p>
          <p className="text-2xl font-bold text-green-600">{stats.unlocked}</p>
        </div>
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 text-center">
          <Lock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">{t('achievements.stats.locked')}</p>
          <p className="text-2xl font-bold text-gray-600">{stats.locked}</p>
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4 overflow-x-auto">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Award className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{t('achievements.filterLabel')}</span>
          </div>

          {[
            { key: 'all', name: t('achievements.filters.all'), icon: Award },
            { key: 'unlocked', name: t('achievements.filters.unlocked'), icon: CheckCircle },
            { key: 'locked', name: t('achievements.filters.locked'), icon: Lock },
            { key: 'PARTICIPATION', name: t('achievements.categories.participation'), icon: Target },
            { key: 'CREATION', name: t('achievements.categories.creation'), icon: Zap },
            { key: 'SOCIAL', name: t('achievements.categories.social'), icon: Users },
            { key: 'TRUST', name: t('achievements.categories.trust'), icon: Heart },
            { key: 'MILESTONE', name: t('achievements.categories.milestone'), icon: Crown },
            { key: 'SPECIAL', name: t('achievements.categories.special'), icon: Star },
          ].map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors flex-shrink-0 ${
                  selectedCategory === category.key
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Achievement List */}
      {filteredAchievements.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('achievements.noAchievements')}</h3>
          <p className="text-gray-500">{t('achievements.noAchievementsDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-white rounded-lg shadow hover:shadow-md transition-all duration-500 p-6 ${
                achievement.unlocked ? 'border-l-4 border-green-500' : 'opacity-75'
              } ${
                highlightAchievementId === achievement.id
                  ? 'ring-4 ring-blue-300 ring-opacity-50 bg-blue-50'
                  : ''
              }`}
            >
              {/* 成就头部 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                      {achievement.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {getCategoryIcon(achievement.category)}
                      <span className="text-xs text-gray-500">
                        {getCategoryName(achievement.category)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* 稀有度标签 */}
                <span className={`px-2 py-1 text-xs rounded-full ${getRarityColor(achievement.rarity)}`}>
                  {getRarityName(achievement.rarity)}
                </span>
              </div>

              {/* 成就描述 */}
              <p className={`text-sm mb-4 ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                {achievement.description}
              </p>

              {/* 解锁状态和分享 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {achievement.unlocked ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">{t('achievements.unlocked')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm">{t('achievements.locked')}</span>
                    </div>
                  )}

                  {achievement.unlocked && achievement.unlockedAt && (
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* 分享按钮 - 只有已解锁的成就才显示 */}
                {achievement.unlocked && (
                  <button
                    onClick={() => shareAchievement(achievement.id, achievement.name)}
                    className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                    title={t('achievements.shareTitle', { name: achievement.name })}
                  >
                    <Share2 className="w-3 h-3" />
                    <span>{t('achievements.share')}</span>
                  </button>
                )}
              </div>

              {/* 奖励信息 */}
              {achievement.reward && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">{t('achievements.reward')}</p>
                  <div className="text-sm text-primary-600">
                    {achievement.reward.points && (
                      <span>{t('achievements.rewardPoints', { amount: achievement.reward.points.amount })}</span>
                    )}
                    {achievement.reward.vip && (
                      <span>{t('achievements.rewardVip', { days: achievement.reward.vip.duration })}</span>
                    )}
                    {achievement.reward.special && (
                      <span>{achievement.reward.special}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;
