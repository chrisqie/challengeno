import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { templatesAPI } from '../services/api';
import { getTemplateConfig } from '../config/templateConfigs';
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

interface ThreeLayerTemplateSelectorProps {
  onTemplateSelect: (template: GameTemplate) => void;
  selectedTemplateId?: string;
  onNext?: () => void;  // 可选的下一步回调
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

const ThreeLayerTemplateSelector: React.FC<ThreeLayerTemplateSelectorProps> = ({
  onTemplateSelect,
  selectedTemplateId,
  onNext
}) => {
  const [templateType, setTemplateType] = useState<'quick' | 'custom' | 'general'>('quick');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [localSelectedTemplateId, setLocalSelectedTemplateId] = useState<string>('');

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // 获取快捷模板数据（从后端）
  const { data: quickTemplatesResponse } = useQuery(
    ['templates', 'quick-start', currentLanguage],
    () => templatesAPI.getTemplates({ isQuickStart: true, language: currentLanguage }),
    {
      enabled: templateType === 'quick'
    }
  );

  // 获取通用模板数据（从后端）
  const { data: generalTemplateResponse } = useQuery(
    ['templates', 'general', currentLanguage],
    () => templatesAPI.getTemplates({ language: currentLanguage }),
    {
      enabled: templateType === 'general'
    }
  );

  // 快捷模板：直接使用数据库中 isQuickStart=true 的模板
  const quickGameTemplates = (quickTemplatesResponse?.data || []) as GameTemplate[];

  const allTemplates = (generalTemplateResponse?.data || []) as GameTemplate[];
  const generalGameTemplate = allTemplates.find(t => t.name === 'general_custom'); // 查找通用模板

  // 获取精细模板数据
  const { data: templatesResponse, isLoading } = useQuery(
    ['templates', selectedCategory, selectedSubcategory, currentLanguage],
    () => templatesAPI.getTemplates({
      category: selectedCategory || undefined,
      subcategory: selectedSubcategory || undefined,
      language: currentLanguage
    }),
    {
      enabled: templateType === 'custom' && !!selectedCategory && !!selectedSubcategory
    }
  );

  // 精细模板：排除快捷模板（isQuickStart=true 的模板）
  const allCustomTemplates = (templatesResponse?.data || []) as GameTemplate[];
  const customTemplates = allCustomTemplates.filter(t => !t.isQuickStart);

  const categories: Category[] = [
    {
      key: 'HEALTH',
      name: 'Health',
      icon: '🏃‍♂️',
      subcategories: [
        { key: 'HEALTH_SLEEP', name: 'Sleep' },
        { key: 'HEALTH_DIET', name: 'Diet' },
        { key: 'HEALTH_MENTAL', name: 'Mental Health' }
      ]
    },
    {
      key: 'FITNESS',
      name: 'Fitness',
      icon: '💪',
      subcategories: [
        { key: 'FITNESS_CARDIO', name: 'Cardio' },
        { key: 'FITNESS_STRENGTH', name: 'Strength Training' },
        { key: 'FITNESS_FLEXIBILITY', name: 'Flexibility' }
      ]
    },
    {
      key: 'LEARNING',
      name: 'Learning',
      icon: '📚',
      subcategories: [
        { key: 'LEARNING_LANGUAGE', name: 'Language Learning' },
        { key: 'LEARNING_SKILL', name: 'Skill Development' },
        { key: 'LEARNING_READING', name: 'Reading' }
      ]
    },
    {
      key: 'PERSONAL',
      name: 'Personal Growth',
      icon: '🌱',
      subcategories: [
        { key: 'PERSONAL_PRODUCTIVITY', name: 'Productivity' },
        { key: 'PERSONAL_CREATIVITY', name: 'Creativity' },
        { key: 'PERSONAL_GROWTH', name: 'Habit Building' }
      ]
    },
    {
      key: 'LIFESTYLE',
      name: 'Lifestyle',
      icon: '🏠',
      subcategories: [
        { key: 'LIFESTYLE_HOME', name: 'Home Life' },
        { key: 'LIFESTYLE_SOCIAL', name: 'Social' },
        { key: 'LIFESTYLE_HOBBY', name: 'Hobbies' }
      ]
    },
    {
      key: 'WORK',
      name: 'Career Development',
      icon: '💼',
      subcategories: [
        { key: 'CAREER_STARTUP', name: 'Startup Projects' },
        { key: 'CAREER_NETWORKING', name: 'Professional Networking' },
        { key: 'CAREER_SKILLS', name: 'Skill Enhancement' }
      ]
    }
  ];

  const handleTemplateSelect = (template: GameTemplate) => {
    if (!template.canUse) {
      alert(`This template requires ${template.requiredVipTier} VIP membership`);
      return;
    }
    setLocalSelectedTemplateId(template.id);
    onTemplateSelect(template);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'HEALTH': return '💧';
      case 'LEARNING': return '📚';
      case 'FITNESS': return '💪';
      case 'PERSONAL': return '🌱';
      case 'LIFESTYLE': return '🏠';
      case 'WORK': return '💼';
      default: return '⭐';
    }
  };

