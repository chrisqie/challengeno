import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import { gamesAPI } from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { Filter, Star, Users, Calendar, Trophy, User, Cloud, Settings, MapPin, Zap } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import GameCard from '../components/GameCard'
import VipUsageStats from '../components/VipUsageStats'
import Breadcrumb from '../components/Breadcrumb'
import { usePullToRefresh } from '../hooks/usePullToRefresh'
import { PullToRefreshIndicator } from '../components/PullToRefreshIndicator'
// import PointsDisplay from '../components/PointsDisplay'
import { getCategoryPath } from '../config/categories'
import { getCategoryName, getSubcategoryName } from '../utils/categoryTranslation'

const HomePage = () => {
  const { t } = useTranslation()

  // Helper function to translate breadcrumb items
  const getTranslatedCategoryPath = (category: string, subcategory?: string, title?: string) => {
    const path = getCategoryPath(category, subcategory, title);
    return path.map(item => ({
      ...item,
      label: item.categoryId
        ? getCategoryName(item.categoryId)
        : item.subcategoryId
        ? getSubcategoryName(item.subcategoryId)
        : item.label
    }));
  }
  const { user, refreshUser } = useAuthStore()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [category, setCategory] = useState('all')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)
  const [sortBy, setSortBy] = useState('smart')
  const [gameType, setGameType] = useState<'all' | 'individual' | 'team'>('all')
  const [locationFilter, setLocationFilter] = useState<'all' | 'local' | 'tough'>('all')
  const [limit, setLimit] = useState(10) // 初始显示10个游戏
  const searchQuery = searchParams.get('search') || ''
  const observerTarget = useRef<HTMLDivElement>(null)

  // 下拉刷新
  const pullToRefresh = usePullToRefresh({
    refreshQueries: [
      ['games', filter, category, searchQuery, sortBy, gameType, locationFilter, String(limit)]
    ]
  })

  // 实时更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 定期刷新用户积分数据
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        refreshUser()
      }, 60000) // 每分钟刷新一次

      return () => clearInterval(interval)
    }
  }, [user, refreshUser])

  const { data: gamesData, isLoading } = useQuery(
    ['games', filter, category, searchQuery, sortBy, gameType, locationFilter, limit],
    () => {
      // 将前端的filter映射到后端的参数
      const params: any = { category, limit }

      if (filter === 'open') {
        params.status = 'open'
      } else if (filter === 'featured') {
        params.featured = true
      } else if (filter === 'in_progress') {
        params.status = 'in_progress'
      } else if (filter === 'peer_review') {
        params.status = 'peer_review'
      } else if (filter === 'completed') {
        params.status = 'completed'
      } else if (filter === 'expired') {
        params.status = 'completed'
      }
      // 'all' 不添加任何状态过滤，显示所有游戏

      // 添加搜索参数
      if (searchQuery) {
        params.search = searchQuery
      }

      // 添加游戏类型筛选
      if (gameType === 'team') {
        params.isTeamGame = true
      } else if (gameType === 'individual') {
        params.isTeamGame = false
      }

      // 添加排序参数
      params.sortBy = sortBy

      // 地理位置和难度过滤
      if (locationFilter === 'local') {
        params.locationFilter = 'local'
        params.maxDistance = 50 // 50公里内
      } else if (locationFilter === 'tough') {
        params.locationFilter = 'tough'
        // tough表示艰难挑战：持续时间长、参与人数多、困难类别
      }

      // 'all' 不需要特殊处理，会显示默认的开放和进行中的游戏

      return gamesAPI.getGames(params)
    },
    {
      select: (response) => response.data,
    }
  )

  const categories = [
    { value: 'all', label: t('home.categories.all'), icon: Star },
    { value: 'HEALTH', label: t('home.categories.health'), icon: Trophy },
    { value: 'FITNESS', label: t('home.categories.fitness'), icon: Users },
    { value: 'LEARNING', label: t('home.categories.learning'), icon: Calendar },
    { value: 'PERSONAL', label: t('home.categories.personal'), icon: User },
    { value: 'WEATHER', label: t('home.categories.weather'), icon: Cloud },
    { value: 'CUSTOM', label: t('home.categories.custom'), icon: Settings },
  ]

  const filters = [
    { value: 'all', label: t('home.filters.all') },
    { value: 'open', label: t('home.filters.open') },
    { value: 'featured', label: t('home.filters.featured') },
    { value: 'in_progress', label: t('home.filters.inProgress') },
    { value: 'peer_review', label: t('home.filters.peerReview') },
    { value: 'completed', label: t('home.filters.completed') },
  ]

  const locationFilters = [
    { value: 'all', label: t('home.location.all'), icon: null },
    { value: 'local', label: t('home.location.local'), icon: MapPin, description: t('home.location.localDesc') },
    { value: 'tough', label: t('home.location.tough'), icon: Zap, description: t('home.location.toughDesc') },
  ]

  // 无限滚动 - 使用 Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && gamesData && gamesData.length >= limit) {
          setLimit(prev => prev + 10)
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [gamesData, limit])

  return (
    <div className="space-y-6">
      {/* 下拉刷新指示器 */}
      <PullToRefreshIndicator {...pullToRefresh} />

      {/* Welcome Area - Only visible to logged-in users */}
      {user && (
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('home.welcomeBack', { name: user.fullName })}
              </h1>
              <p className="text-gray-600 mt-1">
                {t('home.discoverChallenges')}
              </p>
            </div>
            <div className="text-right">
              {/* Real-time clock - Date only */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                <div className="text-sm text-blue-600 text-center">
                  {currentTime.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    weekday: 'short'
                  }).replace(/\//g, '.')}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {user.totalGamesCreated}
              </div>
              <div className="text-sm text-gray-500">{t('home.challengesCreated')}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {user.totalGamesJoined}
              </div>
              <div className="text-sm text-gray-500">{t('home.challengesJoined')}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {user.gamesCompleted}
              </div>
              <div className="text-sm text-gray-500">{t('home.challengesCompleted')}</div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/achievements')}
              className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 hover:from-yellow-100 hover:to-orange-100 transition-colors"
            >
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">{t('home.myAchievements')}</span>
            </button>
            <button
              onClick={() => navigate('/referral')}
              className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-colors"
            >
              <User className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">{t('home.inviteFriends')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Guest Welcome Area */}
      {!user && (
        <div className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('home.welcomeGuest')}
            </h1>
            <p className="text-gray-600 mb-6">
              {t('home.subtitle')}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t('home.signUpNow')}
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors font-medium"
              >
                {t('home.logIn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIP Usage Stats - Only visible to logged-in users */}
      {user && <VipUsageStats />}

      {/* Search Results Hint */}
      {searchQuery && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            {t('home.searchResults')}: <span className="font-medium">"{searchQuery}"</span>
            {gamesData && <span className="ml-2">({gamesData.length} {t('home.results')})</span>}
          </p>
        </div>
      )}

      {/* 筛选器 */}
      <div className="space-y-4">
        {/* 分类筛选 */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                category === value
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* 状态筛选 */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {filters.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === value
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            className="flex items-center space-x-1 text-gray-600 hover:text-primary-600"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">{t('common.filter')}</span>
          </button>
        </div>

        {/* Location Filter */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-800 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {t('home.location.title')}
            </h3>
            <div className="text-xs text-blue-600">
              {t('home.location.subtitle')}
            </div>
          </div>
          <div className="flex space-x-2">
            {locationFilters.map(({ value, label, icon: Icon, description }) => (
              <button
                key={value}
                onClick={() => setLocationFilter(value as 'all' | 'local' | 'tough')}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  locationFilter === value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-blue-700 hover:bg-blue-100 border border-blue-200'
                }`}
                title={description}
              >
                {Icon && <Icon className="w-3 h-3" />}
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filter Panel */}
        {showAdvancedFilter && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-700 mb-3">{t('home.advanced.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('home.advanced.sortBy')}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="smart">{t('home.advanced.smartSort')}</option>
                  <option value="newest">{t('home.advanced.newest')}</option>
                  <option value="featured">{t('home.advanced.featured')}</option>
                  <option value="ending_soon">{t('home.advanced.startingSoon')}</option>
                  <option value="oldest">{t('home.advanced.oldest')}</option>
                  <option value="most_participants">{t('home.advanced.mostParticipants')}</option>
                  <option value="least_participants">{t('home.advanced.leastParticipants')}</option>
                </select>
                {sortBy === 'smart' && (
                  <p className="text-xs text-gray-500 mt-1">
                    {t('home.advanced.smartSortHint')}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('home.advanced.gameType')}</label>
                <select
                  value={gameType}
                  onChange={(e) => setGameType(e.target.value as 'all' | 'individual' | 'team')}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">{t('home.advanced.allGames')}</option>
                  <option value="individual">{t('home.advanced.individualChallenge')}</option>
                  <option value="team">{t('home.advanced.teamGame')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('home.advanced.quickFilters')}</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setFilter('open')
                      setCategory('all')
                    }}
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                  >
                    {t('home.advanced.available')}
                  </button>
                  <button
                    onClick={() => {
                      setFilter('all')
                      setCategory('HEALTH')
                    }}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {t('home.advanced.healthChallenges')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Challenge List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : gamesData && gamesData.length > 0 ? (
          <>
            {gamesData.map((game: any) => (
              <div key={game.id} className="space-y-2">
                {/* Breadcrumb Navigation */}
                <Breadcrumb
                  items={getTranslatedCategoryPath(game.category, game.subcategory, game.title)}
                  className="px-4"
                />
                <GameCard game={game} />
              </div>
            ))}

            {/* Infinite Scroll Trigger */}
            {gamesData.length >= limit && (
              <div ref={observerTarget} className="flex justify-center py-6">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('home.noChallenges')}
            </h3>
            <p className="text-gray-500 mb-4">
              {t('home.noChallengesDesc')}
            </p>
            <Link to="/create-wizard" className="btn-primary">
              {t('home.advanced.createChallenge')}
            </Link>
          </div>
        )}
      </div>

      {/* Floating Create Button */}
      <Link
        to="/create-wizard"
        className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </div>
  )
}

export default HomePage
