import React, { useState } from 'react';
import { AlertTriangle, Shield, Heart, Brain, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SafetyDisclaimerProps {
  onAgree: (agreed: boolean) => void;
  agreed: boolean;
}

const SafetyDisclaimer: React.FC<SafetyDisclaimerProps> = ({ onAgree, agreed }) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <Shield className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">
          {t('safety.title')}
        </h2>
      </div>
      
      {/* 核心安全提醒 */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex items-center mb-3">
          <Heart className="w-5 h-5 text-red-500 mr-2" />
          <h3 className="text-lg font-semibold text-yellow-800">
            {t('safety.coreMessage')}
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-yellow-800">
          <div className="space-y-2">
            <div className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('safety.principles.withinCapacity')}</strong>
                <p className="text-sm">{t('safety.principles.withinCapacityDesc')}</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('safety.principles.healthFirst')}</strong>
                <p className="text-sm">{t('safety.principles.healthFirstDesc')}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('safety.principles.gradual')}</strong>
                <p className="text-sm">{t('safety.principles.gradualDesc')}</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('safety.principles.safetyFirst')}</strong>
                <p className="text-sm">{t('safety.principles.safetyFirstDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 免责声明 */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-red-800 mb-2">{t('safety.disclaimer.title')}</h4>
            <p className="text-red-700 text-sm leading-relaxed">
              {t('safety.disclaimer.description')}
            </p>

            {showDetails && (
              <div className="mt-3 space-y-2 text-sm text-red-600">
                <p>• {t('safety.disclaimer.details.highRisk')}</p>
                <p>• {t('safety.disclaimer.details.healthIssues')}</p>
                <p>• {t('safety.disclaimer.details.minors')}</p>
                <p>• {t('safety.disclaimer.details.noMedicalAdvice')}</p>
                <p>• {t('safety.disclaimer.details.fullResponsibility')}</p>
              </div>
            )}

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
            >
              {showDetails ? t('safety.disclaimer.hideDetails') : t('safety.disclaimer.showDetails')}
            </button>
          </div>
        </div>
      </div>
      
      {/* 心理健康提醒 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start">
          <Brain className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">{t('safety.mentalHealth.title')}</h4>
            <p className="text-blue-700 text-sm">
              {t('safety.mentalHealth.description')}
            </p>
          </div>
        </div>
      </div>

      {/* 同意复选框 */}
      <div className="border-t pt-4">
        <label className="flex items-start cursor-pointer group">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => onAgree(e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div className="ml-3">
            <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
              {t('safety.agreement.title')}
            </span>
            <p className="text-sm text-gray-600 mt-1">
              {t('safety.agreement.description')}
            </p>
          </div>
        </label>
      </div>

      {/* 额外提醒 */}
      {agreed && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-800">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              {t('safety.agreement.thankYou')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyDisclaimer;
