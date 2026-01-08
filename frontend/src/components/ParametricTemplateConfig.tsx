import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Info } from 'lucide-react';

interface ParameterOption {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface TemplateParameter {
  id: string;
  name: string;
  type: 'select' | 'multi_select' | 'radio' | 'checkbox' | 'tab' | 'number' | 'text' | 'textarea';
  required: boolean;
  options: ParameterOption[];
  defaultValue?: any;
  description?: string;
}

interface TemplateConfig {
  allowCustomTitle: boolean;
  allowCustomDescription: boolean;
  titleMaxLength: number;
  descriptionMaxLength: number;
  parameters: TemplateParameter[];
}

interface EvidenceConfig {
  types: Array<{
    type: string;
    required: boolean;
    label: string;
    requirements: string[];
  }>;
  requirements: string[];
  allowCustomDescription: boolean;
  descriptionMaxLength: number;
}

interface Props {
  template: {
    id: string;
    title: string;
    description: string;
    templateOptions?: TemplateConfig;
    features?: {
      evidenceConfig?: EvidenceConfig;
      customizable?: boolean;
      parametric?: boolean;
    };
  };
  onConfigChange: (config: any) => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onEvidenceDescriptionChange: (description: string) => void;
}

const ParametricTemplateConfig: React.FC<Props> = ({
  template,
  onConfigChange,
  onTitleChange,
  onDescriptionChange,
  onEvidenceDescriptionChange
}) => {
  const { t } = useTranslation();
  const [config, setConfig] = useState<Record<string, any>>({});
  const [customTitle, setCustomTitle] = useState(template.title);
  const [customDescription, setCustomDescription] = useState(template.description);
  const [evidenceDescription, setEvidenceDescription] = useState('');
  const [activeTab, setActiveTab] = useState<string>('');

  const templateConfig = template.templateOptions;
  const evidenceConfig = template.features?.evidenceConfig;

  useEffect(() => {
    // 初始化默认值
    if (templateConfig?.parameters) {
      const defaultConfig: Record<string, any> = {};
      templateConfig.parameters.forEach(param => {
        if (param.defaultValue !== undefined) {
          defaultConfig[param.id] = param.defaultValue;
        }
      });
      setConfig(defaultConfig);
      onConfigChange(defaultConfig);
    }
  }, [template.id]);

  const handleParameterChange = (parameterId: string, value: any) => {
    const newConfig = { ...config, [parameterId]: value };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleTitleChange = (value: string) => {
    setCustomTitle(value);
    onTitleChange(value);
  };

  const handleDescriptionChange = (value: string) => {
    setCustomDescription(value);
    onDescriptionChange(value);
  };

  const handleEvidenceDescriptionChange = (value: string) => {
    setEvidenceDescription(value);
    onEvidenceDescriptionChange(value);
  };

  const renderParameter = (parameter: TemplateParameter) => {
    const value = config[parameter.id];

    switch (parameter.type) {
      case 'select':
        return (
          <div className="relative">
            <select
              value={value || ''}
              onChange={(e) => handleParameterChange(parameter.id, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              required={parameter.required}
            >
              <option value="">{t('templateConfig.pleaseSelect')}</option>
              {parameter.options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {parameter.options.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={parameter.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleParameterChange(parameter.id, e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  disabled={option.disabled}
                />
                <span className="text-sm text-gray-700">{option.label}</span>
                {option.description && (
                  <div className="relative group">
                    <Info className="w-4 h-4 text-gray-400" />
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                      {option.description}
                    </div>
                  </div>
                )}
              </label>
            ))}
          </div>
        );

      case 'tab':
        return (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex bg-gray-50">
              {parameter.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    handleParameterChange(parameter.id, option.value);
                    setActiveTab(option.value.toString());
                  }}
                  className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                    value === option.value
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                  disabled={option.disabled}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {parameter.options.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter(v => v !== option.value);
                    handleParameterChange(parameter.id, newValues);
                  }}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                  disabled={option.disabled}
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleParameterChange(parameter.id, parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={parameter.required}
          />
        );

      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleParameterChange(parameter.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={parameter.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleParameterChange(parameter.id, e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            required={parameter.required}
          />
        );

      default:
        return null;
    }
  };

  if (!templateConfig?.parameters || templateConfig.parameters.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 自定义标题 */}
      {templateConfig.allowCustomTitle && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('templateConfig.challengeTitle')} *
          </label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            maxLength={templateConfig.titleMaxLength}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('templateConfig.titlePlaceholder')}
          />
          <p className="text-xs text-gray-500 mt-1">
            {customTitle.length}/{templateConfig.titleMaxLength} {t('templateConfig.characters')}
          </p>
        </div>
      )}

      {/* 自定义描述 */}
      {templateConfig.allowCustomDescription && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('templateConfig.challengeDescription')} *
          </label>
          <textarea
            value={customDescription}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            maxLength={templateConfig.descriptionMaxLength}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder={t('templateConfig.descriptionPlaceholder')}
          />
          <p className="text-xs text-gray-500 mt-1">
            {customDescription.length}/{templateConfig.descriptionMaxLength} {t('templateConfig.characters')}
          </p>
        </div>
      )}

      {/* 参数化配置 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{t('templateConfig.parameterConfig')}</h3>
        {templateConfig.parameters.map((parameter) => (
          <div key={parameter.id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {parameter.name}
              {parameter.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderParameter(parameter)}
            {parameter.description && (
              <p className="text-xs text-gray-500 mt-1">{parameter.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* 证据要求 */}
      {evidenceConfig && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('templateConfig.evidenceRequirements')}</h3>

          {/* 证据类型 */}
          <div className="space-y-3">
            {evidenceConfig.types.map((type, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">{type.label}</span>
                  {type.required && <span className="text-red-500 text-sm">{t('templateConfig.required')}</span>}
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {type.requirements.map((req, reqIndex) => (
                    <li key={reqIndex} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 自定义证据描述 */}
          {evidenceConfig.allowCustomDescription && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('templateConfig.evidenceDescription')}
              </label>
              <input
                type="text"
                value={evidenceDescription}
                onChange={(e) => handleEvidenceDescriptionChange(e.target.value)}
                maxLength={evidenceConfig.descriptionMaxLength}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('templateConfig.evidencePlaceholder')}
              />
              <p className="text-xs text-gray-500 mt-1">
                {evidenceDescription.length}/{evidenceConfig.descriptionMaxLength} {t('templateConfig.characters')}
              </p>
            </div>
          )}

          {/* 通用要求 */}
          {evidenceConfig.requirements.length > 0 && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ {t('templateConfig.importantReminder')}</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {evidenceConfig.requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ParametricTemplateConfig;
