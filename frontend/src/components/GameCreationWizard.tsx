import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { gamesAPI } from '../services/api';
import SafetyDisclaimer from './SafetyDisclaimer';
import ThreeLayerTemplateSelector from './ThreeLayerTemplateSelector';
import ParametricTemplateConfig from './ParametricTemplateConfig';
import DynamicTemplateConfig from './DynamicTemplateConfig';
import GeneralTemplateConfig from './GeneralTemplateConfig';
import { getTemplateConfig } from '../config/templateConfigs';
import { getQuickTemplateConfig } from '../config/quickTemplateConfigs';
import { GENERAL_TEMPLATE_CONFIG } from '../config/generalTemplateConfig';
import { TemplateType } from '../types/templateConfig';
import { ArrowLeft, ArrowRight, CheckCircle, MapPin, Sliders } from 'lucide-react';
import toast from 'react-hot-toast';
import { TimeUtil } from '../utils/time';
import SimpleTimeSelector from './SimpleTimeSelector';

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
  stakeType?: string;
  isAgeRestricted?: boolean;
  isActive?: boolean;
  usageCount?: number;
  successRate?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface GameCreationData {
  templateId: string;
  title: string;
  description: string;
  additionalNotes?: string;
  startDate: string;
  endDate: string;
  evidenceDeadline: string;
  maxParticipants: number;
  visibility: 'PUBLIC' | 'FRIENDS_ONLY';
  stakeType: string;
  betAmount?: number;
  currency?: string;
  stakeDescription?: string;
  evidenceType: string;
  evidenceInstructions: string;
  category: string;
  // 地理位置相关字段
  locationRestriction?: 'NONE' | 'LOCAL' | 'CUSTOM';
  maxDistance?: number;
  customLocation?: string;
}

