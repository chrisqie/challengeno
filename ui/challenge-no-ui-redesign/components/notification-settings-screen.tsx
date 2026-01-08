"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BottomNav } from "./bottom-nav"
import {
  Bell,
  ArrowLeft,
  BarChart2,
  RotateCcw,
  Users,
  UserCheck,
  Trophy,
  CheckCircle,
  FileText,
  Crown,
  Mail,
  Smartphone,
  Save,
} from "lucide-react"

interface NotificationSetting {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  enabled: boolean
}

export function NotificationSettingsScreen() {
  const router = useRouter()

  const [notificationTypes, setNotificationTypes] = useState<NotificationSetting[]>([
    {
      id: "friend_request",
      icon: <Users className="w-5 h-5 text-blue-500" />,
      title: "好友请求",
      description: "收到新的好友请求时通知",
      enabled: true,
    },
    {
      id: "friend_accepted",
      icon: <UserCheck className="w-5 h-5 text-green-500" />,
      title: "好友通过",
      description: "好友请求被接受时通知",
      enabled: false,
    },
    {
      id: "game_start",
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
      title: "游戏开始",
      description: "参与的游戏开始时通知",
      enabled: false,
    },
    {
      id: "game_complete",
      icon: <CheckCircle className="w-5 h-5 text-purple-500" />,
      title: "游戏完成",
      description: "游戏结束和结果公布时通知",
      enabled: false,
    },
    {
      id: "submit_evidence",
      icon: <FileText className="w-5 h-5 text-red-500" />,
      title: "提交证据",
      description: "需要提交证据时通知",
      enabled: false,
    },
    {
      id: "system",
      icon: <Crown className="w-5 h-5 text-amber-500" />,
      title: "系统通知",
      description: "系统更新和重要公告",
      enabled: false,
    },
  ])

  const [notificationMethods, setNotificationMethods] = useState<NotificationSetting[]>([
    {
      id: "email",
      icon: <Mail className="w-5 h-5 text-blue-500" />,
      title: "邮件通知",
      description: "通过邮件接收重要通知",
      enabled: false,
    },
    {
      id: "push",
      icon: <Smartphone className="w-5 h-5 text-green-500" />,
      title: "推送通知",
      description: "浏览器推送通知",
      enabled: false,
    },
  ])

  const toggleType = (id: string) => {
    setNotificationTypes((types) => types.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)))
  }

  const toggleMethod = (id: string) => {
    setNotificationMethods((methods) => methods.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)))
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">通知设置</h1>
                <p className="text-xs text-muted-foreground">管理您的通知偏好</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <BarChart2 className="w-4 h-4" />
              统计
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw className="w-4 h-4" />
              重置
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Notification Types */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-foreground mb-4">通知类型</h2>
          <div className="space-y-4">
            {notificationTypes.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {setting.icon}
                  <div>
                    <p className="font-medium text-foreground">{setting.title}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleType(setting.id)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    setting.enabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      setting.enabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Methods */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-foreground mb-4">通知方式</h2>
          <div className="space-y-4">
            {notificationMethods.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {setting.icon}
                  <div>
                    <p className="font-medium text-foreground">{setting.title}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleMethod(setting.id)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    setting.enabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      setting.enabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
          <Save className="w-5 h-5" />
          保存设置
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
