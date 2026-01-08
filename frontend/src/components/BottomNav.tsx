import { NavLink } from 'react-router-dom'
import { Home, Plus, Trophy, User, Users } from 'lucide-react'
import { useQuery } from 'react-query'
import { messagesAPI, friendsAPI } from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { cn } from '../utils/cn'
import { useTranslation } from 'react-i18next'

const BottomNav = () => {
  const { user } = useAuthStore()
  const { t } = useTranslation()

  // 只在登录状态下获取未读消息数
  const { data: unreadData } = useQuery(
    'unreadMessagesCount',
    () => messagesAPI.getUnreadCount(),
    {
      enabled: !!user, // 只在登录时启用
      refetchInterval: 10000, // 每10秒刷新一次
      select: (response) => response.data,
    }
  )

  // 只在登录状态下获取待处理好友请求数
  const { data: pendingRequestsData } = useQuery(
    'pendingFriendRequests',
    () => friendsAPI.getPendingRequests(),
    {
      enabled: !!user, // 只在登录时启用
      refetchInterval: 10000, // 每10秒刷新一次
      select: (response) => response.data,
    }
  )

  const unreadCount = unreadData?.count || 0
  const pendingRequestsCount = pendingRequestsData?.length || 0
  const totalBadgeCount = unreadCount + pendingRequestsCount

  // 匿名用户不显示底部导航
  if (!user) {
    return null
  }

  const navItems = [
    { to: '/', icon: Home, label: t('bottomNav.home') },
    { to: '/create-wizard', icon: Plus, label: t('bottomNav.create') },
    { to: '/my-games', icon: Trophy, label: t('bottomNav.myGames') },
    { to: '/friends', icon: Users, label: t('bottomNav.friends'), badge: totalBadgeCount },
    { to: '/profile', icon: User, label: t('bottomNav.profile') },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-colors min-w-[60px]',
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative inline-flex items-center justify-center">
                    <Icon className={cn('w-5 h-5', isActive && 'scale-110')} />
                    {badge && badge > 0 && (
                      <span className="absolute -top-1 -right-3 bg-red-500 text-white text-[10px] rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1 font-medium shadow-sm">
                        {badge > 99 ? '99+' : badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default BottomNav
