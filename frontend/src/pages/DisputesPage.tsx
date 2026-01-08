import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Clock, CheckCircle, XCircle, Eye, Plus } from 'lucide-react';
import { disputesAPI } from '../services/api';
import { DISPUTE_TYPE_LABELS, DISPUTE_STATUS_LABELS, ArbitrationStatus, DisputeType } from '../types/arbitration';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTranslation } from 'react-i18next';

const DisputesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'initiated' | 'targeted'>('all');
  const [statusFilter, setStatusFilter] = useState<ArbitrationStatus | ''>('');

  const { data: disputes, isLoading, refetch } = useQuery(
    ['disputes', activeTab, statusFilter],
    () => disputesAPI.getDisputes({
      type: activeTab,
      status: statusFilter || undefined
    }),
    {
      select: (response) => response.data,
    }
  );

  const getStatusColor = (status: ArbitrationStatus) => {
    switch (status) {
      case ArbitrationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case ArbitrationStatus.UNDER_REVIEW:
        return 'bg-blue-100 text-blue-800';
      case ArbitrationStatus.INVESTIGATING:
        return 'bg-purple-100 text-purple-800';
      case ArbitrationStatus.WAITING_EVIDENCE:
        return 'bg-orange-100 text-orange-800';
      case ArbitrationStatus.RESOLVED:
        return 'bg-green-100 text-green-800';
      case ArbitrationStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case ArbitrationStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      case ArbitrationStatus.ESCALATED:
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ArbitrationStatus) => {
    switch (status) {
      case ArbitrationStatus.PENDING:
        return <Clock className="w-4 h-4" />;
      case ArbitrationStatus.UNDER_REVIEW:
      case ArbitrationStatus.INVESTIGATING:
        return <AlertTriangle className="w-4 h-4" />;
      case ArbitrationStatus.RESOLVED:
        return <CheckCircle className="w-4 h-4" />;
      case ArbitrationStatus.REJECTED:
      case ArbitrationStatus.CANCELLED:
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{t('disputes.title')}</h1>
                <p className="text-sm text-gray-500">{t('disputes.subtitle')}</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/disputes/create')}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t('disputes.createDispute')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 筛选器 */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* 标签页 */}
            <div className="flex space-x-2">
              {[
                { key: 'all', label: t('disputes.tabs.all') },
                { key: 'initiated', label: t('disputes.tabs.initiated') },
                { key: 'targeted', label: t('disputes.tabs.targeted') },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 状态筛选 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ArbitrationStatus | '')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">全部状态</option>
              {Object.entries(DISPUTE_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 争议列表 */}
        <div className="space-y-4">
          {disputes && disputes.length > 0 ? (
            disputes.map((dispute: any) => (
              <div key={dispute.id} className="card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{dispute.title}</h3>
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dispute.status)}`}>
                        {getStatusIcon(dispute.status)}
                        <span>{DISPUTE_STATUS_LABELS[dispute.status as ArbitrationStatus]}</span>
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-4">
                        <span>{t('disputes.game')} {dispute.game?.title}</span>
                        <span>{t('disputes.type')} {DISPUTE_TYPE_LABELS[dispute.disputeType as DisputeType]}</span>
                        <span>{t('disputes.evidence')} {t('disputes.evidenceCount', { count: dispute._count?.evidence || 0 })}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-2">{dispute.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>{t('disputes.initiator')} @{dispute.initiator?.username}</span>
                        {dispute.target && (
                          <span>{t('disputes.respondent')} @{dispute.target?.username}</span>
                        )}
                      </div>
                      <span>{new Date(dispute.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col space-y-2">
                    <button
                      onClick={() => navigate(`/disputes/${dispute.id}`)}
                      className="flex items-center space-x-2 px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{t('disputes.viewDetails')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card p-8 text-center">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('disputes.empty.title')}</h3>
              <p className="text-gray-500 mb-4">
                {activeTab === 'all' ? t('disputes.empty.all') :
                 activeTab === 'initiated' ? t('disputes.empty.initiated') :
                 t('disputes.empty.targeted')}
              </p>
              <button
                onClick={() => navigate('/disputes/create')}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{t('disputes.createDispute')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisputesPage;
