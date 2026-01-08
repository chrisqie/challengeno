import i18n from '../i18n';

/**
 * 获取分类的翻译名称
 */
export const getCategoryName = (categoryId: string): string => {
  const key = `categories.${categoryId}.name`;
  const translated = i18n.t(key);
  // 如果翻译键不存在,返回原始ID
  return translated === key ? categoryId : translated;
};

/**
 * 获取分类的翻译描述
 */
export const getCategoryDescription = (categoryId: string): string => {
  const key = `categories.${categoryId}.description`;
  const translated = i18n.t(key);
  return translated === key ? '' : translated;
};

/**
 * 获取子分类的翻译名称
 */
export const getSubcategoryName = (subcategoryId: string): string => {
  const key = `categories.${subcategoryId}.name`;
  const translated = i18n.t(key);
  return translated === key ? subcategoryId : translated;
};

/**
 * 获取子分类的翻译描述
 */
export const getSubcategoryDescription = (subcategoryId: string): string => {
  const key = `categories.${subcategoryId}.description`;
  const translated = i18n.t(key);
  return translated === key ? '' : translated;
};

