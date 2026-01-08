/**
 * 简化的语言配置
 * 运营策略：降低复杂度，专注核心市场
 */

/**
 * 运营策略说明（基于Google Play市场分析）：
 *
 * 界面语言：仅英语
 * - 避免翻译成本和文化误解
 * - 统一客服和争议处理语言
 * - 降低维护复杂度
 *
 * 输入语言支持：4种精选语言
 * - 英语：全球通用，主要目标市场
 * - 繁体中文：港澳台+海外华人，消费能力强（比简体中文用户多）
 * - 西班牙语：全球第二大语言，覆盖美洲和欧洲
 * - 日语：高质量用户，消费能力强，纠纷少，文化重视规则
 *
 * 移除简体中文的原因：
 * - Google Play上主要是海外华人和新加坡用户
 * - 新加坡用户多数英语能力强，更倾向英语
 * - 绝对数量不如繁体中文用户
 */

export interface SupportedInputLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  unicodeRange: string; // Unicode字符范围描述
}

/**
 * 支持的输入语言（用于文本验证）
 */
export const SUPPORTED_INPUT_LANGUAGES: SupportedInputLanguage[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    unicodeRange: 'Latin alphabet (a-z, A-Z)'
  },
  {
    code: 'zh-TW',
    name: 'Traditional Chinese',
    nativeName: '繁體中文',
    flag: '🇹🇼',
    unicodeRange: 'Chinese characters (\\u4e00-\\u9fff)'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    unicodeRange: 'Latin + Spanish accents (ñáéíóúü)'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    unicodeRange: 'Hiragana, Katakana, Kanji (\\u3040-\\u309f, \\u30a0-\\u30ff, \\u4e00-\\u9fff)'
  }
];

/**
 * 界面语言：固定为英语
 */
export const UI_LANGUAGE = 'en';

/**
 * 获取输入语言信息
 */
export function getInputLanguageInfo(code: string): SupportedInputLanguage | undefined {
  return SUPPORTED_INPUT_LANGUAGES.find(lang => lang.code === code);
}

/**
 * 检测用户输入的主要语言
 */
export function detectInputLanguage(text: string): string {
  // 日语（平假名、片假名）
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) {
    return 'ja';
  }

  // 中文（繁体/简体通用检测）
  if (/[\u4e00-\u9fff]/.test(text)) {
    return 'zh-TW';
  }

  // 西班牙语特征字符
  if (/[ñáéíóúü¿¡]/.test(text)) {
    return 'es';
  }

  // 默认英语
  return 'en';
}

/**
 * 验证输入语言是否支持
 */
export function isInputLanguageSupported(code: string): boolean {
  return SUPPORTED_INPUT_LANGUAGES.some(lang => lang.code === code);
}

/**
 * 获取语言的文本方向
 */
export function getTextDirection(code: string): 'ltr' | 'rtl' {
  const lang = getInputLanguageInfo(code);
  return 'ltr'; // 所有支持的语言都是从左到右
}

/**
 * 格式化语言显示名称
 */
export function formatLanguageName(code: string, showNative: boolean = true): string {
  const lang = getInputLanguageInfo(code);
  if (!lang) return code;

  if (showNative && lang.nativeName !== lang.name) {
    return `${lang.name} (${lang.nativeName})`;
  }

  return lang.name;
}

/**
 * 语言分组（按地区）
 */
export const LANGUAGE_GROUPS = {
  'Western': ['en', 'es', 'fr', 'pt', 'de'],
  'East Asian': ['zh-CN', 'zh-TW', 'ja', 'ko'],
  'Eastern European': ['ru']
};

/**
 * 获取语言组
 */
export function getLanguageGroup(code: string): string {
  for (const [group, languages] of Object.entries(LANGUAGE_GROUPS)) {
    if (languages.includes(code)) {
      return group;
    }
  }
  return 'Other';
}

/**
 * 常用验证消息的多语言键值
 * （这里只定义键值，实际翻译在i18n文件中）
 */
export const VALIDATION_MESSAGE_KEYS = {
  REQUIRED: 'validation.required',
  MIN_LENGTH: 'validation.minLength',
  MAX_LENGTH: 'validation.maxLength',
  INVALID_FORMAT: 'validation.invalidFormat',
  UNSAFE_CHARS: 'validation.unsafeChars',
  UNSUPPORTED_CHARS: 'validation.unsupportedChars'
};

/**
 * 表单字段的多语言键值
 */
export const FORM_FIELD_KEYS = {
  TITLE: 'form.title',
  DESCRIPTION: 'form.description',
  STAKE_DESCRIPTION: 'form.stakeDescription',
  EVIDENCE_INSTRUCTIONS: 'form.evidenceInstructions',
  START_DATE: 'form.startDate',
  END_DATE: 'form.endDate',
  EVIDENCE_DEADLINE: 'form.evidenceDeadline',
  MAX_PARTICIPANTS: 'form.maxParticipants'
};

/**
 * 获取当前语言的数字格式化选项
 */
export function getNumberFormatOptions(code: string): Intl.NumberFormatOptions {
  return {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  };
}

/**
 * 格式化数字
 */
export function formatNumber(value: number, code: string): string {
  return new Intl.NumberFormat(code, getNumberFormatOptions(code)).format(value);
}

/**
 * 获取当前语言的日期格式化选项
 */
export function getDateFormatOptions(code: string): Intl.DateTimeFormatOptions {
  return {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
}

/**
 * 格式化日期
 */
export function formatDate(date: Date, code: string): string {
  return new Intl.DateTimeFormat(code, getDateFormatOptions(code)).format(date);
}

/**
 * 语言切换时需要重新加载的组件标识
 */
export const RELOAD_ON_LANGUAGE_CHANGE = [
  'CreateGamePage',
  'GameDetailPage',
  'ProfilePage',
  'SettingsPage'
];

/**
 * 检查是否需要重新加载组件
 */
export function shouldReloadComponent(componentName: string): boolean {
  return RELOAD_ON_LANGUAGE_CHANGE.includes(componentName);
}
