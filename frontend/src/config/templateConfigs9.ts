import {
  TemplateConfigDefinition,
  TemplateType,
  TemplateConfig
} from '../types/templateConfig';

// ============================================
// 生活方式类精细模板配置
// ============================================

// 居家清洁配置
export const LIFESTYLE_HOME_CLEANING_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'LIFESTYLE',
  subcategory: 'LIFESTYLE_HOME',
  sections: [
    {
      id: 'cleaning_basics',
      title: '清洁设置',
      fields: [
        {
          id: 'cleaningAreas',
          label: '清洁区域',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'bedroom', label: '卧室' },
            { value: 'living_room', label: '客厅' },
            { value: 'kitchen', label: '厨房' },
            { value: 'bathroom', label: '卫生间' },
            { value: 'all', label: '全屋' }
          ],
          defaultValue: ['bedroom', 'living_room']
        },
        {
          id: 'frequency',
          label: '清洁频率',
          type: 'radio',
          required: true,
          options: [
            { value: 'daily', label: '每天', description: '日常整理' },
            { value: 'weekly', label: '每周', description: '深度清洁' },
            { value: 'biweekly', label: '两周一次', description: '大扫除' }
          ],
          defaultValue: 'daily'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const freqs: Record<string, string> = {
      'daily': '每日', 'weekly': '每周', 'biweekly': '两周'
    };
    const freq = freqs[config.frequency || 'daily'] || '每日';
    const areas = config.cleaningAreas?.length || 2;
    return `${freq}${areas}区域清洁整理`;
  },
  generateDescription: (config: TemplateConfig) => {
    const freqs: Record<string, string> = {
      'daily': '每天', 'weekly': '每周', 'biweekly': '两周一次'
    };
    const freq = freqs[config.frequency || 'daily'] || '每天';
    const areas = config.cleaningAreas?.length || 2;
    return `${freq}清洁整理${areas}个区域，保持居家环境整洁舒适。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每次清洁后提交整理前后对比照片，展示清洁成果。';
  }
};

// 社交联系配置
export const LIFESTYLE_SOCIAL_CONNECTION_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'LIFESTYLE',
  subcategory: 'LIFESTYLE_SOCIAL',
  sections: [
    {
      id: 'social_basics',
      title: '社交设置',
      fields: [
        {
          id: 'connectionType',
          label: '联系方式',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'call', label: '电话' },
            { value: 'video', label: '视频通话' },
            { value: 'meet', label: '面对面见面' },
            { value: 'message', label: '深度聊天' }
          ],
          defaultValue: ['call']
        },
        {
          id: 'frequency',
          label: '联系频率',
          type: 'select',
          required: true,
          options: [
            { value: 'daily', label: '每天1人' },
            { value: '3_per_week', label: '每周3人' },
            { value: 'weekly', label: '每周1人' }
          ],
          defaultValue: 'weekly'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const freqs: Record<string, string> = {
      'daily': '每日', '3_per_week': '每周3次', 'weekly': '每周'
    };
    const freq = freqs[config.frequency || 'weekly'] || '每周';
    return `${freq}主动社交联系`;
  },
  generateDescription: (config: TemplateConfig) => {
    const freqs: Record<string, string> = {
      'daily': '每天', '3_per_week': '每周3次', 'weekly': '每周'
    };
    const freq = freqs[config.frequency || 'weekly'] || '每周';
    const types = config.connectionType?.length || 1;
    return `${freq}通过${types}种方式主动联系亲友，维护人际关系。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每次联系后记录联系对象和方式，分享交流内容和感受。';
  }
};

