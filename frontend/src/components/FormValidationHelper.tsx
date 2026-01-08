import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ValidationRule {
  field: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

interface FormValidationHelperProps {
  rules: ValidationRule[];
  className?: string;
}

const FormValidationHelper: React.FC<FormValidationHelperProps> = ({
  rules,
  className = ''
}) => {
  if (rules.length === 0) return null;

  const errors = rules.filter(rule => rule.type === 'error');
  const warnings = rules.filter(rule => rule.type === 'warning');
  const infos = rules.filter(rule => rule.type === 'info');

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 错误信息 */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-red-800 mb-2">需要修正的问题</h4>
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700">
                    • {error.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 警告信息 */}
      {warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-800 mb-2">建议优化</h4>
              <ul className="space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-yellow-700">
                    • {warning.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 提示信息 */}
      {infos.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-800 mb-2">温馨提示</h4>
              <ul className="space-y-1">
                {infos.map((info, index) => (
                  <li key={index} className="text-sm text-blue-700">
                    • {info.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 表单字段验证组件
interface FieldValidationProps {
  error?: string;
  warning?: string;
  info?: string;
  isValid?: boolean;
  className?: string;
}

export const FieldValidation: React.FC<FieldValidationProps> = ({
  error,
  warning,
  info,
  isValid,
  className = ''
}) => {
  return (
    <div className={`mt-1 ${className}`}>
      {error && (
        <div className="flex items-center space-x-1 text-red-600">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      {!error && warning && (
        <div className="flex items-center space-x-1 text-yellow-600">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">{warning}</span>
        </div>
      )}
      {!error && !warning && info && (
        <div className="flex items-center space-x-1 text-blue-600">
          <Info className="w-4 h-4" />
          <span className="text-sm">{info}</span>
        </div>
      )}
      {!error && !warning && !info && isValid && (
        <div className="flex items-center space-x-1 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">格式正确</span>
        </div>
      )}
    </div>
  );
};

// 实时验证钩子
export const useFormValidation = (formData: any, rules: any) => {
  const [validationResults, setValidationResults] = React.useState<ValidationRule[]>([]);

  React.useEffect(() => {
    const results: ValidationRule[] = [];

    // 执行验证规则
    Object.keys(rules).forEach(field => {
      const fieldRules = rules[field];
      const value = formData[field];

      fieldRules.forEach((rule: any) => {
        const result = rule.validate(value, formData);
        if (!result.isValid) {
          results.push({
            field,
            message: result.message,
            type: result.type || 'error'
          });
        }
      });
    });

    setValidationResults(results);
  }, [formData, rules]);

  return {
    validationResults,
    hasErrors: validationResults.some(r => r.type === 'error'),
    hasWarnings: validationResults.some(r => r.type === 'warning'),
    isValid: validationResults.every(r => r.type !== 'error')
  };
};

export default FormValidationHelper;
