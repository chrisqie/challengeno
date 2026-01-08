import {
  TemplateConfigDefinition,
  TemplateType,
  TemplateConfig
} from '../types/templateConfig';

// ============================================
// 学习类精细模板配置
// ============================================

// 辅助函数 - 口语练习
const getLanguageLabel = (lang: string): string => {
  const map: Record<string, string> = {
    'english': '英语',
    'spanish': '西班牙语',
    'french': '法语',
    'japanese': '日语',
    'korean': '韩语',
    'german': '德语'
  };
  return map[lang] || lang;
};

const getSpeakingMethodLabel = (method: string): string => {
  const map: Record<string, string> = {
    'shadowing': '跟读模仿',
    'conversation': '对话练习',
    'presentation': '演讲表达',
    'recording': '录音自评'
  };
  return map[method] || method;
};

// 口语练习配置
export const LEARNING_LANGUAGE_SPEAKING_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'LEARNING',
  subcategory: 'LEARNING_LANGUAGE',
  sections: [
    {
      id: 'speaking_basics',
      title: '口语基础',
      fields: [
        {
          id: 'language',
          label: '学习语言',
          type: 'select',
          required: true,
          options: [
            { value: 'english', label: '英语' },
            { value: 'spanish', label: '西班牙语' },
            { value: 'french', label: '法语' },
            { value: 'japanese', label: '日语' },
            { value: 'korean', label: '韩语' },
            { value: 'german', label: '德语' }
          ],
          defaultValue: 'english'
        },
        {
          id: 'level',
          label: '当前水平',
          type: 'radio',
          required: true,
          options: [
            { value: 'beginner', label: '初级', description: '基础词汇和句型' },
            { value: 'intermediate', label: '中级', description: '日常对话' },
            { value: 'advanced', label: '高级', description: '流利表达' }
          ],
          defaultValue: 'intermediate'
        }
      ]
    },
    {
      id: 'speaking_method',
      title: '练习方式',
      fields: [
        {
          id: 'methods',
          label: '练习方法',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'shadowing', label: '跟读模仿', description: '跟着音频练习' },
            { value: 'conversation', label: '对话练习', description: '与他人对话' },
            { value: 'presentation', label: '演讲表达', description: '主题演讲' },
            { value: 'recording', label: '录音自评', description: '录音回听' }
          ],
          defaultValue: ['shadowing', 'recording']
        },
        {
          id: 'dailyMinutes',
          label: '每日时长',
          type: 'select',
          required: true,
          options: [
            { value: '15min', label: '15分钟' },
            { value: '30min', label: '30分钟' },
            { value: '45min', label: '45分钟' },
            { value: '60min', label: '60分钟' }
          ],
          defaultValue: '30min'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const lang = getLanguageLabel(config.language || 'english');
    const duration = config.dailyMinutes === '15min' ? '15分钟' :
                     config.dailyMinutes === '30min' ? '30分钟' :
                     config.dailyMinutes === '45min' ? '45分钟' : '60分钟';
    return `每日${duration}${lang}口语练习`;
  },
  generateDescription: (config: TemplateConfig) => {
    const lang = getLanguageLabel(config.language || 'english');
    const methods = config.methods?.map((m: string) => getSpeakingMethodLabel(m)).join('、') || '多种方法';
    const duration = config.dailyMinutes === '15min' ? '15分钟' :
                     config.dailyMinutes === '30min' ? '30分钟' :
                     config.dailyMinutes === '45min' ? '45分钟' : '60分钟';
    
    return `每天练习${duration}${lang}口语，通过${methods}提升口语能力。坚持练习，突破口语瓶颈。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每天提交口语练习录音或视频，记录练习内容和时长。分享口语进步的感受。';
  }
};

// 辅助函数 - 编程学习
const getProgrammingLanguageLabel = (lang: string): string => {
  const map: Record<string, string> = {
    'python': 'Python',
    'javascript': 'JavaScript',
    'java': 'Java',
    'cpp': 'C++',
    'go': 'Go',
    'rust': 'Rust'
  };
  return map[lang] || lang;
};

const getLearningGoalLabel = (goal: string): string => {
  const map: Record<string, string> = {
    'basics': '基础语法',
    'algorithms': '算法数据结构',
    'web_dev': 'Web开发',
    'app_dev': '应用开发',
    'data_science': '数据科学'
  };
  return map[goal] || goal;
};

// 编程学习配置
export const LEARNING_SKILL_PROGRAMMING_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'LEARNING',
  subcategory: 'LEARNING_SKILL',
  sections: [
    {
      id: 'programming_basics',
      title: '编程基础',
      fields: [
        {
          id: 'programmingLanguage',
          label: '编程语言',
          type: 'select',
          required: true,
          options: [
            { value: 'python', label: 'Python' },
            { value: 'javascript', label: 'JavaScript' },
            { value: 'java', label: 'Java' },
            { value: 'cpp', label: 'C++' },
            { value: 'go', label: 'Go' },
            { value: 'rust', label: 'Rust' }
          ],
          defaultValue: 'python'
        },
        {
          id: 'learningGoal',
          label: '学习目标',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'basics', label: '基础语法', description: '掌握基本语法' },
            { value: 'algorithms', label: '算法数据结构', description: '刷题练习' },
            { value: 'web_dev', label: 'Web开发', description: '网站开发' },
            { value: 'app_dev', label: '应用开发', description: '软件开发' },
            { value: 'data_science', label: '数据科学', description: '数据分析' }
          ],
          defaultValue: ['basics']
        }
      ]
    },
    {
      id: 'programming_practice',
      title: '练习安排',
      fields: [
        {
          id: 'dailyHours',
          label: '每日学习时长',
          type: 'select',
          required: true,
          options: [
            { value: '1h', label: '1小时' },
            { value: '2h', label: '2小时' },
            { value: '3h', label: '3小时' },
            { value: '4h', label: '4小时以上' }
          ],
          defaultValue: '2h'
        },
        {
          id: 'practiceType',
          label: '练习方式',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'video_course', label: '视频课程' },
            { value: 'coding_practice', label: '编程练习' },
            { value: 'project', label: '项目实战' },
            { value: 'leetcode', label: 'LeetCode刷题' },
            { value: 'reading', label: '阅读文档' }
          ],
          defaultValue: ['video_course', 'coding_practice']
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const lang = getProgrammingLanguageLabel(config.programmingLanguage || 'python');
    const hours = config.dailyHours === '1h' ? '1小时' :
                  config.dailyHours === '2h' ? '2小时' :
                  config.dailyHours === '3h' ? '3小时' : '4小时';
    return `每日${hours}${lang}编程学习`;
  },
  generateDescription: (config: TemplateConfig) => {
    const lang = getProgrammingLanguageLabel(config.programmingLanguage || 'python');
    const goals = config.learningGoal?.map((g: string) => getLearningGoalLabel(g)).join('、') || '编程技能';
    const practices = config.practiceType?.length || 2;
    
    return `系统学习${lang}编程，目标掌握${goals}。通过${practices}种方式练习，提升编程能力。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每天提交代码截图或GitHub提交记录，记录学习内容和练习题目。分享学习心得。';
  }
};

