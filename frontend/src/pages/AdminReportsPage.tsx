import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  Flag, 
  Search, 
  Shield,
  LogOut,
  ArrowLeft,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  AlertTriangle
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminReportsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Check admin permission
  useEffect(() => {
    if (user && !user.isAdmin) {
      toast.error('Admin permission required');
      navigate('/admin/login');
    }
  }, [user, navigate]);

  const { data: reportsData, isLoading, refetch } = useQuery(
    ['admin-reports', searchTerm, filterStatus],
    () => adminAPI.getReports({ search: searchTerm, status: filterStatus }),
    {
      select: (response) => response.data,
      enabled: !!user?.isAdmin,
    }
  );

  const handleReportAction = async (reportId: string, action: string) => {
    try {
      switch (action) {
        case 'approve':
          await adminAPI.approveReport(reportId);
          toast.success('Report handled');
          break;
        case 'reject':
          await adminAPI.rejectReport(reportId);
          toast.success('Report rejected');
          break;
      }
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'INVESTIGATING':
        return 'bg-blue-100 text-blue-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'INVESTIGATING':
        return 'Investigating';
      case 'RESOLVED':
        return 'Resolved';
      case 'REJECTED':
        return 'Rejected';
      default:
        return status;
    }
  };

  const getReportTypeText = (type: string) => {
    switch (type) {
      case 'INAPPROPRIATE_CONTENT':
        return 'Inappropriate Content';
      case 'SPAM':
        return 'Spam';
      case 'FRAUD':
        return 'Fraud';
      case 'HARASSMENT':
        return 'Harassment';
      case 'FAKE_EVIDENCE':
        return 'Fake Evidence';
      case 'OTHER':
        return 'Other';
      default:
        return type;
    }
  };

  const getTargetTypeText = (type: string) => {
    switch (type) {
      case 'GAME':
        return 'Game';
      case 'USER':
        return 'User';
      case 'EVIDENCE':
        return 'Evidence';
      case 'COMMENT':
        return 'Comment';
      default:
        return type;
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
                <Shield className="w-6 h-6 text-purple-600 mr-2" />
                <h1 className="text-xl font-semibold text-gray-900">Report Management</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.fullName}</span>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Reports</option>
            <option value="PENDING">Pending</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Reports List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : reportsData?.reports?.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <Flag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports</h3>
            <p className="text-gray-500">There are no reports to handle</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Report List ({reportsData?.reports?.length || 0})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {reportsData?.reports?.map((report: any) => (
                <div key={report.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Title Row */}
                      <div className="flex items-center mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-base font-semibold text-gray-900">
                          {getReportTypeText(report.reason)}
                        </span>
                        <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {getStatusText(report.status)}
                        </span>
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getTargetTypeText(report.targetType)}
                        </span>
                      </div>

                      {/* Report Details */}
                      {report.description && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Description:</strong> {report.description}
                          </p>
                        </div>
                      )}

                      {/* Meta Information */}
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1.5 text-gray-400" />
                          <span>Reporter:</span>
                          <span className="ml-1 font-medium">{report.reporter?.username || report.reporter?.fullName || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                          <span>Reported:</span>
                          <span className="ml-1">{new Date(report.createdAt).toLocaleString('en-US')}</span>
                        </div>
                        <div className="flex items-center">
                          <Flag className="w-4 h-4 mr-1.5 text-gray-400" />
                          <span>Target ID:</span>
                          <span className="ml-1 font-mono text-xs">{report.targetId}</span>
                        </div>
                        {report.handler && (
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1.5 text-gray-400" />
                            <span>Handler:</span>
                            <span className="ml-1 font-medium">{report.handler?.username || report.handler?.fullName}</span>
                          </div>
                        )}
                      </div>

                      {/* Resolution */}
                      {report.resolution && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Resolution:</strong> {report.resolution}
                          </p>
                          {report.handledAt && (
                            <p className="text-xs text-green-600 mt-1">
                              Handled at: {new Date(report.handledAt).toLocaleString('en-US')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {report.status === 'PENDING' && (
                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => handleReportAction(report.id, 'approve')}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-1.5" />
                          Handle
                        </button>
                        <button
                          onClick={() => handleReportAction(report.id, 'reject')}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="w-4 h-4 mr-1.5" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;
