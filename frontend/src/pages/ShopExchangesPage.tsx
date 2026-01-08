import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package,
  Trophy,
  Heart,
  Zap
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { shopAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

interface Exchange {
  id: string;
  pointType: string;
  pointCost: number;
  status: string;
  deliveryInfo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  item: {
    id: string;
    name: string;
    description: string;
    image?: string;
    category: string;
  };
}

const ShopExchangesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // 加载兑换记录
  const loadExchanges = async (page = 1) => {
    try {
      setLoading(true);
      const response = await shopAPI.getExchanges(page, 20);
      setExchanges(response.data.exchanges || []);
      setPagination(response.data.pagination);
    } catch (error: any) {
      console.error('加载兑换记录失败:', error);
      toast.error('加载失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExchanges();
  }, []);

  // 获取状态图标和颜色
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          icon: <Clock className="w-5 h-5" />,
          text: '待处理',
          color: 'text-yellow-600 bg-yellow-100',
        };
      case 'PROCESSING':
        return {
          icon: <Package className="w-5 h-5" />,
          text: '处理中',
          color: 'text-blue-600 bg-blue-100',
        };
      case 'COMPLETED':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          text: '已完成',
          color: 'text-green-600 bg-green-100',
        };
      case 'CANCELLED':
        return {
          icon: <XCircle className="w-5 h-5" />,
          text: '已取消',
          color: 'text-red-600 bg-red-100',
        };
      default:
        return {
          icon: <Clock className="w-5 h-5" />,
          text: '未知',
          color: 'text-gray-600 bg-gray-100',
        };
    }
  };

  // 获取积分类型图标
  const getPointTypeIcon = (pointType: string) => {
    switch (pointType) {
      case 'PARTICIPATION':
        return <Trophy className="w-4 h-4 text-blue-500" />;
      case 'TRUST':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'LABOR':
        return <Zap className="w-4 h-4 text-yellow-500" />;
      default:
        return <ShoppingBag className="w-4 h-4 text-gray-500" />;
    }
  };

  // 获取积分类型名称
  const getPointTypeName = (pointType: string) => {
    switch (pointType) {
      case 'PARTICIPATION': return '参与积分';
      case 'TRUST': return '信任积分';
      case 'LABOR': return '劳动积分';
      default: return '积分';
    }
  };

  // 翻页
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadExchanges(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 头部 */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/shop')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <ShoppingBag className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">兑换记录</h1>
          <p className="text-sm text-gray-500">查看您的积分兑换历史</p>
        </div>
      </div>

      {/* 兑换记录列表 */}
      {exchanges.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无兑换记录</h3>
          <p className="text-gray-500 mb-4">您还没有兑换过任何商品</p>
          <button
            onClick={() => navigate('/shop')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            去商城看看
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {exchanges.map((exchange) => {
            const statusInfo = getStatusInfo(exchange.status);
            
            return (
              <div key={exchange.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start space-x-4">
                  {/* 商品图片 */}
                  <div className="flex-shrink-0">
                    {exchange.item.image ? (
                      <img
                        src={exchange.item.image}
                        alt={exchange.item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* 商品信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {exchange.item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {exchange.item.description}
                        </p>
                        
                        {/* 积分信息 */}
                        <div className="flex items-center space-x-2 mb-2">
                          {getPointTypeIcon(exchange.pointType)}
                          <span className="text-sm text-gray-600">
                            消耗 {exchange.pointCost} {getPointTypeName(exchange.pointType)}
                          </span>
                        </div>

                        {/* 时间信息 */}
                        <div className="text-xs text-gray-500">
                          兑换时间: {new Date(exchange.createdAt).toLocaleString()}
                        </div>
                      </div>

                      {/* 状态标签 */}
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span className="text-sm font-medium">{statusInfo.text}</span>
                      </div>
                    </div>

                    {/* 备注信息 */}
                    {exchange.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">备注: </span>
                          {exchange.notes}
                        </p>
                      </div>
                    )}

                    {/* 配送信息 */}
                    {exchange.deliveryInfo && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">配送信息: </span>
                          {exchange.deliveryInfo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 分页 */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    page === pagination.page
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      )}

      {/* 统计信息 */}
      {exchanges.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">
            共 {pagination.total} 条兑换记录，当前第 {pagination.page} 页，共 {pagination.totalPages} 页
          </p>
        </div>
      )}
    </div>
  );
};

export default ShopExchangesPage;
