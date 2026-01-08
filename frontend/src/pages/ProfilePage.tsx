import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/authStore'
import { Trophy, Star, Target, Calendar, Award, Settings, TrendingUp, Users, Clock, BarChart3, Crown, Gavel, Heart } from 'lucide-react'
import { useQuery } from 'react-query'
import { useEffect } from 'react'
import { achievementsAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
// import PointsDisplay from '../components/PointsDisplay' // 临时注释


const ProfilePage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user, refreshUser } = useAuthStore()

  // 获取用户成就数据
  const { data: userAchievements, isLoading: achievementsLoading } = useQuery(
    'user-achievements',
    () => achievementsAPI.getUserAchievements(),
    {
      select: (response) => response.data,
      enabled: !!user,
    }
  )

  // 定期刷新用户积分数据
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        refreshUser()
      }, 30000) // 每30秒刷新一次

      return () => clearInterval(interval)
    }
  }, [user, refreshUser])

  if (!user) return null

  // 计算统计数据
  const totalPoints = user.participationPoints + user.trustPoints + user.laborPoints
  const completionRate = user.totalGamesJoined > 0
    ? Math.round((user.gamesCompleted / user.totalGamesJoined) * 100)
    : 0

  // 计算用户等级
  const userLevel = Math.floor(user.participationPoints / 100) + 1
  const levelProgress = user.participationPoints % 100

  // 计算活跃度（基于最近的活动）
  const daysSinceJoined = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  const averageGamesPerDay = daysSinceJoined > 0 ? (user.totalGamesCreated + user.totalGamesJoined) / daysSinceJoined : 0

  const stats = [
    { label: t('profile.stats.participationPoints'), value: user.participationPoints, icon: Trophy, color: 'text-blue-600' },
    { label: t('profile.stats.trustPoints'), value: user.trustPoints, icon: Star, color: 'text-yellow-600' },
    { label: t('profile.stats.laborPoints'), value: user.laborPoints, icon: Target, color: 'text-green-600' },
  ]

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('profile.title')}</h1>
        <p className="text-gray-600 mt-1">{t('profile.subtitle')}</p>
      </div>

      {/* 用户信息卡片 */}
      <div className="card p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // 如果头像加载失败，显示默认头像
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div
              className={`w-full h-full bg-gradient-to-r from-primary-500 to-indigo-600 flex items-center justify-center ${user.avatar ? 'hidden' : ''}`}
            >
              <span className="text-white font-bold text-2xl">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{user.fullName}</h2>
            <p className="text-gray-600">@{user.username}</p>
            <p className="text-gray-600 text-sm">{user.email}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm text-gray-500">
                {t('profile.joinedDate', { date: new Date(user.createdAt).toLocaleDateString() })}
              </span>
              {user.isVip && (
                <div className="flex flex-col">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full mb-1">
                    {t('profile.vipMember')}
                  </span>
                  {user.vipExpiresAt && (
                    <span className="text-xs text-gray-500">
                      {t('profile.vipExpiresAt', { date: new Date(user.vipExpiresAt).toLocaleDateString() })}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* 积分统计 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{t('profile.pointsStats.title')}</h3>
            <button
              onClick={() => navigate('/points/history')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {t('profile.pointsStats.viewHistory')}
            </button>
          </div>
          {/* 使用新的积分显示组件，支持实时更新 */}
          {/* <PointsDisplay layout="grid" size="md" /> */}

          {/* 临时使用简单的积分显示 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-blue-600">
                <Trophy className="w-5 h-5" />
                <span className="text-lg font-bold">{user?.participationPoints || 0}</span>
              </div>
              <p className="text-sm text-gray-500">{t('profile.stats.participationPoints')}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-green-600">
                <Star className="w-5 h-5" />
                <span className="text-lg font-bold">{user?.trustPoints || 0}</span>
              </div>
              <p className="text-sm text-gray-500">{t('profile.stats.trustPoints')}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-purple-600">
                <Target className="w-5 h-5" />
                <span className="text-lg font-bold">{user?.laborPoints || 0}</span>
              </div>
              <p className="text-sm text-gray-500">{t('profile.stats.laborPoints')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 挑战统计 */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.challengeStats.title')}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{user.totalGamesCreated}</div>
            <div className="text-sm text-blue-600">{t('profile.challengeStats.created')}</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{user.totalGamesJoined}</div>
            <div className="text-sm text-green-600">{t('profile.challengeStats.joined')}</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{user.gamesCompleted}</div>
            <div className="text-sm text-purple-600">{t('profile.challengeStats.completed')}</div>
          </div>
        </div>

        {/* 完成率 */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{t('profile.challengeStats.completionRate')}</span>
            <span>{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* 活跃度统计 */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
          {t('profile.activityStats.title')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{daysSinceJoined}</div>
            <div className="text-sm text-blue-600">{t('profile.activityStats.daysSinceJoined')}</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <Users className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{averageGamesPerDay.toFixed(1)}</div>
            <div className="text-sm text-green-600">{t('profile.activityStats.averageGamesPerDay')}</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">{totalPoints}</div>
            <div className="text-sm text-purple-600">{t('profile.activityStats.totalPoints')}</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <Clock className="w-6 h-6 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-600">{userLevel}</div>
            <div className="text-sm text-orange-600">{t('profile.activityStats.currentLevel')}</div>
          </div>
        </div>
      </div>

      {/* 成就系统 */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{t('profile.achievements.title')}</h3>
          {userAchievements && (
            <span className="text-sm text-gray-500">
              {t('profile.achievements.unlocked', {
                count: userAchievements.filter((a: any) => a.unlocked).length,
                total: userAchievements.length
              })}
            </span>
          )}
        </div>

        {achievementsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : userAchievements && userAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userAchievements.slice(0, 6).map((achievement: any) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  achievement.unlocked
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </span>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'
                    }`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm ${
                      achievement.unlocked ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                    {achievement.rarity && (
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                        achievement.rarity === 'LEGENDARY' ? 'bg-purple-100 text-purple-800' :
                        achievement.rarity === 'EPIC' ? 'bg-orange-100 text-orange-800' :
                        achievement.rarity === 'RARE' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {t(`profile.achievements.rarity.${achievement.rarity}`)}
                      </span>
                    )}
                  </div>
                  {achievement.unlocked && (
                    <Award className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{t('profile.achievements.noData')}</p>
          </div>
        )}

        {userAchievements && userAchievements.length > 6 && (
          <div className="text-center mt-4">
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              {t('profile.achievements.viewAll', { count: userAchievements.length })}
            </button>
          </div>
        )}
      </div>

      {/* 我的收藏 */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.favorites.title')}</h3>
        <button
          onClick={() => navigate('/favorites')}
          className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-red-50 to-pink-100 rounded-lg hover:from-red-100 hover:to-pink-200 transition-all duration-200"
        >
          <Heart className="w-6 h-6 text-red-600" />
          <div className="text-left">
            <div className="font-semibold text-red-900">{t('profile.favorites.myGames')}</div>
            <div className="text-sm text-red-600">{t('profile.favorites.viewFavorites')}</div>
          </div>
        </button>
      </div>

      {/* 积分快捷操作 */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.pointsCenter.title')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/points/stats')}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200"
          >
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <div className="font-semibold text-blue-900">{t('profile.pointsCenter.statistics')}</div>
              <div className="text-sm text-blue-600">{t('profile.pointsCenter.statisticsDesc')}</div>
            </div>
          </button>

          <button
            onClick={() => navigate('/leaderboard')}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg hover:from-yellow-100 hover:to-yellow-200 transition-all duration-200"
          >
            <Crown className="w-6 h-6 text-yellow-600" />
            <div className="text-left">
              <div className="font-semibold text-yellow-900">{t('profile.pointsCenter.leaderboard')}</div>
              <div className="text-sm text-yellow-600">{t('profile.pointsCenter.leaderboardDesc')}</div>
            </div>
          </button>
        </div>
      </div>

      {/* 争议管理 */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.disputes.title')}</h3>
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => navigate('/disputes')}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all duration-200"
          >
            <Gavel className="w-6 h-6 text-orange-600" />
            <div className="text-left">
              <div className="font-semibold text-orange-900">{t('profile.disputes.records')}</div>
              <div className="text-sm text-orange-600">{t('profile.disputes.recordsDesc')}</div>
            </div>
          </button>
        </div>
      </div>

      {/* 等级信息 */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.level.title')}</h3>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {Math.floor(user.participationPoints / 100) + 1}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{t('profile.level.level', { level: Math.floor(user.participationPoints / 100) + 1 })}</span>
              <span>
                {user.participationPoints % 100}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(user.participationPoints % 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('profile.level.pointsToNextLevel', { points: 100 - (user.participationPoints % 100) })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
