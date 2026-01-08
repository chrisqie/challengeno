import { Link } from 'react-router-dom'
import { Users, Calendar, Trophy, Clock, Share2, MapPin, Heart } from 'lucide-react'
import { cn } from '../utils/cn'
import { TimeUtil } from '../utils/time'
import VipBadge from './VipBadge'
import { UserDisplay } from './UserDisplay'
import { referralAPI, favoritesAPI } from '../services/api'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useAuthStore } from '../stores/authStore'
import { useTranslation } from 'react-i18next'

interface GameCardProps {
  game: {
    id: string
    title: string
    description: string
    category: string
    stakeDescription?: string
    maxParticipants: number
    currentParticipants: number
    startDate: string
    endDate: string
    evidenceDeadline: string
    status: string
    visibility?: string
    isTeamGame?: boolean
    teamMode?: string
    maxTeams?: number
    // 收藏相关字段
    favoritesCount?: number
    isFavorited?: boolean
    // 地理位置相关字段
    locationRestriction?: 'NONE' | 'LOCAL' | 'CUSTOM'
    maxDistance?: number
    customLocation?: string
    distance?: number // 与当前用户的距离（km）
    // 创建者IP位置信息（优先显示）
    creatorIpLocation?: string
    creatorIpCountry?: string
    creatorIpCity?: string
    creator: {
      username: string
      trustPoints: number
      isVip?: boolean
      isDeleted?: boolean
      // 创建者个人资料位置信息（备用）
      country?: string
      countryCode?: string
      city?: string
    }
  }
}

const GameCard = ({ game }: GameCardProps) => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [isFavorited, setIsFavorited] = useState(game.isFavorited || false)
  const [favoritesCount, setFavoritesCount] = useState(game.favoritesCount || 0)

  // 收藏/取消收藏 mutation
  const favoriteMutation = useMutation(
    (gameId: string) => favoritesAPI.favoriteGame(gameId),
    {
      onSuccess: () => {
        setIsFavorited(true)
        setFavoritesCount(prev => prev + 1)
        toast.success('收藏成功')
        // 刷新相关查询
        queryClient.invalidateQueries('games')
        queryClient.invalidateQueries('my-games')
        queryClient.invalidateQueries('my-favorites')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '收藏失败')
      },
    }
  )

  const unfavoriteMutation = useMutation(
    (gameId: string) => favoritesAPI.unfavoriteGame(gameId),
    {
      onSuccess: () => {
        setIsFavorited(false)
        setFavoritesCount(prev => Math.max(0, prev - 1))
        toast.success('已取消收藏')
        // 刷新相关查询
        queryClient.invalidateQueries('games')
        queryClient.invalidateQueries('my-games')
        queryClient.invalidateQueries('my-favorites')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '取消收藏失败')
      },
    }
  )

  // 处理收藏/取消收藏
  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault() // 阻止Link导航
    e.stopPropagation()

    if (!user) {
      toast.error('请先登录')
      return
    }

    if (isFavorited) {
      unfavoriteMutation.mutate(game.id)
    } else {
      favoriteMutation.mutate(game.id)
    }
  }

  // 复制到剪贴板的通用函数
  const copyToClipboard = async (text: string) => {
    try {
      // 优先使用现代剪贴板API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      // 降级方案：使用传统方法
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      return successful;
    } catch (err) {
      console.error('复制失败:', err);
      return false;
    }
  };

  // 分享游戏
  const shareGame = async (e: React.MouseEvent) => {
    e.preventDefault(); // 阻止Link导航
    e.stopPropagation();

    try {
      const response = await referralAPI.generateShareLink({
        type: 'game',
        targetId: game.id
      });
      const shareLink = response.data.shareLink;

      const success = await copyToClipboard(shareLink);
      if (success) {
        toast.success('游戏分享链接已复制！');
      } else {
        toast.error('复制失败，请重试');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || '分享失败，请先生成推荐码');
    }
  };

  // 分享成就（仅完成的游戏显示）
  const shareAchievement = async (e: React.MouseEvent) => {
    e.preventDefault(); // 阻止Link导航
    e.stopPropagation();

    try {
      const response = await referralAPI.generateShareLink({
        type: 'achievement',
        targetId: game.id
      });
      const shareLink = response.data.shareLink;

      const success = await copyToClipboard(shareLink);
      if (success) {
        toast.success('成就分享链接已复制！');
      } else {
        toast.error('复制失败，请重试');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || '分享失败，请先生成推荐码');
    }
  };

  // 获取游戏的实际状态（优先检查数据库状态，然后基于时间计算）
  const getActualGameState = () => {
    // 1. 优先检查特殊状态（这些状态不受时间影响）
    if (game.status === 'CLOSED') {
      return { phase: 'CLOSED', canJoin: false }
    }

    if (game.status === 'DISPUTED') {
      return { phase: 'DISPUTED', canJoin: false }
    }

    if (game.status === 'COMPLETED') {
      return { phase: 'COMPLETED', canJoin: false }
    }

    // 2. 基于时间计算其他状态
    const now = new Date()
    const startDate = new Date(game.startDate)
    const endDate = new Date(game.endDate)
    const evidenceDeadline = new Date(game.evidenceDeadline)

    // 计算互评截止时间（证据截止后48小时）
    const peerReviewDeadline = new Date(evidenceDeadline.getTime() + 48 * 60 * 60 * 1000)

    if (now < startDate) {
      return { phase: 'OPEN', canJoin: true }
    } else if (now >= startDate && now < endDate) {
      return { phase: 'IN_PROGRESS', canJoin: false }
    } else if (now >= endDate && now < evidenceDeadline) {
      return { phase: 'EVIDENCE_SUBMISSION', canJoin: false }
    } else if (now >= evidenceDeadline && now < peerReviewDeadline) {
      return { phase: 'PEER_REVIEW', canJoin: false }
    } else {
      return { phase: 'COMPLETED', canJoin: false }
    }
  }

  const actualState = getActualGameState()

  const getStatusColor = (status: string) => {
    // 使用实际状态而不是数据库状态
    const phase = actualState.phase

    switch (phase) {
      case 'OPEN':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'EVIDENCE_SUBMISSION':
        return 'bg-orange-100 text-orange-800'
      case 'PEER_REVIEW':
        return 'bg-purple-100 text-purple-800'
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800'
      case 'DISPUTED':
        return 'bg-yellow-100 text-yellow-800'
      case 'CLOSED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    // 使用实际状态而不是数据库状态
    const phase = actualState.phase

    switch (phase) {
      case 'OPEN':
        return t('game.status.open')
      case 'IN_PROGRESS':
        return t('game.status.inProgress')
      case 'EVIDENCE_SUBMISSION':
        return t('game.status.evidenceSubmission')
      case 'PEER_REVIEW':
        return t('game.status.peerReview')
      case 'COMPLETED':
        return t('game.status.completed')
      case 'DISPUTED':
        return t('game.status.disputed')
      case 'CLOSED':
        return t('game.status.closed')
      default:
        return t('game.status.unknown')
    }
  }

  // 获取详细的状态描述
  const getDetailedStatusText = () => {
    const phase = actualState.phase

    switch (phase) {
      case 'OPEN':
        return t('game.status.open')
      case 'IN_PROGRESS':
        return t('game.status.inProgress')
      case 'EVIDENCE_SUBMISSION':
        return t('game.status.evidenceSubmission')
      case 'PEER_REVIEW':
        return t('game.status.peerReview')
      case 'COMPLETED':
        return t('game.status.completed')
      case 'DISPUTED':
        return t('game.status.disputed')
      case 'CLOSED':
        return t('game.status.closed')
      default:
        return t('game.status.completed')
    }
  }

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'FRIENDS_ONLY':
        return 'bg-blue-100 text-blue-800'
      case 'PRIVATE':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-green-100 text-green-800'
    }
  }

  const getVisibilityText = (visibility: string) => {
    switch (visibility) {
      case 'FRIENDS_ONLY':
        return t('game.visibility.friendsOnly')
      case 'PRIVATE':
        return t('game.visibility.private')
      default:
        return t('game.visibility.public')
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'HEALTH':
        return '🏥'
      case 'FITNESS':
        return '💪'
      case 'LEARNING':
        return '📚'
      case 'WEATHER':
        return '🌤️'
      default:
        return '🎯'
    }
  }

  const formatDate = (dateString: string) => {
    return TimeUtil.formatDate(dateString)
  }



  const timeUntilStart = () => {
    return TimeUtil.formatTimeUntil(game.startDate)
  }

  return (
    <Link to={`/game/${game.id}`} className="block">
      <div className="card p-4 hover:scale-[1.02] transition-all duration-300">
        {/* 头部信息 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getCategoryIcon(game.category)}</span>
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-1">
                {game.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <span>@<UserDisplay username={game.creator.username} isDeleted={game.creator.isDeleted} showDeletedLabel={false} /></span>
                {game.creator.isVip && (
                  <VipBadge size="sm" className="ml-1" />
                )}
                <span className="ml-1">· {t('game.trustLevel')} {game.creator.trustPoints}</span>
                {/* 创建者位置信息 - 优先显示自定义位置，然后IP位置 */}
                {(() => {
                  // 如果是自定义位置限制，优先显示自定义位置
                  if (game.locationRestriction === 'CUSTOM' && game.customLocation) {
                    return (
                      <span className="ml-2 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-purple-400" />
                        <span className="text-purple-600">
                          {game.customLocation}
                        </span>
                      </span>
                    );
                  }
                  // 其次显示IP位置
                  if (game.creatorIpCity || game.creatorIpCountry) {
                    return (
                      <span className="ml-2 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">
                          {game.creatorIpCity && game.creatorIpCountry
                            ? `${game.creatorIpCity} ${game.creatorIpCountry}`
                            : game.creatorIpCity || game.creatorIpCountry
                          }
                        </span>
                      </span>
                    );
                  }
                  // 备用：显示个人资料位置
                  if (game.creator.city || game.creator.country) {
                    return (
                      <span className="ml-2 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">
                          {game.creator.city && game.creator.country
                            ? `${game.creator.city} ${game.creator.country}`
                            : game.creator.city || game.creator.country
                          }
                        </span>
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            {/* 可见性标签 */}
            {game.visibility && game.visibility !== 'PUBLIC' && (
              <span
                className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getVisibilityColor(game.visibility)
                )}
              >
                {getVisibilityText(game.visibility)}
              </span>
            )}
            {/* 团队游戏标识 */}
            {game.isTeamGame && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {t('game.teamGame')}
              </span>
            )}
            {/* 状态标签 */}
            <span
              className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                getStatusColor(game.status)
              )}
            >
              {getDetailedStatusText()}
            </span>
          </div>
        </div>

        {/* 描述 */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {game.description}
        </p>

        {/* 赌注信息 */}
        {game.stakeDescription && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">{t('game.stake')}</span>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              {game.stakeDescription}
            </p>
          </div>
        )}

        {/* 底部信息 */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>
                {game.isTeamGame
                  ? `${game.currentParticipants || 0}/${game.maxTeams || '∞'} 团队`
                  : `${game.currentParticipants}/${game.maxParticipants} 人`
                }
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">
                {TimeUtil.toLocalDisplayWithTimezone(game.startDate)}
              </span>
            </div>
            {game.isTeamGame && game.teamMode && (
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4" />
                <span>
                  {game.teamMode === 'TEAM_VS_TEAM' ? t('game.teamMode.teamVsTeam') :
                   game.teamMode === 'COLLABORATIVE' ? t('game.teamMode.collaborative') : t('game.teamMode.challenge')}
                </span>
              </div>
            )}
            {/* 距离显示 */}
            {game.distance !== undefined && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>
                  {game.distance < 1 ? '<1km' :
                   game.distance < 10 ? `${game.distance.toFixed(1)}km` :
                   `${Math.round(game.distance)}km`}
                </span>
              </div>
            )}

          </div>
          
          {game.status === 'OPEN' && (
            <div className="flex items-center space-x-1 text-primary-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                {timeUntilStart()}
              </span>
            </div>
          )}
        </div>

        {/* 进度条 */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{t('game.participationProgress')}</span>
            <span>
              {Math.round((game.currentParticipants / game.maxParticipants) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(game.currentParticipants / game.maxParticipants) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* 收藏和分享按钮 */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* 收藏按钮 */}
            <button
              onClick={handleFavorite}
              className={`flex items-center space-x-1 px-2 py-1 text-xs rounded transition-colors ${
                isFavorited
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              title={isFavorited ? '取消收藏' : '收藏游戏'}
            >
              <Heart className={`w-3 h-3 ${isFavorited ? 'fill-current' : ''}`} />
              <span>{favoritesCount || 0}</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={shareGame}
              className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
              title="分享游戏"
            >
              <Share2 className="w-3 h-3" />
              <span>游戏</span>
            </button>
            {game.status === 'COMPLETED' && (
              <button
                onClick={shareAchievement}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                title="分享成就"
              >
                <Trophy className="w-3 h-3" />
                <span>成就</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default GameCard
