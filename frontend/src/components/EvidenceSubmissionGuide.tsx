import React from 'react';
import { Camera, FileText, Video, AlertTriangle, CheckCircle, Clock, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EvidenceSubmissionGuideProps {
  evidenceType: 'PHOTO' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
  evidenceInstructions: string;
  deadline: string;
  gameTitle: string;
}

const EvidenceSubmissionGuide: React.FC<EvidenceSubmissionGuideProps> = ({
  evidenceType,
  evidenceInstructions,
  deadline,
  gameTitle
}) => {
  const { t } = useTranslation();

  const getEvidenceTypeInfo = () => {
    switch (evidenceType) {
      case 'PHOTO':
        return {
          icon: Camera,
          title: t('evidenceGuide.photo.title'),
          description: t('evidenceGuide.photo.description'),
          tips: [
            t('evidenceGuide.photo.tips.clear'),
            t('evidenceGuide.photo.tips.keyElements'),
            t('evidenceGuide.photo.tips.avoidBlur'),
            t('evidenceGuide.photo.tips.format')
          ],
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'VIDEO':
        return {
          icon: Video,
          title: t('evidenceGuide.video.title'),
          description: t('evidenceGuide.video.description'),
          tips: [
            t('evidenceGuide.video.tips.duration'),
            t('evidenceGuide.video.tips.quality'),
            t('evidenceGuide.video.tips.complete'),
            t('evidenceGuide.video.tips.format')
          ],
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        };
      case 'TEXT':
        return {
          icon: FileText,
          title: t('evidenceGuide.text.title'),
          description: t('evidenceGuide.text.description'),
          tips: [
            t('evidenceGuide.text.tips.detailed'),
            t('evidenceGuide.text.tips.timePlace'),
            t('evidenceGuide.text.tips.minLength'),
            t('evidenceGuide.text.tips.honest')
          ],
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'DOCUMENT':
        return {
          icon: FileText,
          title: t('evidenceGuide.document.title'),
          description: t('evidenceGuide.document.description'),
          tips: [
            t('evidenceGuide.document.tips.readable'),
            t('evidenceGuide.document.tips.necessary'),
            t('evidenceGuide.document.tips.format'),
            t('evidenceGuide.document.tips.size')
          ],
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        };
    }
  };

  const typeInfo = getEvidenceTypeInfo();
  const TypeIcon = typeInfo.icon;
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const timeLeft = deadlineDate.getTime() - now.getTime();
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
  const isUrgent = hoursLeft < 24;

  return (
    <div className="space-y-6">
      {/* 挑战信息 */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{gameTitle}</h2>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{t('evidenceGuide.deadline')}: {deadlineDate.toLocaleString()}</span>
          </div>
          {isUrgent && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">
                {hoursLeft > 0 ? t('evidenceGuide.hoursLeft', { hours: hoursLeft }) : t('evidenceGuide.closingSoon')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 证据类型说明 */}
      <div className={`card p-6 ${typeInfo.bgColor} ${typeInfo.borderColor} border-2`}>
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg bg-white ${typeInfo.borderColor} border`}>
            <TypeIcon className={`w-6 h-6 ${typeInfo.color}`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${typeInfo.color} mb-2`}>
              {typeInfo.title}
            </h3>
            <p className="text-gray-700 mb-4">{typeInfo.description}</p>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">{t('evidenceGuide.requirements')}:</h4>
              <ul className="space-y-1">
                {typeInfo.tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 具体要求 */}
      {evidenceInstructions && (
        <div className="card p-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('evidenceGuide.specificRequirements')}</h3>
              <div className="text-gray-700 whitespace-pre-wrap">
                {evidenceInstructions}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 重要提醒 */}
      <div className="card p-6 bg-yellow-50 border-yellow-200 border-2">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">{t('evidenceGuide.importantReminder')}</h3>
            <ul className="space-y-1 text-sm text-yellow-700">
              <li>• {t('evidenceGuide.reminders.authentic')}</li>
              <li>• {t('evidenceGuide.reminders.noEdit')}</li>
              <li>• {t('evidenceGuide.reminders.peerReview')}</li>
              <li>• {t('evidenceGuide.reminders.deadline')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceSubmissionGuide;
