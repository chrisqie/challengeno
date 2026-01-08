import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { templatesAPI } from '../services/api';
import { getTemplateConfig } from '../config/templateConfigs';
import { getAllQuickTemplates } from '../config/quickTemplateConfigs';
import { GENERAL_TEMPLATE_CONFIG } from '../config/generalTemplateConfig';
import { TemplateType } from '../types/templateConfig';
import { Crown, AlertTriangle, Clock, Users, Settings, Zap, Globe, Rocket, Wrench } from 'lucide-react';
interface GameTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  difficultyLevel: string;
  riskLevel: string;
  isQuickStart: boolean;
  isVipOnly: boolean;
  vipTier?: string;
  canUse: boolean;
  requiresVip: boolean;
  requiredVipTier?: string;
  templateOptions?: any;
  uiTheme?: any;
  features?: any;
  defaultDurationHours: number;
  maxParticipants: number;
  evidenceType: string;
  instructions: string;
  exampleEvidence?: string;
  isAgeRestricted?: boolean;
  isActive?: boolean;
  usageCount?: number;
  successRate?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface TemplateSelectorProps {
  onTemplateSelect: (template: GameTemplate) => void;
  selectedTemplateId?: string;
}

interface CategorySubcategory {
  key: string;
  name: string;
}

interface Category {
  key: string;
  name: string;
  icon: string;
  subcategories: CategorySubcategory[];
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onTemplateSelect,
  selectedTemplateId
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [templateType, setTemplateType] = useState<'quick' | 'custom' | 'general'>('quick');
  const [showQuickStart, setShowQuickStart] = useState<boolean>(true);

  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // 获取模板类型
  const getTemplateType = (template: GameTemplate): { type: TemplateType; label: string; icon: React.ReactNode; color: string } => {
    const configDef = getTemplateConfig(template.name);

    if (template.name === 'general_challenge') {
      return {
        type: TemplateType.GENERAL,
        label: '通用',
        icon: <Globe className="w-4 h-4" />,
        color: 'bg-gray-100 text-gray-700'
      };
    }

    if (template.isQuickStart) {
      return {
        type: TemplateType.QUICK_START,
        label: '快捷',
        icon: <Zap className="w-4 h-4" />,
        color: 'bg-green-100 text-green-700'
      };
    }

    if (configDef) {
      return {
        type: TemplateType.CUSTOM,
        label: '精细',
        icon: <Settings className="w-4 h-4" />,
        color: 'bg-blue-100 text-blue-700'
      };
    }

    return {
      type: TemplateType.QUICK_START,
      label: '标准',
      icon: <Clock className="w-4 h-4" />,
      color: 'bg-purple-100 text-purple-700'
    };
  };

  // 获取模板数据
  const { data: templatesResponse, isLoading } = useQuery(
    ['templates', selectedCategory, selectedSubcategory, currentLanguage],
    () => templatesAPI.getTemplates({
      category: selectedCategory || undefined,
      subcategory: selectedSubcategory || undefined,
      language: currentLanguage
    }),
    {
      enabled: !!selectedCategory && !!selectedSubcategory // 需要选择分类和子分类才查询模板
    }
  );

  // 获取快速开始模板
  const { data: quickStartResponse } = useQuery(
    ['templates', 'quick-start', currentLanguage],
    () => templatesAPI.getQuickStartTemplates()
  );

  const templates = (templatesResponse?.data || []) as GameTemplate[];
  const quickStartTemplates = (quickStartResponse?.data || []) as GameTemplate[];

  const categories: Category[] = [
    {
      key: 'HEALTH',
      name: '健康 Health',
      icon: '🏃‍♂️',
      subcategories: [
        { key: 'HEALTH_DIET', name: '饮食营养' },
        { key: 'HEALTH_SLEEP', name: '睡眠作息' },
        { key: 'HEALTH_MENTAL', name: '心理健康' }
      ]
    },
    {
      key: 'LEARNING',
      name: '学习 Learning',
      icon: '📚',
      subcategories: [
        { key: 'LEARNING_LANGUAGE', name: '语言学习' },
        { key: 'LEARNING_SKILL', name: '技能提升' },
        { key: 'LEARNING_READING', name: '阅读写作' },
        { key: 'LEARNING_EXAM', name: '考试备考' }
      ]
    },
    {
      key: 'LIFESTYLE',
      name: '生活 Lifestyle',
      icon: '🏠',
      subcategories: [
        { key: 'LIFESTYLE_HOME', name: '家务整理' },
        { key: 'LIFESTYLE_FINANCE', name: '理财储蓄' },
        { key: 'LIFESTYLE_COOKING', name: '烹饪美食' }
      ]
    },
    {
      key: 'FITNESS',
      name: '健身 Fitness',
      icon: '💪',
      subcategories: [
        { key: 'FITNESS_CARDIO', name: '有氧运动' },
        { key: 'FITNESS_STRENGTH', name: '力量训练' },
        { key: 'FITNESS_YOGA', name: '瑜伽冥想' }
      ]
    },
    {
      key: 'PERSONAL',
      name: '个人成长 Personal',
      icon: '🌱',
      subcategories: [
        { key: 'PERSONAL_PRODUCTIVITY', name: '效率提升' },
        { key: 'PERSONAL_GROWTH', name: '个人成长' },
        { key: 'PERSONAL_CREATIVITY', name: '创意表达' }
      ]
    },
    {
      key: 'SOCIAL',
      name: '社交 Social',
      icon: '👥',
      subcategories: [
        { key: 'SOCIAL_COMMUNITY', name: '社区参与' },
        { key: 'SOCIAL_RELATIONSHIP', name: '人际关系' }
      ]
    },
    {
      key: 'WORK',
      name: '工作 Work',
      icon: '💼',
      subcategories: [
        { key: 'WORK_CAREER', name: '职业发展' },
        { key: 'WORK_EFFICIENCY', name: '工作效率' },
        { key: 'WORK_STARTUP', name: '创业项目' }
      ]
    }
  ];

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'text-green-600 bg-green-100';
      case 'INTERMEDIATE': return 'text-yellow-600 bg-yellow-100';
      case 'ADVANCED': return 'text-orange-600 bg-orange-100';
      case 'EXPERT': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'HIGH': return 'text-orange-600';
      case 'EXTREME': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleTemplateSelect = (template: GameTemplate) => {
    if (!template.canUse) {
      alert(`此模板需要 ${template.requiredVipTier} VIP 权限`);
      return;
    }
    onTemplateSelect(template);
  };