// 志愿服务配置
export const LIFESTYLE_SOCIAL_VOLUNTEER_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'LIFESTYLE',
  subcategory: 'LIFESTYLE_SOCIAL',
  sections: [
    {
      id: 'volunteer_basics',
      title: '志愿服务',
      fields: [
        {
          id: 'serviceType',
          label: '服务类型',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'community', label: '社区服务' },
            { value: 'education', label: '教育支持' },
            { value: 'environment', label: '环保活动' },
            { value: 'elderly', label: '关爱老人' },
            { value: 'children', label: '儿童关怀' }
          ],
          defaultValue: ['community']
        },
        {
          id: 'frequency',
          label: '服务频率',
          type: 'select',
          required: true,
          options: [
            { value: 'weekly', label: '每周' },
            { value: 'biweekly', label: '两周一次' },
            { value: 'monthly', label: '每月' }
          ],
          defaultValue: 'monthly'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const freqs: Record<string, string> = {
      'weekly': '每周', 'biweekly': '两周', 'monthly': '每月'
    };
    const freq = freqs[config.frequency || 'monthly'] || '每月';
    return `${freq}志愿服务活动`;
  },
  generateDescription: (config: TemplateConfig) => {
    const freqs: Record<string, string> = {
      'weekly': '每周', 'biweekly': '两周一次', 'monthly': '每月'
    };
    const freq = freqs[config.frequency || 'monthly'] || '每月';
    const types = config.serviceType?.length || 1;
    return `${freq}参与${types}种志愿服务，回馈社会，传递爱心。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每次服务后提交活动照片和服务记录，分享志愿服务的感受和收获。';
  }
};

// 摄影练习配置
export const LIFESTYLE_HOBBY_PHOTOGRAPHY_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'LIFESTYLE',
  subcategory: 'LIFESTYLE_HOBBY',
  sections: [
    {
      id: 'photography_basics',
      title: '摄影设置',
      fields: [
        {
          id: 'photoType',
          label: '摄影类型',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'landscape', label: '风景' },
            { value: 'portrait', label: '人像' },
            { value: 'street', label: '街拍' },
            { value: 'food', label: '美食' },
            { value: 'macro', label: '微距' }
          ],
          defaultValue: ['landscape']
        },
        {
          id: 'dailyPhotos',
          label: '每日拍摄数量',
          type: 'select',
          required: true,
          options: [
            { value: '5', label: '5张' },
            { value: '10', label: '10张' },
            { value: '20', label: '20张' },
            { value: '50', label: '50张' }
          ],
          defaultValue: '10'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const count = config.dailyPhotos || '10';
    return `每日拍摄${count}张照片`;
  },
  generateDescription: (config: TemplateConfig) => {
    const count = config.dailyPhotos || '10';
    const types = config.photoType?.length || 1;
    return `每天拍摄${count}张照片，涵盖${types}种摄影类型。提升摄影技巧和审美能力。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每天提交精选照片，记录拍摄主题和参数设置。';
  }
};

// 园艺种植配置
export const LIFESTYLE_HOBBY_GARDENING_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'LIFESTYLE',
  subcategory: 'LIFESTYLE_HOBBY',
  sections: [
    {
      id: 'gardening_basics',
      title: '园艺设置',
      fields: [
        {
          id: 'plantType',
          label: '种植类型',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'flowers', label: '花卉' },
            { value: 'vegetables', label: '蔬菜' },
            { value: 'herbs', label: '香草' },
            { value: 'succulents', label: '多肉植物' },
            { value: 'trees', label: '树木' }
          ],
          defaultValue: ['flowers']
        },
        {
          id: 'careFrequency',
          label: '养护频率',
          type: 'select',
          required: true,
          options: [
            { value: 'daily', label: '每天' },
            { value: '3_per_week', label: '每周3次' },
            { value: 'weekly', label: '每周' }
          ],
          defaultValue: 'daily'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const freqs: Record<string, string> = {
      'daily': '每日', '3_per_week': '每周3次', 'weekly': '每周'
    };
    const freq = freqs[config.careFrequency || 'daily'] || '每日';
    return `${freq}园艺养护记录`;
  },
  generateDescription: (config: TemplateConfig) => {
    const freqs: Record<string, string> = {
      'daily': '每天', '3_per_week': '每周3次', 'weekly': '每周'
    };
    const freq = freqs[config.careFrequency || 'daily'] || '每天';
    const types = config.plantType?.length || 1;
    return `${freq}养护${types}种植物，记录植物生长过程。享受园艺乐趣，亲近自然。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每次养护后提交植物照片，记录浇水、施肥等养护活动。';
  }
};

// 观影打卡配置
export const LIFESTYLE_HOBBY_MOVIE_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'LIFESTYLE',
  subcategory: 'LIFESTYLE_HOBBY',
  sections: [
    {
      id: 'movie_basics',
      title: '观影设置',
      fields: [
        {
          id: 'movieType',
          label: '电影类型',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'classic', label: '经典电影' },
            { value: 'documentary', label: '纪录片' },
            { value: 'art', label: '艺术片' },
            { value: 'foreign', label: '外语片' },
            { value: 'series', label: '剧集' }
          ],
          defaultValue: ['classic']
        },
        {
          id: 'frequency',
          label: '观影频率',
          type: 'select',
          required: true,
          options: [
            { value: 'daily', label: '每天' },
            { value: '3_per_week', label: '每周3部' },
            { value: 'weekly', label: '每周1部' }
          ],
          defaultValue: 'weekly'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const freqs: Record<string, string> = {
      'daily': '每日', '3_per_week': '每周3部', 'weekly': '每周'
    };
    const freq = freqs[config.frequency || 'weekly'] || '每周';
    return `${freq}观影打卡`;
  },
  generateDescription: (config: TemplateConfig) => {
    const freqs: Record<string, string> = {
      'daily': '每天', '3_per_week': '每周3部', 'weekly': '每周'
    };
    const freq = freqs[config.frequency || 'weekly'] || '每周';
    const types = config.movieType?.length || 1;
    return `${freq}观看${types}种类型的电影，拓展视野，提升审美。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每次观影后提交电影海报和观后感，分享观影体验。';
  }
};

