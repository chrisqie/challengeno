import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { feedbackAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageSquare, CheckCircle, XCircle, Clock, AlertCircle, User, Mail, Calendar, ExternalLink, Shield, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuthStore } from '../stores/authStore'

const AdminFeedbackPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, logout } = useAuthStore()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null)
  const [adminNotes, setAdminNotes] = useState('')

  // 检查管理员权限
  useEffect(() => {
    if (user && !user.isAdmin) {
      toast.error('需要管理员权限')
      navigate('/admin/login')
    }
  }, [user, navigate])

  // 获取反馈列表
  const { data, isLoading } = useQuery(
    ['admin-feedbacks', page, statusFilter, typeFilter],
    () => feedbackAPI.getAll({
      page,
      limit: 20,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      type: typeFilter !== 'all' ? typeFilter : undefined,
    }),
    {
      keepPreviousData: true,
      select: (response) => response.data,
      enabled: !!user?.isAdmin,
      onError: (error: any) => {
        if (error.response?.status === 403) {
          toast.error('需要管理员权限')
          navigate('/admin/login')
        }
      }
    }
  )

  // 获取统计数据
  const { data: stats } = useQuery(
    'feedback-stats',
    feedbackAPI.getStats,
    {
      select: (response) => response.data,
      enabled: !!user?.isAdmin,
      onError: (error: any) => {
        if (error.response?.status === 403) {
          toast.error('需要管理员权限')
          navigate('/admin/login')
        }
      }
    }
  )

  // 处理反馈
  const handleMutation = useMutation(
    ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      feedbackAPI.handle(id, { status: status as any, adminNotes: notes }),
    {
      onSuccess: () => {
        toast.success('反馈已处理')
        queryClient.invalidateQueries('admin-feedbacks')
        queryClient.invalidateQueries('feedback-stats')
        setSelectedFeedback(null)
        setAdminNotes('')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '处理失败')
      },
    }
  )

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
      IN_PROGRESS: { color: 'bg-blue-100 text-blue-800', icon: AlertCircle, text: 'In Progress' },
      RESOLVED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Resolved' },
      CLOSED: { color: 'bg-gray-100 text-gray-800', icon: XCircle, text: 'Closed' },
    }
    const badge = badges[status as keyof typeof badges] || badges.PENDING
    const Icon = badge.icon
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.text}
      </span>
    )
  }

  const getTypeBadge = (type: string) => {
    const badges = {
      BUG: { color: 'bg-red-100 text-red-800', text: 'Bug Report' },
      SUGGESTION: { color: 'bg-purple-100 text-purple-800', text: 'Feature Suggestion' },
      OTHER: { color: 'bg-gray-100 text-gray-800', text: 'Other' },
    }
    const badge = badges[type as keyof typeof badges] || badges.OTHER
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
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
                <h1 className="text-xl font-semibold text-gray-900">User Feedback Management</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.fullName}</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Feedback</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Closed</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
                </div>
                <XCircle className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value)
                  setPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="BUG">Bug Report</option>
                <option value="SUGGESTION">Feature Suggestion</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : data?.feedbacks && data.feedbacks.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Content
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.feedbacks.map((feedback: any) => (
                      <tr key={feedback.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {feedback.user?.username || 'Anonymous'}
                              </div>
                              {feedback.email && (
                                <div className="text-xs text-gray-500 flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {feedback.email}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getTypeBadge(feedback.type)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-md truncate">
                            {feedback.content}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(feedback.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(feedback.createdAt).toLocaleDateString('en-US')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedFeedback(feedback)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data.pagination && data.pagination.pages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
                      disabled={page === data.pagination.pages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(page - 1) * 20 + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(page * 20, data.pagination.total)}</span> of{' '}
                        <span className="font-medium">{data.pagination.total}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
                          disabled={page === data.pagination.pages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No feedback</p>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Feedback Details</h3>
              <button
                onClick={() => {
                  setSelectedFeedback(null)
                  setAdminNotes('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                  <div className="text-sm text-gray-900">
                    {selectedFeedback.user?.username || 'Anonymous'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <div className="text-sm text-gray-900">
                    {selectedFeedback.email || 'Not provided'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feedback Type</label>
                  <div>{getTypeBadge(selectedFeedback.type)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div>{getStatusBadge(selectedFeedback.status)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                  <div className="text-sm text-gray-900">
                    {new Date(selectedFeedback.createdAt).toLocaleString('en-US')}
                  </div>
                </div>
                {selectedFeedback.handledAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Handled At</label>
                    <div className="text-sm text-gray-900">
                      {new Date(selectedFeedback.handledAt).toLocaleString('en-US')}
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Content</label>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-900 whitespace-pre-wrap">
                  {selectedFeedback.content}
                </div>
              </div>

              {/* Page URL */}
              {selectedFeedback.url && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Submitted Page</label>
                  <a
                    href={selectedFeedback.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    {selectedFeedback.url}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}

              {/* Existing Admin Notes */}
              {selectedFeedback.adminNotes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                  <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedFeedback.adminNotes}
                  </div>
                </div>
              )}

              {/* Handler */}
              {selectedFeedback.handler && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Handler</label>
                  <div className="text-sm text-gray-900">
                    {selectedFeedback.handler.username}
                  </div>
                </div>
              )}

              {/* Admin Actions */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes (Optional)</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add handling notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                {selectedFeedback.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleMutation.mutate({
                        id: selectedFeedback.id,
                        status: 'IN_PROGRESS',
                        notes: adminNotes || undefined
                      })}
                      disabled={handleMutation.isLoading}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      Mark as In Progress
                    </button>
                    <button
                      onClick={() => handleMutation.mutate({
                        id: selectedFeedback.id,
                        status: 'RESOLVED',
                        notes: adminNotes || undefined
                      })}
                      disabled={handleMutation.isLoading}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      Mark as Resolved
                    </button>
                  </>
                )}
                {selectedFeedback.status === 'IN_PROGRESS' && (
                  <>
                    <button
                      onClick={() => handleMutation.mutate({
                        id: selectedFeedback.id,
                        status: 'RESOLVED',
                        notes: adminNotes || undefined
                      })}
                      disabled={handleMutation.isLoading}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      Mark as Resolved
                    </button>
                    <button
                      onClick={() => handleMutation.mutate({
                        id: selectedFeedback.id,
                        status: 'CLOSED',
                        notes: adminNotes || undefined
                      })}
                      disabled={handleMutation.isLoading}
                      className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors"
                    >
                      Close
                    </button>
                  </>
                )}
                {(selectedFeedback.status === 'RESOLVED' || selectedFeedback.status === 'CLOSED') && (
                  <button
                    onClick={() => handleMutation.mutate({
                      id: selectedFeedback.id,
                      status: 'IN_PROGRESS',
                      notes: adminNotes || undefined
                    })}
                    disabled={handleMutation.isLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminFeedbackPage

