import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import { useThemeStore } from '../stores/themeStore'
import { Bell, Search, Menu, Clock, Crown, ShoppingBag, Trophy, Users, Settings, Gift, LogIn, UserPlus, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { notificationsAPI } from '../services/api'
import { LOGO } from '../config/cdn'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslation } from 'react-i18next'

const Navbar = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()
  const { unreadCount, setUnreadCount } = useNotificationStore()
  const { isDarkMode, toggleDarkMode } = useThemeStore()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showMenu && !target.closest('.user-menu-container')) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu])

  // 获取未读通知数量
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await notificationsAPI.getUnreadCount()
        setUnreadCount(response.data?.count || 0)
      } catch (error) {
        // 静默处理错误
      }
    }

    if (user) {
      fetchUnreadCount()
      // 每30秒更新一次未读数量
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user, setUnreadCount])

  // 实时更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 处理搜索
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`)
      setShowMobileSearch(false)
    }
  }

  // 处理搜索输入
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img
              src={LOGO.horizontal}
              alt="ChallengeNo"
              className="h-10"
              style={{ width: 'auto' }}
            />
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder={t('nav.search')}
                className="w-full pl-10 pr-12 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-primary-600 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* 右侧操作 */}
          <div className="flex items-center space-x-3">
            {/* 语言切换器 */}
            <LanguageSwitcher />

            {/* 明暗模式切换 */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              title={isDarkMode ? t('nav.lightMode') : t('nav.darkMode')}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* 移动端搜索按钮 */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* 实时时钟 - 移动端显示秒数 */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="font-mono text-sm text-blue-800 font-medium">
                {/* 移动端显示秒数 */}
                <span className="sm:hidden">
                  {currentTime.toLocaleTimeString('zh-CN', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
                {/* 桌面端不显示秒数 */}
                <span className="hidden sm:inline">
                  {currentTime.toLocaleTimeString('zh-CN', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </span>
            </div>

            {/* Not Logged In - Show Login/Register Buttons */}
            {!user && (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  {t('nav.login')}
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <UserPlus className="w-4 h-4" />
                  {t('nav.register')}
                </button>
                {/* Mobile Merged Button */}
                <button
                  onClick={() => navigate('/login')}
                  className="sm:hidden p-2 text-blue-600 hover:text-blue-700 transition-colors"
                  title={t('nav.login')}
                >
                  <LogIn className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Logged In - Show Feature Buttons and User Menu */}
            {user && (
              <>
                {/* Achievements */}
                <button
                  onClick={() => navigate('/achievements')}
                  className="p-2 text-orange-600 hover:text-orange-700 transition-colors"
                  title={t('nav.achievementsTitle')}
                >
                  <Trophy className="w-5 h-5" />
                </button>

                {/* Shop */}
                <button
                  onClick={() => navigate('/shop')}
                  className="p-2 text-purple-600 hover:text-purple-700 transition-colors"
                  title={t('nav.shopTitle')}
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>

                {/* Teams */}
                <button
                  onClick={() => navigate('/teams')}
                  className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                  title={t('nav.teamsTitle')}
                >
                  <Users className="w-5 h-5" />
                </button>

                {/* VIP */}
                <button
                  onClick={() => navigate('/vip')}
                  className="relative p-2 text-yellow-600 hover:text-yellow-700 transition-colors"
                  title={t('nav.vipTitle')}
                >
                  <Crown className="w-5 h-5" />
                  {user?.isVip && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"></span>
                  )}
                </button>

                {/* Settings */}
                <button
                  onClick={() => navigate('/settings')}
                  className="p-2 text-gray-600 hover:text-gray-700 transition-colors"
                  title={t('nav.settings')}
                >
                  <Settings className="w-5 h-5" />
                </button>

                {/* Notifications */}
                <button
                  onClick={() => navigate('/notifications')}
                  className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
                  title={t('nav.notificationsTitle')}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* User Menu */}
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user?.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <Menu className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* Dropdown Menu */}
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <div className="flex items-center">
                          <p className="font-medium text-gray-900">{user?.fullName}</p>
                          {user?.isVip && (
                            <Crown className="w-4 h-4 text-yellow-500 ml-2" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">@{user?.username}</p>
                      </div>

                      <button
                        onClick={() => {
                          navigate('/achievements')
                          setShowMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        {t('nav.achievements')}
                      </button>

                      <button
                        onClick={() => {
                          navigate('/referral')
                          setShowMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        {t('nav.referral')}
                      </button>

                      <button
                        onClick={() => {
                          navigate('/enhanced-profile')
                          setShowMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        {t('nav.myProfile')}
                      </button>

                      <button
                        onClick={() => {
                          logout()
                          setShowMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Box */}
      {showMobileSearch && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              placeholder={t('nav.search')}
              className="w-full pl-10 pr-12 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-primary-600 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </nav>
  )
}

export default Navbar
