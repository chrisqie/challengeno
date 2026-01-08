import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, FileText, Send } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { DisputeType, DISPUTE_TYPE_LABELS } from '../types/arbitration';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const ArbitrationPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    respondentId: '',
    disputeType: DisputeType.EVIDENCE_DISPUTE,
    description: '',
  });

  // 模拟游戏数据
  const game = {
    id: gameId,
    title: '每日跑步挑战',
    description: '每天跑步5公里',
    participants: [
      { id: '1', username: 'user1', fullName: '用户1' },
      { id: '2', username: 'user2', fullName: '用户2' },
      { id: '3', username: 'user3', fullName: '用户3' },
    ].filter(p => p.id !== user?.id), // 排除自己
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.respondentId) {
      toast.error(t('arbitration.selectRespondent'));
      return;
    }

    if (!formData.description.trim()) {
      toast.error(t('arbitration.describeDispute'));
      return;
    }

    toast.success(t('arbitration.submitSuccess'));
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                {t('arbitration.title')}
              </h1>
              <p className="text-sm text-gray-600">{t('arbitration.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('arbitration.relatedGame')}</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900">{game.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{game.description}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('arbitration.respondentLabel')}
              </label>
              <select
                value={formData.respondentId}
                onChange={(e) => setFormData(prev => ({ ...prev, respondentId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">{t('arbitration.selectRespondentPlaceholder')}</option>
                {game.participants.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.fullName} (@{participant.username})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('arbitration.disputeTypeLabel')}
              </label>
              <select
                value={formData.disputeType}
                onChange={(e) => setFormData(prev => ({ ...prev, disputeType: e.target.value as DisputeType }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {Object.entries(DISPUTE_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('arbitration.descriptionLabel')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                placeholder={t('arbitration.descriptionPlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {t('arbitration.descriptionHint')}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">{t('arbitration.instructions.title')}</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• {t('arbitration.instructions.point1')}</li>
                    <li>• {t('arbitration.instructions.point2')}</li>
                    <li>• {t('arbitration.instructions.point3')}</li>
                    <li>• {t('arbitration.instructions.point4')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('arbitration.cancel')}
              </button>
              <button
                type="submit"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {t('arbitration.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArbitrationPage;
