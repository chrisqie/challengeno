import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Shield,
  LogOut,
  ArrowLeft,
  Ban,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import UserDisplay from '../components/UserDisplay';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
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

  const { data: usersData, isLoading, refetch } = useQuery(
    ['admin-users', searchTerm, filterStatus],
    () => adminAPI.getUsers({ search: searchTerm, status: filterStatus }),
    {
      select: (response) => response.data,
      enabled: !!user?.isAdmin,
    }
  );

  const handleUserAction = async (userId: string, action: string, username?: string) => {
    try {
      switch (action) {
        case 'ban':
          await adminAPI.banUser(userId);
          toast.success('User banned');
          break;
        case 'unban':
          await adminAPI.unbanUser(userId);
          toast.success('User unbanned');
          break;
        case 'delete':
          // Require username confirmation for deletion
          const confirmUsername = window.prompt(
            `⚠️ Warning: Deleting a user is a sensitive operation!\n\nPlease enter username "${username}" to confirm deletion:`
          );

          if (confirmUsername === username) {
            await adminAPI.deleteUser(userId);
            toast.success('User deleted');
          } else if (confirmUsername !== null) {
            // User entered but didn't match
            toast.error('Username mismatch, deletion cancelled');
            return; // Don't refresh list
          } else {
            // User cancelled
            return; // Don't refresh list
          }
          break;
        case 'restore':
          if (window.confirm('Are you sure you want to restore this user?')) {
            await adminAPI.restoreUser(userId);
            toast.success('User restored');
          } else {
            return; // Don't refresh list
          }
          break;
      }
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
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
                <h1 className="text-xl font-semibold text-gray-900">User Management</h1>
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
              placeholder="Search username or email..."
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
            <option value="all">All Users</option>
            <option value="active">Active Users</option>
            <option value="banned">Banned</option>
            <option value="admin">Administrators</option>
          </select>
        </div>

        {/* User List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                User List ({usersData?.users?.length || 0})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Game Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reports
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registered
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usersData?.users?.map((user: any) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <Users className="w-5 h-5 text-purple-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              <UserDisplay
                                username={user.username}
                                isDeleted={user.isDeleted}
                              />
                              {user.isAdmin && (
                                <Shield className="w-4 h-4 text-purple-600 ml-2" />
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>Trust: {user.trustPoints}</div>
                          <div>Participation: {user.participationPoints}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>Created: {user.totalGamesCreated}</div>
                          <div>Joined: {user.totalGamesJoined}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col space-y-1">
                          <span className="inline-flex items-center text-green-600 font-medium">
                            +{user.reportCount || 0} Reports
                          </span>
                          <span className="inline-flex items-center text-red-600 font-medium">
                            +{user.reportedCount || 0} Reported
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isDeleted
                            ? 'bg-gray-100 text-gray-600'
                            : user.isAdmin
                            ? 'bg-purple-100 text-purple-800'
                            : user.isBanned
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.isDeleted ? 'Deleted' : user.isAdmin ? 'Admin' : user.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {!user.isAdmin && (
                            <>
                              {user.isDeleted ? (
                                // Deleted user: show restore button
                                <button
                                  onClick={() => handleUserAction(user.id, 'restore')}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Restore user"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              ) : (
                                // Active user: show ban/unban and delete buttons
                                <>
                                  {user.isBanned ? (
                                    <button
                                      onClick={() => handleUserAction(user.id, 'unban')}
                                      className="text-green-600 hover:text-green-900"
                                      title="Unban user"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleUserAction(user.id, 'ban')}
                                      className="text-red-600 hover:text-red-900"
                                      title="Ban user"
                                    >
                                      <Ban className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleUserAction(user.id, 'delete', user.username)}
                                    className="text-red-600 hover:text-red-900"
                                    title="Delete user"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