  return (
    <div className="space-y-6">
      {/* Quick Start 模板 */}
      {showQuickStart && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              ⚡ Quick Start - 热门挑战
            </h3>
            <button
              onClick={() => setShowQuickStart(false)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              自定义挑战 →
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {quickStartTemplates.map((template: GameTemplate) => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-center ${
                  selectedTemplateId === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : template.canUse 
                    ? 'border-gray-200 hover:border-blue-500 hover:bg-blue-50' 
                    : 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="text-2xl mb-2">
                  {template.category === 'HEALTH' && '💧'}
                  {template.category === 'ENTERTAINMENT' && '🌤️'}
                  {template.category === 'LEARNING' && '📚'}
                  {template.category === 'LIFESTYLE' && '🌅'}
                  {template.category === 'SOCIAL' && '📱'}
                </div>
                <div className="font-medium text-sm">{template.title}</div>
                <div className="flex items-center justify-center mt-2 space-x-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{Math.floor(template.defaultDurationHours / 24)}天</span>
                </div>
                {template.isVipOnly && (
                  <div className="mt-2">
                    <span className="bg-yellow-400 text-white text-xs px-2 py-1 rounded flex items-center justify-center">
                      <Crown className="w-3 h-3 mr-1" />
                      VIP
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 自定义模板选择 */}
      {!showQuickStart && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">选择挑战分类</h3>
            <button
              onClick={() => setShowQuickStart(true)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ← 返回快速开始
            </button>
          </div>
          
          {/* 大分类选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">大分类</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.key}
                  onClick={() => {
                    setSelectedCategory(category.key);
                    setSelectedSubcategory('');
                  }}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-center ${
                    selectedCategory === category.key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="font-medium text-sm">{category.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 小分类选择 */}
          {selectedCategory && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">小分类</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.find(c => c.key === selectedCategory)?.subcategories.map((subcategory) => (
                  <div
                    key={subcategory.key}
                    onClick={() => setSelectedSubcategory(subcategory.key)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all text-center ${
                      selectedSubcategory === subcategory.key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{subcategory.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 模板选择 */}
          {selectedSubcategory && (
            <div>
              <label className="block text-sm font-medium mb-3">选择模板</label>
              {isLoading ? (
                <div className="text-center py-8">加载中...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.filter((t: GameTemplate) =>
                    t.category === selectedCategory && t.subcategory === selectedSubcategory
                  ).map((template: GameTemplate) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedTemplateId === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : template.canUse
                          ? 'border-gray-200 hover:border-blue-300'
                          : 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm">{template.title}</h4>
                        <div className="flex items-center space-x-1">
                          {template.riskLevel === 'HIGH' && (
                            <AlertTriangle className={`w-4 h-4 ${getRiskColor(template.riskLevel)}`} />
                          )}
                          {template.isVipOnly && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                      </div>

                      {/* 模板类型标识 */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTemplateType(template).color}`}>
                          {getTemplateType(template).icon}
                          <span className="ml-1">{getTemplateType(template).label}</span>
                        </span>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{Math.floor(template.defaultDurationHours / 24)}天</span>
                          <Users className="w-3 h-3 ml-2" />
                          <span>{template.maxParticipants}人</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                      
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded ${getDifficultyColor(template.difficultyLevel)}`}>
                            {template.difficultyLevel}
                          </span>
                          <div className="flex items-center text-gray-500">
                            <Users className="w-3 h-3 mr-1" />
                            <span>{template.maxParticipants}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{Math.floor(template.defaultDurationHours / 24)}天</span>
                        </div>
                      </div>
                      
                      {!template.canUse && (
                        <div className="mt-2 text-xs text-red-600 flex items-center">
                          <Crown className="w-3 h-3 mr-1" />
                          需要 {template.requiredVipTier} VIP 权限
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
