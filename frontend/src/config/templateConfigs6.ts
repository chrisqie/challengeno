import {
  TemplateConfigDefinition,
  TemplateType,
  TemplateConfig
} from '../types/templateConfig';

// ============================================
// 健身类精细模板配置
// ============================================

// 辅助函数 - 骑行训练
const getCyclingDistanceLabel = (distance: string): string => {
  const map: Record<string, string> = {
    '10km': '10公里',
    '20km': '20公里',
    '30km': '30公里',
    '50km': '50公里'
  };
  return map[distance] || distance;
};

const getCyclingTerrainLabel = (terrain: string): string => {
  const map: Record<string, string> = {
    'flat': '平路',
    'hills': '丘陵',
    'mountain': '山地',
    'mixed': '混合路况'
  };
  return map[terrain] || terrain;
};

// 骑行训练配置
export const FITNESS_CARDIO_CYCLING_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'FITNESS',
  subcategory: 'FITNESS_CARDIO',
  sections: [
    {
      id: 'cycling_basics',
      title: '骑行基础',
      fields: [
        {
          id: 'targetDistance',
          label: '目标距离',
          type: 'select',
          required: true,
          options: [
            { value: '10km', label: '10公里' },
            { value: '20km', label: '20公里' },
            { value: '30km', label: '30公里' },
            { value: '50km', label: '50公里' }
          ],
          defaultValue: '20km'
        },
        {
          id: 'terrain',
          label: '路况类型',
          type: 'radio',
          required: true,
          options: [
            { value: 'flat', label: '平路', description: '城市道路、平坦路面' },
            { value: 'hills', label: '丘陵', description: '有起伏的路段' },
            { value: 'mountain', label: '山地', description: '山路、越野' },
            { value: 'mixed', label: '混合路况', description: '多种路况' }
          ],
          defaultValue: 'flat'
        }
      ]
    },
    {
      id: 'cycling_goals',
      title: '训练目标',
      fields: [
        {
          id: 'goals',
          label: '骑行目标',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'endurance', label: '提升耐力' },
            { value: 'speed', label: '提高速度' },
            { value: 'weight_loss', label: '减脂瘦身' },
            { value: 'leg_strength', label: '腿部力量' },
            { value: 'cardio', label: '心肺功能' }
          ],
          defaultValue: ['endurance']
        },
        {
          id: 'frequency',
          label: '骑行频率',
          type: 'select',
          required: true,
          options: [
            { value: 'daily', label: '每天' },
            { value: '3_per_week', label: '每周3次' },
            { value: '5_per_week', label: '每周5次' }
          ],
          defaultValue: '3_per_week'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const distance = getCyclingDistanceLabel(config.targetDistance || '20km');
    const terrain = getCyclingTerrainLabel(config.terrain || 'flat');
    return `${distance}${terrain}骑行训练`;
  },
  generateDescription: (config: TemplateConfig) => {
    const distance = getCyclingDistanceLabel(config.targetDistance || '20km');
    const terrain = getCyclingTerrainLabel(config.terrain || 'flat');
    const goals = config.goals?.length || 1;
    const freq = config.frequency === 'daily' ? '每天' : config.frequency === '3_per_week' ? '每周3次' : '每周5次';
    
    return `${freq}骑行${distance}，路况为${terrain}。通过系统训练，实现${goals}个健身目标。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每次骑行后提交骑行APP截图，包含距离、时间、路线等数据。拍摄骑行照片作为证据。';
  }
};

// 辅助函数 - 健身房训练
const getGymFocusLabel = (focus: string): string => {
  const map: Record<string, string> = {
    'strength': '力量训练',
    'muscle': '增肌',
    'fat_loss': '减脂',
    'endurance': '耐力',
    'functional': '功能性训练'
  };
  return map[focus] || focus;
};

const getMuscleGroupLabel = (group: string): string => {
  const map: Record<string, string> = {
    'chest': '胸肌',
    'back': '背肌',
    'shoulders': '肩膀',
    'arms': '手臂',
    'legs': '腿部',
    'core': '核心',
    'full_body': '全身'
  };
  return map[group] || group;
};

// 健身房训练配置
export const FITNESS_STRENGTH_GYM_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'FITNESS',
  subcategory: 'FITNESS_STRENGTH',
  sections: [
    {
      id: 'gym_basics',
      title: '训练基础',
      fields: [
        {
          id: 'trainingFocus',
          label: '训练重点',
          type: 'radio',
          required: true,
          options: [
            { value: 'strength', label: '力量训练', description: '提升最大力量' },
            { value: 'muscle', label: '增肌', description: '肌肉体积增长' },
            { value: 'fat_loss', label: '减脂', description: '降低体脂率' },
            { value: 'endurance', label: '耐力', description: '肌肉耐力' },
            { value: 'functional', label: '功能性训练', description: '日常动作能力' }
          ],
          defaultValue: 'muscle'
        },
        {
          id: 'targetMuscles',
          label: '目标肌群',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'chest', label: '胸肌' },
            { value: 'back', label: '背肌' },
            { value: 'shoulders', label: '肩膀' },
            { value: 'arms', label: '手臂' },
            { value: 'legs', label: '腿部' },
            { value: 'core', label: '核心' },
            { value: 'full_body', label: '全身' }
          ],
          defaultValue: ['chest', 'back', 'legs']
        }
      ]
    },
    {
      id: 'gym_schedule',
      title: '训练安排',
      fields: [
        {
          id: 'frequency',
          label: '训练频率',
          type: 'select',
          required: true,
          options: [
            { value: '3_days', label: '每周3次' },
            { value: '4_days', label: '每周4次' },
            { value: '5_days', label: '每周5次' },
            { value: '6_days', label: '每周6次' }
          ],
          defaultValue: '4_days'
        },
        {
          id: 'sessionDuration',
          label: '每次时长',
          type: 'select',
          required: true,
          options: [
            { value: '45min', label: '45分钟' },
            { value: '60min', label: '60分钟' },
            { value: '90min', label: '90分钟' }
          ],
          defaultValue: '60min'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const focus = getGymFocusLabel(config.trainingFocus || 'muscle');
    const freq = config.frequency === '3_days' ? '每周3练' : 
                 config.frequency === '4_days' ? '每周4练' :
                 config.frequency === '5_days' ? '每周5练' : '每周6练';
    return `${freq}${focus}计划`;
  },
  generateDescription: (config: TemplateConfig) => {
    const focus = getGymFocusLabel(config.trainingFocus || 'muscle');
    const muscles = config.targetMuscles?.map((m: string) => getMuscleGroupLabel(m)).join('、') || '全身';
    const duration = config.sessionDuration === '45min' ? '45分钟' : 
                     config.sessionDuration === '60min' ? '60分钟' : '90分钟';
    
    return `系统化${focus}，重点训练${muscles}。每次训练${duration}，科学安排训练计划。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每次训练后提交健身照片或视频，记录训练动作、组数、重量等数据。';
  }
};

// 辅助函数 - 拉伸训练
const getStretchingTypeLabel = (type: string): string => {
  const map: Record<string, string> = {
    'static': '静态拉伸',
    'dynamic': '动态拉伸',
    'yoga': '瑜伽拉伸',
    'foam_rolling': '泡沫轴放松'
  };
  return map[type] || type;
};

// 拉伸训练配置
export const FITNESS_FLEXIBILITY_STRETCHING_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'FITNESS',
  subcategory: 'FITNESS_FLEXIBILITY',
  sections: [
    {
      id: 'stretching_basics',
      title: '拉伸基础',
      fields: [
        {
          id: 'stretchingType',
          label: '拉伸类型',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'static', label: '静态拉伸', description: '保持姿势15-30秒' },
            { value: 'dynamic', label: '动态拉伸', description: '活动关节' },
            { value: 'yoga', label: '瑜伽拉伸', description: '瑜伽体式' },
            { value: 'foam_rolling', label: '泡沫轴放松', description: '筋膜放松' }
          ],
          defaultValue: ['static']
        },
        {
          id: 'targetAreas',
          label: '重点部位',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'neck_shoulders', label: '颈肩' },
            { value: 'back', label: '背部' },
            { value: 'hips', label: '髋部' },
            { value: 'legs', label: '腿部' },
            { value: 'full_body', label: '全身' }
          ],
          defaultValue: ['neck_shoulders', 'back']
        }
      ]
    },
    {
      id: 'stretching_schedule',
      title: '拉伸安排',
      fields: [
        {
          id: 'timing',
          label: '拉伸时间',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'morning', label: '晨起拉伸', description: '唤醒身体' },
            { value: 'before_workout', label: '运动前', description: '热身准备' },
            { value: 'after_workout', label: '运动后', description: '放松恢复' },
            { value: 'evening', label: '睡前拉伸', description: '助眠放松' }
          ],
          defaultValue: ['morning']
        },
        {
          id: 'duration',
          label: '每次时长',
          type: 'select',
          required: true,
          options: [
            { value: '10min', label: '10分钟' },
            { value: '15min', label: '15分钟' },
            { value: '20min', label: '20分钟' },
            { value: '30min', label: '30分钟' }
          ],
          defaultValue: '15min'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const types = config.stretchingType?.map((t: string) => getStretchingTypeLabel(t)).join('+') || '拉伸';
    const duration = config.duration === '10min' ? '10分钟' : 
                     config.duration === '15min' ? '15分钟' :
                     config.duration === '20min' ? '20分钟' : '30分钟';
    return `每日${duration}${types}训练`;
  },
  generateDescription: (config: TemplateConfig) => {
    const types = config.stretchingType?.map((t: string) => getStretchingTypeLabel(t)).join('、') || '拉伸';
    const areas = config.targetAreas?.length || 2;
    const timings = config.timing?.length || 1;
    
    return `通过${types}改善柔韧性，重点拉伸${areas}个部位。在${timings}个时段进行拉伸，提升身体灵活度。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每次拉伸后拍摄拉伸姿势照片，记录拉伸部位和时长。分享身体柔韧性的改善。';
  }
};

