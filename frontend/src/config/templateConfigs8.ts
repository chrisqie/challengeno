import {
  TemplateConfigDefinition,
  TemplateType,
  TemplateConfig
} from '../types/templateConfig';

// ============================================
// 个人成长类精细模板配置
// ============================================

// 待办事项管理配置
export const PERSONAL_PRODUCTIVITY_TODO_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'PERSONAL',
  subcategory: 'PERSONAL_PRODUCTIVITY',
  sections: [
    {
      id: 'todo_basics',
      title: '任务管理',
      fields: [
        {
          id: 'dailyTasks',
          label: '每日任务数量',
          type: 'select',
          required: true,
          options: [
            { value: '3', label: '3个重要任务' },
            { value: '5', label: '5个任务' },
            { value: '10', label: '10个任务' }
          ],
          defaultValue: '5'
        },
        {
          id: 'method',
          label: '管理方法',
          type: 'radio',
          required: true,
          options: [
            { value: 'eisenhower', label: '四象限法', description: '紧急重要矩阵' },
            { value: 'mit', label: 'MIT法', description: '最重要的3件事' },
            { value: 'gtd', label: 'GTD', description: 'Getting Things Done' }
          ],
          defaultValue: 'mit'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const tasks = config.dailyTasks || '5';
    const methods: Record<string, string> = {
      'eisenhower': '四象限', 'mit': 'MIT', 'gtd': 'GTD'
    };
    const method = methods[config.method || 'mit'] || 'MIT';
    return `每日${tasks}任务${method}管理`;
  },
  generateDescription: (config: TemplateConfig) => {
    const tasks = config.dailyTasks || '5';
    const methods: Record<string, string> = {
      'eisenhower': '四象限法', 'mit': 'MIT法', 'gtd': 'GTD方法'
    };
    const method = methods[config.method || 'mit'] || 'MIT法';
    return `每天使用${method}管理${tasks}个任务，提高执行力和完成率。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每天提交任务清单和完成情况截图，记录任务完成率。';
  }
};

// 写作练习配置
export const PERSONAL_CREATIVITY_WRITING_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'PERSONAL',
  subcategory: 'PERSONAL_CREATIVITY',
  sections: [
    {
      id: 'writing_basics',
      title: '写作基础',
      fields: [
        {
          id: 'writingType',
          label: '写作类型',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'journal', label: '日记' },
            { value: 'essay', label: '随笔' },
            { value: 'fiction', label: '小说' },
            { value: 'poetry', label: '诗歌' },
            { value: 'blog', label: '博客文章' }
          ],
          defaultValue: ['journal']
        },
        {
          id: 'dailyWords',
          label: '每日字数',
          type: 'select',
          required: true,
          options: [
            { value: '300', label: '300字' },
            { value: '500', label: '500字' },
            { value: '1000', label: '1000字' },
            { value: '2000', label: '2000字' }
          ],
          defaultValue: '500'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const words = config.dailyWords || '500';
    return `每日${words}字写作练习`;
  },
  generateDescription: (config: TemplateConfig) => {
    const words = config.dailyWords || '500';
    const types = config.writingType?.length || 1;
    return `每天写作${words}字，涵盖${types}种写作类型。坚持写作，提升表达能力。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每天提交写作内容截图或文字，记录写作字数和主题。';
  }
};

// 绘画练习配置
export const PERSONAL_CREATIVITY_DRAWING_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'PERSONAL',
  subcategory: 'PERSONAL_CREATIVITY',
  sections: [
    {
      id: 'drawing_basics',
      title: '绘画基础',
      fields: [
        {
          id: 'drawingStyle',
          label: '绘画风格',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'sketch', label: '素描' },
            { value: 'watercolor', label: '水彩' },
            { value: 'digital', label: '数字绘画' },
            { value: 'cartoon', label: '卡通漫画' },
            { value: 'realistic', label: '写实' }
          ],
          defaultValue: ['sketch']
        },
        {
          id: 'dailyMinutes',
          label: '每日练习时长',
          type: 'select',
          required: true,
          options: [
            { value: '15min', label: '15分钟' },
            { value: '30min', label: '30分钟' },
            { value: '60min', label: '60分钟' },
            { value: '90min', label: '90分钟' }
          ],
          defaultValue: '30min'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const duration = config.dailyMinutes === '15min' ? '15分钟' :
                     config.dailyMinutes === '30min' ? '30分钟' :
                     config.dailyMinutes === '60min' ? '60分钟' : '90分钟';
    return `每日${duration}绘画练习`;
  },
  generateDescription: (config: TemplateConfig) => {
    const duration = config.dailyMinutes === '15min' ? '15分钟' :
                     config.dailyMinutes === '30min' ? '30分钟' :
                     config.dailyMinutes === '60min' ? '60分钟' : '90分钟';
    const styles = config.drawingStyle?.length || 1;
    return `每天练习${duration}绘画，探索${styles}种绘画风格。提升绘画技巧和艺术表达。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每天提交绘画作品照片，记录练习内容和进步。';
  }
};

// 反思日记配置
export const PERSONAL_GROWTH_REFLECTION_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'PERSONAL',
  subcategory: 'PERSONAL_GROWTH',
  sections: [
    {
      id: 'reflection_basics',
      title: '反思设置',
      fields: [
        {
          id: 'reflectionTime',
          label: '反思时间',
          type: 'radio',
          required: true,
          options: [
            { value: 'morning', label: '早晨', description: '规划一天' },
            { value: 'evening', label: '晚上', description: '回顾一天' },
            { value: 'weekly', label: '每周', description: '周总结' }
          ],
          defaultValue: 'evening'
        },
        {
          id: 'reflectionAreas',
          label: '反思领域',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'work', label: '工作' },
            { value: 'relationships', label: '人际关系' },
            { value: 'health', label: '健康' },
            { value: 'learning', label: '学习成长' },
            { value: 'emotions', label: '情绪管理' }
          ],
          defaultValue: ['work', 'learning']
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const times: Record<string, string> = {
      'morning': '晨间', 'evening': '晚间', 'weekly': '每周'
    };
    const time = times[config.reflectionTime || 'evening'] || '晚间';
    return `${time}反思日记`;
  },
  generateDescription: (config: TemplateConfig) => {
    const times: Record<string, string> = {
      'morning': '晨间', 'evening': '晚间', 'weekly': '每周'
    };
    const time = times[config.reflectionTime || 'evening'] || '晚间';
    const areas = config.reflectionAreas?.length || 2;
    return `${time}进行深度反思，关注${areas}个生活领域。通过反思提升自我认知和成长。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每次提交反思日记内容，记录思考和感悟。';
  }
};

// 学习新知识配置
export const PERSONAL_GROWTH_LEARNING_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'PERSONAL',
  subcategory: 'PERSONAL_GROWTH',
  sections: [
    {
      id: 'learning_basics',
      title: '学习设置',
      fields: [
        {
          id: 'learningArea',
          label: '学习领域',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'professional', label: '专业技能' },
            { value: 'language', label: '语言' },
            { value: 'hobby', label: '兴趣爱好' },
            { value: 'finance', label: '理财投资' },
            { value: 'health', label: '健康知识' }
          ],
          defaultValue: ['professional']
        },
        {
          id: 'dailyMinutes',
          label: '每日学习时长',
          type: 'select',
          required: true,
          options: [
            { value: '15min', label: '15分钟' },
            { value: '30min', label: '30分钟' },
            { value: '60min', label: '60分钟' },
            { value: '90min', label: '90分钟' }
          ],
          defaultValue: '30min'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const duration = config.dailyMinutes === '15min' ? '15分钟' :
                     config.dailyMinutes === '30min' ? '30分钟' :
                     config.dailyMinutes === '60min' ? '60分钟' : '90分钟';
    return `每日${duration}学习新知识`;
  },
  generateDescription: (config: TemplateConfig) => {
    const duration = config.dailyMinutes === '15min' ? '15分钟' :
                     config.dailyMinutes === '30min' ? '30分钟' :
                     config.dailyMinutes === '60min' ? '60分钟' : '90分钟';
    const areas = config.learningArea?.length || 1;
    return `每天学习${duration}，涵盖${areas}个领域。持续学习，不断成长。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每天提交学习内容截图或笔记，记录学习主题和收获。';
  }
};

