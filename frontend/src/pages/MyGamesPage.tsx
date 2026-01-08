import { useState, useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import { gamesAPI, favoritesAPI } from '../services/api'
import { Trophy, Clock, CheckCircle, Heart } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import GameCard from '../components/GameCard'
import { usePullToRefresh } from '../hooks/usePullToRefresh'
import { PullToRefreshIndicator } from '../components/PullToRefreshIndicator'

const MyGamesPage = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'all' | 'created' | 'joined' | 'favorites'>('all')
  const [limit, setLimit] = useState(10)
  const observerTarget = useRef<HTMLDivElement>(null)

  // 下拉刷新
  const pullToRefresh = usePullToRefresh({
    refreshQueries: [
      ['my-games', activeTab, String(limit)]
    ]
  })

  const { data: games, isLoading } = useQuery(
    ['my-games', activeTab, limit],
    () => {
      if (activeTab === 'favorites') {
        return favoritesAPI.getMyFavorites(1, limit)
      }
      return gamesAPI.getMyGames(activeTab)
    },
    {
      select: (response) => {
        if (activeTab === 'favorites') {
          // favorites API 返回的数据结构是 { favorites: [...], total: number }
          return response.data.favorites.map((fav: any) => fav.game)
        }
        return response.data
      },
    }
  )

  // 当切换标签时重置limit
  useEffect(() => {
    setLimit(10)
  }, [activeTab])

  // 无限滚动 - 使用 Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && games && games.length > limit) {
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
  }, [games, limit])

  const tabs = [
    { key: 'all', label: t('myGames.tabs.all'), icon: Trophy },
    { key: 'created', label: t('myGames.tabs.created'), icon: Clock },
    { key: 'joined', label: t('myGames.tabs.joined'), icon: CheckCircle },
    { key: 'favorites', label: t('myGames.tabs.favorites'), icon: Heart },
  ]

  return (
    <div className="space-y-6">
      {/* 下拉刷新指示器 */}
      <PullToRefreshIndicator {...pullToRefresh} />

      {/* 头部 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('myGames.title')}</h1>
        <p className="text-gray-600 mt-1">{t('myGames.subtitle')}</p>
      </div>

      {/* 标签页 */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
              activeTab === key
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* 游戏列表 */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : games && games.length > 0 ? (
          <>
            {games.slice(0, limit).map((game: any) => (
              <GameCard key={game.id} game={game} />
            ))}

            {/* 无限滚动触发器 */}
            {games.length > limit && (
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
              {activeTab === 'created' ? t('myGames.empty.created.title') :
               activeTab === 'joined' ? t('myGames.empty.joined.title') :
               activeTab === 'favorites' ? t('myGames.empty.favorites.title') : t('myGames.empty.all.title')}
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'created' ? t('myGames.empty.created.description') :
               activeTab === 'joined' ? t('myGames.empty.joined.description') :
               activeTab === 'favorites' ? t('myGames.empty.favorites.description') : t('myGames.empty.all.description')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyGamesPage
