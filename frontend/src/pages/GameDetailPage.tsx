import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { gamesAPI, referralAPI, disputesAPI, favoritesAPI } from '../services/api'
import { ArrowLeft, Users, Calendar, Trophy, Clock, Share2, User, CheckCircle, XCircle, Eye, Flag, Crown, AlertTriangle, Gavel, MapPin, FileText, MessageSquare, Heart } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import GameParticipationStatus from '../components/GameParticipationStatus'
import GameSettlementModal from '../components/GameSettlementModal'
import Breadcrumb from '../components/Breadcrumb'
import GameConfigDisplay from '../components/GameConfigDisplay'
import { UserDisplay } from '../components/UserDisplay'
import toast from 'react-hot-toast'
import { TimeUtil } from '../utils/time'
import { useAuthStore } from '../stores/authStore'
import { getCategoryPath } from '../config/categories'

const GameDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const [showEvidenceModal, setShowEvidenceModal] = useState<any>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportDescription, setReportDescription] = useState('')
  const [showSettlementModal, setShowSettlementModal] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoritesCount, setFavoritesCount] = useState(0)

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
  const shareGame = async () => {
    try {
      const response = await referralAPI.generateShareLink({
        type: 'game',
        targetId: id
      });
      const shareLink = response.data.shareLink;

      // 复制到剪贴板
      const success = await copyToClipboard(shareLink);
      if (success) {
        toast.success(t('gameDetail.share.copySuccess'));
      } else {
        toast.error(t('gameDetail.share.copyFailed'));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('gameDetail.share.shareFailed'));
    }
  };

  // 分享成就
  const shareAchievement = async () => {
    try {
      const response = await referralAPI.generateShareLink({
        type: 'achievement',
        targetId: id
      });
      const shareLink = response.data.shareLink;

      // 复制到剪贴板
      const success = await copyToClipboard(shareLink);
      if (success) {
        toast.success(t('gameDetail.share.achievementCopySuccess'));
      } else {
        toast.error(t('gameDetail.share.copyFailed'));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('gameDetail.share.shareFailed'));
    }
  };

  const { data: game, isLoading, error, refetch } = useQuery(
    ['game', id],
    () => gamesAPI.getGame(id!),
    {
      select: (response) => response.data,
      enabled: !!id,
      retry: (failureCount, error: any) => {
        // 如果是404错误，不重试
        if (error?.response?.status === 404) {
          return false
        }
        // 其他错误重试最多2次
        return failureCount < 2
      },
      retryDelay: 1000, // 1秒后重试
    }
  )

  // 获取游戏的争议信息
  const { data: disputes } = useQuery(
    ['game-disputes', id],
    () => disputesAPI.getDisputes({ gameId: id }),
    {
      select: (response) => response.data,
      enabled: !!id && (game?.status === 'DISPUTED' || game?.status === 'COMPLETED'),
    }
  )

  const { data: settlement } = useQuery(
    ['gameSettlement', id],
    () => gamesAPI.getGameSettlement(id!),
    {
      select: (response) => response.data,
      enabled: !!id && game?.status === 'COMPLETED',
    }
  )

  const { data: participants } = useQuery(
    ['game-participants', id],
    () => gamesAPI.getGameParticipants(id!),
    {
      select: (response) => response.data,
      enabled: !!id && !!game, // 只要游戏存在就可以查询参与者
      retry: false,
    }
  )

  const { data: allEvaluations } = useQuery(
    ['all-evaluations', id],
    () => gamesAPI.getAllEvaluations(id!),
    {
      select: (response) => response.data,
      enabled: !!id && (game?.status === 'COMPLETED' || game?.status === 'PEER_REVIEW'),
      retry: false,
    }
  )

  // 初始化收藏状态
  useEffect(() => {
    if (game) {
      setIsFavorited(game.isFavorited || false)
      setFavoritesCount(game.favoritesCount || 0)
    }
  }, [game])

  // 收藏/取消收藏 mutation
  const favoriteMutation = useMutation(
    (gameId: string) => favoritesAPI.favoriteGame(gameId),
    {
      onSuccess: () => {
        setIsFavorited(true)
        setFavoritesCount(prev => prev + 1)
        toast.success(t('gameDetail.favorite.favoriteSuccess'))
        queryClient.invalidateQueries(['game', id])
        queryClient.invalidateQueries('games')
        queryClient.invalidateQueries('my-games')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || t('gameDetail.favorite.favoriteFailed'))
      },
    }
  )

  const unfavoriteMutation = useMutation(
    (gameId: string) => favoritesAPI.unfavoriteGame(gameId),
    {
      onSuccess: () => {
        setIsFavorited(false)
        setFavoritesCount(prev => Math.max(0, prev - 1))
        toast.success(t('gameDetail.favorite.unfavoriteSuccess'))
        queryClient.invalidateQueries(['game', id])
        queryClient.invalidateQueries('games')
        queryClient.invalidateQueries('my-games')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || t('gameDetail.favorite.unfavoriteFailed'))
      },
    }
  )

  // 处理收藏/取消收藏
  const handleFavorite = () => {
    if (!user) {
      toast.error(t('gameDetail.favorite.loginRequired'))
      return
    }

    if (isFavorited) {
      unfavoriteMutation.mutate(id!)
    } else {
      favoriteMutation.mutate(id!)
    }
  }

  // 举报游戏mutation
  const reportGameMutation = useMutation(
    (data: { reason: string; description?: string }) => gamesAPI.reportGame(id!, data),
    {
      onSuccess: () => {
        toast.success(t('gameDetail.report.submitSuccess'))
        setShowReportModal(false)
        setReportReason('')
        setReportDescription('')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || t('gameDetail.report.submitFailed'))
      },
    }
  )

  const handleSubmitReport = () => {
    if (!reportReason) {
      toast.error(t('gameDetail.report.selectReason'))
      return
    }

    reportGameMutation.mutate({
      reason: reportReason,
      description: reportDescription || undefined
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    const isNotFound = error?.response?.status === 404
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isNotFound ? t('gameDetail.error.notFound') : t('gameDetail.error.loadFailed')}
        </h3>
        <p className="text-gray-600 mb-4">
          {isNotFound ? t('gameDetail.error.notFoundDesc') : t('gameDetail.error.loadFailedDesc')}
        </p>
        <div className="space-x-4">
          <button onClick={() => navigate('/')} className="btn-primary">
            {t('gameDetail.error.backToHome')}
          </button>
          {!isNotFound && (
            <button onClick={() => window.location.reload()} className="btn-secondary">
              {t('gameDetail.error.reload')}
            </button>
          )}
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('gameDetail.error.challengeNotExist')}</h3>
        <button onClick={() => navigate('/')} className="btn-primary">
          {t('gameDetail.error.backToHome')}
        </button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'EVIDENCE_SUBMISSION':
        return 'bg-yellow-100 text-yellow-800'
      case 'PEER_REVIEW':
        return 'bg-purple-100 text-purple-800'
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800'
      case 'DISPUTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN':
        return t('gameDetail.status.OPEN')
      case 'IN_PROGRESS':
        return t('gameDetail.status.IN_PROGRESS')
      case 'EVIDENCE_SUBMISSION':
        return t('gameDetail.status.EVIDENCE_SUBMISSION')
      case 'PEER_REVIEW':
        return t('gameDetail.status.PEER_REVIEW')
      case 'COMPLETED':
        return t('gameDetail.status.COMPLETED')
      case 'DISPUTED':
        return t('gameDetail.status.DISPUTED')
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    return TimeUtil.toLocalDisplay(dateString)
  }

  // 获取游戏状态文本
  const getGameStatusText = (status: string) => {
    switch (status) {
      case 'OPEN':
        return t('gameDetail.status.openPhase')
      case 'IN_PROGRESS':
        return t('gameDetail.status.inProgressPhase')
      case 'EVIDENCE_SUBMISSION':
        return t('gameDetail.status.evidencePhase')
      case 'PEER_REVIEW':
        return t('gameDetail.status.reviewPhase')
      case 'COMPLETED':
        return t('gameDetail.status.completedPhase')
      case 'DISPUTED':
        return t('gameDetail.status.disputedPhase')
      case 'CLOSED':
        return t('gameDetail.status.closedPhase')
      default:
        return status
    }
  }

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
    const reviewDeadline = game.reviewDeadline ? new Date(game.reviewDeadline) : new Date(evidenceDeadline.getTime() + 30 * 60 * 1000)

    if (now < startDate) {
      return { phase: 'OPEN', canJoin: true }
    } else if (now >= startDate && now < endDate) {
      return { phase: 'IN_PROGRESS', canJoin: false }
    } else if (now >= endDate && now < evidenceDeadline) {
      return { phase: 'EVIDENCE_SUBMISSION', canJoin: false }
    } else if (now >= evidenceDeadline && now < reviewDeadline) {
      return { phase: 'PEER_REVIEW', canJoin: false }
    } else {
      return { phase: 'COMPLETED', canJoin: false }
    }
  }

  const actualState = getActualGameState()

  const canJoin = actualState.canJoin &&
                  game.currentParticipants < game.maxParticipants &&
                  !game.userParticipation &&
                  game.status !== 'CLOSED' &&  // 已关闭的游戏不能加入
                  game.status !== 'DISPUTED'   // 争议中的游戏不能加入

  const canSubmitEvidence = game.status === 'EVIDENCE_SUBMISSION' &&
                           game.userParticipation &&
                           !game.userParticipation.evidenceSubmitted

  const canEvaluate = actualState.phase === 'PEER_REVIEW' &&
                     game.userParticipation

  // 判断是否可以查看证据
  const canViewEvidence = (participant?: any) => {
    if (!user) return false

    // 发起人可以随时查看所有证据
    if (game.creator.id === user.id) return true

    // 参与者可以随时查看自己的证据
    if (participant && participant.userId === user.id) return true

    // 互评阶段，参与者可以查看其他人的证据
    if (game.status === 'PEER_REVIEW' && game.userParticipation) return true

    // 游戏完成后，所有参与者都可以查看证据
    if (game.status === 'COMPLETED' && game.userParticipation) return true

    return false
  }

  // 渲染证据内容
  const renderEvidence = (participant: any) => {
    if (!participant.evidenceSubmitted) {
      return <p className="text-gray-500 text-sm">{t('gameDetail.evidence.notSubmitted')}</p>
    }

    // 检查是否有证据内容
    const hasContent = participant.evidenceContent && participant.evidenceContent.trim()

    if (!hasContent) {
      return <p className="text-gray-500 text-sm">{t('gameDetail.evidence.notSubmitted')}</p>
    }

    // 检查是否是 OSS URL（https://）或 base64（data:）
    const isUrl = participant.evidenceContent.startsWith('https://') || participant.evidenceContent.startsWith('http://')
    const isBase64 = participant.evidenceContent.startsWith('data:')

    // 如果是图片证据（OSS URL 或 base64）
    if (participant.evidenceType === 'PHOTO' && (isUrl || isBase64)) {
      return (
        <div className="space-y-2">
          <img
            src={participant.evidenceContent}
            alt={t('gameDetail.evidence.typePhoto')}
            className="max-w-full max-h-64 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(participant.evidenceContent, '_blank')}
          />
          <p className="text-xs text-gray-500">{t('gameDetail.evidence.clickToView')}</p>
          {participant.selfReportedSuccess !== null && (
            <p className="text-xs text-gray-500">
              {participant.selfReportedSuccess ? t('gameDetail.evidence.selfReportSuccess') : t('gameDetail.evidence.selfReportFailure')}
            </p>
          )}
        </div>
      )
    }

    // 如果是视频证据（OSS URL 或 base64）
    if (participant.evidenceType === 'VIDEO' && (isUrl || isBase64)) {
      return (
        <div className="space-y-2">
          <video
            src={participant.evidenceContent}
            controls
            className="max-w-full max-h-64 rounded-lg"
            preload="metadata"
          />
          <p className="text-xs text-gray-500">{t('gameDetail.evidence.videoEvidence')}</p>
          {participant.selfReportedSuccess !== null && (
            <p className="text-xs text-gray-500">
              {participant.selfReportedSuccess ? t('gameDetail.evidence.selfReportSuccess') : t('gameDetail.evidence.selfReportFailure')}
            </p>
          )}
        </div>
      )
    }

    // 纯文字证据
    const truncatedText = participant.evidenceContent.length > 100
      ? participant.evidenceContent.substring(0, 100) + '...'
      : participant.evidenceContent

    return (
      <div className="space-y-2">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-800 text-sm whitespace-pre-wrap">{truncatedText}</p>
        </div>
        {participant.selfReportedSuccess !== null && (
          <p className="text-xs text-gray-500">
            {participant.selfReportedSuccess ? t('gameDetail.evidence.selfReportSuccess') : t('gameDetail.evidence.selfReportFailure')}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowReportModal(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-red-600"
            title={t('gameDetail.report.reportButton')}
          >
            <Flag className="w-5 h-5" />
          </button>
          <button
            onClick={shareGame}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-blue-600"
            title={t('gameDetail.share.shareGameTitle')}
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 面包屑导航 */}
      <Breadcrumb
        items={getCategoryPath(game.category, game.subcategory, game.title)}
        className="px-2"
      />

      {/* 游戏已关闭提示 */}
      {game.status === 'CLOSED' && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {t('gameDetail.closed.title')}
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{t('gameDetail.closed.description')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 游戏信息 */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{game.title}</h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleFavorite}
                  className={`flex items-center space-x-1 px-4 py-2 text-sm rounded-lg transition-colors shadow-sm ${
                    isFavorited
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={isFavorited ? t('gameDetail.favorite.cancel') : t('gameDetail.favorite.favorite')}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  <span>{isFavorited ? t('gameDetail.favorite.favorited') : t('gameDetail.favorite.favorite')}</span>
                  <span className="text-xs">({favoritesCount})</span>
                </button>
                <button
                  onClick={shareGame}
                  className="flex items-center space-x-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  title={t('gameDetail.share.shareGameTitle')}
                >
                  <Share2 className="w-4 h-4" />
                  <span>{t('gameDetail.share.shareGame')}</span>
                </button>
                {game.status === 'COMPLETED' && (
                  <button
                    onClick={shareAchievement}
                    className="flex items-center space-x-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    title={t('gameDetail.share.shareAchievementTitle')}
                  >
                    <Trophy className="w-4 h-4" />
                    <span>{t('gameDetail.share.shareAchievement')}</span>
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-600 mb-4">{game.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <span>{t('gameDetail.info.creator')} @<UserDisplay username={game.creator.username} isDeleted={game.creator.isDeleted} showDeletedLabel={false} /></span>
                {game.creator.isVip && (
                  <Crown className="w-4 h-4 text-yellow-500 ml-1" />
                )}
              </div>
              <span>{t('gameDetail.info.trustLevel')} {game.creator.trustPoints}</span>
              {/* 创建者真实IP位置信息 - 优先显示IP位置 */}
              {(() => {
                // 优先显示IP位置（真实位置）
                if (game.creatorIpCity || game.creatorIpCountry) {
                  return (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>
                        {game.creatorIpCity && game.creatorIpCountry
                          ? `${game.creatorIpCity} ${game.creatorIpCountry}`
                          : game.creatorIpCity || game.creatorIpCountry
                        }
                      </span>
                    </div>
                  );
                }
                // 备用：显示个人资料位置
                if (game.creator.city || game.creator.country) {
                  return (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>
                        {game.creator.city && game.creator.country
                          ? `${game.creator.city} ${game.creator.country}`
                          : game.creator.city || game.creator.country
                        }
                      </span>
                    </div>
                  );
                }
                return null;
              })()}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                game.visibility === 'FRIENDS_ONLY' ? 'bg-blue-100 text-blue-800' :
                game.visibility === 'PRIVATE' ? 'bg-red-100 text-red-800' :
                'bg-green-100 text-green-800'
              }`}>
                {game.visibility === 'FRIENDS_ONLY' ? t('gameDetail.info.visibility.FRIENDS_ONLY') :
                 game.visibility === 'PRIVATE' ? t('gameDetail.info.visibility.PRIVATE') : t('gameDetail.info.visibility.PUBLIC')}
              </span>
              {/* 地理位置信息 */}
              {game.locationRestriction === 'LOCAL' && (
                <span className="flex items-center space-x-1 text-blue-600">
                  <MapPin className="w-3 h-3" />
                  <span>{t('gameDetail.info.localChallenge', { distance: game.maxDistance })}</span>
                </span>
              )}
              {game.locationRestriction === 'CUSTOM' && game.customLocation && (
                <span className="flex items-center space-x-1 text-purple-600">
                  <MapPin className="w-3 h-3" />
                  <span>{game.customLocation}</span>
                </span>
              )}
              {game.distance !== undefined && (
                <span className="flex items-center space-x-1 text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span>
                    {t('gameDetail.info.distanceFromYou', {
                      distance: game.distance < 1 ? '<1km' :
                               game.distance < 10 ? `${game.distance.toFixed(1)}km` :
                               `${Math.round(game.distance)}km`
                    })}
                  </span>
                </span>
              )}
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(actualState.phase)}`}>
            {getStatusText(actualState.phase)}
          </span>
        </div>

        {/* 争议状态提示 */}
        {game.status === 'DISPUTED' && disputes && disputes.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Gavel className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-orange-800">{t('gameDetail.dispute.title')}</span>
            </div>
            <p className="text-orange-700 text-sm">
              {t('gameDetail.dispute.description', { count: disputes.length })}
            </p>
            <button
              onClick={() => {
                const element = document.getElementById('dispute-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              {t('gameDetail.dispute.viewDetails')}
            </button>
          </div>
        )}

        {/* 赌注信息 */}
        {game.stakeDescription && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-amber-800">{t('gameDetail.info.stake')}</span>
            </div>
            <p className="text-amber-700">{game.stakeDescription}</p>
          </div>
        )}

        {/* 统计信息 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-gray-600 mx-auto mb-1" />
            <div className="text-lg font-semibold text-gray-900">
              {game.currentParticipants}/{game.maxParticipants}
            </div>
            <div className="text-sm text-gray-500">{t('gameDetail.info.participants')}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600 mx-auto mb-1" />
            <div className="text-lg font-semibold text-gray-900">
              {Math.ceil((new Date(game.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-sm text-gray-500">{t('gameDetail.info.daysRemaining')}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-gray-600 mx-auto mb-1" />
            <div className="text-lg font-semibold text-gray-900">
              {game.category}
            </div>
            <div className="text-sm text-gray-500">{t('gameDetail.info.category')}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Trophy className="w-5 h-5 text-gray-600 mx-auto mb-1" />
            <div className="text-lg font-semibold text-gray-900">
              {game.evidenceType}
            </div>
            <div className="text-sm text-gray-500">{t('gameDetail.info.evidenceType')}</div>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>{t('gameDetail.info.participationProgress')}</span>
            <span>{Math.round((game.currentParticipants / game.maxParticipants) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${(game.currentParticipants / game.maxParticipants) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* 操作按钮区域 - 移除重复按钮，统一使用GameParticipationStatus组件 */}
        <div className="space-y-4">
          {/* 状态说明 */}
          <div className="text-center">
            <span className={`text-sm px-3 py-1 rounded-full ${
              actualState.phase === 'OPEN' ? 'bg-green-100 text-green-800' :
              actualState.phase === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
              actualState.phase === 'EVIDENCE_SUBMISSION' ? 'bg-orange-100 text-orange-800' :
              actualState.phase === 'PEER_REVIEW' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {actualState.phase === 'OPEN' ? t('gameDetail.status.OPEN') :
               actualState.phase === 'IN_PROGRESS' ? t('gameDetail.status.inProgressPhase') :
                   actualState.phase === 'EVIDENCE_SUBMISSION' ? t('gameDetail.status.evidencePhase') :
                   actualState.phase === 'PEER_REVIEW' ? t('gameDetail.status.reviewPhase') :
                   t('gameDetail.status.completedPhase')}
                </span>
              </div>

          {/* 证据提交按钮 */}
          {canSubmitEvidence && (
            <button
              onClick={() => navigate(`/game/${id}/evidence`)}
              className="w-full btn-primary py-3 text-lg"
            >
              {t('gameDetail.actions.submitEvidence')}
            </button>
          )}

          {/* 互评按钮 */}
          {canEvaluate && (
            <button
              onClick={() => navigate(`/game/${id}/evaluate`)}
              className="w-full btn-primary py-3 text-lg"
            >
              {game.currentParticipants === 1 ? t('gameDetail.actions.selfEvaluate') : t('gameDetail.actions.evaluate')}
            </button>
          )}

          {/* 参与状态显示 */}
          {game.userParticipation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium">{t('gameDetail.actions.youJoined')}</p>
              <div className="text-blue-600 text-sm mt-2 space-y-1">
                <p>
                  {t('gameDetail.actions.evidenceSubmitted', {
                    status: game.userParticipation.evidenceSubmitted ? t('gameDetail.actions.evidenceSubmittedYes') : t('gameDetail.actions.evidenceSubmittedNo')
                  })}
                  {game.userParticipation.evidenceSubmitted && (game.status === 'PEER_EVALUATION' || game.status === 'PEER_REVIEW' || game.status === 'ARBITRATION' || game.status === 'COMPLETED') && (
                    <Link
                      to={`/game/${id}/evaluate`}
                      className="ml-3 text-blue-700 font-semibold hover:text-blue-900 underline"
                    >
                      {t('gameDetail.actions.viewEvaluationDetails')}
                    </Link>
                  )}
                </p>
                {game.userParticipation.finalResult && game.userParticipation.finalResult !== 'PENDING' && (
                  <p>{t('gameDetail.actions.finalResult', {
                    result: game.userParticipation.finalResult === 'SUCCESS' ? t('gameDetail.actions.finalResultSuccess') : t('gameDetail.actions.finalResultFailure')
                  })}</p>
                )}
                {(!game.userParticipation.finalResult || game.userParticipation.finalResult === 'PENDING') && (
                  <p>{t('gameDetail.actions.finalResult', { result: t('gameDetail.actions.finalResultPending') })}</p>
                )}
              </div>

              {/* 个性化提醒：单人游戏（游戏开始后才显示） */}
              {game.currentParticipants === 1 && actualState.phase !== 'OPEN' && (
                <div className="mt-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                  <div className="space-y-2">
                    <p className="text-yellow-900 text-sm font-semibold flex items-center">
                      <span className="text-xl mr-2">🎯</span>
                      {t('gameDetail.actions.singlePlayerMode')}
                    </p>
                    <p className="text-yellow-800 text-sm">
                      {game.creator.id === user?.id
                        ? t('gameDetail.actions.singlePlayerCreator')
                        : t('gameDetail.actions.singlePlayerOther')}
                    </p>
                  </div>
                </div>
              )}

              {/* 争议申请按钮和状态 */}
              {(game.status === 'COMPLETED' || game.status === 'DISPUTED') && (
                <div id="dispute-section" className="mt-3 pt-3 border-t border-blue-200">
                  {/* 显示现有争议 */}
                  {disputes && disputes.length > 0 && (
                    <div className="mb-3 space-y-2">
                      <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Gavel className="w-4 h-4" />
                        {t('gameDetail.dispute.records', { count: disputes.length })}
                      </p>
                      {disputes.map((dispute: any) => (
                        <div
                          key={dispute.id}
                          className="bg-orange-50 border border-orange-200 rounded-lg p-3 cursor-pointer hover:bg-orange-100 transition-colors"
                          onClick={() => navigate(`/disputes/${dispute.id}`)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{dispute.title}</p>
                              <p className="text-xs text-gray-600 mt-1">
                                {dispute.status === 'PENDING' && t('gameDetail.dispute.status.PENDING')}
                                {dispute.status === 'UNDER_REVIEW' && t('gameDetail.dispute.status.UNDER_REVIEW')}
                                {dispute.status === 'INVESTIGATING' && t('gameDetail.dispute.status.INVESTIGATING')}
                                {dispute.status === 'RESOLVED' && t('gameDetail.dispute.status.RESOLVED')}
                                {dispute.status === 'REJECTED' && t('gameDetail.dispute.status.REJECTED')}
                                {dispute.status === 'CANCELLED' && t('gameDetail.dispute.status.CANCELLED')}
                                {' • '}
                                {new Date(dispute.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <button className="text-orange-600 hover:text-orange-700 text-xs">
                              {t('gameDetail.progress.viewDetails')} →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 发起新争议按钮 */}
                  {(() => {
                    // 检查是否在争议提交期限内（48小时窗口）
                    const now = new Date();
                    const disputeSubmissionDeadline = game.disputeSubmissionDeadline ? new Date(game.disputeSubmissionDeadline) : null;
                    const canCreateDispute = !disputeSubmissionDeadline || now <= disputeSubmissionDeadline;

                    // 计算剩余时间
                    const hoursLeft = disputeSubmissionDeadline
                      ? Math.max(0, Math.floor((disputeSubmissionDeadline.getTime() - now.getTime()) / (1000 * 60 * 60)))
                      : 0;

                    if (!canCreateDispute) {
                      return (
                        <div className="text-center py-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">
                            {t('gameDetail.dispute.deadlinePassed')}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {t('gameDetail.dispute.waitingAdmin')}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <>
                        <button
                          onClick={() => navigate(`/disputes/create?gameId=${game.id}`)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 border border-orange-300 text-orange-700 hover:bg-orange-100 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Gavel className="w-4 h-4" />
                          {t('gameDetail.dispute.createNew')}
                        </button>
                        <p className="text-xs text-gray-600 mt-2 text-center">
                          {hoursLeft > 0 ? (
                            t('gameDetail.dispute.hoursLeft', { hours: hoursLeft })
                          ) : (
                            t('gameDetail.dispute.canSubmit')
                          )}
                        </p>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 个性化配置 */}
      <GameConfigDisplay
        templateConfig={game.templateConfig}
        dynamicConfig={game.dynamicConfig}
        templateId={game.templateId}
      />

      {/* 时间信息 */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('gameDetail.timeline.title')}</h2>
        <div className="space-y-4">
          {/* 当前阶段指示器 */}
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-blue-900">
              {t('gameDetail.status.currentPhase')} {(() => {
                // 检查互评是否已结束
                const now = new Date();
                const reviewDeadline = game.reviewDeadline ? new Date(game.reviewDeadline) : null;
                const reviewEnded = reviewDeadline && now > reviewDeadline;

                if (game.status === 'PEER_REVIEW' && reviewEnded) {
                  return t('gameDetail.status.waitingSettlement');
                }
                return getGameStatusText(game.status);
              })()}
            </span>
          </div>

          {/* 时间节点列表 */}
          <div className="space-y-3">
            {/* 加入截止时间 */}
            {game.joinDeadline && (
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">{t('gameDetail.timeline.joinDeadline')}</span>
                </div>
                <span className="font-medium">{formatDate(game.joinDeadline)}</span>
              </div>
            )}

            {/* 游戏开始时间 */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">{t('gameDetail.timeline.gameStart')}</span>
              </div>
              <span className="font-medium">{formatDate(game.startDate)}</span>
            </div>

            {/* 游戏结束时间 */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-gray-600">{t('gameDetail.timeline.gameEnd')}</span>
              </div>
              <span className="font-medium">{formatDate(game.endDate)}</span>
            </div>

            {/* 证据提交截止 */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span className="text-gray-600">{t('gameDetail.timeline.evidenceDeadline')}</span>
              </div>
              <span className="font-medium">{formatDate(game.evidenceDeadline)}</span>
            </div>

            {/* 互评截止时间 */}
            {game.reviewDeadline && (
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-pink-600" />
                  <span className="text-gray-600">{t('gameDetail.timeline.reviewDeadline')}</span>
                </div>
                <span className="font-medium">{formatDate(game.reviewDeadline)}</span>
              </div>
            )}

            {/* 争议提交截止时间（用户48小时窗口） */}
            {game.disputeSubmissionDeadline && (
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Gavel className="w-4 h-4 text-orange-600" />
                  <span className="text-gray-600">{t('gameDetail.timeline.disputeDeadline')}</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">{formatDate(game.disputeSubmissionDeadline)}</span>
                  {(() => {
                    const now = new Date();
                    const deadline = new Date(game.disputeSubmissionDeadline);
                    const hoursLeft = Math.max(0, Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60)));
                    if (hoursLeft > 0 && now < deadline) {
                      return <span className="ml-2 text-xs text-orange-600">({hoursLeft}h)</span>;
                    }
                    return null;
                  })()}
                </div>
              </div>
            )}

            {/* 管理员仲裁截止时间（120小时） */}
            {game.arbitrationDeadline && (
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Gavel className="w-4 h-4 text-red-600" />
                  <span className="text-gray-600">{t('gameDetail.timeline.arbitrationDeadline')}</span>
                </div>
                <span className="font-medium">{formatDate(game.arbitrationDeadline)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 证据要求 */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('gameDetail.evidence.title')}</h2>
          {game.userParticipation && game.status === 'EVIDENCE_SUBMISSION' && (
            <Link
              to={`/game/${game.id}/evidence`}
              className="btn-primary text-sm px-4 py-2"
            >
              {t('gameDetail.actions.submitEvidence')}
            </Link>
          )}
        </div>
        <p className="text-gray-600">{game.evidenceInstructions}</p>

        {/* 证据类型说明 */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{t('gameDetail.evidence.typeLabel')}</span>
            <span className="text-sm text-gray-600">
              {game.evidenceType === 'PHOTO' ? t('gameDetail.evidence.typePhoto') :
               game.evidenceType === 'TEXT' ? t('gameDetail.evidence.typeText') :
               game.evidenceType}
            </span>
          </div>
        </div>
      </div>

      {/* 游戏参与状态 */}
      <GameParticipationStatus
        game={game}
        participants={participants || []}
        className="mb-6"
      />

      {/* 参与者证据查看 */}
      {participants && participants.length > 0 && (
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('gameDetail.evidence.participantsTitle')}</h2>
          <div className="space-y-4">
            {participants.map((participant: any) => (
              <div key={participant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    {participant.userId === game.creator.id ? (
                      <Crown className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <User className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        @{participant.user.username}
                      </span>
                      {participant.userId === user?.id && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {t('gameDetail.evidence.you')}
                        </span>
                      )}
                      {participant.userId === game.creator.id && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          {t('gameDetail.evidence.creator')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {t('gameDetail.evidence.trustLevel')} {participant.user.trustPoints}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {participant.evidenceSubmitted ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">{t('gameDetail.evidence.evidenceSubmitted')}</span>
                      {canViewEvidence(participant) && (
                        <button
                          onClick={() => setShowEvidenceModal(participant)}
                          className="text-sm text-blue-600 hover:text-blue-700 underline"
                        >
                          {t('gameDetail.evidence.viewEvidence')}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{t('gameDetail.evidence.evidenceNotSubmitted')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 收到的评价（互评截止后显示） */}
      {(() => {
        // 检查是否应该显示评价：游戏完成 或 互评截止时间已过
        const now = new Date();
        const reviewDeadline = game.reviewDeadline ? new Date(game.reviewDeadline) : null;
        const shouldShowEvaluations = game.status === 'COMPLETED' ||
          (game.status === 'PEER_REVIEW' && reviewDeadline && now > reviewDeadline);

        return shouldShowEvaluations && allEvaluations && participants && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('gameDetail.evaluations.title')}</h2>
            <div className="space-y-6">
              {participants.map((participant: any) => {
                const evaluations = allEvaluations[participant.userId] || [];
                if (evaluations.length === 0) return null;

                return (
                  <div key={participant.userId} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">@{participant.user.username}</h3>
                        <p className="text-sm text-gray-500">{t('gameDetail.evaluations.count', { count: evaluations.length })}</p>
                      </div>
                    </div>

                    <div className="ml-13 space-y-2">
                      {evaluations.map((evaluation: any, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            {evaluation.evaluation === 'RECOGNIZE' ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                @{evaluation.evaluatorUsername}
                              </span>
                              <span className={`text-sm ${evaluation.evaluation === 'RECOGNIZE' ? 'text-green-700' : 'text-red-700'}`}>
                                {evaluation.evaluation === 'RECOGNIZE' ? t('gameDetail.evaluations.recognize') : t('gameDetail.evaluations.notRecognize')}
                              </span>
                            </div>
                            {evaluation.reasoning && (
                              <p className="text-sm text-gray-600">{evaluation.reasoning}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(evaluation.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* 游戏进度 */}
      {game.userParticipation && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('gameDetail.progress.title')}</h2>
          <div className="space-y-4">
            {/* 进度步骤 */}
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                game.status === 'OPEN' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
              }`}>
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium">{t('gameDetail.progress.joinChallenge')}</p>
                <p className="text-sm text-gray-500">{t('gameDetail.progress.joinedSuccess')}</p>
              </div>
            </div>

            <div className={`flex items-center space-x-4 ${
              ['EVIDENCE_SUBMISSION', 'PEER_REVIEW', 'PEER_EVALUATION', 'ARBITRATION', 'DISPUTED', 'COMPLETED'].includes(game.status)
                ? 'opacity-100' : 'opacity-50'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                game.userParticipation.evidenceSubmitted
                  ? 'bg-green-500 text-white'
                  : ['EVIDENCE_SUBMISSION', 'PEER_REVIEW', 'PEER_EVALUATION', 'ARBITRATION', 'DISPUTED', 'COMPLETED'].includes(game.status)
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-300 text-gray-600'
              }`}>
                {game.userParticipation.evidenceSubmitted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="font-medium">{t('gameDetail.progress.submitEvidence')}</p>
                <p className="text-sm text-gray-500">
                  {game.userParticipation.evidenceSubmitted
                    ? t('gameDetail.progress.evidenceSubmitted')
                    : game.status === 'EVIDENCE_SUBMISSION'
                      ? t('gameDetail.progress.submitNow')
                      : t('gameDetail.progress.waitingPhase')
                  }
                </p>
              </div>
            </div>

            <div className={`flex items-center space-x-4 ${
              ['PEER_REVIEW', 'PEER_EVALUATION', 'ARBITRATION', 'DISPUTED', 'COMPLETED'].includes(game.status)
                ? 'opacity-100' : 'opacity-50'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                (() => {
                  // 检查互评是否已结束
                  const now = new Date();
                  const reviewDeadline = game.reviewDeadline ? new Date(game.reviewDeadline) : null;
                  const reviewEnded = reviewDeadline && now > reviewDeadline;

                  if (['ARBITRATION', 'DISPUTED', 'COMPLETED'].includes(game.status) || reviewEnded) {
                    return 'bg-green-500 text-white';
                  } else if (['PEER_REVIEW', 'PEER_EVALUATION'].includes(game.status)) {
                    return 'bg-yellow-500 text-white';
                  } else {
                    return 'bg-gray-300 text-gray-600';
                  }
                })()
              }`}>
                {(() => {
                  const now = new Date();
                  const reviewDeadline = game.reviewDeadline ? new Date(game.reviewDeadline) : null;
                  const reviewEnded = reviewDeadline && now > reviewDeadline;

                  return (['ARBITRATION', 'DISPUTED', 'COMPLETED'].includes(game.status) || reviewEnded) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  );
                })()}
              </div>
              <div className="flex-1">
                <p className="font-medium">{game.currentParticipants === 1 ? t('gameDetail.progress.selfEvaluate') : t('gameDetail.progress.peerReview')}</p>
                <p className="text-sm text-gray-500">
                  {(() => {
                    const now = new Date();
                    const reviewDeadline = game.reviewDeadline ? new Date(game.reviewDeadline) : null;
                    const reviewEnded = reviewDeadline && now > reviewDeadline;

                    if (['ARBITRATION', 'DISPUTED', 'COMPLETED'].includes(game.status) || reviewEnded) {
                      return game.currentParticipants === 1 ? t('gameDetail.progress.selfEvaluateCompleted') : t('gameDetail.progress.peerReviewCompleted');
                    } else if (['PEER_REVIEW', 'PEER_EVALUATION'].includes(game.status)) {
                      return game.currentParticipants === 1 ? t('gameDetail.progress.pleaseSelfEvaluate') : t('gameDetail.progress.pleaseEvaluate');
                    } else {
                      return game.currentParticipants === 1 ? t('gameDetail.progress.waitingSelfEvaluate') : t('gameDetail.progress.waitingReview');
                    }
                  })()}
                </p>
              </div>
              {(() => {
                const now = new Date();
                const reviewDeadline = game.reviewDeadline ? new Date(game.reviewDeadline) : null;
                const reviewEnded = reviewDeadline && now > reviewDeadline;
                const canEvaluate = ['PEER_REVIEW', 'PEER_EVALUATION'].includes(game.status) && !reviewEnded;

                return canEvaluate && game.userParticipation && (
                  <Link
                    to={`/game/${id}/evaluate`}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                  >
                    {game.currentParticipants === 1 ? t('gameDetail.progress.startSelfEvaluate') : t('gameDetail.progress.startReview')}
                  </Link>
                );
              })()}
            </div>

            {/* 仲裁阶段（如果有） */}
            {['ARBITRATION', 'DISPUTED', 'COMPLETED', 'CLOSED'].includes(game.status) && (
              <div className={`flex items-center space-x-4 ${
                ['ARBITRATION', 'DISPUTED', 'COMPLETED', 'CLOSED'].includes(game.status) ? 'opacity-100' : 'opacity-50'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  (() => {
                    const now = new Date();
                    const arbitrationDeadline = game.arbitrationDeadline ? new Date(game.arbitrationDeadline) : null;
                    const arbitrationExpired = arbitrationDeadline && now > arbitrationDeadline;

                    if (game.status === 'CLOSED' || arbitrationExpired) {
                      return 'bg-green-500 text-white'; // 仲裁期结束
                    } else if (game.status === 'COMPLETED') {
                      return 'bg-yellow-500 text-white'; // 仲裁窗口开放中
                    } else if (['ARBITRATION', 'DISPUTED'].includes(game.status)) {
                      return 'bg-orange-500 text-white'; // 有争议，处理中
                    }
                    return 'bg-gray-300 text-gray-600';
                  })()
                }`}>
                  {(() => {
                    const now = new Date();
                    const arbitrationDeadline = game.arbitrationDeadline ? new Date(game.arbitrationDeadline) : null;
                    const arbitrationExpired = arbitrationDeadline && now > arbitrationDeadline;

                    if (game.status === 'CLOSED' || arbitrationExpired) {
                      return <CheckCircle className="w-4 h-4" />;
                    }
                    return <Flag className="w-4 h-4" />;
                  })()}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t('gameDetail.progress.arbitration')}</p>
                  <p className="text-sm text-gray-500">
                    {(() => {
                      const now = new Date();
                      const disputeSubmissionDeadline = game.disputeSubmissionDeadline ? new Date(game.disputeSubmissionDeadline) : null;
                      const arbitrationDeadline = game.arbitrationDeadline ? new Date(game.arbitrationDeadline) : null;
                      const submissionExpired = disputeSubmissionDeadline && now > disputeSubmissionDeadline;
                      const arbitrationExpired = arbitrationDeadline && now > arbitrationDeadline;

                      if (game.status === 'CLOSED' || arbitrationExpired) {
                        return t('gameDetail.progress.arbitrationEnded');
                      } else if (game.status === 'COMPLETED' && !submissionExpired) {
                        const hoursLeft = disputeSubmissionDeadline
                          ? Math.max(0, Math.floor((disputeSubmissionDeadline.getTime() - now.getTime()) / (1000 * 60 * 60)))
                          : 0;
                        return t('gameDetail.progress.disputeWindowOpen', { hours: hoursLeft });
                      } else if (game.status === 'COMPLETED' && submissionExpired) {
                        return t('gameDetail.progress.disputeWindowClosed');
                      } else if (['ARBITRATION', 'DISPUTED'].includes(game.status)) {
                        return t('gameDetail.progress.disputeProcessing');
                      }
                      return t('gameDetail.progress.noArbitration');
                    })()}
                  </p>
                </div>
              </div>
            )}

            {/* 挑战结果 */}
            <div className={`flex items-center space-x-4 ${
              (() => {
                const now = new Date();
                const arbitrationDeadline = game.arbitrationDeadline ? new Date(game.arbitrationDeadline) : null;
                const arbitrationExpired = arbitrationDeadline && now > arbitrationDeadline;
                return (game.status === 'CLOSED' || arbitrationExpired) ? 'opacity-100' : 'opacity-50';
              })()
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                (() => {
                  const now = new Date();
                  const arbitrationDeadline = game.arbitrationDeadline ? new Date(game.arbitrationDeadline) : null;
                  const arbitrationExpired = arbitrationDeadline && now > arbitrationDeadline;

                  if (game.status === 'CLOSED' || arbitrationExpired) {
                    return game.userParticipation.finalResult === 'SUCCESS'
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white';
                  }
                  return 'bg-gray-300 text-gray-600';
                })()
              }`}>
                {(() => {
                  const now = new Date();
                  const arbitrationDeadline = game.arbitrationDeadline ? new Date(game.arbitrationDeadline) : null;
                  const arbitrationExpired = arbitrationDeadline && now > arbitrationDeadline;

                  if (game.status === 'CLOSED' || arbitrationExpired) {
                    return game.userParticipation.finalResult === 'SUCCESS' ? (
                      <Trophy className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    );
                  }
                  return <Clock className="w-4 h-4" />;
                })()}
              </div>
              <div className="flex-1">
                <p className="font-medium">{t('gameDetail.progress.challengeResult')}</p>
                <p className="text-sm text-gray-500">
                  {(() => {
                    const now = new Date();
                    const arbitrationDeadline = game.arbitrationDeadline ? new Date(game.arbitrationDeadline) : null;
                    const arbitrationExpired = arbitrationDeadline && now > arbitrationDeadline;

                    if (game.status === 'CLOSED' || arbitrationExpired) {
                      if (game.userParticipation?.finalResult === 'SUCCESS') {
                        return `🎉 ${t('gameDetail.progress.success')}`;
                      } else if (game.userParticipation?.finalResult === 'FAILURE') {
                        return `😔 ${t('gameDetail.progress.failure')}`;
                      } else {
                        // 游戏已完成但没有最终结果，可能是平局或其他情况
                        return `✅ ${t('gameDetail.progress.gameEnded')}`;
                      }
                    } else if (game.status === 'COMPLETED') {
                      // 检查是否还在争议提交窗口内
                      const disputeSubmissionDeadline = game.disputeSubmissionDeadline ? new Date(game.disputeSubmissionDeadline) : null;
                      const submissionExpired = disputeSubmissionDeadline && now > disputeSubmissionDeadline;

                      if (submissionExpired) {
                        return `⏳ ${t('gameDetail.progress.waitingAdminDispute')}`;
                      } else {
                        return `⏳ ${t('gameDetail.progress.arbitrationPeriod')}`;
                      }
                    } else if (['ARBITRATION', 'DISPUTED'].includes(game.status)) {
                      // 有争议，等待管理员处理
                      return `⚖️ ${t('gameDetail.progress.disputeInProgress')}`;
                    }

                    // 其他状态：等待互评结束
                    return `⏱️ ${t('gameDetail.progress.waitingReviewEnd')}`;
                  })()}
                </p>
              </div>
              {(() => {
                const now = new Date();
                const arbitrationDeadline = game.arbitrationDeadline ? new Date(game.arbitrationDeadline) : null;
                const arbitrationExpired = arbitrationDeadline && now > arbitrationDeadline;

                // 仲裁期结束后才显示"查看详情"按钮
                if ((game.status === 'CLOSED' || arbitrationExpired) && settlement) {
                  return (
                    <button
                      onClick={() => setShowSettlementModal(true)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      {t('gameDetail.progress.viewDetails')}
                    </button>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>
      )}



      {/* 证据查看模态框 */}
      {showEvidenceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('gameDetail.modal.evidenceTitle', { username: showEvidenceModal.user.username })}
              </h3>
              <button
                onClick={() => setShowEvidenceModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              {renderEvidence(showEvidenceModal)}
              {showEvidenceModal.selfReportedSuccess === true && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm font-medium">
                    ✅ {t('gameDetail.modal.selfReportSuccess')}
                  </p>
                </div>
              )}
              {showEvidenceModal.selfReportedSuccess === false && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm font-medium">
                    ❌ {t('gameDetail.modal.selfReportFailure')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 举报模态框 */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('gameDetail.modal.reportTitle')}</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('gameDetail.modal.reportReasonLabel')} <span className="text-red-500">*</span>
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">{t('gameDetail.modal.selectReason')}</option>
                  <option value="INAPPROPRIATE_CONTENT">{t('gameDetail.modal.reasonInappropriate')}</option>
                  <option value="SPAM">{t('gameDetail.modal.reasonSpam')}</option>
                  <option value="FRAUD">{t('gameDetail.modal.reasonFraud')}</option>
                  <option value="HARASSMENT">{t('gameDetail.modal.reasonHarassment')}</option>
                  <option value="FAKE_EVIDENCE">{t('gameDetail.modal.reasonFakeEvidence')}</option>
                  <option value="OTHER">{t('gameDetail.modal.reasonOther')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('gameDetail.modal.descriptionLabel')}
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  rows={4}
                  placeholder={t('gameDetail.modal.descriptionPlaceholder')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {reportDescription.length}/500
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowReportModal(false)
                    setReportReason('')
                    setReportDescription('')
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={reportGameMutation.isLoading}
                >
                  {t('gameDetail.modal.cancel')}
                </button>
                <button
                  onClick={handleSubmitReport}
                  disabled={reportGameMutation.isLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {reportGameMutation.isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">{t('gameDetail.modal.submitting')}</span>
                    </>
                  ) : (
                    t('gameDetail.modal.submitReport')
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Settlement Modal */}
      {settlement && (
        <GameSettlementModal
          settlement={settlement}
          currentUserId={user?.id || ''}
          isOpen={showSettlementModal}
          onClose={() => setShowSettlementModal(false)}
        />
      )}
    </div>
  )
}

export default GameDetailPage
