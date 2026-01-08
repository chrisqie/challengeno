/**
 * 简化的文本验证工具
 * 运营策略：专注3种核心语言，降低运营复杂度
 */

/**
 * 支持的输入语言（4种精选）：
 *
 * 1. 英语 (English) - 拉丁字母
 * 2. 繁体中文 (Traditional Chinese) - 中文字符
 * 3. 西班牙语 (Spanish) - 拉丁字母 + 西班牙语特殊字符
 * 4. 日语 (Japanese) - 平假名、片假名、汉字
 */

/**
 * 英语字符（基础拉丁字母）
 */
export const ENGLISH_CHARS = /[a-zA-Z]/;

/**
 * 中文字符（繁体/简体通用）
 */
export const CHINESE_CHARS = /[\u4e00-\u9fff]/;

/**
 * 日语字符（平假名、片假名）
 */
export const JAPANESE_CHARS = /[\u3040-\u309f\u30a0-\u30ff]/;

/**
 * 西班牙语特殊字符
 */
export const SPANISH_SPECIAL_CHARS = /[ñáéíóúüÑÁÉÍÓÚÜ¿¡]/;

/**
 * 数字字符
 */
export const NUMERIC_CHARS = /[0-9]/;

/**
 * 允许的标点符号（安全字符）
 */
export const SAFE_PUNCTUATION = /[\s\-_.,!?():;'"]/;

/**
 * 允许的表情符号（常用）
 */
export const ALLOWED_EMOJIS = /[❤️🎉💪⭐👍👎🔥💯🎯🏆🎊🎈]/;

/**
 * 数学和特殊符号
 */
export const MATH_SYMBOLS = /[+×÷%\[\]{}]/;

/**
 * 完整的允许字符正则表达式
 */
export const ALLOWED_CHARS_REGEX = new RegExp(
  `[${ENGLISH_CHARS.source.slice(1, -1)}` +
  `${CHINESE_CHARS.source.slice(1, -1)}` +
  `${JAPANESE_CHARS.source.slice(1, -1)}` +
  `${SPANISH_SPECIAL_CHARS.source.slice(1, -1)}` +
  `${NUMERIC_CHARS.source.slice(1, -1)}` +
  `${SAFE_PUNCTUATION.source.slice(1, -1)}` +
  `${ALLOWED_EMOJIS.source.slice(1, -1)}` +
  `${MATH_SYMBOLS.source.slice(1, -1)}]+`,
  'u'
);

/**
 * 不安全字符（XSS和注入攻击防护）
 */
export const UNSAFE_CHARS_REGEX = /[<>{}\\\/`$\x00-\x1f\x7f-\x9f]/;

/**
 * 验证文本安全性
 */
export function validateTextSafety(text: string): boolean {
  return !UNSAFE_CHARS_REGEX.test(text);
}

/**
 * 验证字符是否被支持
 */
export function validateSupportedChars(text: string): boolean {
  return ALLOWED_CHARS_REGEX.test(text);
}

/**
 * 检测文本的主要语言
 */
export function detectPrimaryLanguage(text: string): 'en' | 'zh-TW' | 'es' | 'ja' | 'mixed' {
  const hasEnglish = ENGLISH_CHARS.test(text);
  const hasChinese = CHINESE_CHARS.test(text);
  const hasJapanese = JAPANESE_CHARS.test(text);
  const hasSpanish = SPANISH_SPECIAL_CHARS.test(text);

  const languageCount = [hasEnglish, hasChinese, hasJapanese, hasSpanish].filter(Boolean).length;

  if (languageCount > 1) return 'mixed';
  if (hasJapanese) return 'ja';
  if (hasChinese) return 'zh-TW';
  if (hasSpanish) return 'es';
  return 'en';
}

/**
 * 获取不支持的字符
 */
export function getUnsupportedChars(text: string): string[] {
  const unsupported: string[] = [];
  
  for (const char of text) {
    if (!ALLOWED_CHARS_REGEX.test(char) && !unsupported.includes(char)) {
      unsupported.push(char);
    }
  }
  
  return unsupported;
}

/**
 * 清理文本，移除不支持的字符
 */
export function sanitizeText(text: string): string {
  return text
    .split('')
    .filter(char => ALLOWED_CHARS_REGEX.test(char))
    .join('');
}

/**
 * 验证配置
 */
export const VALIDATION_CONFIG = {
  title: {
    minLength: 3,
    maxLength: 60,
    description: 'Challenge title (3-60 characters)'
  },
  description: {
    minLength: 15,
    maxLength: 300,
    description: 'Challenge description (15-300 characters)'
  },
  stakeDescription: {
    minLength: 8,
    maxLength: 80,
    description: 'Stake description (8-80 characters, optional)'
  },
  evidenceInstructions: {
    minLength: 5,
    maxLength: 200,
    description: 'Evidence requirements (5-200 characters)'
  }
};

/**
 * 验证结果接口
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * 通用文本验证函数
 */
export function validateText(
  text: string, 
  type: keyof typeof VALIDATION_CONFIG,
  isOptional: boolean = false
): ValidationResult {
  const config = VALIDATION_CONFIG[type];
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // 可选字段的空值检查
  if (isOptional && (!text || text.trim().length === 0)) {
    return { isValid: true, errors: [], warnings: [] };
  }
  
  // 必填字段的空值检查
  if (!text || text.trim().length === 0) {
    errors.push(`${config.description} is required`);
    return { isValid: false, errors, warnings };
  }
  
  // 长度验证
  const trimmedText = text.trim();
  if (trimmedText.length < config.minLength) {
    errors.push(`${config.description} must be at least ${config.minLength} characters`);
  }
  
  if (text.length > config.maxLength) {
    errors.push(`${config.description} cannot exceed ${config.maxLength} characters`);
  }
  
  // 安全性验证
  if (!validateTextSafety(text)) {
    errors.push(`${config.description} contains unsafe characters`);
  }
  
  // 字符支持验证
  if (!validateSupportedChars(text)) {
    const unsupported = getUnsupportedChars(text);
    if (unsupported.length > 0) {
      errors.push(`Unsupported characters found: ${unsupported.join(', ')}`);
      warnings.push('Only English, Simplified Chinese, and Spanish are supported');
    }
  }
  
  // 语言检测警告
  const primaryLang = detectPrimaryLanguage(text);
  if (primaryLang === 'mixed') {
    warnings.push('Mixed languages detected. Consider using one primary language for better readability.');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * 快速验证函数（只返回是否有效）
 */
export function isTextValid(text: string, type: keyof typeof VALIDATION_CONFIG, isOptional: boolean = false): boolean {
  return validateText(text, type, isOptional).isValid;
}

/**
 * 获取支持的语言信息
 */
export function getSupportedLanguagesInfo() {
  return {
    languages: [
      { code: 'en', name: 'English', example: 'Daily running challenge' },
      { code: 'zh-TW', name: 'Traditional Chinese', example: '每日跑步挑戰' },
      { code: 'es', name: 'Spanish', example: 'Desafío de correr diario' },
      { code: 'ja', name: 'Japanese', example: '毎日ランニングチャレンジ' }
    ],
    note: 'Interface language is English only. Input supports 4 carefully selected languages for operational efficiency.',
    rationale: {
      'en': 'Global lingua franca, primary target market',
      'zh-TW': 'Hong Kong, Taiwan, overseas Chinese communities - higher spending power',
      'es': 'Second largest language globally, covers Americas and Europe',
      'ja': 'High-quality users, strong spending power, fewer disputes, rule-respecting culture'
    }
  };
}
