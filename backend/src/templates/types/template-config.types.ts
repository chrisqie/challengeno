// 模板参数化配置类型定义

export interface TemplateConfig {
  // 基础配置
  allowCustomTitle: boolean;        // 是否允许自定义标题
  allowCustomDescription: boolean;  // 是否允许自定义描述
  titleMaxLength: number;          // 标题最大长度
  descriptionMaxLength: number;    // 描述最大长度
  
  // 参数化选项
  parameters: TemplateParameter[];
}

export interface TemplateParameter {
  id: string;                      // 参数ID
  name: string;                    // 参数名称
  type: ParameterType;             // 参数类型
  required: boolean;               // 是否必填
  options: ParameterOption[];      // 可选项
  defaultValue?: any;              // 默认值
  description?: string;            // 参数描述
}

export enum ParameterType {
  SELECT = 'select',               // 下拉选择
  MULTI_SELECT = 'multi_select',   // 多选
  RADIO = 'radio',                 // 单选按钮
  CHECKBOX = 'checkbox',           // 复选框
  TAB = 'tab',                     // 标签页选择
  NUMBER = 'number',               // 数字输入
  TEXT = 'text',                   // 文本输入
  TEXTAREA = 'textarea'            // 多行文本
}

export interface ParameterOption {
  value: string | number;          // 选项值
  label: string;                   // 显示标签
  description?: string;            // 选项描述
  disabled?: boolean;              // 是否禁用
}

// 证据配置
export interface EvidenceConfig {
  types: EvidenceTypeConfig[];     // 支持的证据类型
  requirements: string[];          // 证据要求描述
  allowCustomDescription: boolean; // 是否允许自定义证据描述
  descriptionMaxLength: number;    // 证据描述最大长度
}

export interface EvidenceTypeConfig {
  type: 'text' | 'photo' | 'video' | 'file' | 'data';
  required: boolean;               // 是否必须
  label: string;                   // 类型标签
  requirements: string[];          // 具体要求
  validation?: ValidationRule[];   // 验证规则
}

export interface ValidationRule {
  type: 'size' | 'format' | 'content' | 'metadata';
  rule: string;                    // 验证规则
  message: string;                 // 错误提示
}

// 阅读挑战的具体配置示例
export const READING_CHALLENGE_CONFIG: TemplateConfig = {
  allowCustomTitle: true,
  allowCustomDescription: true,
  titleMaxLength: 50,
  descriptionMaxLength: 200,
  
  parameters: [
    {
      id: 'frequency',
      name: '频率',
      type: ParameterType.SELECT,
      required: true,
      options: [
        { value: 'daily', label: '每日' },
        { value: 'weekly', label: '每周' },
        { value: 'monthly', label: '每月' },
        { value: 'half_yearly', label: '半年' }
      ],
      defaultValue: 'daily'
    },
    {
      id: 'book_type',
      name: '书籍类型',
      type: ParameterType.SELECT,
      required: true,
      options: [
        { value: 'novel', label: '小说' },
        { value: 'newspaper', label: '报刊' },
        { value: 'magazine', label: '杂志' },
        { value: 'essay', label: '散文' },
        { value: 'classic', label: '名著' },
        { value: 'web_novel', label: '网文' },
        { value: 'other', label: '其他' }
      ]
    },
    {
      id: 'target_type',
      name: '目标类型',
      type: ParameterType.TAB,
      required: true,
      options: [
        { value: 'pages', label: '页数' },
        { value: 'chapters', label: '章节' },
        { value: 'time', label: '时间' }
      ]
    },
    {
      id: 'pages_target',
      name: '页数目标',
      type: ParameterType.SELECT,
      required: false,
      options: [
        { value: 300, label: '300页' },
        { value: 600, label: '600页' },
        { value: 800, label: '800页' }
      ]
    },
    {
      id: 'chapters_target',
      name: '章节目标',
      type: ParameterType.SELECT,
      required: false,
      options: [
        { value: 1, label: '1章' },
        { value: 2, label: '2章' },
        { value: 3, label: '3章' },
        { value: 10, label: '10章' }
      ]
    },
    {
      id: 'time_target',
      name: '时间目标',
      type: ParameterType.SELECT,
      required: false,
      options: [
        { value: '1day', label: '1天' },
        { value: '3days', label: '3天' },
        { value: '1week', label: '1周' },
        { value: '1month', label: '1月' }
      ]
    }
  ]
};

export const READING_EVIDENCE_CONFIG: EvidenceConfig = {
  allowCustomDescription: true,
  descriptionMaxLength: 100,
  requirements: [
    '拍照时请确保书籍封面清晰可见',
    '阅读环境照片需要显示真实的阅读场景',
    '照片不得使用滤镜或过度修饰'
  ],
  types: [
    {
      type: 'text',
      required: false,
      label: '文字记录',
      requirements: ['简要记录阅读心得或进度']
    },
    {
      type: 'photo',
      required: true,
      label: '图片证据',
      requirements: ['书籍封面', '阅读环境'],
      validation: [
        {
          type: 'format',
          rule: 'jpg,png,jpeg',
          message: '仅支持JPG、PNG格式图片'
        },
        {
          type: 'size',
          rule: 'max:5MB',
          message: '图片大小不能超过5MB'
        }
      ]
    }
  ]
};
