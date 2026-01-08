import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, Clock, Eye, UserCheck, Gavel, Filter } from 'lucide-react';
import { disputesAPI } from '../services/api';
import { DISPUTE_TYPE_LABELS, DISPUTE_STATUS_LABELS, ArbitrationStatus, DisputeType } from '../types/arbitration';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminDisputesPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [statusFilter, setStatusFilter] = useState<ArbitrationStatus | ''>('');
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveForm, setResolveForm] = useState({
    decision: '',
    resolution: '',
    compensationAmount: '',
    handlerType: 'HUMAN_MANUAL',
  });

  const { data: disputes, isLoading, refetch } = useQuery(
    ['admin-disputes', statusFilter],
    () => disputesAPI.getAdminDisputes({
      status: statusFilter || undefined
    }),
    {
      select: (response) => response.data,
    }
  );

  const assignMutation = useMutation(
    (disputeId: string) => disputesAPI.assignDispute(disputeId),
    {
      onSuccess: () => {
        toast.success('Dispute assigned to you');
        refetch();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Assignment failed');
      },
    }
  );

  const resolveMutation = useMutation(
    ({ disputeId, data }: { disputeId: string; data: any }) =>
      disputesAPI.resolveDispute(disputeId, data),
    {
      onSuccess: () => {
        toast.success('Dispute resolved');
        setShowResolveModal(false);
        setSelectedDispute(null);
        setResolveForm({
          decision: '',
          resolution: '',
          compensationAmount: '',
          handlerType: 'HUMAN_MANUAL',
        });
        refetch();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to resolve dispute');
      },
    }
  );

  const handleAssign = (disputeId: string) => {
    assignMutation.mutate(disputeId);
  };

  const handleResolve = (dispute: any) => {
    setSelectedDispute(dispute);
    setShowResolveModal(true);
  };

  const handleSubmitResolve = (e: React.FormEvent) => {
    e.preventDefault();

    if (!resolveForm.decision) {
      toast.error('Please select a resolution decision');
      return;
    }

    if (!resolveForm.resolution.trim()) {
      toast.error('Please fill in the resolution result');
      return;
    }

    const data = {
      ...resolveForm,
      compensationAmount: resolveForm.compensationAmount ?
        parseInt(resolveForm.compensationAmount) : undefined,
    };

    resolveMutation.mutate({
      disputeId: selectedDispute.id,
      data
    });
  };

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'text-red-600';
      case 'HIGH':
        return 'text-orange-600';
      case 'NORMAL':
        return 'text-blue-600';
      case 'LOW':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
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
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Dispute Management</h1>
                <p className="text-sm text-gray-500">Handle user dispute requests</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ArbitrationStatus | '')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  {Object.entries(DISPUTE_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Pending', status: 'PENDING', color: 'yellow' },
            { label: 'Under Review', status: 'UNDER_REVIEW', color: 'blue' },
            { label: 'Resolved', status: 'RESOLVED', color: 'green' },
            { label: 'Rejected', status: 'REJECTED', color: 'red' },
          ].map((stat) => {
            const count = disputes?.filter((d: any) => d.status === stat.status).length || 0;
            return (
              <div key={stat.status} className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    {getStatusIcon(stat.status as ArbitrationStatus)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dispute List */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Dispute List ({disputes?.length || 0})
            </h2>
          </div>

          {disputes && disputes.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {disputes.map((dispute: any) => (
                <div key={dispute.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{dispute.title}</h3>
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dispute.status)}`}>
                          {getStatusIcon(dispute.status)}
                          <span>{DISPUTE_STATUS_LABELS[dispute.status as ArbitrationStatus]}</span>
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(dispute.priority)}`}>
                          {dispute.priority === 'URGENT' ? 'Urgent' :
                           dispute.priority === 'HIGH' ? 'High Priority' :
                           dispute.priority === 'NORMAL' ? 'Normal' : 'Low Priority'}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-4">
                          <span>Game: {dispute.game?.title}</span>
                          <span>Type: {DISPUTE_TYPE_LABELS[dispute.disputeType as DisputeType]}</span>
                          <span>Evidence: {dispute._count?.evidence || 0}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3 line-clamp-2">{dispute.description}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>Initiator: @{dispute.initiator?.username}</span>
                          {dispute.target && (
                            <span>Respondent: @{dispute.target?.username}</span>
                          )}
                          {dispute.handler && (
                            <span>Handler: @{dispute.handler?.username}</span>
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
                        <span>View Details</span>
                      </button>

                      {!dispute.handlerId && dispute.status === 'PENDING' && (
                        <button
                          onClick={() => handleAssign(dispute.id)}
                          disabled={assignMutation.isLoading}
                          className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Take Over</span>
                        </button>
                      )}

                      {dispute.handlerId && ['UNDER_REVIEW', 'INVESTIGATING', 'WAITING_EVIDENCE'].includes(dispute.status) && (
                        <button
                          onClick={() => handleResolve(dispute)}
                          className="flex items-center space-x-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Gavel className="w-4 h-4" />
                          <span>Resolve Dispute</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No dispute records</p>
            </div>
          )}
        </div>
      </div>

      {/* Resolve Dispute Modal */}
      {showResolveModal && selectedDispute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Resolve Dispute: {selectedDispute.title}
              </h3>
            </div>

            <form onSubmit={handleSubmitResolve} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Decision *
                </label>
                <select
                  value={resolveForm.decision}
                  onChange={(e) => setResolveForm(prev => ({ ...prev, decision: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Please select a decision</option>
                  <option value="APPROVE_INITIATOR">Support Initiator</option>
                  <option value="APPROVE_TARGET">Support Respondent</option>
                  <option value="PARTIAL_APPROVAL">Partial Support</option>
                  <option value="NO_ACTION_NEEDED">No Action Needed</option>
                  <option value="INSUFFICIENT_EVIDENCE">Insufficient Evidence</option>
                  <option value="INVALID_DISPUTE">Invalid Dispute</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Result *
                </label>
                <textarea
                  value={resolveForm.resolution}
                  onChange={(e) => setResolveForm(prev => ({ ...prev, resolution: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Provide detailed resolution and reasoning"
                  required
                />
              </div>

              {resolveForm.decision === 'PARTIAL_APPROVAL' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compensation Points
                  </label>
                  <input
                    type="number"
                    value={resolveForm.compensationAmount}
                    onChange={(e) => setResolveForm(prev => ({ ...prev, compensationAmount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Amount of participation points to compensate"
                    min="0"
                  />
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowResolveModal(false);
                    setSelectedDispute(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resolveMutation.isLoading}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {resolveMutation.isLoading ? 'Processing...' : 'Confirm Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDisputesPage;
