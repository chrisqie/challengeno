import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { useAuthStore } from '../stores/authStore'
import { gamesAPI } from '../services/api'
import { templateService } from '../services/templateService'
import { ArrowLeft, Calendar, Users, Trophy, Info, Crown, MapPin, Sliders } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import PageLoader from '../components/PageLoader'
import VipFeatureGuard from '../components/VipFeatureGuard'
import LocationDisplay from '../components/LocationDisplay'
import LocationSelector from '../components/LocationSelector'
import toast from 'react-hot-toast'
import { TimeUtil } from '../utils/time'
import GameTimeSelector from '../components/GameTimeSelector'
// import { usePointsRefresh } from '../hooks/usePointsRefresh' // 临时注释

// 分类和小分类配置
const CATEGORY_CONFIG = {
  HEALTH: {
    label: '健康',
    icon: '💊',
    subcategories: {
      HEALTH_SLEEP: '睡眠管理',
      HEALTH_DIET: '饮食健康',
      HEALTH_MENTAL: '心理健康'
    }
  },
  FITNESS: {
    label: '健身',
    icon: '💪',
    subcategories: {
      FITNESS_CARDIO: '有氧运动',
      FITNESS_STRENGTH: '力量训练',
      FITNESS_FLEXIBILITY: '柔韧性训练'
    }
  },
  LEARNING: {
    label: '学习',
    icon: '📚',
    subcategories: {
      LEARNING_LANGUAGE: '语言学习',
      LEARNING_SKILL: '技能提升',
      LEARNING_READING: '阅读习惯'
    }
  },
  PERSONAL: {
    label: '个人成长',
    icon: '🌱',
    subcategories: {
      PERSONAL_PRODUCTIVITY: '效率提升',
      PERSONAL_CREATIVITY: '创意表达',
      PERSONAL_GROWTH: '自我提升'
    }
  },
  LIFESTYLE: {
    label: '生活方式',
    icon: '🏡',
    subcategories: {
      LIFESTYLE_HOME: '居家生活',
      LIFESTYLE_SOCIAL: '社交活动',
      LIFESTYLE_HOBBY: '兴趣爱好'
    }
  },
  CAREER: {
    label: '职业发展',
    icon: '💼',
    subcategories: {
      CAREER_STARTUP: '创业项目',
      CAREER_NETWORKING: '职场社交',
      CAREER_SKILLS: '职业技能'
    }
  }
}

interface CreateGameForm {
  title: string
  description: string
  templateId?: string
  stakeType: 'ITEM' | 'FAVOR'
  stakeDescription?: string
  evidenceType: 'PHOTO' | 'TEXT'
  evidenceInstructions: string
  maxParticipants: number
  // 完整时间流程字段
  joinDeadline: string      // 加入截止时间
  startDate: string         // 游戏开始时间
  endDate: string           // 游戏结束时间
  evidenceDeadline: string  // 证据提交截止
  reviewDeadline: string    // 互评截止时间
  arbitrationDeadline: string // 仲裁截止时间
  category: 'HEALTH' | 'FITNESS' | 'LEARNING' | 'WEATHER' | 'PERSONAL' | 'CUSTOM'
  visibility: 'PUBLIC' | 'FRIENDS_ONLY'
  // 地理位置相关字段
  locationRestriction: 'NONE' | 'LOCAL' | 'CUSTOM'
  maxDistance?: number
  customLocation?: string
}

const CreateGamePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [locationRestriction, setLocationRestriction] = useState<'NONE' | 'LOCAL' | 'CUSTOM'>('NONE')
  const [maxDistance, setMaxDistance] = useState(50)
  const [useGameTimeSelector, setUseGameTimeSelector] = useState<boolean>(true)
  const [selectedTimeLabel, setSelectedTimeLabel] = useState<string>('')
  // 新增：分类选择状态
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('')
  const [showTemplateSelection, setShowTemplateSelection] = useState(false)
  const [skipTemplate, setSkipTemplate] = useState(false)
  // const { refreshPointsWithDelay } = usePointsRefresh() // 临时注释

  const { data: templatesResult, isLoading: templatesLoading } = useQuery(
    'templates',
    () => templateService.getGameTemplates(),
    {
      select: (result) => result,
    }
  )

  const templates = templatesResult?.data || []

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    clearErrors,
    formState: { errors, isValid, isDirty },
  } = useForm<CreateGameForm>({
    mode: 'onChange', // 实时验证
    defaultValues: {
      stakeType: 'FAVOR',
      evidenceType: 'PHOTO',
      maxParticipants: 6,
      category: 'HEALTH',
      visibility: 'PUBLIC',
      locationRestriction: 'NONE',
      maxDistance: 50,
    },
  })

  // 检查是否从模板选择页面传来了模板
  useEffect(() => {
    if (location.state?.selectedTemplate) {
      const template = location.state.selectedTemplate
      setSelectedTemplate(template)
      // 自动填充表单
      setValue('title', template.title)
      setValue('description', template.description)
      setValue('category', template.category)
      setValue('evidenceType', template.evidenceType)
      setValue('evidenceInstructions', template.instructions)
      setValue('maxParticipants', template.maxParticipants)

      // 设置默认时间（确保使用正确的本地时间）
      const now = new Date()
      console.log('🕐 模板时间设置调试:', {
        当前时间: now.toString(),
        当前小时: now.getHours(),
        当前分钟: now.getMinutes(),
        模板持续时间: template.defaultDurationHours
      })

      const startDate = new Date(now.getTime()) // 创建副本避免修改原对象

      // 默认立即开始，用户可以自己调整时间
      if (template.defaultDurationHours < 1) {
        // 快速测试模板，立即开始
        console.log('⚡ 快速测试模板，立即开始:', startDate.toString())
      } else {
        // 正常模板，也立即开始，用户心急想马上开始挑战
        console.log('⏰ 正常模板，立即开始:', startDate.toString())
      }

      const endDate = new Date(startDate.getTime())
      endDate.setTime(endDate.getTime() + template.defaultDurationHours * 60 * 60 * 1000)

      const evidenceDeadline = new Date(endDate.getTime())
      evidenceDeadline.setMinutes(evidenceDeadline.getMinutes() + 30) // 结束后30分钟截止

      console.log('📅 最终时间设置:', {
        开始时间: startDate.toString(),
        结束时间: endDate.toString(),
        证据截止: evidenceDeadline.toString()
      })

      setValue('startDate', TimeUtil.toDateTimeLocalValue(startDate))
      setValue('endDate', TimeUtil.toDateTimeLocalValue(endDate))
      setValue('evidenceDeadline', TimeUtil.toDateTimeLocalValue(evidenceDeadline))
    }
  }, [location.state, setValue])

  const watchStakeType = watch('stakeType')

  // 处理分类选择
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory('')
    setShowTemplateSelection(false)
  }

  // 处理小分类选择
  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory)
    setShowTemplateSelection(true)
  }

  // 跳过模板选择，直接创建
  const handleSkipTemplate = () => {
    setSkipTemplate(true)

    // 获取分类名称
    const categoryLabel = CATEGORY_CONFIG[selectedCategory as keyof typeof CATEGORY_CONFIG]?.label || '挑战'
    const categoryConfig = CATEGORY_CONFIG[selectedCategory as keyof typeof CATEGORY_CONFIG]
    const subcategoryLabel = categoryConfig?.subcategories?.[selectedSubcategory as keyof typeof categoryConfig.subcategories] || ''

    // 生成默认标题和描述
    const defaultTitle = `${categoryLabel} - ${subcategoryLabel}`
    const defaultDescription = `这是一个${categoryLabel}类的${subcategoryLabel}挑战，请在下方详细描述您的挑战内容和规则。`

    setSelectedTemplate({
      id: null,
      title: defaultTitle,
      category: selectedCategory,
      subcategory: selectedSubcategory
    })

    // 设置默认值
    setValue('category', selectedCategory as any)
    setValue('title', defaultTitle)
    setValue('description', defaultDescription)
    setValue('evidenceType', 'PHOTO')
    setValue('evidenceInstructions', '请拍摄照片作为完成证据')
    setValue('maxParticipants', 6)

    // 设置默认时间
    const now = new Date()
    const startDate = new Date(now.getTime())
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000) // 7天后
    const evidenceDeadline = new Date(endDate.getTime() + 24 * 60 * 60 * 1000) // 结束后24小时

    setValue('startDate', TimeUtil.toDateTimeLocalValue(startDate))
    setValue('endDate', TimeUtil.toDateTimeLocalValue(endDate))
    setValue('evidenceDeadline', TimeUtil.toDateTimeLocalValue(evidenceDeadline))
  }

  const onTemplateSelect = (template: any) => {
    // 检查用户是否有权限使用此模板
    if (template.canUse === false) {
      toast.error(`此模板需要${template.requiredVipTier || 'VIP'}会员权限`);
      return;
    }

    setSelectedTemplate(template)
    setSkipTemplate(false)
    setValue('title', template.title)
    setValue('description', template.description)
    setValue('category', template.category)
    setValue('evidenceType', template.evidenceType)
    setValue('evidenceInstructions', template.instructions)
    setValue('maxParticipants', template.maxParticipants)

    // 注意：不重置visibility字段，保持用户的选择

    // 设置默认时间（确保使用正确的本地时间）
    const now = new Date()
    console.log('🎯 模板选择时间设置调试:', {
      当前时间: now.toString(),
      模板名称: template.name,
      持续时间小时: template.defaultDurationHours
    })

    const startDate = new Date(now.getTime()) // 创建副本

    // 默认立即开始，用户可以自己调整时间
    if (template.defaultDurationHours < 1) {
      // 快速测试模板，立即开始
      console.log('⚡ 快速模板，立即开始:', startDate.toString())
    } else {
      // 正常模板，也立即开始，用户心急想马上开始挑战
      console.log('⏰ 标准模板，立即开始:', startDate.toString())
    }

    const endDate = new Date(startDate.getTime())
    endDate.setTime(endDate.getTime() + template.defaultDurationHours * 60 * 60 * 1000)

    const evidenceDeadline = new Date(endDate.getTime())
    evidenceDeadline.setMinutes(evidenceDeadline.getMinutes() + 30) // 结束后30分钟截止

    console.log('📋 模板时间最终设置:', {
      开始: startDate.toString(),
      结束: endDate.toString(),
      证据截止: evidenceDeadline.toString()
    })

    // 使用时间工具类格式化
    setValue('startDate', TimeUtil.toDateTimeLocalValue(startDate))
    setValue('endDate', TimeUtil.toDateTimeLocalValue(endDate))
    setValue('evidenceDeadline', TimeUtil.toDateTimeLocalValue(evidenceDeadline))
  }

  // 处理游戏时间选择器的时间变化
  const handleGameTimeChange = (timeData: any, label: string) => {
    setSelectedTimeLabel(label)

    console.log('🕐 游戏时间选择器设置:', {
      选择标签: label,
      时间数据: timeData,
      当前时间: new Date().toISOString(),
      开始时间: timeData.startDate,
      时间差: new Date(timeData.startDate).getTime() - new Date().getTime()
    })

    // 🔧 修复时区问题：GameTimeSelector返回的是ISO字符串，需要正确转换为datetime-local
    const convertISOToDateTimeLocal = (isoString: string) => {
      // ISO字符串已经是正确的UTC时间，需要转换为本地时间显示在datetime-local控件中
      const utcDate = new Date(isoString)

      console.log('🌍 ISO转datetime-local调试:', {
        输入ISO: isoString,
        UTC时间: utcDate.toISOString(),
        本地时间: utcDate.toString(),
        datetime_local值: TimeUtil.toDateTimeLocalValue(utcDate)
      })

      return TimeUtil.toDateTimeLocalValue(utcDate)
    }

    // 设置所有时间字段
    setValue('joinDeadline', convertISOToDateTimeLocal(timeData.joinDeadline))
    setValue('startDate', convertISOToDateTimeLocal(timeData.startDate))
    setValue('endDate', convertISOToDateTimeLocal(timeData.endDate))
    setValue('evidenceDeadline', convertISOToDateTimeLocal(timeData.evidenceDeadline))
    setValue('reviewDeadline', convertISOToDateTimeLocal(timeData.reviewDeadline))
    setValue('arbitrationDeadline', convertISOToDateTimeLocal(timeData.arbitrationDeadline))
  }

  const onSubmit = async (data: CreateGameForm) => {
    setIsLoading(true)

    try {
      // 清除之前的错误
      clearErrors()

      // 前端验证
      const validation = TimeUtil.validateGameTimes(
        data.startDate,
        data.endDate,
        data.evidenceDeadline
      )

      if (!validation.isValid) {
        toast.error('时间设置有误：' + validation.errors.join('; '))
        setIsLoading(false)
        return
      }

      // 显示创建进度提示
      toast.loading('正在创建挑战...', { id: 'creating-game' })

      // 调试信息
      console.log('创建游戏数据:', {
        ...data,
        templateId: selectedTemplate?.id,
        selectedTemplate: selectedTemplate ? {
          id: selectedTemplate.id,
          name: selectedTemplate.name,
          title: selectedTemplate.title
        } : null
      });

      const response = await gamesAPI.createGame({
        ...data,
        startDate: TimeUtil.toServerTime(data.startDate),
        endDate: TimeUtil.toServerTime(data.endDate),
        evidenceDeadline: TimeUtil.toServerTime(data.evidenceDeadline),
        templateId: selectedTemplate?.id,
        // 地理位置相关数据
        locationRestriction: locationRestriction,
        maxDistance: locationRestriction === 'LOCAL' ? maxDistance : undefined,
        customLocation: data.customLocation,
      })

      // 成功提示
      toast.success('🎉 挑战创建成功！即将跳转到游戏页面...', { id: 'creating-game' })

      // 立即刷新积分数据
      // refreshPointsWithDelay(1000) // 1秒后刷新积分 // 临时注释

      // 验证返回的游戏ID
      if (!response.data?.id) {
        console.error('创建游戏成功但未返回游戏ID:', response.data)
        toast.error('创建成功但跳转失败，请手动刷新页面')
        setIsLoading(false)
        return
      }

      // 延迟跳转，让用户看到成功提示，并确保数据库事务完成
      setTimeout(() => {
        navigate(`/game/${response.data.id}`, { replace: true })
      }, 1500)

    } catch (error: any) {
      toast.dismiss('creating-game')

      // 详细的错误处理
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || '请求参数有误'
        toast.error(`创建失败：${errorMessage}`)
      } else if (error.response?.status === 403) {
        toast.error('权限不足：' + (error.response.data?.message || '您没有权限执行此操作'))
      } else if (error.response?.status === 429) {
        toast.error('操作过于频繁，请稍后再试')
      } else if (error.response?.status >= 500) {
        toast.error('服务器错误，请稍后重试')
      } else if (error.code === 'NETWORK_ERROR') {
        toast.error('网络连接失败，请检查网络后重试')
      } else {
        toast.error('创建失败：' + (error.response?.data?.message || '未知错误'))
      }

      console.error('创建游戏失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">创建挑战</h1>
          <p className="text-gray-600">设计一个有趣的挑战，邀请朋友参与</p>
        </div>
      </div>

      {/* 分类和模板选择 */}
      {!selectedTemplate && (
        <div className="space-y-6">
          {/* 步骤1: 选择大分类 */}
          {!selectedCategory && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">第一步：选择挑战分类</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => handleCategorySelect(key)}
                    className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-center group"
                  >
                    <div className="text-4xl mb-2">{config.icon}</div>
                    <div className="font-medium text-gray-900 group-hover:text-primary-700">{config.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 步骤2: 选择小分类 */}
          {selectedCategory && !selectedSubcategory && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  第二步：选择具体类型
                </h2>
                <button
                  onClick={() => setSelectedCategory('')}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  ← 重新选择分类
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(CATEGORY_CONFIG[selectedCategory as keyof typeof CATEGORY_CONFIG].subcategories).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleSubcategorySelect(key)}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-left"
                  >
                    <div className="font-medium text-gray-900">{label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 步骤3: 选择模板（可选） */}
          {selectedCategory && selectedSubcategory && showTemplateSelection && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">第三步：选择模板（可选）</h2>
                <button
                  onClick={() => {
                    setSelectedSubcategory('')
                    setShowTemplateSelection(false)
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  ← 重新选择类型
                </button>
              </div>

              {/* 跳过模板按钮 */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-blue-900">不使用模板，直接创建</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      完全自定义您的挑战内容，适合有特殊需求的场景
                    </p>
                  </div>
                  <button
                    onClick={handleSkipTemplate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap ml-4"
                  >
                    跳过模板
                  </button>
                </div>
              </div>

              {templatesLoading ? (
                <PageLoader message="正在加载模板..." />
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    或者选择一个模板快速开始：
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates
                      ?.filter((t: any) =>
                        t.category === selectedCategory &&
                        (!t.subcategory || t.subcategory === selectedSubcategory)
                      )
                      .map((template: any) => (
                      <button
                        key={template.id}
                        onClick={() => onTemplateSelect(template)}
                        className={`text-left p-4 border rounded-lg transition-colors relative ${
                          template.canUse === false
                            ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                            : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                        disabled={template.canUse === false}
                      >
                        {/* VIP标识 */}
                        {template.isVipOnly && (
                          <div className="absolute top-2 right-2 flex items-center space-x-1">
                            <span className="text-yellow-500">👑</span>
                            {template.vipTier && (
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                template.vipTier === 'BASIC' ? 'text-blue-600 bg-blue-100' :
                                template.vipTier === 'PREMIUM' ? 'text-purple-600 bg-purple-100' :
                                template.vipTier === 'ELITE' ? 'text-yellow-600 bg-yellow-100' :
                                'text-gray-600 bg-gray-100'
                              }`}>
                                {template.vipTier}
                              </span>
                            )}
                          </div>
                        )}

                        <h3 className="font-medium text-gray-900 pr-16">{template.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                          <span>👥 最多{template.maxParticipants}人</span>
                          {template.isVipOnly && template.canUse === false && (
                            <span className="text-yellow-600 font-medium">需要VIP</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* 如果没有匹配的模板 */}
                  {templates?.filter((t: any) =>
                    t.category === selectedCategory &&
                    (!t.subcategory || t.subcategory === selectedSubcategory)
                  ).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>该分类暂无模板，请点击上方"跳过模板"按钮直接创建</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* 用户引导 */}
      {selectedTemplate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-2">创建挑战指南</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• <strong>标题和描述</strong>：清晰描述挑战内容，吸引更多参与者</p>
                <p>• <strong>时间设置</strong>：合理安排开始、结束和证据提交时间</p>
                <p>• <strong>证据要求</strong>：明确说明参与者需要提交什么证据</p>
                <p>• <strong>参与人数</strong>：根据挑战难度设置合适的人数限制</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 创建表单 */}
      {selectedTemplate && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 基本信息 */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  挑战标题 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('title', {
                    required: 'Please enter a challenge title',
                    minLength: { value: 3, message: 'Title must be at least 3 characters' },
                    maxLength: { value: 60, message: 'Title cannot exceed 60 characters' },
                    pattern: {
                      value: /^[\p{L}\p{N}\p{M}\s\-_.,!?():;'"❤️🎉💪⭐+×÷%\[\]{}]+$/u,
                      message: 'Title contains unsupported characters'
                    }
                  })}
                  type="text"
                  className={`input ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Give your challenge an interesting name (3-60 characters)"
                  maxLength={60}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.title.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  好的标题能吸引更多人参与您的挑战
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  挑战描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('description', {
                    required: 'Please enter a challenge description',
                    minLength: { value: 15, message: 'Description must be at least 15 characters' },
                    maxLength: { value: 300, message: 'Description cannot exceed 300 characters' }
                  })}
                  rows={4}
                  className={`input ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Describe the challenge content, rules and requirements (15-300 characters)"
                  maxLength={300}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.description.message}
                  </p>
                )}
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    清晰的描述有助于参与者理解挑战要求
                  </p>
                  <p className="text-xs text-gray-400">
                    {watch('description')?.length || 0}/300
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分类
                  </label>
                  <select {...register('category')} className="input">
                    <option value="HEALTH">健康</option>
                    <option value="FITNESS">健身</option>
                    <option value="LEARNING">学习</option>
                    <option value="WEATHER">天气</option>
                    <option value="PERSONAL">个人</option>
                    <option value="CUSTOM">自定义</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    可见性
                  </label>
                  <select {...register('visibility')} className="input">
                    <option value="PUBLIC">公开</option>
                    <VipFeatureGuard
                      feature="privateRooms"
                      fallback={
                        <option value="FRIENDS_ONLY" disabled>
                          仅好友 (VIP专属)
                        </option>
                      }
                    >
                      <option value="FRIENDS_ONLY">仅好友</option>
                    </VipFeatureGuard>
                  </select>
                  {watch('visibility') === 'FRIENDS_ONLY' && (
                    <VipFeatureGuard
                      feature="privateRooms"
                      showUpgradePrompt={false}
                      fallback={
                        <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded text-sm">
                          <div className="flex items-center text-purple-700">
                            <Crown className="w-4 h-4 mr-1" />
                            仅好友可见功能需要VIP会员
                          </div>
                        </div>
                      }
                    >
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                        ✓ VIP特权：仅好友可见
                      </div>
                    </VipFeatureGuard>
                  )}
                </div>

                {/* 地理位置设置 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    地理位置限制
                  </label>
                  <select
                    value={locationRestriction}
                    onChange={(e) => setLocationRestriction(e.target.value as 'NONE' | 'LOCAL' | 'CUSTOM')}
                    className="input"
                  >
                    <option value="NONE">无限制</option>
                    <option value="LOCAL">本地挑战</option>
                    <option value="CUSTOM">自定义位置</option>
                  </select>

                  {locationRestriction === 'LOCAL' && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Sliders className="w-4 h-4 inline mr-1" />
                          最大距离: {maxDistance}km
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="200"
                          step="5"
                          value={maxDistance}
                          onChange={(e) => setMaxDistance(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>5km</span>
                          <span>200km</span>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <LocationDisplay className="inline" showDetails={false} />
                          <br />
                          只有距离您 {maxDistance}km 内的用户可以参与此挑战
                        </p>
                      </div>
                    </div>
                  )}

                  {locationRestriction === 'CUSTOM' && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        自定义位置
                      </label>
                      <input
                        {...register('customLocation')}
                        type="text"
                        placeholder="例如：北京市朝阳区"
                        className="input"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        指定特定的地理位置，只有该区域的用户可以参与
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 赌注设置 */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">赌注设置</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  赌注类型
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('stakeType')}
                      type="radio"
                      value="FAVOR"
                      className="text-primary-600"
                    />
                    <span>人情/服务</span>
                  </label>
                  <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('stakeType')}
                      type="radio"
                      value="ITEM"
                      className="text-primary-600"
                    />
                    <span>物品</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stake Description
                  <span className="text-xs text-gray-500 ml-1">(optional)</span>
                </label>
                <input
                  {...register('stakeDescription', {
                    validate: (value) => {
                      if (value && value.trim().length > 0) {
                        if (value.trim().length < 8) {
                          return 'Stake description must be at least 8 characters';
                        }
                        if (value.length > 80) {
                          return 'Stake description cannot exceed 80 characters';
                        }
                      }
                      return true;
                    }
                  })}
                  type="text"
                  className={`input ${errors.stakeDescription ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="e.g., Loser buys everyone bubble tea (8-80 characters)"
                  maxLength={80}
                />
                {errors.stakeDescription && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.stakeDescription.message}
                  </p>
                )}
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    Keep it simple and fun
                  </p>
                  <p className="text-xs text-gray-400">
                    {watch('stakeDescription')?.length || 0}/80
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">重要提醒</p>
                    <p>本平台严禁任何形式的金钱赌博。赌注应该是健康、积极的奖励或惩罚。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 证据设置 */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">证据设置</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  证据类型
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('evidenceType')}
                      type="radio"
                      value="PHOTO"
                      className="text-primary-600"
                    />
                    <span>照片/视频</span>
                  </label>
                  <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('evidenceType')}
                      type="radio"
                      value="TEXT"
                      className="text-primary-600"
                    />
                    <span>文字描述</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  证据要求
                </label>
                <textarea
                  {...register('evidenceInstructions', { required: '请输入证据要求' })}
                  rows={3}
                  className="input"
                  placeholder="详细说明参与者需要提交什么样的证据"
                />
                {errors.evidenceInstructions && (
                  <p className="mt-1 text-sm text-red-600">{errors.evidenceInstructions.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* 参与设置 */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">参与设置</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                最大参与人数
                {user?.isVip && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    VIP可创建更大规模游戏
                  </span>
                )}
              </label>
              <input
                {...register('maxParticipants', {
                  required: '请输入最大参与人数',
                  min: { value: 2, message: '至少需要2人参与' },
                  max: { value: user?.isVip ? 50 : 20, message: user?.isVip ? '最多50人参与' : '最多20人参与，升级VIP可创建更大规模游戏' },
                  valueAsNumber: true,
                })}
                type="number"
                min="2"
                max={user?.isVip ? "50" : "20"}
                className="input"
              />
              {errors.maxParticipants && (
                <p className="mt-1 text-sm text-red-600">{errors.maxParticipants.message}</p>
              )}
              {!user?.isVip && (
                <p className="mt-1 text-xs text-gray-500">
                  普通用户最多20人，<button
                    type="button"
                    onClick={() => navigate('/vip')}
                    className="text-yellow-600 hover:text-yellow-700 underline"
                  >升级VIP</button> 可创建最多50人的大型游戏
                </p>
              )}
            </div>
          </div>

          {/* 时间设置 */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">时间设置</h2>
              <div className="text-sm text-gray-500">
                当前时间: {new Date().toLocaleString('zh-CN', { hour12: false })}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800 mb-2">
                💡 <strong>时间输入说明：</strong>
              </p>
              <div className="text-xs text-blue-700 space-y-1">
                <p>• 如果显示"上午/下午"选择：<strong>下午1点 = 13:00，上午1点 = 01:00</strong></p>
                <p>• 如果显示24小时制：<strong>13:00表示下午1点，01:00表示凌晨1点</strong></p>
                <p>• <strong>中午12点 = 12:00，午夜12点 = 00:00</strong></p>
                <p>• 示例：下午2:30 → 选择"下午 02:30" 或输入 "14:30"</p>
              </div>
            </div>
            <div className="space-y-4">
              {/* 时间选择方式切换 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">时间设置方式</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setUseGameTimeSelector(true)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        useGameTimeSelector
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      智能时间
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseGameTimeSelector(false)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        !useGameTimeSelector
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      手动设置
                    </button>
                  </div>
                </div>

                {/* 游戏时间选择器 */}
                {useGameTimeSelector && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <GameTimeSelector
                      onTimeChange={handleGameTimeChange}
                      defaultDurationHours={selectedTemplate?.defaultDurationHours || 168}
                      className="mb-2"
                    />
                    {selectedTimeLabel && (
                      <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        ✅ 已选择：{selectedTimeLabel}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 手动时间设置 */}
              {!useGameTimeSelector && (
                <div className="space-y-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">手动设置完整时间流程</h4>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* 加入截止时间 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        加入截止时间 <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-500 ml-1">(其他人可加入的最后时间)</span>
                      </label>
                      <input
                        {...register('joinDeadline', { required: '请选择加入截止时间' })}
                        type="datetime-local"
                        className="input"
                        min={new Date(Date.now() + 2 * 60 * 1000).toISOString().slice(0, 16)}
                      />
                      {errors.joinDeadline && (
                        <p className="mt-1 text-sm text-red-600">{errors.joinDeadline.message}</p>
                      )}
                    </div>

                    {/* 游戏开始时间 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        游戏开始时间 <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-500 ml-1">(游戏正式开始，不可再加入)</span>
                      </label>
                      <input
                        {...register('startDate', { required: '请选择游戏开始时间' })}
                        type="datetime-local"
                        className="input"
                      />
                      {errors.startDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                      )}
                    </div>

                    {/* 游戏结束时间 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        游戏结束时间 <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-500 ml-1">(挑战结束，开始提交证据)</span>
                      </label>
                      <input
                        {...register('endDate', { required: '请选择游戏结束时间' })}
                        type="datetime-local"
                        className="input"
                      />
                      {errors.endDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                      )}
                    </div>

                    {/* 证据提交截止 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        证据提交截止 <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-500 ml-1">(提交证据的最后期限)</span>
                      </label>
                      <input
                        {...register('evidenceDeadline', { required: '请选择证据提交截止时间' })}
                        type="datetime-local"
                        className="input"
                      />
                      {errors.evidenceDeadline && (
                        <p className="mt-1 text-sm text-red-600">{errors.evidenceDeadline.message}</p>
                      )}
                    </div>

                    {/* 互评截止时间 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        互评截止时间 <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-500 ml-1">(互相评价的最后期限)</span>
                      </label>
                      <input
                        {...register('reviewDeadline', { required: '请选择互评截止时间' })}
                        type="datetime-local"
                        className="input"
                      />
                      {errors.reviewDeadline && (
                        <p className="mt-1 text-sm text-red-600">{errors.reviewDeadline.message}</p>
                      )}
                    </div>

                    {/* 仲裁截止时间 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        仲裁截止时间 <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-500 ml-1">(争议处理的最后期限)</span>
                      </label>
                      <input
                        {...register('arbitrationDeadline', { required: '请选择仲裁截止时间' })}
                        type="datetime-local"
                        className="input"
                      />
                      {errors.arbitrationDeadline && (
                        <p className="mt-1 text-sm text-red-600">{errors.arbitrationDeadline.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded">
                    💡 <strong>时间流程说明：</strong><br/>
                    1. 加入截止 → 2. 游戏开始 → 3. 游戏结束 → 4. 证据截止 → 5. 互评截止 → 6. 仲裁截止 → 7. 游戏关闭
                  </div>
                </div>
              )}


            </div>
          </div>

          {/* 提交按钮 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-gray-900">准备创建挑战</h3>
                <p className="text-sm text-gray-600">
                  {isDirty ? '表单已修改，请检查信息后提交' : '请填写完整信息'}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${isValid ? 'text-green-600' : 'text-gray-400'}`}>
                  {isValid ? '✓ 信息完整' : '⚠ 信息不完整'}
                </div>
                <div className="text-xs text-gray-500">
                  {Object.keys(errors).length > 0 && `${Object.keys(errors).length} 个字段需要修正`}
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="btn-secondary flex-1"
                disabled={isLoading}
              >
                重新选择模板
              </button>
              <button
                type="submit"
                disabled={isLoading || !isValid}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isLoading || !isValid
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>创建中...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Trophy className="w-4 h-4" />
                    <span>创建挑战</span>
                  </div>
                )}
              </button>
            </div>

            {!isValid && Object.keys(errors).length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium mb-2">请修正以下问题：</p>
                <ul className="text-sm text-red-700 space-y-1">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field} className="flex items-center gap-2">
                      <span className="text-red-500">•</span>
                      {error?.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  )
}

export default CreateGamePage
