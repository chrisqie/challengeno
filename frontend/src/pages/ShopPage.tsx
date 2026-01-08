import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Coins,
  Star,
  Gift,
  Filter,
  ArrowLeft,
  Trophy,
  Crown,
  Heart,
  Zap
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { shopAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  image?: string;
  category: string;
  pointType: string;
  pointCost: number;
  stock: number;
  isActive: boolean;
}

interface PointsBalance {
  participationPoints: number;
  trustPoints: number;
  laborPoints: number;
  total: number;
}

const ShopPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [pointsBalance, setPointsBalance] = useState<PointsBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [exchanging, setExchanging] = useState<string | null>(null);

  // 加载数据
  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsRes, categoriesRes, balanceRes] = await Promise.all([
        shopAPI.getItems(selectedCategory),
        shopAPI.getCategories(),
        shopAPI.getPointsBalance(),
      ]);

      setItems(itemsRes.data.items || []);
      setCategories(categoriesRes.data.categories || []);
      setPointsBalance(balanceRes.data);
    } catch (error: any) {
      console.error('Failed to load shop data:', error);
      toast.error(t('shop.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  // 兑换商品
  const handleExchange = async (item: ShopItem) => {
    if (!pointsBalance) return;

    // 检查积分是否足够
    let userPoints = 0;
    switch (item.pointType) {
      case 'PARTICIPATION':
        userPoints = pointsBalance.participationPoints;
        break;
      case 'TRUST':
        userPoints = pointsBalance.trustPoints;
        break;
      case 'LABOR':
        userPoints = pointsBalance.laborPoints;
        break;
    }

    if (userPoints < item.pointCost) {
      toast.error(t('shop.insufficientPoints'));
      return;
    }

    if (item.stock === 0) {
      toast.error(t('shop.outOfStock'));
      return;
    }

    try {
      setExchanging(item.id);
      await shopAPI.exchangeItem(item.id);
      toast.success(t('shop.exchangeSuccess'));

      // 刷新数据
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('shop.exchangeFailed'));
    } finally {
      setExchanging(null);
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
        return <Coins className="w-4 h-4 text-gray-500" />;
    }
  };

  // 获取积分类型名称
  const getPointTypeName = (pointType: string) => {
    switch (pointType) {
      case 'PARTICIPATION': return t('shop.pointTypes.participation');
      case 'TRUST': return t('shop.pointTypes.trust');
      case 'LABOR': return t('shop.pointTypes.labor');
      default: return t('shop.pointTypes.points');
    }
  };

  // 获取分类图标
  const getCategoryIcon = (category: string) => {
    const upperCategory = category.toUpperCase();
    switch (upperCategory) {
      case 'VIRTUAL': return <Zap className="w-5 h-5" />;
      case 'PHYSICAL': return <Gift className="w-5 h-5" />;
      case 'VIP': return <Crown className="w-5 h-5" />;
      case 'PRIVILEGE': return <Star className="w-5 h-5" />;
      default: return <ShoppingBag className="w-5 h-5" />;
    }
  };

  // 获取分类名称翻译
  const getCategoryName = (category: string) => {
    const upperCategory = category.toUpperCase();
    switch (upperCategory) {
      case 'VIRTUAL': return t('shop.categories.virtual');
      case 'PHYSICAL': return t('shop.categories.physical');
      case 'VIP': return t('shop.categories.vip');
      case 'PRIVILEGE': return t('shop.categories.privilege');
      default: return category;
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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <ShoppingBag className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('shop.title')}</h1>
            <p className="text-sm text-gray-500">{t('shop.subtitle')}</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/shop/exchanges')}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t('shop.exchangeHistory')}</span>
        </button>
      </div>

      {/* 积分余额 */}
      {pointsBalance && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('shop.myPoints')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <Trophy className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{t('shop.pointTypes.participation')}</p>
              <p className="text-2xl font-bold text-blue-600">{pointsBalance.participationPoints}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{t('shop.pointTypes.trust')}</p>
              <p className="text-2xl font-bold text-red-600">{pointsBalance.trustPoints}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{t('shop.pointTypes.labor')}</p>
              <p className="text-2xl font-bold text-yellow-600">{pointsBalance.laborPoints}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <Coins className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{t('shop.pointTypes.total')}</p>
              <p className="text-2xl font-bold text-purple-600">{pointsBalance.total}</p>
            </div>
          </div>
        </div>
      )}

      {/* 分类筛选 */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4 overflow-x-auto">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{t('shop.category')}:</span>
          </div>

          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors flex-shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('shop.all')}</span>
          </button>

          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors flex-shrink-0 ${
                selectedCategory === category.name
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {getCategoryIcon(category.name)}
              <span>{getCategoryName(category.name)}</span>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 商品列表 */}
      {items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('shop.noItems')}</h3>
          <p className="text-gray-500">{t('shop.noItemsInCategory')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              {/* 商品图片 */}
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-t-lg">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center h-48">
                    <Gift className="w-16 h-16 text-gray-300" />
                  </div>
                )}
              </div>

              {/* 商品信息 */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                {/* 价格和库存 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getPointTypeIcon(item.pointType)}
                    <span className="font-bold text-lg">{item.pointCost}</span>
                    <span className="text-sm text-gray-500">{getPointTypeName(item.pointType)}</span>
                  </div>

                  {item.stock !== -1 && (
                    <span className="text-sm text-gray-500">
                      {t('shop.stock')}: {item.stock}
                    </span>
                  )}
                </div>

                {/* 兑换按钮 */}
                <button
                  onClick={() => handleExchange(item)}
                  disabled={exchanging === item.id || item.stock === 0}
                  className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {exchanging === item.id ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{item.stock === 0 ? t('shop.soldOut') : t('shop.exchangeNow')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
