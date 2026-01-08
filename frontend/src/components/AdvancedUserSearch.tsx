import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Trophy, 
  Star,
  Users,
  Gamepad2,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { usersAPI } from '../services/api';
import { useDebounce } from '../utils/useDebounce';

interface SearchFilters {
  query: string;
  location?: string;
  ageRange: [number, number];
  trustPointsRange: [number, number];
  gameCategories: string[];
  isVip: boolean | null;
  hasAvatar: boolean;
  isActive: boolean; // 最近活跃
  sortBy: 'relevance' | 'trustPoints' | 'joinDate' | 'activity' | 'gameCount';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedUserSearchProps {
  onUserSelect?: (user: any) => void;
  showFilters?: boolean;
}

const GAME_CATEGORIES = [
  '健身运动', '学习成长', '生活习惯', '技能提升', 
  '创意挑战', '社交互动', '公益活动', '其他'
];

const AdvancedUserSearch: React.FC<AdvancedUserSearchProps> = ({
  onUserSelect,
  showFilters = true
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    ageRange: [18, 65],
    trustPointsRange: [0, 200],
    gameCategories: [],
    isVip: null,
    hasAvatar: false,
    isActive: false,
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const debouncedQuery = useDebounce(filters.query, 300);

  // 搜索用户
  const { data: searchResults, isLoading, error } = useQuery(
    ['advanced-user-search', debouncedQuery, filters],
    () => usersAPI.advancedSearch({
      q: debouncedQuery,
      location: filters.location,
      minAge: filters.ageRange[0],
      maxAge: filters.ageRange[1],
      minTrustPoints: filters.trustPointsRange[0],
      maxTrustPoints: filters.trustPointsRange[1],
      gameCategories: filters.gameCategories.join(','),
      isVip: filters.isVip,
      hasAvatar: filters.hasAvatar,
      isActive: filters.isActive,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      limit: 20
    }),
    {
      enabled: debouncedQuery.length >= 2,
      select: (response) => response.data
    }
  );

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleGameCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      gameCategories: prev.gameCategories.includes(category)
        ? prev.gameCategories.filter(c => c !== category)
        : [...prev.gameCategories, category]
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: filters.query, // 保留搜索词
      ageRange: [18, 65],
      trustPointsRange: [0, 200],
      gameCategories: [],
      isVip: null,
      hasAvatar: false,
      isActive: false,
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
  };

  const getTrustBadge = (trustPoints: number) => {
    if (trustPoints >= 150) return { label: '钻石', color: 'text-purple-600 bg-purple-100' };
    if (trustPoints >= 100) return { label: '黄金', color: 'text-yellow-600 bg-yellow-100' };
    if (trustPoints >= 70) return { label: '白银', color: 'text-gray-600 bg-gray-100' };
    if (trustPoints >= 50) return { label: '青铜', color: 'text-orange-600 bg-orange-100' };
    return { label: '新手', color: 'text-green-600 bg-green-100' };
  };

  return (
    <div className="space-y-4">
      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={filters.query}
          onChange={(e) => updateFilter('query', e.target.value)}
          placeholder="搜索用户名、全名或兴趣..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* 快速过滤器 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateFilter('isVip', filters.isVip === true ? null : true)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            filters.isVip === true
              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          VIP用户
        </button>
        
        <button
          onClick={() => updateFilter('isActive', !filters.isActive)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            filters.isActive
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          最近活跃
        </button>

        <button
          onClick={() => updateFilter('hasAvatar', !filters.hasAvatar)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            filters.hasAvatar
              ? 'bg-blue-100 text-blue-800 border border-blue-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          有头像
        </button>

        {showFilters && (
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center"
          >
            <SlidersHorizontal className="w-4 h-4 mr-1" />
            高级筛选
          </button>
        )}
      </div>

      {/* 高级筛选面板 */}
      {showAdvancedFilters && showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">高级筛选</h3>
            <button
              onClick={() => setShowAdvancedFilters(false)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 地区筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                地区
              </label>
              <input
                type="text"
                value={filters.location || ''}
                onChange={(e) => updateFilter('location', e.target.value)}
                placeholder="输入城市或地区"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 年龄范围 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                年龄范围: {filters.ageRange[0]} - {filters.ageRange[1]}
              </label>
              <div className="flex space-x-2">
                <input
                  type="range"
                  min="18"
                  max="65"
                  value={filters.ageRange[0]}
                  onChange={(e) => updateFilter('ageRange', [parseInt(e.target.value), filters.ageRange[1]])}
                  className="flex-1"
                />
                <input
                  type="range"
                  min="18"
                  max="65"
                  value={filters.ageRange[1]}
                  onChange={(e) => updateFilter('ageRange', [filters.ageRange[0], parseInt(e.target.value)])}
                  className="flex-1"
                />
              </div>
            </div>

            {/* 信任度范围 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Trophy className="w-4 h-4 inline mr-1" />
                信任度: {filters.trustPointsRange[0]} - {filters.trustPointsRange[1]}
              </label>
              <div className="flex space-x-2">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.trustPointsRange[0]}
                  onChange={(e) => updateFilter('trustPointsRange', [parseInt(e.target.value), filters.trustPointsRange[1]])}
                  className="flex-1"
                />
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.trustPointsRange[1]}
                  onChange={(e) => updateFilter('trustPointsRange', [filters.trustPointsRange[0], parseInt(e.target.value)])}
                  className="flex-1"
                />
              </div>
            </div>

            {/* 排序方式 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">排序方式</label>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  updateFilter('sortBy', sortBy);
                  updateFilter('sortOrder', sortOrder);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="relevance-desc">相关度</option>
                <option value="trustPoints-desc">信任度 (高到低)</option>
                <option value="trustPoints-asc">信任度 (低到高)</option>
                <option value="activity-desc">活跃度</option>
                <option value="joinDate-desc">注册时间 (新到旧)</option>
                <option value="gameCount-desc">游戏参与数</option>
              </select>
            </div>
          </div>

          {/* 游戏分类 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Gamepad2 className="w-4 h-4 inline mr-1" />
              感兴趣的游戏类型
            </label>
            <div className="flex flex-wrap gap-2">
              {GAME_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleGameCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.gameCategories.includes(category)
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              清除筛选
            </button>
          </div>
        </div>
      )}

      {/* 搜索结果 */}
      {debouncedQuery.length >= 2 && (
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              搜索出错，请重试
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <>
              <div className="text-sm text-gray-600 mb-3">
                找到 {searchResults.length} 个用户
              </div>
              {searchResults.map((user: any) => {
                const trustBadge = getTrustBadge(user.trustPoints);
                return (
                  <div
                    key={user.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onUserSelect?.(user)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            @{user.username}
                          </h3>
                          {user.isVip && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              VIP
                            </span>
                          )}
                          <span className={`px-2 py-0.5 text-xs rounded-full ${trustBadge.color}`}>
                            {trustBadge.label}
                          </span>
                        </div>
                        {user.fullName && (
                          <p className="text-sm text-gray-600 mb-2">{user.fullName}</p>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Trophy className="w-3 h-3 mr-1" />
                            {user.trustPoints}
                          </span>
                          <span className="flex items-center">
                            <Gamepad2 className="w-3 h-3 mr-1" />
                            {user.totalGamesJoined || 0}
                          </span>
                          {user.location && (
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {user.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : debouncedQuery.length >= 2 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>未找到匹配的用户</p>
              <p className="text-sm mt-1">尝试调整搜索条件</p>
            </div>
          ) : null}
        </div>
      )}

      {debouncedQuery.length > 0 && debouncedQuery.length < 2 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          请输入至少2个字符开始搜索
        </div>
      )}
    </div>
  );
};

export default AdvancedUserSearch;
