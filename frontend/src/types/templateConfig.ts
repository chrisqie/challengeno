// 模板精细化配置类型定义

export interface TemplateConfigField {
  id: string;
  label: string;
  type: 'select' | 'radio' | 'checkbox' | 'text' | 'textarea' | 'tabs';
  required?: boolean;
  options?: TemplateConfigOption[];
  defaultValue?: any;
  placeholder?: string;
  description?: string;
}

export interface TemplateConfigOption {
  value: string;
  label: string;
  description?: string;
}

export interface TemplateConfigSection {
  id: string;
  title: string;
  description?: string;
  fields: TemplateConfigField[];
}

// 具体分类的配置定义
export interface LearningLanguageConfig {
  language: string;           // 语种
  content: string;           // 学习内容
  type: string;              // 学习类型
  purposes: string[];        // 学习目的（多选）
  partners: string[];        // 学习伙伴（多选）
  persistence: string;       // 坚持程度
}

export interface FitnessConfig {
  exerciseType: string;      // 运动类型
  intensity: string;         // 强度等级
  duration: number;          // 每次时长（分钟）
  frequency: string;         // 频率
  goals: string[];           // 健身目标（多选）
  equipment: string[];       // 器材需求（多选）
}

export interface FitnessGymConfig {
  trainingType: string;      // 训练类型
  targetMuscle: string[];    // 目标肌群（多选）
  experience: string;        // 经验水平
  frequency: string;         // 训练频率
  duration: string;          // 单次时长
  goals: string[];           // 训练目标（多选）
}

export interface HealthConfig {
  healthType: string;        // 健康类型
  targetMetric: string;      // 目标指标
  currentLevel: string;      // 当前水平
  improvementGoal: string;   // 改善目标
  trackingMethod: string;    // 跟踪方式
}

export interface PersonalConfig {
  developmentArea: string;   // 发展领域
  skillLevel: string;        // 技能水平
  timeCommitment: string;    // 时间投入
  resources: string[];       // 资源需求（多选）
  milestones: string[];      // 里程碑（多选）
}

// 新增配置类型
export interface FitnessRunningConfig {
  experience: string;        // 跑步经验
  goals: string[];          // 跑步目标（多选）
  terrain: string[];        // 地形偏好（多选）
  frequency: string;        // 跑步频率
  distance: string;         // 目标距离
  timeOfDay: string[];      // 跑步时间（多选）
}

export interface FitnessYogaConfig {
  style: string[];          // 瑜伽风格（多选）
  experience: string;       // 练习经验
  goals: string[];          // 练习目标（多选）
  duration: string;         // 练习时长
  timeOfDay: string[];      // 练习时间（多选）
  environment: string;      // 练习环境
}

export interface LearningReadingConfig {
  genres: string[];         // 阅读类型（多选）
  format: string[];         // 阅读形式（多选）
  goals: string[];          // 阅读目标（多选）
  duration: string;         // 阅读时长
  timeOfDay: string[];      // 阅读时间（多选）
  environment: string;      // 阅读环境
}

export interface LearningSkillConfig {
  skillType: string;        // 技能类型
  experience: string;       // 技能水平
  goals: string[];          // 学习目标（多选）
  duration: string;         // 练习时长
  resources: string[];      // 学习资源（多选）
  frequency: string;        // 练习频率
}

export interface HealthWakeUpConfig {
  targetTime: string;       // 目标起床时间
  currentTime: string;      // 当前起床时间
  motivation: string[];     // 早起动机（多选）
  challenges: string[];     // 面临挑战（多选）
  rewards: string[];        // 奖励机制（多选）
  support: string;          // 支持方式
}

export interface HealthWaterConfig {
  currentIntake: string;    // 当前饮水量
  targetAmount: string;     // 目标饮水量
  reminders: string[];      // 提醒方式（多选）
  tracking: string;         // 记录方式
  motivation: string[];     // 动机因素（多选）
  challenges: string[];     // 面临困难（多选）
}

export interface HealthMeditationConfig {
  experience: string;       // 冥想经验
  style: string[];          // 冥想类型（多选）
  duration: string;         // 冥想时长
  timeOfDay: string[];      // 冥想时间（多选）
  goals: string[];          // 冥想目标（多选）
  environment: string;      // 冥想环境
}

export interface PersonalProductivityConfig {
  areas: string[];          // 提升领域（多选）
  methods: string[];        // 方法工具（多选）
  tools: string[];          // 使用工具（多选）
  goals: string[];          // 目标成果（多选）
  timeBlocks: string;       // 时间安排
  challenges: string[];     // 面临挑战（多选）
}

export interface PersonalCreativityConfig {
  mediums: string[];        // 创作媒介（多选）
  experience: string;       // 创作经验
  goals: string[];          // 创作目标（多选）
  frequency: string;        // 创作频率
  inspiration: string[];    // 灵感来源（多选）
  sharing: string;          // 分享方式
}

export interface PersonalGratitudeConfig {
  format: string;           // 记录形式
  timeOfDay: string[];      // 记录时间（多选）
  categories: string[];     // 感恩类别（多选）
  depth: string;            // 记录深度
  sharing: string;          // 分享方式
  reflection: string[];     // 反思方式（多选）
}

export interface LifestyleCookingConfig {
  experience: string;       // 烹饪经验
  cuisines: string[];       // 菜系偏好（多选）
  goals: string[];          // 烹饪目标（多选）
  frequency: string;        // 烹饪频率
  complexity: string;       // 复杂程度
  dietary: string[];        // 饮食偏好（多选）
}

export interface LifestyleOrganizationConfig {
  areas: string[];          // 整理区域（多选）
  methods: string[];        // 整理方法（多选）
  frequency: string;        // 整理频率
  goals: string[];          // 整理目标（多选）
  challenges: string[];     // 面临挑战（多选）
  maintenance: string;      // 维护方式
}

export interface WorkStartupConfig {
  stage: string;            // 创业阶段
  industry: string;         // 行业领域
  focus: string[];          // 关注重点（多选）
  goals: string[];          // 阶段目标（多选）
  timeCommitment: string;   // 时间投入
  challenges: string[];     // 面临挑战（多选）
  support: string[];        // 支持资源（多选）
}

// 通用配置类型 - 使用更灵活的类型定义
export type TemplateConfig = Record<string, any>;

// 模板类型枚举
export enum TemplateType {
  QUICK_START = 'quick_start',    // 快捷挑战
  CUSTOM = 'custom',              // 自定义挑战
  GENERAL = 'general'             // 通用挑战
}

// 模板配置定义
export interface TemplateConfigDefinition {
  templateType: TemplateType;
  category: string;
  subcategory?: string;
  sections: TemplateConfigSection[];
  generateTitle?: (config: TemplateConfig) => string;
  generateDescription?: (config: TemplateConfig) => string;
  generateInstructions?: (config: TemplateConfig) => string;
}
