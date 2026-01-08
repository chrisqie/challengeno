import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Crown, Sparkles } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { templateService } from '../services/templateService';
import { GameTemplate } from '../types/template';
import TemplateCard from '../components/TemplateCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const TemplateSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [templates, setTemplates] = useState<GameTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<GameTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<GameTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showVipOnly, setShowVipOnly] = useState(false);

  // 加载模板数据
  useEffect(() => {
    loadTemplates();
  }, []);

  // 过滤模板
  useEffect(() => {
    filterTemplates();
  }, [templates, searchTerm, selectedCategory, showVipOnly]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const result = await templateService.getGameTemplates();
      setTemplates(result.data);
    } catch (error) {
      console.error('加载模板失败:', error);
      toast.error('加载模板失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 分类过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // VIP过滤
    if (showVipOnly) {
      filtered = filtered.filter(template => template.isVipOnly);
    }

    setFilteredTemplates(filtered);
  };

  const handleTemplateSelect = (template: GameTemplate) => {
    setSelectedTemplate(template);
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      // 将选中的模板信息传递到创建游戏页面
      navigate('/create', { 
        state: { 
          selectedTemplate: selectedTemplate 
        } 
      });
    }
  };

  const categories = [
    { value: 'all', label: '全部分类' },
    { value: 'FITNESS', label: '健身运动' },
    { value: 'HEALTH', label: '健康生活' },
    { value: 'LEARNING', label: '学习成长' },
    { value: 'WEATHER', label: '天气预测' },
    { value: 'PERSONAL', label: '个人发展' }
  ];

  // 统计信息
  const vipTemplatesCount = templates.filter(t => t.isVipOnly).length;
  const freeTemplatesCount = templates.filter(t => !t.isVipOnly).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">选择游戏模板</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user?.isVip && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  <Crown className="w-4 h-4" />
                  <span>VIP会员</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索和过滤 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            {/* 搜索框 */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索模板..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* 过滤器 */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowVipOnly(!showVipOnly)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  showVipOnly
                    ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Crown className="w-4 h-4" />
                <span>VIP专属</span>
              </button>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
            <span>共 {filteredTemplates.length} 个模板</span>
            <span>免费模板: {freeTemplatesCount}</span>
            <span className="flex items-center space-x-1">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span>VIP模板: {vipTemplatesCount}</span>
            </span>
          </div>
        </div>

        {/* VIP推广横幅 */}
        {!user?.isVip && vipTemplatesCount > 0 && (
          <div className="mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">解锁VIP专属模板</h3>
                  <p className="text-yellow-100">
                    升级VIP会员，享受 {vipTemplatesCount} 个专业模板和高级功能
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/vip')}
                className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                立即升级
              </button>
            </div>
          </div>
        )}

        {/* 模板网格 */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={handleTemplateSelect}
                isSelected={selectedTemplate?.id === template.id}
                userIsVip={user?.isVip}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的模板</h3>
            <p className="text-gray-600">尝试调整搜索条件或选择其他分类</p>
          </div>
        )}

        {/* 底部操作栏 */}
        {selectedTemplate && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">已选择: {selectedTemplate.title}</p>
                  <p className="text-gray-600">{selectedTemplate.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  取消选择
                </button>
                <button
                  onClick={handleContinue}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  使用此模板
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateSelectionPage;
