import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Users,
  GamepadIcon,
  AlertTriangle,
  TrendingUp,
  Shield,
  LogOut,
  Settings,
  BarChart3,
  Flag,
  Crown,
  ShoppingCart,
  MessageSquare,
  UserPlus,
  Gamepad2,
  Scale,
  Clock
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Check admin privileges
  useEffect(() => {
    // Only redirect if user info is loaded and user is not admin
    if (user && !user.isAdmin) {
      toast.error('Administrator privileges required');
      navigate('/admin/login');
    }
  }, [user, navigate]);

  // Update time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: stats, isLoading } = useQuery(
    'admin-overview-stats',
    () => adminAPI.getOverviewStats(),
    {
      refetchInterval: 30000, // Refresh every 30 seconds
      select: (response) => response.data,
    }
  );

  const { data: recentActivities, isLoading: activitiesLoading } = useQuery(
    'admin-recent-activities',
    () => adminAPI.getRecentActivities(10),
    {
      refetchInterval: 30000, // Refresh every 30 seconds
      select: (response) => response.data,
    }
  );

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getActivityIcon = (iconName: string) => {
    const icons: any = {
      UserPlus,
      Gamepad2,
      Scale,
      Shield,
      Clock,
    };
    const Icon = icons[iconName] || Clock;
    return <Icon className="w-5 h-5" />;
  };

  const getActivityColor = (type: string) => {
    const colors: any = {
      USER_REGISTERED: 'text-green-600 bg-green-50',
      GAME_CREATED: 'text-blue-600 bg-blue-50',
      DISPUTE_CREATED: 'text-orange-600 bg-orange-50',
      DISPUTE_RESOLVED: 'text-purple-600 bg-purple-50',
      ADMIN_ACTION: 'text-gray-600 bg-gray-50',
    };
    return colors[type] || 'text-gray-600 bg-gray-50';
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return time.toLocaleDateString('en-US');
  };

  if (!user?.isAdmin) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {currentTime.toLocaleString('en-US')}
              </div>
              <div className="text-sm text-gray-600">
                Welcome, {user.fullName || user.username}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.totalUsers}</p>
                    <p className="text-xs text-green-600">Today +{stats?.todayUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <GamepadIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Games</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.totalGames}</p>
                    <p className="text-xs text-green-600">Today +{stats?.todayGames}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Games</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.activeGames}</p>
                    <p className="text-xs text-gray-500">In Progress</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.pendingReports}</p>
                    <p className="text-xs text-red-600">Needs Attention</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
            >
              <Users className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-medium text-gray-900">User Management</h3>
              <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
            </button>

            <button
              onClick={() => navigate('/admin/games')}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
            >
              <GamepadIcon className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-medium text-gray-900">Game Management</h3>
              <p className="text-sm text-gray-600">Manage game content and status</p>
            </button>

            <button
              onClick={() => navigate('/admin/reports')}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
            >
              <Flag className="w-8 h-8 text-red-600 mb-3" />
              <h3 className="font-medium text-gray-900">Report Management</h3>
              <p className="text-sm text-gray-600">Handle user reports and complaints</p>
            </button>

            <button
              onClick={() => navigate('/admin/stats')}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
            >
              <BarChart3 className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-medium text-gray-900">Statistics</h3>
              <p className="text-sm text-gray-600">View system data analytics</p>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <button
              onClick={() => navigate('/admin/vip')}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
            >
              <Crown className="w-8 h-8 text-yellow-600 mb-3" />
              <h3 className="font-medium text-gray-900">VIP Management</h3>
              <p className="text-sm text-gray-600">Manage VIP users and subscriptions</p>
            </button>

            <button
              onClick={() => navigate('/admin/arbitration')}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
            >
              <AlertTriangle className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-medium text-gray-900">Arbitration Management</h3>
              <p className="text-sm text-gray-600">Handle user disputes and arbitration</p>
            </button>

            <button
              onClick={() => navigate('/admin/teams')}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
            >
              <Users className="w-8 h-8 text-indigo-600 mb-3" />
              <h3 className="font-medium text-gray-900">Team Management</h3>
              <p className="text-sm text-gray-600">Manage platform teams and members</p>
            </button>

            <button
              onClick={() => navigate('/admin/shop')}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
            >
              <ShoppingCart className="w-8 h-8 text-pink-600 mb-3" />
              <h3 className="font-medium text-gray-900">Points Shop</h3>
              <p className="text-sm text-gray-600">Manage points shop items</p>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <button
              onClick={() => navigate('/admin/feedback')}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
            >
              <MessageSquare className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-medium text-gray-900">User Feedback</h3>
              <p className="text-sm text-gray-600">View and handle user feedback</p>
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              {activitiesLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="md" />
                </div>
              ) : recentActivities && recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity: any) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        {activity.badge && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {activity.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
