import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TemplateConfigDefinition, TemplateConfigField, TemplateConfig } from '../types/templateConfig';

interface DynamicTemplateConfigProps {
  configDefinition: TemplateConfigDefinition;
  onConfigChange: (config: TemplateConfig) => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onInstructionsChange: (instructions: string) => void;
}

const DynamicTemplateConfig: React.FC<DynamicTemplateConfigProps> = ({
  configDefinition,
  onConfigChange,
  onTitleChange,
  onDescriptionChange,
  onInstructionsChange
}) => {
  const { t } = useTranslation();
  const [config, setConfig] = useState<TemplateConfig>({});

  // 初始化默认值
  useEffect(() => {
    const defaultConfig: Record<string, any> = {};
    
    configDefinition.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          defaultConfig[field.id] = field.defaultValue;
        }
      });
    });
    
    setConfig(defaultConfig);
    onConfigChange(defaultConfig);
  }, [configDefinition]);

  // 当配置改变时，更新生成的内容
  useEffect(() => {
    if (configDefinition.generateTitle) {
      const title = configDefinition.generateTitle(config);
      onTitleChange(title);
    }
    
    if (configDefinition.generateDescription) {
      const description = configDefinition.generateDescription(config);
      onDescriptionChange(description);
    }
    
    if (configDefinition.generateInstructions) {
      const instructions = configDefinition.generateInstructions(config);
      onInstructionsChange(instructions);
    }
  }, [config, configDefinition]);

  const handleFieldChange = (fieldId: string, value: any) => {
    const newConfig = { ...config, [fieldId]: value };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const renderField = (field: TemplateConfigField) => {
    const value = (config as any)[field.id];

    switch (field.type) {
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          >
            <option value="">{t('templateConfig.pleaseSelect')}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                  required={field.required}
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter(v => v !== option.value);
                    handleFieldChange(field.id, newValues);
                  }}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'tabs':
        return (
          <div className="flex flex-wrap gap-2">
            {field.options?.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleFieldChange(field.id, option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  value === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        );

      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          />
        );

      default:
        return null;
    }
  };

  if (configDefinition.sections.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>{t('templateConfig.noExtraConfig')}</p>
        <p className="text-sm mt-2">{t('templateConfig.fullyCustomizable')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {configDefinition.sections.map(section => (
        <div key={section.id} className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {section.title}
          </h3>
          {section.description && (
            <p className="text-sm text-gray-600 mb-4">{section.description}</p>
          )}
          
          <div className="space-y-4">
            {section.fields.map(field => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.description && (
                  <p className="text-xs text-gray-500 mb-2">{field.description}</p>
                )}
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicTemplateConfig;