// 辅助函数 - 设计学习
const getDesignTypeLabel = (type: string): string => {
  const map: Record<string, string> = {
    'ui_ux': 'UI/UX设计',
    'graphic': '平面设计',
    'illustration': '插画设计',
    '3d': '3D设计',
    'motion': '动效设计'
  };
  return map[type] || type;
};

// 设计学习配置
export const LEARNING_SKILL_DESIGN_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'LEARNING',
  subcategory: 'LEARNING_SKILL',
  sections: [
    {
      id: 'design_basics',
      title: '设计基础',
      fields: [
        {
          id: 'designType',
          label: '设计类型',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'ui_ux', label: 'UI/UX设计', description: '界面和用户体验' },
            { value: 'graphic', label: '平面设计', description: '海报、Logo等' },
            { value: 'illustration', label: '插画设计', description: '手绘插画' },
            { value: '3d', label: '3D设计', description: '三维建模' },
            { value: 'motion', label: '动效设计', description: '动画效果' }
          ],
          defaultValue: ['ui_ux']
        },
        {
          id: 'tools',
          label: '设计工具',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'figma', label: 'Figma' },
            { value: 'sketch', label: 'Sketch' },
            { value: 'ps', label: 'Photoshop' },
            { value: 'ai', label: 'Illustrator' },
            { value: 'blender', label: 'Blender' },
            { value: 'ae', label: 'After Effects' }
          ],
          defaultValue: ['figma']
        }
      ]
    },
    {
      id: 'design_practice',
      title: '练习安排',
      fields: [
        {
          id: 'dailyPractice',
          label: '每日练习',
          type: 'select',
          required: true,
          options: [
            { value: '30min', label: '30分钟' },
            { value: '1h', label: '1小时' },
            { value: '2h', label: '2小时' },
            { value: '3h', label: '3小时以上' }
          ],
          defaultValue: '1h'
        },
        {
          id: 'projectType',
          label: '项目类型',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'daily_ui', label: 'Daily UI挑战' },
            { value: 'redesign', label: '重新设计' },
            { value: 'personal_project', label: '个人项目' },
            { value: 'client_work', label: '客户作品' }
          ],
          defaultValue: ['daily_ui']
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const types = config.designType?.map((t: string) => getDesignTypeLabel(t)).join('+') || '设计';
    const duration = config.dailyPractice === '30min' ? '30分钟' :
                     config.dailyPractice === '1h' ? '1小时' :
                     config.dailyPractice === '2h' ? '2小时' : '3小时';
    return `每日${duration}${types}练习`;
  },
  generateDescription: (config: TemplateConfig) => {
    const types = config.designType?.map((t: string) => getDesignTypeLabel(t)).join('、') || '设计';
    const tools = config.tools?.length || 1;
    const projects = config.projectType?.length || 1;
    
    return `学习${types}，掌握${tools}种设计工具。通过${projects}种项目类型练习，提升设计能力。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每天提交设计作品截图，记录设计过程和思路。分享设计心得和进步。';
  }
};

// 音乐学习配置
export const LEARNING_SKILL_MUSIC_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'LEARNING',
  subcategory: 'LEARNING_SKILL',
  sections: [
    {
      id: 'music_basics',
      title: '音乐基础',
      fields: [
        {
          id: 'instrument',
          label: '乐器选择',
          type: 'select',
          required: true,
          options: [
            { value: 'piano', label: '钢琴' },
            { value: 'guitar', label: '吉他' },
            { value: 'violin', label: '小提琴' },
            { value: 'drums', label: '架子鼓' },
            { value: 'vocal', label: '声乐' },
            { value: 'ukulele', label: '尤克里里' }
          ],
          defaultValue: 'guitar'
        },
        {
          id: 'level',
          label: '当前水平',
          type: 'radio',
          required: true,
          options: [
            { value: 'beginner', label: '初学者', description: '刚开始学习' },
            { value: 'intermediate', label: '进阶', description: '有一定基础' },
            { value: 'advanced', label: '高级', description: '熟练演奏' }
          ],
          defaultValue: 'beginner'
        }
      ]
    },
    {
      id: 'music_practice',
      title: '练习安排',
      fields: [
        {
          id: 'dailyMinutes',
          label: '每日练习时长',
          type: 'select',
          required: true,
          options: [
            { value: '15min', label: '15分钟' },
            { value: '30min', label: '30分钟' },
            { value: '45min', label: '45分钟' },
            { value: '60min', label: '60分钟' },
            { value: '90min', label: '90分钟' }
          ],
          defaultValue: '30min'
        },
        {
          id: 'practiceContent',
          label: '练习内容',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'scales', label: '音阶练习' },
            { value: 'technique', label: '技巧训练' },
            { value: 'songs', label: '曲目练习' },
            { value: 'sight_reading', label: '视奏练习' },
            { value: 'theory', label: '乐理学习' }
          ],
          defaultValue: ['scales', 'songs']
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const instruments: Record<string, string> = {
      'piano': '钢琴', 'guitar': '吉他', 'violin': '小提琴',
      'drums': '架子鼓', 'vocal': '声乐', 'ukulele': '尤克里里'
    };
    const instrument = instruments[config.instrument || 'guitar'] || '乐器';
    const duration = config.dailyMinutes === '15min' ? '15分钟' :
                     config.dailyMinutes === '30min' ? '30分钟' :
                     config.dailyMinutes === '45min' ? '45分钟' :
                     config.dailyMinutes === '60min' ? '60分钟' : '90分钟';
    return `每日${duration}${instrument}练习`;
  },
  generateDescription: (config: TemplateConfig) => {
    const instruments: Record<string, string> = {
      'piano': '钢琴', 'guitar': '吉他', 'violin': '小提琴',
      'drums': '架子鼓', 'vocal': '声乐', 'ukulele': '尤克里里'
    };
    const instrument = instruments[config.instrument || 'guitar'] || '乐器';
    const duration = config.dailyMinutes === '15min' ? '15分钟' :
                     config.dailyMinutes === '30min' ? '30分钟' :
                     config.dailyMinutes === '45min' ? '45分钟' :
                     config.dailyMinutes === '60min' ? '60分钟' : '90分钟';
    const contentCount = config.practiceContent?.length || 2;

    return `每天练习${duration}${instrument}，通过${contentCount}种练习内容提升演奏技巧。坚持练习，享受音乐。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每天提交练习视频或录音，记录练习曲目和时长。分享音乐学习的进步和感受。';
  }
};

