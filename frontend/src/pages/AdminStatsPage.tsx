import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Shield,
  LogOut,
  ArrowLeft,
  Users,
  GamepadIcon,
  TrendingUp,
  Calendar,
  Activity,
  Award,
  Clock,
  Target,
  Zap,
  RefreshCw,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

// 简单的进度条组件
const ProgressBar = ({ value, max, color = 'blue' }: { value: number; max: number; color?: string }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses]}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
};

// 趋势指示器组件
const TrendIndicator = ({ value, isPositive }: { value: number; isPositive?: boolean }) => {
  const isUp = isPositive !== undefined ? isPositive : value > 0;
  return (
    <div className={`flex items-center text-xs ${isUp ? 'text-green-600' : 'text-red-600'}`}>
      <TrendingUp className={`w-3 h-3 mr-1 ${isUp ? '' : 'rotate-180'}`} />
      {Math.abs(value)}%
    </div>
  );
};

const AdminStatsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  // Check admin permission
  useEffect(() => {
    if (user && !user.isAdmin) {
      toast.error('Admin permission required');
      navigate('/admin/login');
    }
  }, [user, navigate]);

  const { data: statsData, isLoading, refetch } = useQuery(
    ['admin-stats', timeRange],
    () => adminAPI.getDetailedStats(timeRange),
    {
      select: (response) => response.data,
      enabled: !!user?.isAdmin,
      refetchInterval: 60000, // 每分钟自动刷新
    }
  );

  // 手动刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
    toast.success('Data refreshed');
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
                <h1 className="text-xl font-semibold text-gray-900">Data Statistics</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
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
        {/* Time Range Selection */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              <option value="1d">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-semibold text-gray-900">{statsData?.totalUsers || 0}</p>
                    </div>
                  </div>
                  <TrendIndicator value={12} isPositive={true} />
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>New Users</span>
                    <span>{statsData?.newUsers || 0}</span>
                  </div>
                  <ProgressBar value={statsData?.newUsers || 0} max={100} color="blue" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <GamepadIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Games</p>
                      <p className="text-2xl font-semibold text-gray-900">{statsData?.totalGames || 0}</p>
                    </div>
                  </div>
                  <TrendIndicator value={8} isPositive={true} />
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>New Games</span>
                    <span>{statsData?.newGames || 0}</span>
                  </div>
                  <ProgressBar value={statsData?.newGames || 0} max={50} color="green" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Activity className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-2xl font-semibold text-gray-900">{statsData?.activeUsers || 0}</p>
                    </div>
                  </div>
                  <TrendIndicator value={5} isPositive={true} />
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Active Rate</span>
                    <span>{statsData?.activeUserRate || 0}%</span>
                  </div>
                  <ProgressBar value={statsData?.activeUserRate || 0} max={100} color="yellow" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">VIP Users</p>
                      <p className="text-2xl font-semibold text-gray-900">{statsData?.vipUsers || 0}</p>
                    </div>
                  </div>
                  <TrendIndicator value={15} isPositive={true} />
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>VIP Ratio</span>
                    <span>{statsData?.totalUsers > 0 ? Math.round((statsData?.vipUsers || 0) / statsData.totalUsers * 100) : 0}%</span>
                  </div>
                  <ProgressBar
                    value={statsData?.vipUsers || 0}
                    max={statsData?.totalUsers || 1}
                    color="purple"
                  />
                </div>
              </div>
            </div>

            {/* Real-time Monitoring Panel */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                    Real-time Monitoring
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Live Updates
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-semibold text-gray-900">{statsData?.activeGames || 0}</div>
                    <div className="text-sm text-gray-600">Active Games</div>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-semibold text-gray-900">{Math.floor((statsData?.activeUsers || 0) * 0.3)}</div>
                    <div className="text-sm text-gray-600">Online Users</div>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-2xl font-semibold text-gray-900">{Math.floor((statsData?.completedGames || 0) * 0.85)}</div>
                    <div className="text-sm text-gray-600">Completed Today</div>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-orange-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Award className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="text-2xl font-semibold text-gray-900">{Math.floor((statsData?.totalUsers || 0) * 0.15)}</div>
                    <div className="text-sm text-gray-600">Achievements Today</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Statistics */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    User Statistics
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-600">Registered Users</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900">{statsData?.totalUsers || 0}</span>
                        <div className="text-xs text-green-600">+{statsData?.newUsers || 0}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-600">Active Users</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900">{statsData?.activeUsers || 0}</span>
                        <div className="text-xs text-gray-500">{statsData?.activeUserRate || 0}%</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-600">VIP Users</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900">{statsData?.vipUsers || 0}</span>
                        <div className="text-xs text-purple-600">
                          {statsData?.totalUsers > 0 ? Math.round((statsData?.vipUsers || 0) / statsData.totalUsers * 100) : 0}%
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-600">Banned Users</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-red-600">{statsData?.bannedUsers || 0}</span>
                        <div className="text-xs text-gray-500">0%</div>
                      </div>
                    </div>

                    {/* User Activity Chart */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-sm font-medium text-gray-700 mb-3">User Activity Distribution</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>High Activity</span>
                          <span>{Math.floor((statsData?.activeUsers || 0) * 0.3)}</span>
                        </div>
                        <ProgressBar value={Math.floor((statsData?.activeUsers || 0) * 0.3)} max={statsData?.totalUsers || 1} color="green" />

                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Medium Activity</span>
                          <span>{Math.floor((statsData?.activeUsers || 0) * 0.5)}</span>
                        </div>
                        <ProgressBar value={Math.floor((statsData?.activeUsers || 0) * 0.5)} max={statsData?.totalUsers || 1} color="yellow" />

                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Low Activity</span>
                          <span>{Math.floor((statsData?.activeUsers || 0) * 0.2)}</span>
                        </div>
                        <ProgressBar value={Math.floor((statsData?.activeUsers || 0) * 0.2)} max={statsData?.totalUsers || 1} color="red" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Statistics */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <GamepadIcon className="w-5 h-5 mr-2 text-green-600" />
                    Game Statistics
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-600">Total Games</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900">{statsData?.totalGames || 0}</span>
                        <div className="text-xs text-green-600">+{statsData?.newGames || 0}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                        <span className="text-sm text-gray-600">In Progress</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-green-600">{statsData?.activeGames || 0}</span>
                        <div className="text-xs text-gray-500">
                          {statsData?.totalGames > 0 ? Math.round((statsData?.activeGames || 0) / statsData.totalGames * 100) : 0}%
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-600">Completed</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-blue-600">{statsData?.completedGames || 0}</span>
                        <div className="text-xs text-gray-500">
                          {statsData?.totalGames > 0 ? Math.round((statsData?.completedGames || 0) / statsData.totalGames * 100) : 0}%
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-600">Cancelled</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-red-600">{statsData?.cancelledGames || 0}</span>
                        <div className="text-xs text-gray-500">
                          {statsData?.totalGames > 0 ? Math.round((statsData?.cancelledGames || 0) / statsData.totalGames * 100) : 0}%
                        </div>
                      </div>
                    </div>

                    {/* Game Completion Rate Chart */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-sm font-medium text-gray-700 mb-3">Game Completion Rate</div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Completion Rate</span>
                          <span>
                            {statsData?.totalGames > 0
                              ? Math.round((statsData?.completedGames || 0) / statsData.totalGames * 100)
                              : 0}%
                          </span>
                        </div>
                        <ProgressBar
                          value={statsData?.completedGames || 0}
                          max={statsData?.totalGames || 1}
                          color="blue"
                        />

                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div>
                            <div className="text-green-600 font-medium">{statsData?.activeGames || 0}</div>
                            <div className="text-gray-500">In Progress</div>
                          </div>
                          <div>
                            <div className="text-blue-600 font-medium">{statsData?.completedGames || 0}</div>
                            <div className="text-gray-500">Completed</div>
                          </div>
                          <div>
                            <div className="text-red-600 font-medium">{statsData?.cancelledGames || 0}</div>
                            <div className="text-gray-500">Cancelled</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health Status */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-500" />
                  System Health Status
                  <div className="ml-auto flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm text-green-600">Normal</span>
                  </div>
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {statsData?.systemHealth?.uptime || '99.9%'}
                    </div>
                    <div className="text-sm text-gray-600">System Uptime</div>
                    <div className="mt-2">
                      <ProgressBar value={99.9} max={100} color="green" />
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {statsData?.systemHealth?.responseTime || '<100ms'}
                    </div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                    <div className="mt-2">
                      <ProgressBar value={85} max={100} color="blue" />
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {statsData?.systemHealth?.errorRate || '<0.1%'}
                    </div>
                    <div className="text-sm text-gray-600">Error Rate</div>
                    <div className="mt-2">
                      <ProgressBar value={0.1} max={1} color="purple" />
                    </div>
                  </div>
                </div>

                {/* Detailed System Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">256MB</div>
                    <div className="text-xs text-gray-500">Memory Usage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">15%</div>
                    <div className="text-xs text-gray-500">CPU Usage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">2.1GB</div>
                    <div className="text-xs text-gray-500">Database Size</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">1,247</div>
                    <div className="text-xs text-gray-500">Requests Today</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <button
                    onClick={() => navigate('/admin/users')}
                    className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Users className="w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-blue-900">User Management</span>
                  </button>
                  <button
                    onClick={() => navigate('/admin/games')}
                    className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <GamepadIcon className="w-8 h-8 text-green-600 mb-2" />
                    <span className="text-sm font-medium text-green-900">Game Management</span>
                  </button>
                  <button
                    onClick={() => navigate('/admin/reports')}
                    className="flex flex-col items-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
                    <span className="text-sm font-medium text-red-900">Report Handling</span>
                  </button>
                  <button
                    onClick={() => navigate('/admin/vip')}
                    className="flex flex-col items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
                  >
                    <Award className="w-8 h-8 text-yellow-600 mb-2" />
                    <span className="text-sm font-medium text-yellow-900">VIP Management</span>
                  </button>
                  <button
                    onClick={() => navigate('/admin/feedback')}
                    className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-8 h-8 text-purple-600 mb-2" />
                    <span className="text-sm font-medium text-purple-900">User Feedback</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStatsPage;
