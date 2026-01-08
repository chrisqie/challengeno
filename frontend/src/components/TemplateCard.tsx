import React from 'react';
import { Crown, Star, Users, Clock, Zap, Target, Award } from 'lucide-react';
import { GameTemplate } from '../types/template';

interface TemplateCardProps {
  template: GameTemplate;
  onSelect: (template: GameTemplate) => void;
  isSelected?: boolean;
  userIsVip?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect,
  isSelected = false,
  userIsVip = false
}) => {
  const isVipTemplate = template.isVipOnly;
  // 使用后端返回的canUse字段，如果没有则使用原逻辑
  const canAccess = template.canUse !== undefined ? template.canUse : (!isVipTemplate || userIsVip);

  // 获取VIP等级颜色
  const getVipTierColor = (tier?: string) => {
    switch (tier) {
      case 'BASIC': return 'text-blue-600 bg-blue-100';
      case 'PREMIUM': return 'text-purple-600 bg-purple-100';
      case 'ELITE': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // 获取分类图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'FITNESS': return <Target className="w-5 h-5" />;
      case 'HEALTH': return <Zap className="w-5 h-5" />;
      case 'LEARNING': return <Star className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  // 应用UI主题
  const getThemeStyles = () => {
    if (!template.uiTheme) return {};
    
    const theme = template.uiTheme;
    return {
      '--primary-color': theme.primaryColor,
      '--secondary-color': theme.secondaryColor,
      '--accent-color': theme.accentColor,
    } as React.CSSProperties;
  };

  const getCardClassName = () => {
    let baseClass = "relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer";
    
    if (!canAccess) {
      baseClass += " opacity-60 cursor-not-allowed bg-gray-50 border-gray-200";
    } else if (isSelected) {
      baseClass += " border-primary-500 bg-primary-50 shadow-lg";
    } else {
      baseClass += " border-gray-200 bg-white hover:border-primary-300 hover:shadow-md";
    }

    // 应用VIP主题样式
    if (template.uiTheme && canAccess) {
      const theme = template.uiTheme;
      switch (theme.cardStyle) {
        case 'premium':
          baseClass += " bg-gradient-to-br from-blue-50 to-indigo-100";
          break;
        case 'zen':
          baseClass += " bg-gradient-to-br from-green-50 to-emerald-100";
          break;
        case 'team':
          baseClass += " bg-gradient-to-br from-purple-50 to-violet-100";
          break;
        case 'luxury':
          baseClass += " bg-gradient-to-br from-amber-50 to-yellow-100 border-yellow-300";
          break;
      }
    }

    return baseClass;
  };

  const handleClick = () => {
    if (canAccess) {
      onSelect(template);
    }
  };

  return (
    <div 
      className={getCardClassName()}
      style={getThemeStyles()}
      onClick={handleClick}
    >
      {/* VIP标识 */}
      {isVipTemplate && (
        <div className="absolute top-3 right-3 flex items-center space-x-1">
          <Crown className="w-4 h-4 text-yellow-500" />
          {template.vipTier && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVipTierColor(template.vipTier)}`}>
              {template.vipTier}
            </span>
          )}
        </div>
      )}

      {/* 模板头部 */}
      <div className="flex items-start space-x-3 mb-4">
        <div className={`p-2 rounded-lg ${
          template.uiTheme ? 'bg-white bg-opacity-50' : 'bg-primary-100'
        }`}>
          {getCategoryIcon(template.category)}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {template.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {template.description}
          </p>
        </div>
      </div>

      {/* 模板信息 */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{template.maxParticipants}人</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{Math.round(template.defaultDurationHours / 24)}天</span>
          </div>
        </div>
        <div className="text-xs px-2 py-1 bg-gray-100 rounded-full">
          {template.category}
        </div>
      </div>

      {/* VIP功能特性 */}
      {template.features && canAccess && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2">特色功能:</div>
          <div className="flex flex-wrap gap-1">
            {Object.entries(template.features)
              .filter(([_, enabled]) => enabled)
              .slice(0, 3)
              .map(([feature, _]) => (
                <span 
                  key={feature}
                  className="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full"
                >
                  {getFeatureName(feature)}
                </span>
              ))
            }
            {Object.entries(template.features).filter(([_, enabled]) => enabled).length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{Object.entries(template.features).filter(([_, enabled]) => enabled).length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 无法访问提示 */}
      {!canAccess && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-xl">
          <div className="text-center">
            <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">VIP专属模板</p>
            <p className="text-xs text-gray-500">升级VIP解锁更多功能</p>
          </div>
        </div>
      )}

      {/* 选中指示器 */}
      {isSelected && canAccess && (
        <div className="absolute top-3 left-3">
          <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

// 功能名称映射
const getFeatureName = (feature: string): string => {
  const featureNames: Record<string, string> = {
    dataAnalytics: '数据分析',
    progressCharts: '进度图表',
    socialSharing: '社交分享',
    customReminders: '自定义提醒',
    guidedSessions: '引导课程',
    progressTracking: '进度追踪',
    moodAnalysis: '情绪分析',
    streakRewards: '连击奖励',
    teamRanking: '团队排行',
    collaborativeGoals: '协作目标',
    teamChat: '团队聊天',
    sharedRewards: '共享奖励',
    customChallenges: '自定义挑战',
    aiCoaching: 'AI指导',
    personalizedPlan: '个性化计划',
    expertConsultation: '专家咨询',
    advancedAnalytics: '高级分析',
    prioritySupport: '优先支持',
    customBranding: '自定义品牌'
  };
  return featureNames[feature] || feature;
};

export default TemplateCard;
