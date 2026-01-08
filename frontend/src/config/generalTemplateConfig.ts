import { TemplateType } from '../types/templateConfig';

// 通用模板的自定义字段类型
export type GeneralFieldType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox';

// 通用模板的自定义字段定义
export interface GeneralCustomField {
  id: string;
  label: string;
  type: GeneralFieldType;
  required: boolean;
  options?: string[]; // 仅用于 select/radio/checkbox
  defaultValue?: any;
  placeholder?: string;
  description?: string;
}

// 通用模板配置
export interface GeneralTemplateConfig {
  id: string;
  name: string;
  title: string;
  description: string;
  instructions: string;
  category: string;
  subcategory: string;
  templateType: TemplateType.GENERAL;
  customFields: GeneralCustomField[];
}

// 预定义的通用模板
export const GENERAL_TEMPLATE_CONFIG: GeneralTemplateConfig = {
  id: 'general_custom',
  name: 'general_custom',
  title: '自定义挑战模板',
  description: '完全自由的挑战模板，您可以根据需要添加自定义字段，创建独特的挑战内容。适合有特殊需求或创新想法的用户。',
  instructions: '根据您设置的自定义字段要求提交相应证据和记录',
  category: 'CUSTOM',
  subcategory: 'GENERAL',
  templateType: TemplateType.GENERAL,
  customFields: [] // 初始为空，用户可以动态添加
};

// 预定义字段模板，供用户快速选择
export const PREDEFINED_FIELD_TEMPLATES: Record<string, GeneralCustomField> = {
  // 文本类字段
  target_description: {
    id: 'target_description',
    label: '目标描述',
    type: 'textarea',
    required: true,
    placeholder: '请详细描述您的挑战目标...',
    description: '详细说明您想要达成的具体目标'
  },

  daily_goal: {
    id: 'daily_goal',
    label: '每日目标',
    type: 'text',
    required: true,
    placeholder: '例如：跑步5公里、阅读30分钟',
    description: '设定每天需要完成的具体任务'
  },

  motivation: {
    id: 'motivation',
    label: '参与动机',
    type: 'textarea',
    required: false,
    placeholder: '分享您参与这个挑战的原因和期望...',
    description: '说明您为什么要参与这个挑战'
  },

  // 选择类字段
  difficulty_level: {
    id: 'difficulty_level',
    label: '难度等级',
    type: 'radio',
    required: true,
    options: ['简单', '中等', '困难', '极具挑战'],
    defaultValue: '中等',
    description: '选择适合您当前水平的难度'
  },

  frequency: {
    id: 'frequency',
    label: '执行频率',
    type: 'select',
    required: true,
    options: ['每天', '每周3次', '每周5次', '每周末', '自定义'],
    defaultValue: '每天',
    description: '选择挑战的执行频率'
  },

  categories: {
    id: 'categories',
    label: '相关分类',
    type: 'checkbox',
    required: false,
    options: ['健康', '学习', '工作', '生活', '社交', '创意', '运动', '其他'],
    defaultValue: [],
    description: '选择与您的挑战相关的分类（可多选）'
  },

  time_commitment: {
    id: 'time_commitment',
    label: '时间投入',
    type: 'select',
    required: true,
    options: ['15分钟以内', '15-30分钟', '30-60分钟', '1-2小时', '2小时以上'],
    defaultValue: '30-60分钟',
    description: '每次执行挑战需要的时间'
  },

  tracking_method: {
    id: 'tracking_method',
    label: '记录方式',
    type: 'checkbox',
    required: true,
    options: ['拍照记录', '文字日记', '数据记录', '视频记录', '语音记录'],
    defaultValue: ['拍照记录'],
    description: '选择您偏好的记录和证据提交方式'
  },

  success_criteria: {
    id: 'success_criteria',
    label: '成功标准',
    type: 'textarea',
    required: true,
    placeholder: '例如：连续完成7天、达到特定数值目标等...',
    description: '明确定义什么情况下算作挑战成功'
  },

  reward_system: {
    id: 'reward_system',
    label: '奖励机制',
    type: 'text',
    required: false,
    placeholder: '例如：完成后给自己买一本书、看一场电影等',
    description: '设定完成挑战后给自己的奖励'
  }
};

// 获取预定义字段模板
export function getPredefinedFieldTemplate(fieldId: string): GeneralCustomField | undefined {
  return PREDEFINED_FIELD_TEMPLATES[fieldId];
}

// 获取所有预定义字段模板
export function getAllPredefinedFieldTemplates(): GeneralCustomField[] {
  return Object.values(PREDEFINED_FIELD_TEMPLATES);
}

// 按类型获取预定义字段模板
export function getPredefinedFieldTemplatesByType(type: GeneralFieldType): GeneralCustomField[] {
  return Object.values(PREDEFINED_FIELD_TEMPLATES).filter(field => field.type === type);
}

// 创建自定义字段
export function createCustomField(
  id: string,
  label: string,
  type: GeneralFieldType,
  required: boolean = false,
  options?: string[],
  defaultValue?: any,
  placeholder?: string,
  description?: string
): GeneralCustomField {
  return {
    id,
    label,
    type,
    required,
    options,
    defaultValue,
    placeholder,
    description
  };
}

// 验证自定义字段配置
export function validateCustomField(field: GeneralCustomField): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!field.id || field.id.trim() === '') {
    errors.push('字段ID不能为空');
  }

  if (!field.label || field.label.trim() === '') {
    errors.push('字段标签不能为空');
  }

  if (!field.type) {
    errors.push('字段类型不能为空');
  }

  if (['select', 'radio', 'checkbox'].includes(field.type) && (!field.options || field.options.length === 0)) {
    errors.push('选择类字段必须提供选项');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// 生成通用模板的标题
export function generateGeneralTitle(config: Record<string, any>): string {
  const dailyGoal = config.daily_goal;
  const difficulty = config.difficulty_level;

  if (dailyGoal) {
    return `${dailyGoal}${difficulty ? `（${difficulty}）` : ''}挑战`;
  }

  // 如果配置为空，返回空字符串，让用户自己填写
  return '';
}

// 生成通用模板的描述
export function generateGeneralDescription(config: Record<string, any>): string {
  const targetDescription = config.target_description;
  const frequency = config.frequency;
  const timeCommitment = config.time_commitment;
  const motivation = config.motivation;

  let description = '';

  if (targetDescription) {
    description += targetDescription;
  }

  if (frequency && timeCommitment) {
    description += `${description ? ' ' : ''}${frequency}进行，每次投入${timeCommitment}。`;
  }

  if (motivation) {
    description += `${description ? ' ' : ''}${motivation}`;
  }

  // 如果配置为空，返回空字符串，让用户自己填写
  return description;
}

// 生成通用模板的说明
export function generateGeneralInstructions(config: Record<string, any>): string {
  const trackingMethod = config.tracking_method;
  const successCriteria = config.success_criteria;
  
  let instructions = '';
  
  if (trackingMethod && Array.isArray(trackingMethod)) {
    const methods = trackingMethod.join('、');
    instructions += `请通过${methods}的方式记录您的挑战进展。`;
  }
  
  if (successCriteria) {
    instructions += `${instructions ? ' ' : ''}成功标准：${successCriteria}`;
  }
  
  if (!instructions) {
    instructions = '请按照您设定的挑战要求提交相应的证据和记录，确保真实有效地完成挑战任务。';
  }
  
  return instructions;
}
