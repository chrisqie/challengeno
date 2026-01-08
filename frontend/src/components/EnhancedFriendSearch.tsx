import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, Users, Star, Trophy, Clock } from 'lucide-react';
import { usersAPI, friendsAPI } from '../services/api';
import { useDebounce } from '../utils/useDebounce';
import toast from 'react-hot-toast';

interface SearchFilters {
  trustPointsMin: number;
  trustPointsMax: number;
  isVip: boolean | null;
  hasCommonGames: boolean;
  sortBy: 'relevance' | 'trustPoints' | 'activity' | 'mutual_friends';
}

interface EnhancedFriendSearchProps {
  onUserSelect?: (user: any) => void;
  showFilters?: boolean;
}

const EnhancedFriendSearch: React.FC<EnhancedFriendSearchProps> = ({
  onUserSelect,
  showFilters = true
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    trustPointsMin: 0,
    trustPointsMax: 200,
    isVip: null,
    hasCommonGames: false,
    sortBy: 'relevance'
  });

  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  // 搜索用户
  const searchUsers = async (searchQuery: string, searchFilters: SearchFilters) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await usersAPI.searchUsers(searchQuery);
      let users = response.data || [];

      // 应用过滤器
      users = users.filter((user: any) => {
        if (user.trustPoints < searchFilters.trustPointsMin || 
            user.trustPoints > searchFilters.trustPointsMax) {
          return false;
        }
        
        if (searchFilters.isVip !== null && user.isVip !== searchFilters.isVip) {
          return false;
        }

        return true;
      });

      // 排序
      users.sort((a: any, b: any) => {
        switch (searchFilters.sortBy) {
          case 'trustPoints':
            return b.trustPoints - a.trustPoints;
          case 'activity':
            return (b.totalGamesCreated + b.totalGamesJoined) - 
                   (a.totalGamesCreated + a.totalGamesJoined);
          case 'mutual_friends':
            return (b.mutualFriends || 0) - (a.mutualFriends || 0);
          default:
            return 0; // 保持原有顺序（相关性）
        }
      });

      setResults(users);
    } catch (error) {
      console.error('搜索失败:', error);
      toast.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchUsers(debouncedQuery, filters);
  }, [debouncedQuery, filters]);

  // 发送好友请求
  const sendFriendRequest = async (username: string) => {
    try {
      await friendsAPI.sendFriendRequest(username);
      toast.success('好友请求已发送！');
      
      // 更新结果中的用户状态
      setResults(prev => prev.map(user => 
        user.username === username 
          ? { ...user, friendRequestSent: true }
          : user
      ));
    } catch (error: any) {
      toast.error(error.response?.data?.message || '发送失败');
    }
  };

  const getTrustBadgeColor = (trustPoints: number) => {
    if (trustPoints >= 150) return 'bg-purple-100 text-purple-800';
    if (trustPoints >= 100) return 'bg-green-100 text-green-800';
    if (trustPoints >= 70) return 'bg-blue-100 text-blue-800';
    if (trustPoints >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getTrustLabel = (trustPoints: number) => {
    if (trustPoints >= 150) return '钻石';
    if (trustPoints >= 100) return '黄金';
    if (trustPoints >= 70) return '白银';
    if (trustPoints >= 50) return '青铜';
    return '新手';
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* 搜索输入框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索用户名、昵称..."
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   placeholder-gray-500 text-sm"
        />
        {showFilters && (
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`absolute inset-y-0 right-0 pr-3 flex items-center
                       ${showFilterPanel ? 'text-blue-600' : 'text-gray-400'} 
                       hover:text-blue-600 transition-colors`}
          >
            <Filter className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* 过滤器面板 */}
      {showFilterPanel && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <div className="space-y-4">
            {/* 信任积分范围 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                信任积分范围
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={filters.trustPointsMin}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    trustPointsMin: parseInt(e.target.value) || 0 
                  }))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="0"
                  max="200"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  value={filters.trustPointsMax}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    trustPointsMax: parseInt(e.target.value) || 200 
                  }))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="0"
                  max="200"
                />
              </div>
            </div>

            {/* VIP状态 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                VIP状态
              </label>
              <select
                value={filters.isVip === null ? 'all' : filters.isVip.toString()}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  isVip: e.target.value === 'all' ? null : e.target.value === 'true'
                }))}
                className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="all">全部</option>
                <option value="true">仅VIP</option>
                <option value="false">非VIP</option>
              </select>
            </div>

            {/* 排序方式 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                排序方式
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  sortBy: e.target.value as SearchFilters['sortBy']
                }))}
                className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="relevance">相关性</option>
                <option value="trustPoints">信任积分</option>
                <option value="activity">活跃度</option>
                <option value="mutual_friends">共同好友</option>
              </select>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-between pt-2">
              <button
                onClick={() => setFilters({
                  trustPointsMin: 0,
                  trustPointsMax: 200,
                  isVip: null,
                  hasCommonGames: false,
                  sortBy: 'relevance'
                })}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                重置
              </button>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 搜索结果 */}
      {query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-40">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm">搜索中...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {results.map((user) => (
                <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center space-x-3 flex-1 cursor-pointer"
                      onClick={() => onUserSelect?.(user)}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            @{user.username}
                          </p>
                          {user.isVip && (
                            <Star className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        {user.fullName && (
                          <p className="text-sm text-gray-600 truncate">{user.fullName}</p>
                        )}
                        <div className="flex items-center space-x-3 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTrustBadgeColor(user.trustPoints)}`}>
                            <Trophy className="w-3 h-3 mr-1" />
                            {getTrustLabel(user.trustPoints)} {user.trustPoints}
                          </span>
                          {user.mutualFriends > 0 && (
                            <span className="text-xs text-gray-500 flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {user.mutualFriends} 共同好友
                            </span>
                          )}
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {user.totalGamesCreated + user.totalGamesJoined} 场游戏
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => sendFriendRequest(user.username)}
                      disabled={user.friendRequestSent}
                      className={`ml-3 px-3 py-1 rounded-full text-xs font-medium transition-colors
                        ${user.friendRequestSent 
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                      {user.friendRequestSent ? '已发送' : '添加'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : query.length > 0 && !loading ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">未找到匹配的用户</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default EnhancedFriendSearch;
