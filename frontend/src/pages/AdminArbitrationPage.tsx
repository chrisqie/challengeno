import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  ArrowLeft,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MessageSquare,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { adminAPI } from '../services/api';
import {
  ArbitrationStatus,
  ARBITRATION_STATUS_LABELS,
  ARBITRATION_STATUS_COLORS,
  DISPUTE_TYPE_LABELS
} from '../types/arbitration';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminArbitrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Get arbitration request list
  const { data: disputesData, isLoading, refetch } = useQuery(
    ['admin-disputes', statusFilter],
    () => adminAPI.getDisputes({
      status: statusFilter !== 'all' ? statusFilter : undefined
    }),
    {
      select: (response) => response.data,
    }
  );

  const handleAssignDispute = async (disputeId: string) => {
    try {
      await adminAPI.assignDispute(disputeId);
      toast.success('Dispute assigned');
      refetch();
      setSelectedRequest(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleResolveDispute = async (disputeId: string, decision: string, resolution: string) => {
    try {
      await adminAPI.resolveDispute(disputeId, { decision, resolution });
      toast.success('Dispute resolved');
      refetch();
      setSelectedRequest(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'UNDER_REVIEW':
        return <Eye className="w-4 h-4" />;
      case 'RESOLVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need administrator privileges to access this page</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const disputes = disputesData || [];
  const filteredDisputes = disputes
    .filter((dispute: any) => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          dispute.game?.title?.toLowerCase().includes(search) ||
          dispute.initiator?.username?.toLowerCase().includes(search) ||
          dispute.target?.username?.toLowerCase().includes(search)
        );
      }
      return true;
    })
    .sort((a: any, b: any) => {
      // Sort by creation time in descending order (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center">
                <AlertTriangle className="w-6 h-6 text-orange-500 mr-2" />
                <h1 className="text-xl font-semibold text-gray-900">Arbitration Management</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.fullName || 'Admin'}</span>
              <button
                onClick={logout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search game title, username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Arbitration Request List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Arbitration Requests ({filteredDisputes.length})
            </h2>
          </div>

          {filteredDisputes.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No arbitration requests</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredDisputes.map((dispute: any) => (
                <div key={dispute.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{dispute.game?.title || 'Unknown Game'}</h3>
                        <span className={`
                          inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                          ${ARBITRATION_STATUS_COLORS[dispute.status as ArbitrationStatus] || 'bg-gray-100 text-gray-600'}
                        `}>
                          {getStatusIcon(dispute.status)}
                          {ARBITRATION_STATUS_LABELS[dispute.status as ArbitrationStatus] || dispute.status}
                        </span>
                        {dispute.priority && (
                          <span className={`
                            px-2 py-1 rounded text-xs font-medium
                            ${dispute.priority === 'URGENT' ? 'bg-red-100 text-red-700' :
                              dispute.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'}
                          `}>
                            {dispute.priority === 'URGENT' ? 'Urgent' :
                             dispute.priority === 'HIGH' ? 'High Priority' : 'Normal'}
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Dispute Type:</span>
                        {DISPUTE_TYPE_LABELS[dispute.disputeType as keyof typeof DISPUTE_TYPE_LABELS] || dispute.disputeType}
                      </div>

                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Initiator:</span>
                        @{dispute.initiator?.username || 'Unknown'} ({dispute.initiator?.fullName || 'Unknown'})
                        {dispute.target && (
                          <>
                            <span className="mx-2">vs</span>
                            <span className="font-medium">Respondent:</span>
                            @{dispute.target.username} ({dispute.target.fullName})
                          </>
                        )}
                      </div>

                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {dispute.description || dispute.reason || 'No description'}
                      </p>

                      <div className="text-xs text-gray-500">
                        Created: {formatDate(dispute.createdAt)}
                        {dispute.handler && (
                          <span className="ml-4">
                            Handler: @{dispute.handler.username}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => setSelectedRequest(dispute)}
                        className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <DisputeDetailModal
          dispute={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onAssign={handleAssignDispute}
          onResolve={handleResolveDispute}
        />
      )}
    </div>
  );
};

// Dispute Detail Modal Component
interface DisputeDetailModalProps {
  dispute: any;
  onClose: () => void;
  onAssign: (disputeId: string) => void;
  onResolve: (disputeId: string, decision: string, resolution: string) => void;
}

const DisputeDetailModal: React.FC<DisputeDetailModalProps> = ({
  dispute,
  onClose,
  onAssign,
  onResolve
}) => {
  const [resolution, setResolution] = useState('');
  const [decision, setDecision] = useState<string>('NO_ACTION_NEEDED');

  const handleResolve = () => {
    if (!resolution.trim()) {
      toast.error('Please enter resolution result');
      return;
    }
    onResolve(dispute.id, decision, resolution);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Arbitration Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Game Title</h3>
              <p className="text-gray-900">{dispute.game?.title || 'Unknown Game'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Dispute Type</h3>
              <p className="text-gray-900">
                {DISPUTE_TYPE_LABELS[dispute.disputeType as keyof typeof DISPUTE_TYPE_LABELS] || dispute.disputeType}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Initiator</h3>
              <p className="text-gray-900">
                @{dispute.initiator?.username} ({dispute.initiator?.fullName})
              </p>
            </div>
            {dispute.target && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Respondent</h3>
                <p className="text-gray-900">
                  @{dispute.target.username} ({dispute.target.fullName})
                </p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
              <p className="text-gray-900">
                {new Date(dispute.createdAt).toLocaleString('en-US')}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
              <span className={`
                inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                ${ARBITRATION_STATUS_COLORS[dispute.status as ArbitrationStatus] || 'bg-gray-100 text-gray-600'}
              `}>
                {ARBITRATION_STATUS_LABELS[dispute.status as ArbitrationStatus] || dispute.status}
              </span>
            </div>
          </div>

          {/* Dispute Description */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Dispute Description</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">
                {dispute.description || dispute.reason || 'No description'}
              </p>
            </div>
          </div>

          {/* Evidence List */}
          {dispute.evidence && dispute.evidence.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Related Evidence ({dispute.evidence.length})</h3>
              <div className="space-y-3">
                {dispute.evidence.map((evidence: any, index: number) => (
                  <div key={evidence.id || index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{evidence.title || `Evidence ${index + 1}`}</span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {evidence.type}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        @{evidence.uploader?.username}
                      </span>
                    </div>
                    {evidence.description && (
                      <p className="text-sm text-gray-600 mb-2">{evidence.description}</p>
                    )}
                    {evidence.type === 'TEXT' ? (
                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {evidence.content}
                      </div>
                    ) : evidence.type === 'IMAGE' ? (
                      <img
                        src={evidence.content}
                        alt="Evidence Image"
                        className="max-w-full h-auto rounded"
                      />
                    ) : (
                      <a
                        href={evidence.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Attachment
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Existing Resolution */}
          {dispute.resolution && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Resolution Result</h3>
              <p className="text-blue-800">{dispute.resolution}</p>
              {dispute.resolvedAt && (
                <p className="text-sm text-blue-600 mt-2">
                  Resolved: {new Date(dispute.resolvedAt).toLocaleString('en-US')}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {dispute.status === 'PENDING' && (
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => onAssign(dispute.id)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Take Over
              </button>
            </div>
          )}

          {(dispute.status === 'UNDER_REVIEW' || dispute.status === 'INVESTIGATING') && (
            <div className="space-y-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Decision
                </label>
                <select
                  value={decision}
                  onChange={(e) => setDecision(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
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
                  Resolution Details
                </label>
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Please provide detailed resolution and reasoning..."
                />
              </div>

              <button
                onClick={handleResolve}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Submit Resolution
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminArbitrationPage;
