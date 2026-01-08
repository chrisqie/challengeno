import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { adminApi } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import {
  Users,
  Search,
  Trash2,
  Eye,
  Shield,
  CheckCircle,
  XCircle,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

interface Team {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  maxMembers: number;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    username: string;
    fullName: string;
  };
  _count: {
    members: number;
    games: number;
  };
}

const TeamManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'public' | 'private'>('all');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Check admin permission
  useEffect(() => {
    if (user && !user.isAdmin) {
      toast.error('Admin permission required');
      navigate('/admin/login');
    }
  }, [user, navigate]);

  // Get team list
  const { data: teams, isLoading } = useQuery(
    ['admin-teams', searchTerm, filterStatus],
    async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('isPublic', filterStatus === 'public' ? 'true' : 'false');

      const response = await adminApi.get(`/admin/teams?${params.toString()}`);
      return response.data;
    }
  );

  // Delete team
  const deleteTeamMutation = useMutation(
    (teamId: string) => adminApi.delete(`/admin/teams/${teamId}`),
    {
      onSuccess: () => {
        toast.success('Team deleted');
        queryClient.invalidateQueries(['admin-teams']);
        setShowDetailModal(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Deletion failed');
      }
    }
  );

  // View team details
  const handleViewTeam = async (team: Team) => {
    try {
      const response = await adminApi.get(`/admin/teams/${team.id}`);
      setSelectedTeam(response.data);
      setShowDetailModal(true);
    } catch (error: any) {
      toast.error('Failed to get team details');
    }
  };

  // Delete team
  const handleDeleteTeam = (teamId: string) => {
    if (window.confirm('Are you sure you want to delete this team? This action cannot be undone!')) {
      deleteTeamMutation.mutate(teamId);
    }
  };

  const filteredTeams = teams || [];

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
                <h1 className="text-xl font-semibold text-gray-900">Team Management</h1>
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
              placeholder="Search team name, creator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Teams</option>
            <option value="public">Public Teams</option>
            <option value="private">Private Teams</option>
          </select>
        </div>

        {/* Team List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Team List ({filteredTeams.length})
              </h2>
            </div>
            {filteredTeams.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-600">No team data</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Creator
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Members/Limit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Games
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTeams.map((team: Team) => (
                      <tr key={team.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {team.name}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {team.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{team.creator.fullName}</div>
                          <div className="text-sm text-gray-500">@{team.creator.username}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {team.isPublic ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Public
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Private
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {team._count.members} / {team.maxMembers}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {team._count.games}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(team.createdAt).toLocaleDateString('en-US')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewTeam(team)}
                            className="text-purple-600 hover:text-purple-900 mr-3"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTeam(team.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Team"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Team Details Modal */}
      {showDetailModal && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedTeam.name}</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-gray-900">{selectedTeam.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Creator</label>
                    <p className="mt-1 text-gray-900">{selectedTeam.creator.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1">
                      {selectedTeam.isPublic ? (
                        <span className="text-green-600">Public</span>
                      ) : (
                        <span className="text-gray-600">Private</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Members</label>
                    <p className="mt-1 text-gray-900">
                      {selectedTeam._count.members} / {selectedTeam.maxMembers}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Games</label>
                    <p className="mt-1 text-gray-900">{selectedTeam._count.games}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Created At</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(selectedTeam.createdAt).toLocaleString('en-US')}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDeleteTeam(selectedTeam.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagementPage;

