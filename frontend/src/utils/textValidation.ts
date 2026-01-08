/**
 * 多语言文本验证工具
 * 支持主流语言和文字系统
 */

/**
 * 界面语言支持（9种）：
 * - 英语、简体中文、繁体中文、西班牙语、法语
 * - 葡萄牙语、俄语、德语、日语、韩语
 *
 * 输入文字支持（更宽泛，安全优先）：
 * - 拉丁语系：英语、法语、德语、西班牙语、葡萄牙语等
 * - 中日韩：简体中文、繁体中文、日语、韩语
 * - 阿拉伯语：阿拉伯文字
 * - 西里尔字母：俄语、乌克兰语、保加利亚语等
 * - 希伯来语：希伯来文字
 * - 南亚语言：印地语、泰语、缅甸语等
 * - 其他Unicode字母系统（安全字符）
 */

/**
 * 多语言字符正则表达式
 * \p{L} - 所有Unicode字母
 * \p{N} - 所有Unicode数字
 * \p{M} - 所有Unicode标记（重音符号等）
 */
export const MULTILINGUAL_CHARS = /[\p{L}\p{N}\p{M}]/u;

/**
 * 允许的标点符号和特殊字符
 * 基于安全考虑，只允许常用的标点符号
 */
export const ALLOWED_PUNCTUATION = /[\s\-_.,!?():;'"]/;

/**
 * 允许的表情符号和特殊符号
 * 常用的表情和数学符号
 */
export const ALLOWED_SPECIAL_CHARS = /[❤️🎉💪⭐+×÷%\[\]{}]/;

/**
 * 完整的标题验证正则表达式
 * 组合多语言字符、标点符号和特殊字符
 */
export const TITLE_VALIDATION_REGEX = new RegExp(
  `^[${MULTILINGUAL_CHARS.source.slice(1, -2)}${ALLOWED_PUNCTUATION.source.slice(1, -1)}${ALLOWED_SPECIAL_CHARS.source.slice(1, -1)}]+$`,
  'u'
);

/**
 * 文本内容验证正则表达式（用于描述等较长文本）
 * 允许换行符和更多标点符号
 */
export const CONTENT_VALIDATION_REGEX = new RegExp(
  `^[${MULTILINGUAL_CHARS.source.slice(1, -2)}${ALLOWED_PUNCTUATION.source.slice(1, -1)}${ALLOWED_SPECIAL_CHARS.source.slice(1, -1)}\\n\\r\\t]+$`,
  'u'
);

/**
 * 验证文本是否包含不安全字符
 * 检查可能的XSS攻击字符和控制字符
 */
export const UNSAFE_CHARS_REGEX = /[<>{}\\\/`$\x00-\x1f\x7f-\x9f\u2000-\u200f\u2028-\u202f\u205f-\u206f]/;

/**
 * 验证文本安全性
 */
export function validateTextSafety(text: string): boolean {
  return !UNSAFE_CHARS_REGEX.test(text);
}

/**
 * 验证标题格式
 */
export function validateTitleFormat(title: string): boolean {
  return TITLE_VALIDATION_REGEX.test(title) && validateTextSafety(title);
}

/**
 * 验证内容格式
 */
export function validateContentFormat(content: string): boolean {
  return CONTENT_VALIDATION_REGEX.test(content) && validateTextSafety(content);
}

/**
 * 获取文本中不支持的字符
 */
export function getUnsupportedChars(text: string, isTitle: boolean = true): string[] {
  const regex = isTitle ? TITLE_VALIDATION_REGEX : CONTENT_VALIDATION_REGEX;
  const unsupportedChars: string[] = [];
  
  for (const char of text) {
    if (!regex.test(char) && !unsupportedChars.includes(char)) {
      unsupportedChars.push(char);
    }
  }
  
  return unsupportedChars;
}

/**
 * 清理文本，移除不支持的字符
 */
export function sanitizeText(text: string, isTitle: boolean = true): string {
  const regex = isTitle ? TITLE_VALIDATION_REGEX : CONTENT_VALIDATION_REGEX;
  return text
    .split('')
    .filter(char => regex.test(char))
    .join('');
}

/**
 * 语言检测（基于界面支持的9种语言）
 * 基于字符范围检测主要语言
 */
export function detectLanguage(text: string): string[] {
  const languages: string[] = [];

  // 简体中文
  if (/[\u4e00-\u9fff]/.test(text)) {
    // 简单区分简繁体（基于常用字符）
    if (/[个这样]/.test(text)) {
      languages.push('Simplified Chinese');
    } else if (/[個這樣]/.test(text)) {
      languages.push('Traditional Chinese');
    } else {
      languages.push('Chinese');
    }
  }

  // 日语（平假名、片假名）
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) {
    languages.push('Japanese');
  }

  // 韩语
  if (/[\uac00-\ud7af]/.test(text)) {
    languages.push('Korean');
  }

  // 西里尔字母（俄语）
  if (/[\u0400-\u04ff]/.test(text)) {
    languages.push('Russian');
  }

  // 拉丁字母（英语、法语、德语、西班牙语、葡萄牙语）
  if (/[a-zA-Z]/.test(text)) {
    // 简单检测特殊字符来区分语言
    if (/[àâäéèêëïîôöùûüÿç]/.test(text)) {
      languages.push('French');
    } else if (/[äöüß]/.test(text)) {
      languages.push('German');
    } else if (/[ñáéíóúü]/.test(text)) {
      languages.push('Spanish');
    } else if (/[ãõáéíóúâêôç]/.test(text)) {
      languages.push('Portuguese');
    } else {
      languages.push('English');
    }
  }

  // 其他支持的输入语言（不在界面语言中，但允许输入）
  if (/[\u0600-\u06ff]/.test(text)) {
    languages.push('Arabic');
  }

  if (/[\u0590-\u05ff]/.test(text)) {
    languages.push('Hebrew');
  }

  if (/[\u0900-\u097f]/.test(text)) {
    languages.push('Hindi');
  }

  if (/[\u0e00-\u0e7f]/.test(text)) {
    languages.push('Thai');
  }

  return languages.length > 0 ? languages : ['Unknown'];
}

/**
 * 文本统计信息
 */
export interface TextStats {
  length: number;
  wordCount: number;
  languages: string[];
  hasUnsafeChars: boolean;
  unsupportedChars: string[];
}

/**
 * 获取文本统计信息
 */
export function getTextStats(text: string, isTitle: boolean = true): TextStats {
  return {
    length: text.length,
    wordCount: text.trim().split(/\s+/).filter(word => word.length > 0).length,
    languages: detectLanguage(text),
    hasUnsafeChars: !validateTextSafety(text),
    unsupportedChars: getUnsupportedChars(text, isTitle)
  };
}

/**
 * 验证配置（平衡简约性和用户自由度）
 */
export const VALIDATION_CONFIG = {
  title: {
    minLength: 3,      // 最短3字符，确保有意义
    maxLength: 60,     // 适中长度，支持多语言表达
    regex: TITLE_VALIDATION_REGEX
  },
  description: {
    minLength: 15,     // 15字符确保描述清晰
    maxLength: 300,    // 简约但不限制热心用户
    regex: CONTENT_VALIDATION_REGEX
  },
  stakeDescription: {
    minLength: 8,      // 8字符确保有意义的赌注描述
    maxLength: 80,     // 简约，适合移动端显示
    regex: TITLE_VALIDATION_REGEX
  },
  evidenceInstructions: {
    minLength: 5,      // 最短5字符
    maxLength: 200,    // 足够描述证据要求
    regex: CONTENT_VALIDATION_REGEX
  }
};

/**
 * 通用文本验证函数
 */
export function validateText(
  text: string, 
  type: keyof typeof VALIDATION_CONFIG
): { isValid: boolean; errors: string[] } {
  const config = VALIDATION_CONFIG[type];
  const errors: string[] = [];
  
  if (!text || text.trim().length === 0) {
    errors.push(`Please enter ${type}`);
  } else if (text.trim().length < config.minLength) {
    errors.push(`${type} must be at least ${config.minLength} characters`);
  } else if (text.length > config.maxLength) {
    errors.push(`${type} cannot exceed ${config.maxLength} characters`);
  } else if (!config.regex.test(text)) {
    const unsupported = getUnsupportedChars(text, type === 'title' || type === 'stakeDescription');
    if (unsupported.length > 0) {
      errors.push(`Unsupported characters: ${unsupported.join(', ')}`);
    }
  } else if (!validateTextSafety(text)) {
    errors.push(`${type} contains unsafe characters`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