const GameCreationWizard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);

  // 初始化默认时间（立即开始，用户心急）
  const getDefaultStartTime = () => {
    const now = new Date();
    const startTime = new Date(now.getTime());
    // 立即开始，不延迟，用户心急想马上开始挑战

    // console.log('🚀 向导默认开始时间:', {
    //   当前时间: now.toString(),
    //   开始时间: startTime.toString(),
    //   格式化结果: TimeUtil.toDateTimeLocalValue(startTime)
    // });

    return TimeUtil.toDateTimeLocalValue(startTime);
  };

  const getDefaultEndTime = () => {
    const now = new Date();
    const endTime = new Date(now.getTime());
    endTime.setDate(endTime.getDate() + 7); // 7天后结束

    return TimeUtil.toDateTimeLocalValue(endTime);
  };

  const getDefaultEvidenceDeadline = () => {
    const now = new Date();
    const deadline = new Date(now.getTime());
    deadline.setDate(deadline.getDate() + 8); // 8天后截止

    return TimeUtil.toDateTimeLocalValue(deadline);
  };

  const [gameData, setGameData] = useState<Partial<GameCreationData>>({
    visibility: 'PUBLIC',
    stakeType: 'POINTS',
    currency: 'USD',
    evidenceType: 'PHOTO',
    maxParticipants: 8,
    startDate: getDefaultStartTime(),
    endDate: getDefaultEndTime(),
    evidenceDeadline: getDefaultEvidenceDeadline(),
    // 地理位置默认值
    locationRestriction: 'NONE',
    maxDistance: 50,
  });

  const [selectedTemplate, setSelectedTemplate] = useState<GameTemplate | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [confirmedGoals, setConfirmedGoals] = useState(false); // 最后一步的确认框
  const [templateConfig, setTemplateConfig] = useState<Record<string, any>>({});
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [evidenceDescription, setEvidenceDescription] = useState('');
  const [dynamicConfig, setDynamicConfig] = useState<Record<string, any>>({});
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [generatedInstructions, setGeneratedInstructions] = useState('');
  const [userEditedTitle, setUserEditedTitle] = useState(false);
  const [userEditedDescription, setUserEditedDescription] = useState(false);
  const [useSimpleTimeSelector, setUseSimpleTimeSelector] = useState<boolean>(true);
  const [selectedTimeLabel, setSelectedTimeLabel] = useState<string>('');

  // 处理简化时间选择器的时间变化
  const handleSimpleTimeChange = (startTime: Date, label: string) => {
    setSelectedTimeLabel(label);

    // 根据选择的模板计算持续时间
    const durationHours = selectedTemplate?.defaultDurationHours || 168; // 默认7天
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
    const evidenceDeadline = new Date(endTime.getTime() + 24 * 60 * 60 * 1000); // 结束后1天截止

    // 🔧 关键修复：将本地时间Date对象转换为datetime-local格式字符串
    // 这样在提交时，TimeUtil.toServerTime会正确地将本地时间转换为UTC
    const startDateLocal = TimeUtil.toDateTimeLocalValue(startTime);
    const endDateLocal = TimeUtil.toDateTimeLocalValue(endTime);
    const evidenceDeadlineLocal = TimeUtil.toDateTimeLocalValue(evidenceDeadline);

    console.log('🕐 向导简化时间选择 - 修复后:', {
      选择标签: label,
      '本地时间对象': {
        开始: startTime.toString(),
        结束: endTime.toString(),
        截止: evidenceDeadline.toString()
      },
      'datetime-local格式（用于表单和提交）': {
        开始: startDateLocal,
        结束: endDateLocal,
        截止: evidenceDeadlineLocal
      },
      '说明': 'datetime-local格式会在提交时由TimeUtil.toServerTime统一转换为UTC'
    });

    // 只存储datetime-local格式，不存储ISO格式
    // 提交时会通过TimeUtil.toServerTime统一转换
    setGameData(prev => ({
      ...prev,
      startDate: startDateLocal,
      endDate: endDateLocal,
      evidenceDeadline: evidenceDeadlineLocal
    }));
  };

  const steps = [
    { number: 1, title: t('wizard.steps.safety') },
    { number: 2, title: t('wizard.steps.template') },
    { number: 3, title: t('wizard.steps.config') },
    { number: 4, title: t('wizard.steps.confirm') },
  ];

  // 创建游戏的mutation
  const createGameMutation = useMutation(gamesAPI.createGame, {
    onSuccess: (data) => {
      toast.success(t('wizard.success'));
      // 刷新游戏列表缓存
      queryClient.invalidateQueries(['games']);
      queryClient.invalidateQueries(['my-games']);
      navigate(`/games/${data.data.id}`);
    },
    onError: (error: any) => {
      console.error('创建游戏失败:', error);
      toast.error(error.response?.data?.message || t('wizard.error'));
    },
  });

  // 处理模板选择
  const handleTemplateSelect = (template: GameTemplate) => {
    setSelectedTemplate(template);

    // 重置用户编辑标志
    setUserEditedTitle(false);
    setUserEditedDescription(false);

    // 对于通用模板，使用 PERSONAL 作为默认分类
    const category = template.name === 'general_custom' ? 'PERSONAL' : template.category;

    // 对于通用模板或无模板选项，使用空字符串让用户自己填写
    const isCustomTemplate = template.name === 'general_custom' || template.name.startsWith('custom_');

    setGameData(prev => ({
      ...prev,
      templateId: template.id,
      title: isCustomTemplate ? '' : template.title,
      description: isCustomTemplate ? '' : template.description,
      evidenceType: template.evidenceType,
      evidenceInstructions: template.instructions,
      maxParticipants: template.maxParticipants,
      category: category,
      stakeType: template.stakeType || 'POINTS',
    }));
  };

  // 步骤导航
  const handleNext = () => {
    // 第一步需要同意安全须知才能继续
    if (currentStep === 1 && !agreedToTerms) {
      toast.error(t('wizard.agreeTerms'));
      return;
    }

    // 第二步需要选择模板才能继续
    if (currentStep === 2 && !selectedTemplate) {
      toast.error(t('wizard.selectTemplate'));
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 提交创建游戏
  const handleSubmit = () => {
    if (!selectedTemplate) {
      toast.error(t('wizard.selectTemplate'));
      return;
    }

    if (!gameData.title || !gameData.description || !gameData.startDate || !gameData.endDate || !gameData.evidenceDeadline) {
      toast.error(t('wizard.fillRequired'));
      return;
    }

    // 🔧 统一时间处理：所有datetime-local格式统一转换为UTC ISO格式
    const convertTimeToUTC = (timeValue: string | undefined, fieldName: string): string | undefined => {
      if (!timeValue) return undefined;

      // 如果已经是ISO格式（包含Z或+），直接返回
      if (timeValue.includes('Z') || timeValue.includes('+')) {
        console.log(`🌍 ${fieldName}已是ISO格式:`, timeValue);
        return timeValue;
      }

      // 否则从datetime-local格式转换为UTC
      const utcTime = TimeUtil.toServerTime(timeValue);
      console.log(`🌍 ${fieldName}转换:`, {
        输入datetime_local: timeValue,
        输出UTC_ISO: utcTime
      });
      return utcTime;
    };

    const finalData: any = {
      ...gameData,
      // 🔧 Unified time conversion
      startDate: convertTimeToUTC(gameData.startDate, 'startDate'),
      endDate: convertTimeToUTC(gameData.endDate, 'endDate'),
      evidenceDeadline: convertTimeToUTC(gameData.evidenceDeadline, 'evidenceDeadline'),
      templateConfig,
      dynamicConfig,
      // Ensure required fields have default values
      evidenceInstructions: gameData.evidenceInstructions || selectedTemplate.instructions || 'Please submit relevant evidence',
      stakeType: gameData.stakeType || 'POINTS',
      evidenceType: gameData.evidenceType || 'PHOTO',
      maxParticipants: gameData.maxParticipants || 8,
      visibility: gameData.visibility || 'PUBLIC',
      // Location fields
      locationRestriction: gameData.locationRestriction || 'NONE',
      maxDistance: gameData.locationRestriction === 'LOCAL' ? gameData.maxDistance : undefined,
      customLocation: gameData.locationRestriction === 'CUSTOM' ? gameData.customLocation : undefined,
    };

    console.log('🚀 提交的游戏数据:', finalData);
    createGameMutation.mutate(finalData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 步骤指示器 */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step.number
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 步骤内容 */}
      <div className="min-h-[500px]">
        {currentStep === 1 && (
          <SafetyDisclaimer 
            onAgree={() => setAgreedToTerms(true)}
            agreed={agreedToTerms}
          />
        )}

        {currentStep === 2 && (
          <ThreeLayerTemplateSelector
            onTemplateSelect={handleTemplateSelect}
            selectedTemplateId={selectedTemplate?.id}
            onNext={handleNext}
          />
        )}

        {currentStep === 3 && selectedTemplate && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">{t('wizard.configureDetails')}</h2>

            {/* 三层模板配置系统 */}
            {(() => {
              // 检查是否是快捷模板
              const quickConfig = getQuickTemplateConfig(selectedTemplate.name);
              if (quickConfig) {
                // 快捷模板：零配置，直接显示预设内容
                return (
                  <div className="space-y-6">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">{t('wizard.quickTemplate.title')}</h3>
                      <p className="text-green-700 mb-4">{t('wizard.quickTemplate.description')}</p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">{t('wizard.quickTemplate.challengeTitle')}</label>
                          <input
                            type="text"
                            value={gameData.title || quickConfig.title}
                            onChange={(e) => setGameData((prev: Partial<GameCreationData>) => ({ ...prev, title: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">{t('wizard.quickTemplate.challengeDescription')}</label>
                          <textarea
                            value={gameData.description || quickConfig.description}
                            onChange={(e) => setGameData((prev: Partial<GameCreationData>) => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">{t('wizard.quickTemplate.evidenceInstructions')}</label>
                          <textarea
                            value={gameData.evidenceInstructions || quickConfig.instructions}
                            onChange={(e) => setGameData((prev: Partial<GameCreationData>) => ({ ...prev, evidenceInstructions: e.target.value }))}
                            rows={2}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // 检查是否是通用模板
              if (selectedTemplate.name === 'general_custom') {
                // 通用模板：自定义字段系统
                return (
                  <div className="space-y-6">
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h3 className="text-lg font-semibold text-purple-800 mb-2">{t('wizard.generalTemplate.title')}</h3>
                      <p className="text-purple-700 mb-4">{t('wizard.generalTemplate.description')}</p>
                    </div>

                    {/* 基本信息 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">{t('wizard.generalTemplate.basicInfo')}</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">{t('wizard.quickTemplate.challengeTitle')}</label>
                          <input
                            type="text"
                            value={userEditedTitle ? gameData.title || '' : (generatedTitle || gameData.title || '')}
                            onChange={(e) => {
                              setUserEditedTitle(true);
                              setGameData((prev: Partial<GameCreationData>) => ({ ...prev, title: e.target.value }));
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={t('wizard.generalTemplate.titlePlaceholder')}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">{t('wizard.quickTemplate.challengeDescription')}</label>
                          <textarea
                            value={userEditedDescription ? gameData.description || '' : (generatedDescription || gameData.description || '')}
                            onChange={(e) => {
                              setUserEditedDescription(true);
                              setGameData((prev: Partial<GameCreationData>) => ({ ...prev, description: e.target.value }));
                            }}
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={t('wizard.generalTemplate.descriptionPlaceholder')}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 通用模板配置 */}
                    <GeneralTemplateConfig
                      onConfigChange={setDynamicConfig}
                      onTitleChange={(title) => {
                        if (!userEditedTitle) {
                          setGeneratedTitle(title);
                          setGameData((prev: Partial<GameCreationData>) => ({ ...prev, title }));
                        }
                      }}
                      onDescriptionChange={(description) => {
                        if (!userEditedDescription) {
                          setGeneratedDescription(description);
                          setGameData((prev: Partial<GameCreationData>) => ({ ...prev, description }));
                        }
                      }}
                      onInstructionsChange={(instructions) => {
                        setGeneratedInstructions(instructions);
                        setGameData((prev: Partial<GameCreationData>) => ({
                          ...prev,
                          evidenceInstructions: instructions
                        }));
                      }}
                    />
                  </div>
                );
              }

              // 精细模板：原有的动态配置系统
              const configDef = getTemplateConfig(selectedTemplate.name);
              if (configDef) {
                return (
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">{t('wizard.parametricTemplate.title')}</h3>
                      <p className="text-blue-700 mb-4">{t('wizard.parametricTemplate.description')}</p>
                    </div>

                    {/* 通用字段 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">{t('wizard.generalTemplate.basicInfo')}</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">{t('wizard.quickTemplate.challengeTitle')}</label>
                          <input
                            type="text"
                            value={generatedTitle || gameData.title || ''}
                            onChange={(e) => {
                              setGeneratedTitle('');
                              setGameData((prev: Partial<GameCreationData>) => ({ ...prev, title: e.target.value }));
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={t('wizard.generalTemplate.titlePlaceholder')}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">{t('wizard.quickTemplate.challengeDescription')}</label>
                          <textarea
                            value={generatedDescription || gameData.description || ''}
                            onChange={(e) => {
                              setGeneratedDescription('');
                              setGameData((prev: Partial<GameCreationData>) => ({ ...prev, description: e.target.value }));
                            }}
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={t('wizard.generalTemplate.descriptionPlaceholder')}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 精细化配置 */}
                    <DynamicTemplateConfig
                      configDefinition={configDef}
                      onConfigChange={setDynamicConfig}
                      onTitleChange={(title) => {
                        setGeneratedTitle(title);
                        setGameData((prev: Partial<GameCreationData>) => ({ ...prev, title }));
                      }}
                      onDescriptionChange={(description) => {
                        setGeneratedDescription(description);
                        setGameData((prev: Partial<GameCreationData>) => ({ ...prev, description }));
                      }}
                      onInstructionsChange={(instructions) => {
                        setGeneratedInstructions(instructions);
                        setGameData((prev: Partial<GameCreationData>) => ({
                          ...prev,
                          evidenceInstructions: instructions
                        }));
                      }}
                    />
                  </div>
                );
              } else if (selectedTemplate.features?.parametric) {
                // 旧的参数化配置系统
                return (
                  <ParametricTemplateConfig
                    template={selectedTemplate}
                    onConfigChange={setTemplateConfig}
                    onTitleChange={setCustomTitle}
                    onDescriptionChange={setCustomDescription}
                    onEvidenceDescriptionChange={setEvidenceDescription}
                  />
                );
              } else {
                // 传统配置方式
                return (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('wizard.quickTemplate.challengeTitle')}</label>
                      <input
                        type="text"
                        value={gameData.title || ''}
                        onChange={(e) => setGameData((prev: Partial<GameCreationData>) => ({ ...prev, title: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t('wizard.generalTemplate.titlePlaceholder')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t('wizard.quickTemplate.challengeDescription')}</label>
                      <textarea
                        value={gameData.description || ''}
                        onChange={(e) => setGameData((prev: Partial<GameCreationData>) => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t('wizard.generalTemplate.descriptionPlaceholder')}
                      />
                    </div>
                  </div>
                );
              }
            })()}

            {/* 通用配置字段 - 所有模板都需要 */}
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t('wizard.timeSettings.title')}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setUseSimpleTimeSelector(true)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      useSimpleTimeSelector
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t('wizard.timeSettings.quickSelect')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseSimpleTimeSelector(false)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      !useSimpleTimeSelector
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t('wizard.timeSettings.preciseSet')}
                  </button>
                </div>
              </div>

              {/* 简化时间选择器 */}
              {useSimpleTimeSelector && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <SimpleTimeSelector
                    onTimeChange={handleSimpleTimeChange}
                    className="mb-2"
                  />
                  {selectedTimeLabel && (
                    <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {t('wizard.timeSettings.selected', { label: selectedTimeLabel })}
                    </div>
                  )}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('wizard.timeSettings.startTime')}</label>
                  <input
                    type="datetime-local"
                    value={gameData.startDate || ''}
                    onChange={(e) => setGameData((prev: Partial<GameCreationData>) => ({ ...prev, startDate: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('wizard.timeSettings.endTime')}</label>
                  <input
                    type="datetime-local"
                    value={gameData.endDate || ''}
                    onChange={(e) => setGameData((prev: Partial<GameCreationData>) => ({ ...prev, endDate: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">{t('wizard.timeSettings.evidenceDeadline')}</label>
                <input
                  type="datetime-local"
                  value={gameData.evidenceDeadline || ''}
                  onChange={(e) => setGameData((prev: Partial<GameCreationData>) => ({ ...prev, evidenceDeadline: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {t('wizard.timeSettings.evidenceDeadlineHint')}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h3 className="text-lg font-semibold mb-4">{t('wizard.participationSettings.title')}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('wizard.participationSettings.maxParticipants')}</label>
                  <input
                    type="number"
                    min="2"
                    max="50"
                    value={gameData.maxParticipants || ''}
                    onChange={(e) => setGameData((prev: Partial<GameCreationData>) => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('wizard.participationSettings.visibility')}</label>
                  <select
                    value={gameData.visibility || 'PUBLIC'}
                    onChange={(e) => setGameData((prev: Partial<GameCreationData>) => ({ ...prev, visibility: e.target.value as 'PUBLIC' | 'FRIENDS_ONLY' }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="PUBLIC">{t('wizard.participationSettings.public')}</option>
                    <option value="FRIENDS_ONLY">{t('wizard.participationSettings.friendsOnly')}</option>
                  </select>
                </div>
              </div>

              {/* 地理位置设置 */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {t('wizard.participationSettings.locationRestriction')}
                </label>
                <select
                  value={gameData.locationRestriction || 'NONE'}
                  onChange={(e) => setGameData((prev: Partial<GameCreationData>) => ({
                    ...prev,
                    locationRestriction: e.target.value as 'NONE' | 'LOCAL' | 'CUSTOM'
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="NONE">{t('wizard.participationSettings.noRestriction')}</option>
                  <option value="LOCAL">{t('wizard.participationSettings.localChallenge')}</option>
                  <option value="CUSTOM">{t('wizard.participationSettings.customLocation')}</option>
                </select>

                {gameData.locationRestriction === 'LOCAL' && (
                  <div className="mt-3 space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Sliders className="w-4 h-4 inline mr-1" />
                        {t('wizard.participationSettings.maxDistance', { distance: gameData.maxDistance || 50 })}
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="200"
                        step="5"
                        value={gameData.maxDistance || 50}
                        onChange={(e) => setGameData((prev: Partial<GameCreationData>) => ({
                          ...prev,
                          maxDistance: Number(e.target.value)
                        }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>5km</span>
                        <span>200km</span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        {t('wizard.participationSettings.maxDistanceHint', { distance: gameData.maxDistance || 50 })}
                      </p>
                    </div>
                  </div>
                )}

                {gameData.locationRestriction === 'CUSTOM' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium mb-2">
                      {t('wizard.participationSettings.customLocation')}
                    </label>
                    <input
                      type="text"
                      value={gameData.customLocation || ''}
                      onChange={(e) => setGameData((prev: Partial<GameCreationData>) => ({
                        ...prev,
                        customLocation: e.target.value
                      }))}
                      placeholder={t('wizard.participationSettings.customLocationPlaceholder')}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {t('wizard.participationSettings.customLocationHint')}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">{t('wizard.participationSettings.additionalNotes')}</label>
                <textarea
                  value={gameData.additionalNotes || ''}
                  onChange={(e) => setGameData((prev: Partial<GameCreationData>) => ({ ...prev, additionalNotes: e.target.value }))}
                  rows={3}
                  maxLength={500}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('wizard.participationSettings.additionalNotesPlaceholder')}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {t('wizard.participationSettings.charactersRemaining', { count: (gameData.additionalNotes || '').length })}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && selectedTemplate && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">{t('wizard.confirmPublish.title')}</h2>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3">{t('wizard.confirmPublish.preview')}</h3>
              <div className="space-y-2 text-sm">
                <p><strong>{t('wizard.confirmPublish.previewTitle')}</strong>  {gameData.title}</p>
                <p><strong>{t('wizard.confirmPublish.previewCategory')}</strong>  {selectedTemplate.category} &gt; {selectedTemplate.subcategory}</p>
                <p><strong>{t('wizard.confirmPublish.previewDifficulty')}</strong>  {selectedTemplate.difficultyLevel}</p>
                <p><strong>{t('wizard.confirmPublish.previewTime')}</strong>  {new Date(gameData.startDate!).toLocaleString()} - {new Date(gameData.endDate!).toLocaleString()}</p>
                <p><strong>{t('wizard.confirmPublish.previewParticipants')}</strong>  {gameData.maxParticipants}</p>
                <p><strong>{t('wizard.confirmPublish.previewVisibility')}</strong>  {gameData.visibility === 'PUBLIC' ? t('wizard.participationSettings.public') : t('wizard.participationSettings.friendsOnly')}</p>
                {gameData.additionalNotes && (
                  <p><strong>{t('wizard.confirmPublish.previewNotes')}</strong>{gameData.additionalNotes}</p>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 font-medium mb-2">
                {t('wizard.confirmPublish.finalReminder')}
              </p>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={confirmedGoals}
                  onChange={(e) => setConfirmedGoals(e.target.checked)}
                />
                <span className="text-yellow-800 text-sm">{t('wizard.confirmPublish.confirmGoals')}</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('wizard.navigation.previous')}
        </button>

        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            disabled={(currentStep === 1 && !agreedToTerms) || (currentStep === 2 && !selectedTemplate)}
            className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
              (currentStep === 1 && !agreedToTerms) || (currentStep === 2 && !selectedTemplate)
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {t('wizard.navigation.next')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={createGameMutation.isLoading || !confirmedGoals}
            className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
              createGameMutation.isLoading || !confirmedGoals
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {createGameMutation.isLoading ? t('wizard.navigation.publishing') : t('wizard.navigation.publish')}
            <CheckCircle className="w-4 h-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default GameCreationWizard;
