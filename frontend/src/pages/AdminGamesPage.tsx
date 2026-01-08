import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  GamepadIcon,
  Search,
  Filter,
  Shield,
  LogOut,
  ArrowLeft,
  Eye,
  Ban,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  XCircle
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminGamesPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Check admin privileges
  useEffect(() => {
    if (user && !user.isAdmin) {
      toast.error('Administrator privileges required');
      navigate('/admin/login');
    }
  }, [user, navigate]);

  const { data: gamesData, isLoading, refetch } = useQuery(
    ['admin-games', searchTerm, filterStatus],
    () => adminAPI.getGames({ search: searchTerm, status: filterStatus }),
    {
      select: (response) => response.data,
      enabled: !!user?.isAdmin,
    }
  );

  const handleGameAction = async (gameId: string, action: string) => {
    try {
      switch (action) {
        case 'suspend':
          await adminAPI.suspendGame(gameId);
          toast.success('Game suspended');
          break;
        case 'resume':
          await adminAPI.resumeGame(gameId);
          toast.success('Game resumed');
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
            await adminAPI.deleteGame(gameId);
            toast.success('Game deleted');
          }
          break;
      }
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-800';
      case 'EVIDENCE_SUBMISSION':
        return 'bg-purple-100 text-purple-800';
      case 'PEER_REVIEW':
        return 'bg-orange-100 text-orange-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'DISPUTED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED':
        return 'bg-gray-300 text-gray-600'; // Archived games use dark gray
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'Open';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'EVIDENCE_SUBMISSION':
        return 'Evidence Submission';
      case 'PEER_REVIEW':
        return 'Peer Review';
      case 'COMPLETED':
        return 'Completed';
      case 'DISPUTED':
        return 'Disputed';
      case 'CLOSED':
        return 'Archived';
      default:
        return status;
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
                <h1 className="text-xl font-semibold text-gray-900">Game Management</h1>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search game title or description..."
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
            <option value="all">All Games</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="EVIDENCE_SUBMISSION">Evidence Submission</option>
            <option value="PEER_REVIEW">Peer Review</option>
            <option value="COMPLETED">Completed</option>
            <option value="DISPUTED">Disputed</option>
            <option value="CLOSED">Archived</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Game List ({gamesData?.games?.length || 0})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Game Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creator
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gamesData?.games?.map((game: any) => (
                    <tr key={game.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <GamepadIcon className="w-5 h-5 text-green-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {game.title}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {game.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-1" />
                          {game.creator?.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>Participants: {game.participantCount}/{game.maxParticipants}</div>
                          <div className="text-xs text-gray-500">
                            Prize Pool: ¥{game.totalPrizePool}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(game.status)}`}>
                          {getStatusText(game.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                          <div>
                            <div>Created: {new Date(game.createdAt).toLocaleDateString()}</div>
                            {game.endTime && (
                              <div className="text-xs">
                                Ends: {new Date(game.endTime).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/game/${game.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {game.status === 'DISPUTED' ? (
                            <button
                              onClick={() => handleGameAction(game.id, 'resume')}
                              className="text-green-600 hover:text-green-900"
                              title="Resume Game"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          ) : game.status !== 'COMPLETED' && game.status !== 'CLOSED' ? (
                            <button
                              onClick={() => handleGameAction(game.id, 'suspend')}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Suspend Game"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          ) : null}
                          <button
                            onClick={() => handleGameAction(game.id, 'delete')}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Game"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
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

export default AdminGamesPage;