// 阅读书籍配置
export const LEARNING_READING_BOOK_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'LEARNING',
  subcategory: 'LEARNING_READING',
  sections: [
    {
      id: 'reading_basics',
      title: '阅读基础',
      fields: [
        {
          id: 'bookType',
          label: '书籍类型',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'fiction', label: '小说文学' },
            { value: 'non_fiction', label: '非虚构' },
            { value: 'professional', label: '专业书籍' },
            { value: 'self_help', label: '自我提升' },
            { value: 'biography', label: '人物传记' },
            { value: 'history', label: '历史' }
          ],
          defaultValue: ['non_fiction']
        },
        {
          id: 'dailyPages',
          label: '每日阅读页数',
          type: 'select',
          required: true,
          options: [
            { value: '10', label: '10页' },
            { value: '20', label: '20页' },
            { value: '30', label: '30页' },
            { value: '50', label: '50页' }
          ],
          defaultValue: '20'
        }
      ]
    },
    {
      id: 'reading_method',
      title: '阅读方式',
      fields: [
        {
          id: 'readingTime',
          label: '阅读时间',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'morning', label: '早晨' },
            { value: 'commute', label: '通勤路上' },
            { value: 'lunch_break', label: '午休' },
            { value: 'evening', label: '晚上' },
            { value: 'before_sleep', label: '睡前' }
          ],
          defaultValue: ['before_sleep']
        },
        {
          id: 'takeNotes',
          label: '是否做笔记',
          type: 'radio',
          required: true,
          options: [
            { value: 'yes', label: '做笔记', description: '记录重点和感悟' },
            { value: 'no', label: '不做笔记', description: '纯粹阅读' }
          ],
          defaultValue: 'yes'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const pages = config.dailyPages || '20';
    return `每日阅读${pages}页书籍`;
  },
  generateDescription: (config: TemplateConfig) => {
    const pages = config.dailyPages || '20';
    const types = config.bookType?.length || 1;
    const notes = config.takeNotes === 'yes' ? '并做读书笔记' : '';

    return `每天阅读${pages}页，涵盖${types}种书籍类型${notes}。养成阅读习惯，拓展知识视野。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    const notes = config.takeNotes === 'yes' ? '和读书笔记' : '';
    return `每天提交阅读进度截图${notes}，分享阅读感悟和收获。`;
  }
};

