import { useState, useEffect, useRef } from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { favoritesAPI } from '../services/api'
import { Heart } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import GameCard from '../components/GameCard'

const FavoritesPage = () => {
  const { t } = useTranslation()
  const [limit, setLimit] = useState(10)
  const observerTarget = useRef<HTMLDivElement>(null)

  const { data: favoritesData, isLoading } = useQuery(
    ['my-favorites', limit],
    () => favoritesAPI.getMyFavorites(1, limit),
    {
      select: (response) => response.data,
    }
  )

  const games = favoritesData?.favorites?.map((fav: any) => fav.game) || []

  // 无限滚动 - 使用 Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && favoritesData && favoritesData.total > limit) {
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
  }, [favoritesData, limit])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('favorites.title')}</h1>
        <p className="text-gray-600 mt-1">{t('favorites.subtitle')}</p>
      </div>

      {favoritesData && (
        <div className="card p-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Heart className="w-5 h-5 text-red-500" />
            <span>{t('favorites.totalCount', { count: favoritesData.total })}</span>
          </div>
        </div>
      )}

      {/* 游戏列表 */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : games && games.length > 0 ? (
          <>
            {games.map((game: any) => (
              <GameCard key={game.id} game={game} />
            ))}

            {/* 无限滚动触发器 */}
            {favoritesData?.total > limit && (
              <div ref={observerTarget} className="flex justify-center py-6">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('favorites.empty.title')}
            </h3>
            <p className="text-gray-500 mb-4">
              {t('favorites.empty.description')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FavoritesPage

