import i18n from '../i18n';

/**
 * 翻译模板配置中的文本
 * 用于在运行时翻译模板的标题、描述等
 */

// 翻译映射对象
export const translateMapping = (mapping: Record<string, string>, prefix: string): Record<string, string> => {
  const result: Record<string, string> = {};
  Object.keys(mapping).forEach(key => {
    result[key] = i18n.t(`${prefix}.${key}`);
  });
  return result;
};

// 翻译选项数组
export const translateOptions = (options: Array<{ value: string; label: string }>, prefix: string): Array<{ value: string; label: string }> => {
  return options.map(opt => ({
    value: opt.value,
    label: i18n.t(`${prefix}.${opt.value}`)
  }));
};

// 翻译字段
export const translateField = (field: any, prefix: string): any => {
  return {
    ...field,
    label: i18n.t(`${prefix}.${field.id}.label`),
    placeholder: field.placeholder ? i18n.t(`${prefix}.${field.id}.placeholder`) : undefined,
    options: field.options ? translateOptions(field.options, `${prefix}.${field.id}.options`) : undefined
  };
};

// 翻译section
export const translateSection = (section: any, prefix: string): any => {
  return {
    ...section,
    title: i18n.t(`${prefix}.${section.id}.title`),
    fields: section.fields.map((field: any) => translateField(field, `${prefix}.${section.id}.fields`))
  };
};

