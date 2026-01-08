"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BottomNav } from "./bottom-nav"
import { AppHeader } from "./app-header"
import { Bell, Settings, CheckSquare, Check, Trash2, Crown, AlertTriangle, Trophy, MessageSquare } from "lucide-react"

interface Notification {
  id: string
  type: "arbitration" | "peer_review" | "evidence" | "game_start" | "system"
  title: string
  message: string
  time: string
  isRead: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "arbitration",
    title: "仲裁结果通知",
    message: '@newbie 发起的游戏"每日运动挑战"的争议"sadfasdfas"已处理完成。处理结果：无需处理。',
    time: "4 days ago",
    isRead: false,
  },
  {
    id: "2",
    type: "arbitration",
    title: "仲裁结果通知",
    message: '您发起的争议"测试上传图片"已处理完成。处理结果：部分支持。部分不支持',
    time: "5 days ago",
    isRead: false,
  },
  {
    id: "3",
    type: "peer_review",
    title: "互评阶段开始",
    message: '"测试dispute" 进入互评阶段，请对其他参与者的证据进行评价。',
    time: "5 days ago",
    isRead: false,
  },
  {
    id: "4",
    type: "evidence",
    title: "请提交证据",
    message: '"测试dispute" 挑战已结束，请在 12/1/2025 前提交证据',
    time: "5 days ago",
    isRead: false,
  },
  {
    id: "5",
    type: "game_start",
    title: "挑战开始了！",
    message: '"测试dispute" 挑战已经开始，快去参与吧！',
    time: "5 days ago",
    isRead: false,
  },
  {
    id: "6",
    type: "peer_review",
    title: "互评阶段开始",
    message: '"test 3" 进入互评阶段，请对其他参与者的证据进行评价。',
    time: "5 days ago",
    isRead: true,
  },
  {
    id: "7",
    type: "evidence",
    title: "请提交证据",
    message: '"test 3" 挑战已结束，请在 12/1/2025 前提交证据',
    time: "5 days ago",
    isRead: true,
  },
  {
    id: "8",
    type: "peer_review",
    title: "互评阶段开始",
    message: '"测试全部不选是否可以提交" 进入互评阶段，请对其他参与者的证据进行评价。',
    time: "2025年11月6日 04:51",
    isRead: true,
  },
  {
    id: "9",
    type: "peer_review",
    title: "自我评价阶段开始",
    message: '"每日阅读" 进入自我评价阶段，请对自己的证据进行评价。',
    time: "2025年11月6日 04:51",
    isRead: true,
  },
]

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "arbitration":
      return <Crown className="w-4 h-4 text-amber-500" />
    case "peer_review":
      return <Bell className="w-4 h-4 text-blue-500" />
    case "evidence":
      return <AlertTriangle className="w-4 h-4 text-red-500" />
    case "game_start":
      return <Trophy className="w-4 h-4 text-amber-500" />
    default:
      return <MessageSquare className="w-4 h-4 text-muted-foreground" />
  }
}

export function NotificationsScreen() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [statusFilter, setStatusFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All Types")

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <div className="min-h-screen bg-muted pb-20">
      <AppHeader />

      {/* Sticky sub-header */}
      <div className="sticky top-14 z-30 bg-muted/95 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Notification Center</h1>
              <p className="text-xs text-blue-500">{unreadCount} unread messages</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/notifications/settings")}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <CheckSquare className="w-4 h-4" />
              Batch Actions
            </button>
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <Check className="w-4 h-4" />
              Mark All Read
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Filter:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm bg-card border border-border rounded-lg text-foreground"
          >
            <option>All</option>
            <option>Unread</option>
            <option>Read</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-sm bg-card border border-border rounded-lg text-foreground"
          >
            <option>All Types</option>
            <option>Arbitration</option>
            <option>Peer Review</option>
            <option>Evidence</option>
            <option>Game Start</option>
          </select>
        </div>
      </div>

      {/* Notification List */}
      <div className="px-4 py-4 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-card rounded-xl p-4 border transition-colors ${
              notification.isRead ? "border-border" : "border-primary/30 bg-primary/5"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground">{notification.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
              </div>
              <div className="flex items-center gap-1">
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 max-w-lg mx-auto">
        <footer className="pt-8 pb-4 text-center">
          <p className="text-xs text-muted-foreground">ChallengeNo. Challenge? No pressure!</p>
          <p className="text-xs text-muted-foreground">© 2025 onFuture Studio</p>
        </footer>
      </div>

      <BottomNav />
    </div>
  )
}
