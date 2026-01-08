import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Compass, 
  TrendingUp, 
  Users, 
  MapPin,
  Filter,
  Sparkles
} from 'lucide-react';
import AdvancedUserSearch from '../components/AdvancedUserSearch';
import UserRecommendationEngine from '../components/UserRecommendationEngine';

export default function UserDiscoveryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'search' | 'recommendations' | 'trending'>('search');

  const handleUserSelect = (user: any) => {
    navigate(`/user/${user.username}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 页面头部 */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <Compass className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">发现用户</h1>
          </div>
          <p className="text-gray-600">
            寻找志同道合的朋友，一起参与有趣的挑战游戏
          </p>
        </div>

        {/* 标签页导航 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'search'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Search className="w-4 h-4" />
                <span>搜索用户</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'recommendations'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>为你推荐</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('trending')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'trending'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>热门用户</span>
              </div>
            </button>
          </div>
        </div>

        {/* 标签页内容 */}
        <div className="space-y-6">
          {/* 搜索标签页 */}
          {activeTab === 'search' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">高级搜索</h2>
                <p className="text-sm text-gray-600">
                  使用多种筛选条件找到最适合的用户
                </p>
              </div>
              <AdvancedUserSearch 
                onUserSelect={handleUserSelect}
                showFilters={true}
              />
            </div>
          )}

          {/* 推荐标签页 */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <UserRecommendationEngine 
                maxRecommendations={12}
                showReasons={true}
              />
              
              {/* 推荐说明 */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-2">推荐算法说明</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• <strong>共同好友</strong>：与你的好友有共同联系的用户</p>
                  <p>• <strong>相似兴趣</strong>：参与相似游戏类型的用户</p>
                  <p>• <strong>地理位置</strong>：来自相同城市或地区的用户</p>
                  <p>• <strong>信任等级</strong>：与你信任度相近的用户</p>
                  <p>• <strong>活跃模式</strong>：活跃时间和频率相似的用户</p>
                  <p>• <strong>游戏历史</strong>：参与过相同游戏的用户</p>
                </div>
              </div>
            </div>
          )}

          {/* 热门用户标签页 */}
          {activeTab === 'trending' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">热门用户</h2>
                <p className="text-sm text-gray-600">
                  最活跃和最受欢迎的用户
                </p>
              </div>

              {/* 热门分类 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-4 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <h3 className="font-medium">本周最活跃</h3>
                  </div>
                  <p className="text-sm opacity-90">参与游戏最多的用户</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5" />
                    <h3 className="font-medium">社交达人</h3>
                  </div>
                  <p className="text-sm opacity-90">好友数量最多的用户</p>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-4 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-5 h-5" />
                    <h3 className="font-medium">本地热门</h3>
                  </div>
                  <p className="text-sm opacity-90">你所在地区的热门用户</p>
                </div>
              </div>

              {/* 热门用户列表占位符 */}
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">热门用户功能开发中</h3>
                <p className="text-sm">
                  我们正在完善热门用户算法，敬请期待！
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => setActiveTab('recommendations')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    查看推荐用户
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部提示 */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Filter className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">发现更多用户的小贴士</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 完善你的个人资料，包括兴趣爱好和所在地区</li>
                <li>• 积极参与游戏，提高你的信任度和活跃度</li>
                <li>• 使用多种搜索条件来找到最合适的用户</li>
                <li>• 定期查看推荐，我们会根据你的活动更新推荐列表</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
