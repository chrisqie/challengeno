import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../services/api'
import toast from 'react-hot-toast'
import i18n from '../i18n'

interface User {
  id: string
  username: string
  email: string
  fullName: string
  avatar?: string
  dateOfBirth?: string
  participationPoints: number
  trustPoints: number
  laborPoints: number
  totalGamesCreated: number
  totalGamesJoined: number
  gamesCompleted: number
  isVip: boolean
  isAdmin?: boolean
  adminRole?: string
  vipExpiresAt?: string
  createdAt: string
  age?: number
  permissionLevel?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  setAuth: (token: string, user: User) => void
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
  refreshUser: () => Promise<void>
  forceRefreshPoints: () => Promise<void>
}

interface RegisterData {
  username: string
  email: string
  password: string
  fullName: string
  dateOfBirth: string
  referralCode?: string
}

// 生成唯一的标签页ID（用于多标签页支持，但现在改为共享登录状态）
const getTabId = () => {
  let tabId = sessionStorage.getItem('tab-id')
  if (!tabId) {
    tabId = Math.random().toString(36).substr(2, 9)
    sessionStorage.setItem('tab-id', tabId)
  }
  return tabId
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,

      login: async (username: string, password: string) => {
        try {
          const response = await api.post('/auth/login', { username, password })
          const { user, accessToken } = response.data

          console.log('Login successful, setting auth data:', { user: user.username, hasToken: !!accessToken })
          set({ user, token: accessToken })

          // 验证存储
          setTimeout(() => {
            const stored = localStorage.getItem('bet-together-auth')
            console.log('Auth data stored in localStorage:', stored)
          }, 100)

          toast.success(i18n.t('auth.loginSuccess'))
          return true
        } catch (error: any) {
          // 不在这里显示toast，让页面组件处理错误显示
          return false
        }
      },

      setAuth: (token: string, user: User) => {
        set({ user, token })
      },

      register: async (data: RegisterData) => {
        try {
          const response = await api.post('/auth/register', data)
          const { user, accessToken } = response.data

          set({ user, token: accessToken })
          toast.success(i18n.t('auth.registerSuccess'))
          return true
        } catch (error: any) {
          const message = error.response?.data?.message || i18n.t('auth.registerFailed')
          toast.error(message)
          return false
        }
      },

      logout: () => {
        set({ user: null, token: null })
        toast.success(i18n.t('auth.logoutSuccess'))
      },

      checkAuth: async () => {
        const { token } = get()
        if (!token) {
          set({ isLoading: false })
          return
        }

        try {
          const response = await api.get('/auth/profile')
          set({ user: response.data, isLoading: false })
        } catch (error: any) {
          // 如果是401错误（令牌过期或无效），清除认证信息
          if (error.response?.status === 401) {
            console.log('Token expired or invalid, logging out')
            set({ user: null, token: null, isLoading: false })
            toast.error(i18n.t('auth.sessionExpired'))
          } else {
            set({ user: null, token: null, isLoading: false })
          }
        }
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...userData } })
        }
      },

      // 刷新用户数据（用于积分更新后）
      refreshUser: async () => {
        const { token } = get()
        if (!token) return

        try {
          // 添加缓存破坏参数强制刷新
          const timestamp = Date.now()
          const response = await api.get(`/auth/profile?_t=${timestamp}`, {
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          })
          set({ user: response.data })
          console.log('User data refreshed after points update:', response.data.participationPoints, response.data.trustPoints, response.data.laborPoints)
        } catch (error) {
          console.error('Failed to refresh user data:', error)
        }
      },

      // 强制刷新用户积分（游戏操作后立即调用）
      forceRefreshPoints: async () => {
        const { refreshUser } = get()
        console.log('Force refreshing user points...')
        await refreshUser()

        // 触发相关查询的重新获取
        if (typeof window !== 'undefined' && (window as any).queryClient) {
          const queryClient = (window as any).queryClient
          queryClient.invalidateQueries(['user-profile'])
          queryClient.invalidateQueries(['user-points-stats'])
          queryClient.invalidateQueries(['user-achievements'])
        }
      },
    }),
    {
      name: 'bet-together-auth', // 统一的存储名称，所有标签页共享
      partialize: (state) => ({
        token: state.token,
        user: state.user
      }), // 同时保存token和user信息
      onRehydrateStorage: () => (state) => {
        console.log('Auth store rehydrated:', state ? 'with data' : 'empty')
        if (state?.token) {
          console.log('Token found in storage:', state.token.substring(0, 20) + '...')
        }
      },
    }
  )
)
