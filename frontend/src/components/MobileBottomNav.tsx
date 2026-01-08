import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  GamepadIcon, 
  ShoppingBag, 
  Bell, 
  User,
  Plus,
  Users,
  Settings
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  // 检查是否为移动端
  const isMobile = window.innerWidth < 768;
  
  // 如果不是移动端或用户未登录，不显示底部导航
  if (!isMobile || !user) {
    return null;
  }

  const navItems = [
    {
      id: 'home',
      label: '首页',
      icon: Home,
      path: '/',
      active: location.pathname === '/'
    },
    {
      id: 'games',
      label: '游戏',
      icon: GamepadIcon,
      path: '/games',
      active: location.pathname.startsWith('/games')
    },
    {
      id: 'create',
      label: '创建',
      icon: Plus,
      path: '/create-wizard',
      active: location.pathname === '/create-wizard',
      special: true // 特殊样式的按钮
    },
    {
      id: 'shop',
      label: '商城',
      icon: ShoppingBag,
      path: '/shop',
      active: location.pathname.startsWith('/shop')
    },
    {
      id: 'profile',
      label: '我的',
      icon: User,
      path: '/profile',
      active: location.pathname === '/profile'
    }
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.special) {
            // 特殊的创建按钮
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className="flex flex-col items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg transform transition-transform active:scale-95"
              >
                <Icon className="w-6 h-6" />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-col items-center justify-center min-w-[60px] py-2 px-1 transition-colors ${
                item.active
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${item.active ? 'text-primary-600' : ''}`} />
                
                {/* 通知徽章 */}
                {item.id === 'notifications' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              
              <span className={`text-xs mt-1 ${
                item.active ? 'text-primary-600 font-medium' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
