import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Settings } from 'lucide-react';
import {
  GeneralCustomField,
  GeneralFieldType,
  PREDEFINED_FIELD_TEMPLATES,
  createCustomField,
  validateCustomField,
  generateGeneralTitle,
  generateGeneralDescription,
  generateGeneralInstructions
} from '../config/generalTemplateConfig';

interface GeneralTemplateConfigProps {
  onConfigChange: (config: Record<string, any>) => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onInstructionsChange: (instructions: string) => void;
}

const GeneralTemplateConfig: React.FC<GeneralTemplateConfigProps> = ({
  onConfigChange,
  onTitleChange,
  onDescriptionChange,
  onInstructionsChange
}) => {
  const { t } = useTranslation();
  const [customFields, setCustomFields] = useState<GeneralCustomField[]>([]);
  const [config, setConfig] = useState<Record<string, any>>({});
  const [showAddField, setShowAddField] = useState(false);

  // 当配置改变时，更新生成的内容
  useEffect(() => {
    const title = generateGeneralTitle(config);
    const description = generateGeneralDescription(config);
    const instructions = generateGeneralInstructions(config);
    
    onTitleChange(title);
    onDescriptionChange(description);
    onInstructionsChange(instructions);
    onConfigChange(config);
  }, [config, onTitleChange, onDescriptionChange, onInstructionsChange, onConfigChange]);

  const handleFieldChange = (fieldId: string, value: any) => {
    const newConfig = { ...config, [fieldId]: value };
    setConfig(newConfig);
  };

  const addPredefinedField = (fieldTemplate: GeneralCustomField) => {
    if (!customFields.find(f => f.id === fieldTemplate.id)) {
      // 翻译字段
      const translatedField: GeneralCustomField = {
        ...fieldTemplate,
        label: t(`generalFields.${fieldTemplate.id}.label`),
        placeholder: fieldTemplate.placeholder ? t(`generalFields.${fieldTemplate.id}.placeholder`) : undefined,
        description: fieldTemplate.description ? t(`generalFields.${fieldTemplate.id}.description`) : undefined,
        options: fieldTemplate.options?.map((_, index) => t(`generalFields.${fieldTemplate.id}.options.${index}`))
      };

      setCustomFields([...customFields, translatedField]);
      if (fieldTemplate.defaultValue !== undefined) {
        handleFieldChange(fieldTemplate.id, fieldTemplate.defaultValue);
      }
    }
    setShowAddField(false);
  };

  const removeField = (fieldId: string) => {
    setCustomFields(customFields.filter(f => f.id !== fieldId));
    const newConfig = { ...config };
    delete newConfig[fieldId];
    setConfig(newConfig);
  };

  const renderField = (field: GeneralCustomField) => {
    const value = config[field.id];

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          >
            <option value="">{t('templateConfig.pleaseSelect')}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="text-blue-600"
                  required={field.required}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValue = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      handleFieldChange(field.id, [...currentValue, option]);
                    } else {
                      handleFieldChange(field.id, currentValue.filter(v => v !== option));
                    }
                  }}
                  className="text-blue-600"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 自定义字段配置区域 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            {t('templateConfig.customFieldConfig')}
          </h3>
          <button
            onClick={() => setShowAddField(!showAddField)}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            {t('templateConfig.addField')}
          </button>
        </div>

        {/* 添加字段面板 */}
        {showAddField && (
          <div className="mb-4 p-4 bg-white rounded-lg border">
            <h4 className="font-medium mb-3">{t('templateConfig.selectFieldTemplate')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {Object.values(PREDEFINED_FIELD_TEMPLATES).map((fieldTemplate) => (
                <button
                  key={fieldTemplate.id}
                  onClick={() => addPredefinedField(fieldTemplate)}
                  disabled={customFields.find(f => f.id === fieldTemplate.id) !== undefined}
                  className={`p-2 text-left rounded border transition-colors ${
                    customFields.find(f => f.id === fieldTemplate.id)
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-white hover:bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="font-medium text-sm">{t(`generalFields.${fieldTemplate.id}.label`)}</div>
                  <div className="text-xs text-gray-500">{fieldTemplate.type}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 已添加的字段列表 */}
        {customFields.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t('templateConfig.noFieldsYet')}</p>
            <p className="text-sm">{t('templateConfig.clickToAddField')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {customFields.map((field) => (
              <div key={field.id} className="bg-white rounded-lg p-4 border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <label className="block font-medium text-gray-900">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.description && (
                      <p className="text-sm text-gray-600 mt-1">{field.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeField(field.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {renderField(field)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 配置预览 */}
      {customFields.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">{t('templateConfig.configPreview')}</h4>
          <div className="text-sm text-blue-800">
            <p><strong>{t('templateConfig.configuredFields')}</strong>{customFields.length} {t('templateConfig.fields')}</p>
            <p><strong>{t('templateConfig.requiredFields')}</strong>{customFields.filter(f => f.required).length} {t('templateConfig.fields')}</p>
            <p><strong>{t('templateConfig.optionalFields')}</strong>{customFields.filter(f => !f.required).length} {t('templateConfig.fields')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralTemplateConfig;
