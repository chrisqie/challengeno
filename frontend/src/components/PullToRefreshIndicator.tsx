import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface PullToRefreshIndicatorProps {
  isPulling: boolean
  isRefreshing: boolean
  pullDistance: number
  progress: number
}

export const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  isPulling,
  isRefreshing,
  pullDistance,
  progress
}) => {
  const { t } = useTranslation()

  if (!isPulling && !isRefreshing) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center transition-all duration-200"
      style={{
        transform: `translateY(${isPulling ? pullDistance - 60 : isRefreshing ? 0 : -60}px)`,
        opacity: isPulling || isRefreshing ? 1 : 0
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg px-6 py-3 flex items-center gap-3">
        <RefreshCw
          className={`w-5 h-5 text-primary-600 ${isRefreshing ? 'animate-spin' : ''}`}
          style={{
            transform: `rotate(${progress * 360}deg)`
          }}
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isRefreshing ? t('common.refreshing') : t('common.pullToRefresh')}
        </span>
      </div>
    </div>
  )
}

