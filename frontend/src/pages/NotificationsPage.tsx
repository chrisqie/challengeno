import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { notificationsAPI } from '../services/api'
import { useNotificationStore } from '../stores/notificationStore'
import { Bell, Check, Trash2, ArrowLeft, Filter, CheckSquare, Square, Crown, Users, Trophy, AlertTriangle, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import { useTranslation } from 'react-i18next'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  data?: any
  isRead: boolean
  createdAt: string
}

const NotificationsPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { unreadCount, setUnreadCount, decrementUnreadCount, resetUnreadCount } = useNotificationStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [showBatchActions, setShowBatchActions] = useState(false)

  // 加载通知数据
  const loadNotifications = async () => {
    try {
      setLoading(true)
      const [notificationsRes, unreadRes] = await Promise.all([
        notificationsAPI.getNotifications(50, 0),
        notificationsAPI.getUnreadCount()
      ])
      setNotifications(notificationsRes.data || [])
      setUnreadCount(unreadRes.data?.count || 0)
    } catch (error: any) {
      console.error('Failed to load notifications:', error)
      toast.error(t('notifications.loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  // 筛选通知
  const filteredNotifications = notifications.filter(notification => {
    // 按读取状态筛选
    if (filter === 'unread' && notification.isRead) return false
    if (filter === 'read' && !notification.isRead) return false

    // 按类型筛选
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false

    return true
  })

  // 切换选择通知
  const toggleSelectNotification = (id: string) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    )
  }

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id))
    }
  }

  // 批量标记为已读
  const handleBatchMarkAsRead = async () => {
    try {
      await Promise.all(
        selectedNotifications.map(id => notificationsAPI.markAsRead(id))
      )
      setNotifications(prev =>
        prev.map(n =>
          selectedNotifications.includes(n.id) ? { ...n, isRead: true } : n
        )
      )
      setSelectedNotifications([])
      toast.success(t('notifications.batchMarkSuccess', { count: selectedNotifications.length }))
      // 重新获取未读数量
      const unreadRes = await notificationsAPI.getUnreadCount()
      setUnreadCount(unreadRes.data?.count || 0)
    } catch (error) {
      toast.error(t('notifications.batchOperationFailed'))
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (!window.confirm(t('notifications.confirmDelete', { count: selectedNotifications.length }))) {
      return
    }

    try {
      await Promise.all(
        selectedNotifications.map(id => notificationsAPI.deleteNotification(id))
      )
      setNotifications(prev =>
        prev.filter(n => !selectedNotifications.includes(n.id))
      )
      setSelectedNotifications([])
      toast.success(t('notifications.batchDeleteSuccess', { count: selectedNotifications.length }))
    } catch (error) {
      toast.error(t('notifications.batchDeleteFailed'))
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  // Get notification type icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'FRIEND_REQUEST':
      case 'FRIEND_ACCEPTED':
        return <Users className="w-5 h-5 text-blue-500" />
      case 'GAME_STARTED':
      case 'GAME_COMPLETED':
        return <Trophy className="w-5 h-5 text-green-500" />
      case 'EVIDENCE_REQUIRED':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      case 'SYSTEM':
        return <Crown className="w-5 h-5 text-purple-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  // Render notification text with i18n support
  // If the text is a translation key (starts with 'notifications.'), use t() to translate
  // Otherwise, display the text as-is (for legacy notifications)
  const renderNotificationText = (text: string, data?: any): string => {
    if (text.startsWith('notifications.')) {
      // This is a translation key, parse data and translate
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data
      return String(t(text, parsedData || {}))
    }
    // Legacy notification with hardcoded text
    return text
  }

  // 获取通知类型名称
  const getNotificationTypeName = (type: string) => {
    switch (type) {
      case 'FRIEND_REQUEST': return t('notifications.types.friendRequest')
      case 'FRIEND_ACCEPTED': return t('notifications.types.friendAccepted')
      case 'GAME_STARTED': return t('notifications.types.gameStarted')
      case 'GAME_COMPLETED': return t('notifications.types.gameCompleted')
      case 'EVIDENCE_REQUIRED': return t('notifications.types.evidenceRequired')
      case 'SYSTEM': return t('notifications.types.system')
      default: return t('notifications.types.notification')
    }
  }

  // 标记为已读
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsAPI.markAsRead(notificationId)
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      )
      decrementUnreadCount()
    } catch (error: any) {
      toast.error(t('notifications.operationFailed'))
    }
  }

  // 标记所有为已读
  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead()
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      )
      resetUnreadCount()
      toast.success(t('notifications.markAllSuccess'))
    } catch (error: any) {
      toast.error(t('notifications.operationFailed'))
    }
  }

  // 删除通知
  const handleDelete = async (notificationId: string) => {
    try {
      await notificationsAPI.deleteNotification(notificationId)
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
      toast.success(t('notifications.deleteSuccess'))
    } catch (error: any) {
      toast.error(t('notifications.deleteFailed'))
    }
  }

  // 处理通知点击
  const handleNotificationClick = (notification: Notification) => {
    // 如果未读，先标记为已读
    if (!notification.isRead) {
      handleMarkAsRead(notification.id)
    }

    // 根据通知类型跳转到相应页面
    if (notification.data) {
      const data = typeof notification.data === 'string' 
        ? JSON.parse(notification.data) 
        : notification.data

      switch (notification.type) {
        case 'FRIEND_REQUEST':
          navigate('/friends')
          break
        case 'GAME_STARTED':
        case 'EVIDENCE_REQUIRED':
        case 'GAME_COMPLETED':
          if (data.gameId) {
            navigate(`/game/${data.gameId}`)
          }
          break
        default:
          break
      }
    }
  }



  // 格式化时间（使用用户本地时区）
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return t('notifications.time.justNow')
    if (minutes < 60) return t('notifications.time.minutesAgo', { count: minutes })
    if (hours < 24) return t('notifications.time.hoursAgo', { count: hours })
    if (days < 7) return t('notifications.time.daysAgo', { count: days })
    // 使用用户本地时区格式化日期（24小时制）
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Bell className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('notifications.title')}</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500">{t('notifications.unreadCount', { count: unreadCount })}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/notifications/settings')}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>{t('notifications.settings')}</span>
          </button>

          <button
            onClick={() => setShowBatchActions(!showBatchActions)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              showBatchActions ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>{t('notifications.batchActions')}</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{t('notifications.markAllRead')}</span>
            </button>
          )}
        </div>
      </div>

      {/* 筛选和批量操作栏 */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* 筛选选项 */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{t('notifications.filter')}:</span>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('notifications.filterAll')}</option>
              <option value="unread">{t('notifications.filterUnread')}</option>
              <option value="read">{t('notifications.filterRead')}</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('notifications.allTypes')}</option>
              <option value="FRIEND_REQUEST">{t('notifications.types.friendRequest')}</option>
              <option value="FRIEND_ACCEPTED">{t('notifications.types.friendAccepted')}</option>
              <option value="GAME_STARTED">{t('notifications.types.gameStarted')}</option>
              <option value="GAME_COMPLETED">{t('notifications.types.gameCompleted')}</option>
              <option value="EVIDENCE_REQUIRED">{t('notifications.types.evidenceRequired')}</option>
              <option value="SYSTEM">{t('notifications.types.system')}</option>
            </select>
          </div>

          {/* 批量操作按钮 */}
          {showBatchActions && selectedNotifications.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {t('notifications.selected', { count: selectedNotifications.length })}
              </span>
              <button
                onClick={handleBatchMarkAsRead}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
              >
                <Check className="w-3 h-3" />
                <span>{t('notifications.markRead')}</span>
              </button>
              <button
                onClick={handleBatchDelete}
                className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>{t('notifications.delete')}</span>
              </button>
            </div>
          )}
        </div>

        {/* 全选选项 */}
        {showBatchActions && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={toggleSelectAll}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
            >
              {selectedNotifications.length === filteredNotifications.length ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span>
                {selectedNotifications.length === filteredNotifications.length ? t('notifications.deselectAll') : t('notifications.selectAll')}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 通知列表 */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {notifications.length === 0 ? t('notifications.noNotifications') : t('notifications.noMatchingNotifications')}
          </h3>
          <p className="text-gray-500">
            {notifications.length === 0 ? t('notifications.notificationsWillAppear') : t('notifications.tryAdjustFilters')}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`card p-4 cursor-pointer transition-all hover:shadow-md ${
                !notification.isRead ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start space-x-3">
                {/* 选择框 */}
                {showBatchActions && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSelectNotification(notification.id)
                    }}
                    className="mt-1 p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {selectedNotifications.includes(notification.id) ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                )}

                {/* 通知图标 */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-medium ${
                        !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {renderNotificationText(notification.title, notification.data)}
                      </h3>
                      <p className={`text-sm mt-1 ${
                        !notification.isRead ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {renderNotificationText(notification.message, notification.data)}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMarkAsRead(notification.id)
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title={t('notifications.markAsRead')}
                        >
                          <Check className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(notification.id)
                        }}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                        title={t('notifications.deleteNotification')}
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationsPage
