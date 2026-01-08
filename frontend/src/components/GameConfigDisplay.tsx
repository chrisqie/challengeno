import React from 'react';
import { Settings, Tag, Users, Target, Clock, BookOpen } from 'lucide-react';

interface GameConfigDisplayProps {
  templateConfig?: Record<string, any>;
  dynamicConfig?: Record<string, any>;
  templateId?: string;
}

const GameConfigDisplay: React.FC<GameConfigDisplayProps> = ({
  templateConfig,
  dynamicConfig,
  templateId
}) => {
  // 如果没有配置数据，不显示
  if (!dynamicConfig || Object.keys(dynamicConfig).length === 0) {
    return null;
  }

  // 根据模板ID确定配置类型
  const getConfigType = () => {
    // 学习成长类
    if (templateId?.includes('language_learning')) return 'language';
    if (templateId?.includes('daily_reading')) return 'reading';
    if (templateId?.includes('skill_practice')) return 'skill';

    // 健身运动类
    if (templateId?.includes('gym_workout')) return 'fitness_gym';
    if (templateId?.includes('running_challenge')) return 'fitness_running';
    if (templateId?.includes('yoga_practice')) return 'fitness_yoga';

    // 健康生活类
    if (templateId?.includes('early_wake_up')) return 'health_wakeup';
    if (templateId?.includes('water_intake')) return 'health_water';
    if (templateId?.includes('meditation')) return 'health_meditation';

    // 个人发展类
    if (templateId?.includes('productivity_boost')) return 'personal_productivity';
    if (templateId?.includes('creative_expression')) return 'personal_creativity';
    if (templateId?.includes('gratitude_journal')) return 'personal_gratitude';

    // 生活方式类
    if (templateId?.includes('cooking_challenge')) return 'lifestyle_cooking';
    if (templateId?.includes('home_organization')) return 'lifestyle_organization';

    // 工作创业类
    if (templateId?.includes('startup_daily_progress')) return 'work_startup';

    return 'general';
  };

  // 渲染语言学习配置
  const renderLanguageConfig = () => {
    const config = dynamicConfig;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {config.language && (
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-medium text-blue-900">学习语种</div>
              <div className="text-sm text-blue-700">
                {getLanguageLabel(config.language)}
              </div>
            </div>
          </div>
        )}
        
        {config.content && (
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <Tag className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-medium text-green-900">学习内容</div>
              <div className="text-sm text-green-700">
                {getContentLabel(config.content)}
              </div>
            </div>
          </div>
        )}
        
        {config.type && (
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <Settings className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-medium text-purple-900">学习方式</div>
              <div className="text-sm text-purple-700">
                {getTypeLabel(config.type)}
              </div>
            </div>
          </div>
        )}
        
        {config.purposes && config.purposes.length > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
            <Target className="w-5 h-5 text-orange-600" />
            <div>
              <div className="font-medium text-orange-900">学习目的</div>
              <div className="text-sm text-orange-700">
                {config.purposes.map((purpose: string) => getPurposeLabel(purpose)).join(', ')}
              </div>
            </div>
          </div>
        )}

        {config.partners && config.partners.length > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
            <Users className="w-5 h-5 text-indigo-600" />
            <div>
              <div className="font-medium text-indigo-900">学习伙伴</div>
              <div className="text-sm text-indigo-700">
                {config.partners.map((partner: string) => getPartnerLabel(partner)).join(', ')}
              </div>
            </div>
          </div>
        )}
        
        {config.persistence && (
          <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
            <Clock className="w-5 h-5 text-pink-600" />
            <div>
              <div className="font-medium text-pink-900">坚持程度</div>
              <div className="text-sm text-pink-700">
                {getPersistenceLabel(config.persistence)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 渲染健身配置
  const renderFitnessConfig = () => {
    const config = dynamicConfig;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {config.trainingType && (
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <Target className="w-5 h-5 text-red-600" />
            <div>
              <div className="font-medium text-red-900">训练类型</div>
              <div className="text-sm text-red-700">
                {getTrainingTypeLabel(config.trainingType)}
              </div>
            </div>
          </div>
        )}
        
        {config.targetMuscle && config.targetMuscle.length > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-medium text-blue-900">目标肌群</div>
              <div className="text-sm text-blue-700">
                {config.targetMuscle.map((muscle: string) => getMuscleLabel(muscle)).join(', ')}
              </div>
            </div>
          </div>
        )}
        
        {config.experience && (
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <BookOpen className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-medium text-green-900">训练经验</div>
              <div className="text-sm text-green-700">
                {getExperienceLabel(config.experience)}
              </div>
            </div>
          </div>
        )}
        
        {config.frequency && (
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <Clock className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-medium text-purple-900">训练频率</div>
              <div className="text-sm text-purple-700">
                {getFrequencyLabel(config.frequency)}
              </div>
            </div>
          </div>
        )}
        
        {config.duration && (
          <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600" />
            <div>
              <div className="font-medium text-orange-900">单次时长</div>
              <div className="text-sm text-orange-700">
                {getDurationLabel(config.duration)}
              </div>
            </div>
          </div>
        )}
        
        {config.goals && config.goals.length > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
            <Target className="w-5 h-5 text-indigo-600" />
            <div>
              <div className="font-medium text-indigo-900">训练目标</div>
              <div className="text-sm text-indigo-700">
                {config.goals.map((goal: string) => getGoalLabel(goal)).join(', ')}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 渲染阅读配置
  const renderReadingConfig = () => {
    const config = dynamicConfig;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {config.genres && config.genres.length > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-medium text-blue-900">阅读类型</div>
              <div className="text-sm text-blue-700">
                {config.genres.map((genre: string) => getGenreLabel(genre)).join(', ')}
              </div>
            </div>
          </div>
        )}

        {config.format && config.format.length > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <Tag className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-medium text-green-900">阅读形式</div>
              <div className="text-sm text-green-700">
                {config.format.map((format: string) => getFormatLabel(format)).join(', ')}
              </div>
            </div>
          </div>
        )}

        {config.goals && config.goals.length > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <Target className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-medium text-purple-900">阅读目标</div>
              <div className="text-sm text-purple-700">
                {config.goals.map((goal: string) => getReadingGoalLabel(goal)).join(', ')}
              </div>
            </div>
          </div>
        )}

        {config.duration && (
          <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600" />
            <div>
              <div className="font-medium text-orange-900">阅读时长</div>
              <div className="text-sm text-orange-700">
                {getDurationLabel(config.duration)}
              </div>
            </div>
          </div>
        )}

        {config.timeOfDay && config.timeOfDay.length > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
            <Clock className="w-5 h-5 text-indigo-600" />
            <div>
              <div className="font-medium text-indigo-900">阅读时间</div>
              <div className="text-sm text-indigo-700">
                {config.timeOfDay.map((time: string) => getTimeOfDayLabel(time)).join(', ')}
              </div>
            </div>
          </div>
        )}

        {config.environment && (
          <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
            <Users className="w-5 h-5 text-pink-600" />
            <div>
              <div className="font-medium text-pink-900">阅读环境</div>
              <div className="text-sm text-pink-700">
                {getReadingEnvironmentLabel(config.environment)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 渲染技能配置
  const renderSkillConfig = () => {
    const config = dynamicConfig;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {config.skillType && (
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Settings className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-medium text-blue-900">技能类型</div>
              <div className="text-sm text-blue-700">
                {getSkillTypeLabel(config.skillType)}
              </div>
            </div>
          </div>
        )}

        {config.experience && (
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <BookOpen className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-medium text-green-900">技能水平</div>
              <div className="text-sm text-green-700">
                {getExperienceLabel(config.experience)}
              </div>
            </div>
          </div>
        )}

        {config.goals && config.goals.length > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <Target className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-medium text-purple-900">学习目标</div>
              <div className="text-sm text-purple-700">
                {config.goals.map((goal: string) => getSkillGoalLabel(goal)).join(', ')}
              </div>
            </div>
          </div>
        )}

        {config.duration && (
          <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600" />
            <div>
              <div className="font-medium text-orange-900">练习时长</div>
              <div className="text-sm text-orange-700">
                {getDurationLabel(config.duration)}
              </div>
            </div>
          </div>
        )}

        {config.resources && config.resources.length > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <div>
              <div className="font-medium text-indigo-900">学习资源</div>
              <div className="text-sm text-indigo-700">
                {config.resources.map((resource: string) => getResourceLabel(resource)).join(', ')}
              </div>
            </div>
          </div>
        )}

        {config.frequency && (
          <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
            <Clock className="w-5 h-5 text-pink-600" />
            <div>
              <div className="font-medium text-pink-900">练习频率</div>
              <div className="text-sm text-pink-700">
                {getFrequencyLabel(config.frequency)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 渲染跑步配置
  const renderRunningConfig = () => {
    const config = dynamicConfig;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {config.experience && (
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-medium text-blue-900">跑步经验</div>
              <div className="text-sm text-blue-700">
                {getExperienceLabel(config.experience)}
              </div>
            </div>
          </div>
        )}

        {config.goals && config.goals.length > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <Target className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-medium text-green-900">跑步目标</div>
              <div className="text-sm text-green-700">
                {config.goals.map((goal: string) => getRunningGoalLabel(goal)).join(', ')}
              </div>
            </div>
          </div>
        )}

        {config.terrain && config.terrain.length > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <Settings className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-medium text-purple-900">地形偏好</div>
              <div className="text-sm text-purple-700">
                {config.terrain.map((terrain: string) => getTerrainLabel(terrain)).join(', ')}
              </div>
            </div>
          </div>
        )}

        {config.frequency && (
          <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600" />
            <div>
              <div className="font-medium text-orange-900">跑步频率</div>
              <div className="text-sm text-orange-700">
                {getFrequencyLabel(config.frequency)}
              </div>
            </div>
          </div>
        )}

        {config.distance && (
          <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
            <Target className="w-5 h-5 text-indigo-600" />
            <div>
              <div className="font-medium text-indigo-900">目标距离</div>
              <div className="text-sm text-indigo-700">
                {config.distance}
              </div>
            </div>
          </div>
        )}

        {config.timeOfDay && config.timeOfDay.length > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
            <Clock className="w-5 h-5 text-pink-600" />
            <div>
              <div className="font-medium text-pink-900">跑步时间</div>
              <div className="text-sm text-pink-700">
                {config.timeOfDay.map((time: string) => getTimeOfDayLabel(time)).join(', ')}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 渲染早起配置
  const renderWakeupConfig = () => {
    const config = dynamicConfig;

    // 标签映射
    const fieldLabels: Record<string, string> = {
      currentTime: '目前起床时间',
      targetTime: '目标起床时间',
      motivation: '早起目标',
      challenges: '面临挑战',
      support: '支持方式',
      rewards: '奖励机制'
    };

    const valueLabels: Record<string, Record<string, string>> = {
      motivation: {
        exercise: '晨练运动',
        study: '学习充电',
        work: '工作效率',
        meditation: '冥想静心',
        planning: '规划一天',
        hobby: '个人爱好'
      },
      challenges: {
        sleep_difficulty: '入睡困难',
        wake_difficulty: '起床困难',
        energy_low: '精力不足',
        schedule_conflict: '时间冲突',
        motivation_lack: '动力不足'
      },
      support: {
        early_sleep: '提前睡觉',
        no_phone: '睡前不玩手机',
        alarm_strategy: '闹钟策略',
        morning_routine: '晨间例行公事',
        accountability: '找人监督',
        gradual_adjustment: '逐步调整'
      },
      rewards: {
        breakfast_treat: '美味早餐',
        morning_coffee: '特制咖啡',
        favorite_activity: '喜爱活动',
        progress_tracking: '进度记录',
        social_sharing: '分享成就',
        weekly_reward: '周末奖励'
      }
    };

    const formatValue = (key: string, value: any) => {
      if (Array.isArray(value)) {
        return value.map(v => valueLabels[key]?.[v] || v).join('、');
      }
      return valueLabels[key]?.[value] || String(value);
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-medium text-blue-900">{fieldLabels[key] || key}</div>
              <div className="text-sm text-blue-700">
                {formatValue(key, value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染饮水配置
  const renderWaterConfig = () => {
    const config = dynamicConfig;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <Target className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-medium text-green-900 capitalize">{key}</div>
              <div className="text-sm text-green-700">
                {Array.isArray(value) ? value.join(', ') : String(value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染冥想配置
  const renderMeditationConfig = () => {
    const config = dynamicConfig;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <Settings className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-medium text-purple-900 capitalize">{key}</div>
              <div className="text-sm text-purple-700">
                {Array.isArray(value) ? value.join(', ') : String(value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染效率提升配置
  const renderProductivityConfig = () => {
    const config = dynamicConfig;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
            <Target className="w-5 h-5 text-orange-600" />
            <div>
              <div className="font-medium text-orange-900 capitalize">{key}</div>
              <div className="text-sm text-orange-700">
                {Array.isArray(value) ? value.join(', ') : String(value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染创意表达配置
  const renderCreativityConfig = () => {
    const config = dynamicConfig;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
            <Settings className="w-5 h-5 text-pink-600" />
            <div>
              <div className="font-medium text-pink-900 capitalize">{key}</div>
              <div className="text-sm text-pink-700">
                {Array.isArray(value) ? value.join(', ') : String(value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染感恩日记配置
  const renderGratitudeConfig = () => {
    const config = dynamicConfig;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <BookOpen className="w-5 h-5 text-yellow-600" />
            <div>
              <div className="font-medium text-yellow-900 capitalize">{key}</div>
              <div className="text-sm text-yellow-700">
                {Array.isArray(value) ? value.join(', ') : String(value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染烹饪配置
  const renderCookingConfig = () => {
    const config = dynamicConfig;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <Settings className="w-5 h-5 text-red-600" />
            <div>
              <div className="font-medium text-red-900 capitalize">{key}</div>
              <div className="text-sm text-red-700">
                {Array.isArray(value) ? value.join(', ') : String(value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染居家整理配置
  const renderOrganizationConfig = () => {
    const config = dynamicConfig;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-3 p-3 bg-teal-50 rounded-lg">
            <Settings className="w-5 h-5 text-teal-600" />
            <div>
              <div className="font-medium text-teal-900 capitalize">{key}</div>
              <div className="text-sm text-teal-700">
                {Array.isArray(value) ? value.join(', ') : String(value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染创业配置
  const renderStartupConfig = () => {
    const config = dynamicConfig;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-3 p-3 bg-cyan-50 rounded-lg">
            <Target className="w-5 h-5 text-cyan-600" />
            <div>
              <div className="font-medium text-cyan-900 capitalize">{key}</div>
              <div className="text-sm text-cyan-700">
                {Array.isArray(value) ? value.join(', ') : String(value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染瑜伽配置
  const renderYogaConfig = () => {
    const config = dynamicConfig;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {config.style && config.style.length > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <Settings className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-medium text-purple-900">瑜伽风格</div>
              <div className="text-sm text-purple-700">
                {config.style.map((style: string) => getYogaStyleLabel(style)).join(', ')}
              </div>
            </div>
          </div>
        )}

        {config.experience && (
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-medium text-blue-900">练习经验</div>
              <div className="text-sm text-blue-700">
                {getExperienceLabel(config.experience)}
              </div>
            </div>
          </div>
        )}

        {config.goals && config.goals.length > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <Target className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-medium text-green-900">练习目标</div>
              <div className="text-sm text-green-700">
                {config.goals.map((goal: string) => getYogaGoalLabel(goal)).join(', ')}
              </div>
            </div>
          </div>
        )}

        {config.duration && (
          <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600" />
            <div>
              <div className="font-medium text-orange-900">练习时长</div>
              <div className="text-sm text-orange-700">
                {getDurationLabel(config.duration)}
              </div>
            </div>
          </div>
        )}

        {config.timeOfDay && config.timeOfDay.length > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
            <Clock className="w-5 h-5 text-indigo-600" />
            <div>
              <div className="font-medium text-indigo-900">练习时间</div>
              <div className="text-sm text-indigo-700">
                {config.timeOfDay.map((time: string) => getTimeOfDayLabel(time)).join(', ')}
              </div>
            </div>
          </div>
        )}

        {config.environment && (
          <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
            <Users className="w-5 h-5 text-pink-600" />
            <div>
              <div className="font-medium text-pink-900">练习环境</div>
              <div className="text-sm text-pink-700">
                {getYogaEnvironmentLabel(config.environment)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 渲染通用配置
  const renderGeneralConfig = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(dynamicConfig).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Settings className="w-5 h-5 text-gray-600" />
            <div>
              <div className="font-medium text-gray-900 capitalize">{key}</div>
              <div className="text-sm text-gray-700">
                {Array.isArray(value) ? value.join(', ') : String(value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const configType = getConfigType();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">个性化配置</h3>
      </div>
      
      {/* 学习成长类 */}
      {configType === 'language' && renderLanguageConfig()}
      {configType === 'reading' && renderReadingConfig()}
      {configType === 'skill' && renderSkillConfig()}

      {/* 健身运动类 */}
      {configType === 'fitness_gym' && renderFitnessConfig()}
      {configType === 'fitness_running' && renderRunningConfig()}
      {configType === 'fitness_yoga' && renderYogaConfig()}

      {/* 健康生活类 */}
      {configType === 'health_wakeup' && renderWakeupConfig()}
      {configType === 'health_water' && renderWaterConfig()}
      {configType === 'health_meditation' && renderMeditationConfig()}

      {/* 个人发展类 */}
      {configType === 'personal_productivity' && renderProductivityConfig()}
      {configType === 'personal_creativity' && renderCreativityConfig()}
      {configType === 'personal_gratitude' && renderGratitudeConfig()}

      {/* 生活方式类 */}
      {configType === 'lifestyle_cooking' && renderCookingConfig()}
      {configType === 'lifestyle_organization' && renderOrganizationConfig()}

      {/* 工作创业类 */}
      {configType === 'work_startup' && renderStartupConfig()}

      {/* 通用配置 */}
      {configType === 'general' && renderGeneralConfig()}
    </div>
  );
};

// 标签映射函数
const getLanguageLabel = (value: string) => {
  const labels: Record<string, string> = {
    'english': '英语',
    'chinese': '中文',
    'japanese': '日语',
    'korean': '韩语',
    'french': '法语',
    'german': '德语',
    'spanish': '西班牙语'
  };
  return labels[value] || value;
};

const getContentLabel = (value: string) => {
  const labels: Record<string, string> = {
    'vocabulary': '词汇',
    'grammar': '语法',
    'speaking': '口语',
    'listening': '听力',
    'reading': '阅读',
    'writing': '写作'
  };
  return labels[value] || value;
};

const getTypeLabel = (value: string) => {
  const labels: Record<string, string> = {
    'reading': '阅读',
    'listening': '听力',
    'speaking': '口语',
    'writing': '写作',
    'comprehensive': '综合练习'
  };
  return labels[value] || value;
};

const getPurposeLabel = (value: string) => {
  const labels: Record<string, string> = {
    'exam': '考试',
    'travel': '旅游',
    'business': '商务',
    'improvement': '提升',
    'hobby': '兴趣'
  };
  return labels[value] || value;
};

const getPartnerLabel = (value: string) => {
  const labels: Record<string, string> = {
    'textbook': '教材',
    'app': '应用',
    'tutor': '导师',
    'friend': '朋友',
    'online': '在线课程'
  };
  return labels[value] || value;
};

const getPersistenceLabel = (value: string) => {
  const labels: Record<string, string> = {
    'can_persist': '能坚持',
    'need_motivation': '需要激励',
    'easy_give_up': '容易放弃'
  };
  return labels[value] || value;
};

const getTrainingTypeLabel = (value: string) => {
  const labels: Record<string, string> = {
    'strength': '力量训练',
    'cardio': '有氧运动',
    'flexibility': '柔韧性',
    'endurance': '耐力训练',
    'functional': '功能性训练',
    'rehabilitation': '康复训练',
    'mixed': '混合训练'
  };
  return labels[value] || value;
};

const getMuscleLabel = (value: string) => {
  const labels: Record<string, string> = {
    'chest': '胸部',
    'back': '背部',
    'shoulders': '肩部',
    'arms': '手臂',
    'legs': '腿部',
    'core': '核心',
    'glutes': '臀部',
    'full_body': '全身'
  };
  return labels[value] || value;
};

const getExperienceLabel = (value: string) => {
  const labels: Record<string, string> = {
    'beginner': '初学者',
    'intermediate': '中级',
    'advanced': '高级',
    'expert': '专家'
  };
  return labels[value] || value;
};

const getFrequencyLabel = (value: string) => {
  const labels: Record<string, string> = {
    'daily': '每天',
    '5_times_week': '每周5次',
    '3_times_week': '每周3次',
    '2_times_week': '每周2次',
    'once_week': '每周1次',
    'flexible': '灵活安排'
  };
  return labels[value] || value;
};

const getDurationLabel = (value: string) => {
  const labels: Record<string, string> = {
    '30_min': '30分钟',
    '45_min': '45分钟',
    '60_min': '1小时',
    '90_min': '1.5小时',
    '120_min': '2小时',
    'flexible': '灵活安排'
  };
  return labels[value] || value;
};

const getGoalLabel = (value: string) => {
  const labels: Record<string, string> = {
    'weight_loss': '减重',
    'muscle_gain': '增肌',
    'strength': '力量提升',
    'endurance': '耐力提升',
    'flexibility': '柔韧性',
    'health': '健康维护',
    'rehabilitation': '康复',
    'competition': '比赛准备'
  };
  return labels[value] || value;
};

// 新增标签映射函数
const getRunningGoalLabel = (value: string) => {
  const labels: Record<string, string> = {
    'weight_loss': '减重塑形',
    'endurance': '提升耐力',
    'speed': '提高速度',
    'health': '健康维护',
    'stress_relief': '缓解压力',
    'competition': '参加比赛'
  };
  return labels[value] || value;
};

const getTerrainLabel = (value: string) => {
  const labels: Record<string, string> = {
    'road': '公路跑',
    'track': '跑道',
    'trail': '越野跑',
    'treadmill': '跑步机',
    'park': '公园小径'
  };
  return labels[value] || value;
};

const getYogaStyleLabel = (value: string) => {
  const labels: Record<string, string> = {
    'hatha': '哈他瑜伽',
    'vinyasa': '流瑜伽',
    'yin': '阴瑜伽',
    'power': '力量瑜伽',
    'restorative': '修复瑜伽',
    'meditation': '冥想瑜伽'
  };
  return labels[value] || value;
};

const getYogaGoalLabel = (value: string) => {
  const labels: Record<string, string> = {
    'flexibility': '提升柔韧性',
    'strength': '增强力量',
    'balance': '改善平衡',
    'stress_relief': '缓解压力',
    'mindfulness': '提升专注力',
    'posture': '改善体态',
    'sleep': '改善睡眠'
  };
  return labels[value] || value;
};

const getYogaEnvironmentLabel = (value: string) => {
  const labels: Record<string, string> = {
    'home': '居家练习',
    'studio': '瑜伽馆',
    'outdoor': '户外练习',
    'online': '在线课程'
  };
  return labels[value] || value;
};

const getTimeOfDayLabel = (value: string) => {
  const labels: Record<string, string> = {
    'early_morning': '清晨',
    'morning': '上午',
    'commute': '通勤时间',
    'lunch': '午休时间',
    'afternoon': '下午',
    'evening': '傍晚',
    'night': '夜晚'
  };
  return labels[value] || value;
};

// 阅读相关标签
const getGenreLabel = (value: string) => {
  const labels: Record<string, string> = {
    'fiction': '小说文学',
    'non_fiction': '非虚构类',
    'business': '商业管理',
    'self_help': '自我提升',
    'technical': '专业技术',
    'philosophy': '哲学思辨'
  };
  return labels[value] || value;
};

const getFormatLabel = (value: string) => {
  const labels: Record<string, string> = {
    'physical': '纸质书籍',
    'ebook': '电子书',
    'audiobook': '有声书',
    'articles': '文章期刊',
    'online': '在线阅读'
  };
  return labels[value] || value;
};

const getReadingGoalLabel = (value: string) => {
  const labels: Record<string, string> = {
    'knowledge': '增长知识',
    'entertainment': '娱乐放松',
    'skill_improvement': '技能提升',
    'language': '语言学习',
    'inspiration': '寻找灵感',
    'habit_building': '养成习惯'
  };
  return labels[value] || value;
};

const getReadingEnvironmentLabel = (value: string) => {
  const labels: Record<string, string> = {
    'home': '居家阅读',
    'library': '图书馆',
    'cafe': '咖啡厅',
    'outdoor': '户外阅读',
    'commute': '移动阅读'
  };
  return labels[value] || value;
};

// 技能相关标签
const getSkillTypeLabel = (value: string) => {
  const labels: Record<string, string> = {
    'music': '音乐技能',
    'art': '艺术创作',
    'programming': '编程技术',
    'language': '语言技能',
    'craft': '手工技艺',
    'sports': '运动技能',
    'writing': '写作技能',
    'other': '其他技能'
  };
  return labels[value] || value;
};

const getSkillGoalLabel = (value: string) => {
  const labels: Record<string, string> = {
    'basic_mastery': '掌握基础',
    'skill_improvement': '技能提升',
    'creative_expression': '创意表达',
    'professional_development': '职业发展',
    'hobby_enjoyment': '兴趣爱好',
    'competition_preparation': '比赛准备'
  };
  return labels[value] || value;
};

const getResourceLabel = (value: string) => {
  const labels: Record<string, string> = {
    'online_courses': '在线课程',
    'books': '书籍教材',
    'videos': '视频教程',
    'practice_apps': '练习应用',
    'mentor': '导师指导',
    'community': '学习社区'
  };
  return labels[value] || value;
};

export default GameConfigDisplay;