  return (
    <div className="space-y-6">
      {/* 三层模板类型选择 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{t('wizard.selectTemplateType')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 快捷模板 */}
          <div
            onClick={() => setTemplateType('quick')}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              templateType === 'quick'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="text-center">
              <Rocket className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-semibold text-green-800">{t('wizard.quickTemplateCard.title')}</h4>
              <p className="text-sm text-green-600 mt-1">{t('wizard.quickTemplateCard.subtitle')}</p>
              <p className="text-xs text-gray-500 mt-2">{t('wizard.quickTemplateCard.description')}</p>
            </div>
          </div>

          {/* 精细模板 */}
          <div
            onClick={() => setTemplateType('custom')}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              templateType === 'custom'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="text-center">
              <Settings className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold text-blue-800">{t('wizard.customTemplateCard.title')}</h4>
              <p className="text-sm text-blue-600 mt-1">{t('wizard.customTemplateCard.subtitle')}</p>
              <p className="text-xs text-gray-500 mt-2">{t('wizard.customTemplateCard.description')}</p>
            </div>
          </div>

          {/* 通用模板 */}
          <div
            onClick={() => setTemplateType('general')}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all relative ${
              templateType === 'general'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            {/* VIP标签 */}
            <div className="absolute top-3 right-3 flex items-center space-x-1">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
                BASIC
              </span>
            </div>

            <div className="text-center">
              <Wrench className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-semibold text-purple-800">{t('wizard.generalTemplateCard.title')}</h4>
              <p className="text-sm text-purple-600 mt-1">{t('wizard.generalTemplateCard.subtitle')}</p>
              <p className="text-xs text-gray-500 mt-2">{t('wizard.generalTemplateCard.description')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 快捷模板展示 */}
      {templateType === 'quick' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-800">{t('wizard.quickTemplates')}</h3>
          <p className="text-gray-600 mb-4">{t('wizard.quickTemplatesDesc')}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickGameTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-center ${
                  selectedTemplateId === template.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
                }`}
              >
                <div className="text-2xl mb-2">{getCategoryIcon(template.category)}</div>
                <div className="font-medium text-sm">{template.title}</div>
                <div className="text-xs text-gray-500 mt-1">{template.category}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 通用模板展示 */}
      {templateType === 'general' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-800">{t('wizard.generalTemplateCard.title')}</h3>
          <p className="text-gray-600 mb-4">{t('wizard.generalTemplate.description')}</p>

          {generalGameTemplate ? (
            <div
              onClick={() => handleTemplateSelect(generalGameTemplate)}
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all text-center ${
                selectedTemplateId === generalGameTemplate.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-500 hover:bg-purple-50'
              }`}
            >
              <Wrench className="w-12 h-12 mx-auto mb-3 text-purple-600" />
              <div className="font-semibold text-lg">{generalGameTemplate.title}</div>
              <div className="text-sm text-gray-600 mt-2">{generalGameTemplate.description}</div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Wrench className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>{t('wizard.loadingTemplates')}</p>
            </div>
          )}
        </div>
      )}

      {/* 精细模板展示 */}
      {templateType === 'custom' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">{t('wizard.advancedTemplates')}</h3>
          <p className="text-gray-600 mb-4">{t('wizard.parametricTemplate.description')}</p>

          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Select Category</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.key}
                  onClick={() => {
                    setSelectedCategory(category.key);
                    setSelectedSubcategory('');
                    setLocalSelectedTemplateId('');
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

          {/* Subcategory Selection */}
          {selectedCategory && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Select Subcategory</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.find(c => c.key === selectedCategory)?.subcategories.map((subcategory) => (
                  <div
                    key={subcategory.key}
                    onClick={() => {
                      setSelectedSubcategory(subcategory.key);
                      setLocalSelectedTemplateId('');
                    }}
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

          {/* Template Selection */}
          {selectedSubcategory && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium">Select Template (Optional)</label>
                <button
                  onClick={() => {
                    // Create a virtual "no template" option
                    const noTemplateOption = {
                      id: `no-template-${selectedCategory}-${selectedSubcategory}`,
                      name: `custom_${selectedCategory}_${selectedSubcategory}`,
                      title: '',  // Empty title, user will fill in
                      description: '',  // Empty description, user will fill in
                      category: selectedCategory,
                      subcategory: selectedSubcategory,
                      difficultyLevel: 'INTERMEDIATE',
                      riskLevel: 'LOW',
                      isQuickStart: false,
                      isVipOnly: false,
                      canUse: true,
                      requiresVip: false,
                      defaultDurationHours: 168,  // Default 7 days
                      maxParticipants: 6,
                      evidenceType: 'PHOTO',
                      instructions: 'Please submit photo evidence of completion',
                      isActive: true
                    } as GameTemplate;

                    setLocalSelectedTemplateId(noTemplateOption.id);
                    onTemplateSelect(noTemplateOption);

                    // Proceed to next step
                    if (onNext) {
                      setTimeout(() => onNext(), 100);  // Brief delay to ensure state update
                    }
                  }}
                  disabled={!!localSelectedTemplateId}
                  className={`px-4 py-2 rounded-lg transition-colors inline-flex items-center space-x-2 text-sm ${
                    localSelectedTemplateId
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  <span>Skip Template, Create Directly</span>
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : customTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        localSelectedTemplateId === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : template.canUse
                          ? 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                          : 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-lg">{template.title}</div>
                          <div className="text-sm text-gray-600 mt-1 line-clamp-2">{template.description}</div>
                          <div className="flex items-center mt-3 space-x-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>{Math.floor(template.defaultDurationHours / 24)} days</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              <span>{template.maxParticipants} people</span>
                            </div>
                          </div>
                        </div>
                        {template.isVipOnly && (
                          <div className="ml-2">
                            <span className="bg-yellow-400 text-white text-xs px-2 py-1 rounded flex items-center">
                              <Crown className="w-3 h-3 mr-1" />
                              VIP
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 mx-auto mb-3 opacity-50 text-gray-400" />
                  <p className="text-gray-600 font-medium mb-2">No templates available in this category</p>
                  <p className="text-sm text-gray-500">You can select another category or click "Skip Template, Create Directly" button above</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ThreeLayerTemplateSelector;