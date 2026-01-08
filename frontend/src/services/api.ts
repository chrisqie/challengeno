import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// 管理员API使用独立服务器
const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_URL || '/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
})

export const adminApi = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
})

// 公开API实例 - 用于不需要认证的接口
export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: false, // 不发送cookies
})

// 请求拦截器 - 添加认证token
const addAuthToken = (config: any) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

api.interceptors.request.use(addAuthToken, (error) => Promise.reject(error))
adminApi.interceptors.request.use(addAuthToken, (error) => Promise.reject(error))

// 公开API不需要认证token，但添加调试日志
publicApi.interceptors.request.use(
  (config) => {
    console.log('🌐 公开API请求:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
)

// 响应拦截器 - 处理认证错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 对于诊断和修复API，不要自动登出
    const isPublicAPI = error.config?.url?.includes('/templates/diagnose') ||
                       error.config?.url?.includes('/templates/quick-fix');

    // 只有在用户已登录的情况下收到401才执行logout
    // 匿名用户访问需要认证的API返回401是正常的，不应该触发logout
    const authStore = useAuthStore.getState();
    if (error.response?.status === 401 && !isPublicAPI && authStore.user) {
      authStore.logout()
    }
    return Promise.reject(error)
  }
)

// 公开API响应拦截器 - 用于调试
publicApi.interceptors.response.use(
  (response) => {
    console.log('✅ 公开API响应:', response.status, response.config.url);
    console.log('响应数据:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ 公开API错误:', error.response?.status, error.config?.url);
    console.error('错误数据:', error.response?.data);
    return Promise.reject(error);
  }
)

// API 接口定义
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),

  register: (data: any) =>
    api.post('/auth/register', data),

  getProfile: () =>
    api.get('/auth/profile'),

  // 请求密码重置
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  // 验证重置令牌
  verifyResetToken: (token: string) =>
    api.post('/auth/verify-reset-token', { token }),

  // 重置密码
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }),
}

export const gamesAPI = {
  getGames: (params?: any) =>
    api.get('/games', { params }),

  getMyGames: (type?: 'created' | 'joined' | 'all') =>
    api.get('/games/my', { params: { type } }),

  getGame: (id: string) =>
    api.get(`/games/${id}`),

  createGame: (data: any) =>
    api.post('/games', data),

  joinGame: (id: string) =>
    api.post(`/games/${id}/join`),

  leaveGame: (id: string) =>
    api.post(`/games/${id}/leave`),

  // 获取证据上传签名 URL
  getEvidenceUploadUrl: (id: string, data: { contentType: string; evidenceType: 'PHOTO' | 'VIDEO' }) =>
    api.post(`/games/${id}/evidence/upload-url`, data),

  submitEvidence: (id: string, data: any) =>
    api.post(`/games/${id}/evidence`, data),

  submitPeerEvaluation: (id: string, data: any) =>
    api.post(`/games/${id}/evaluate`, data),

  getGameParticipants: (id: string) =>
    api.get(`/games/${id}/participants`),

  getMyEvaluations: (id: string) =>
    api.get(`/games/${id}/my-evaluations`),

  getAllEvaluations: (id: string) =>
    api.get(`/games/${id}/all-evaluations`),

  getEvidenceValidationInfo: () =>
    api.get('/games/evidence/validation-info'),

  getGameSettlement: (id: string) =>
    api.get(`/games/${id}/settlement`),

  getUserGameStats: (period?: string) =>
    api.get('/games/stats/user', { params: { period } }),

  // 举报游戏
  reportGame: (gameId: string, data: { reason: string; description?: string }) =>
    api.post(`/games/${gameId}/report`, data),
}



export const pointsAPI = {
  getStats: () =>
    api.get('/points/stats'),

  getDetailedStats: () =>
    api.get('/points/detailed-stats'),

  getHistory: (limit?: number) =>
    api.get('/points/history', { params: { limit } }),

  getRankings: () =>
    api.get('/points/rankings'),

  getLeaderboard: (type: 'participation' | 'trust' | 'labor' | 'total', limit?: number) =>
    api.get(`/points/leaderboard/${type}`, { params: { limit } }),

  checkVIPExchange: () =>
    api.get('/points/vip-check'),
}

// 争议相关API
export const disputesAPI = {
  createDispute: (data: any) => api.post('/disputes', data),
  getDisputes: (params?: any) => api.get('/disputes', { params }),
  getDispute: (id: string) => api.get(`/disputes/${id}`),
  addEvidence: (id: string, data: any) => api.post(`/disputes/${id}/evidence`, data),
  cancelDispute: (id: string) => api.delete(`/disputes/${id}`),
  getAdminDisputes: (params?: any) => api.get('/disputes/admin/list', { params }),
  assignDispute: (id: string) => api.put(`/disputes/admin/${id}/assign`),
  resolveDispute: (id: string, data: any) => api.put(`/disputes/admin/${id}/resolve`, data),
}

export const templatesAPI = {
  getTemplates: (params?: {
    category?: string;
    subcategory?: string;
    difficultyLevel?: string;
    riskLevel?: string;
    isQuickStart?: boolean;
    isVipOnly?: boolean;
    vipTier?: string;
    search?: string;
    language?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    return api.get(`/templates?${searchParams.toString()}`);
  },

  getTemplate: (id: string) =>
    api.get(`/templates/${id}`),

  getQuickStartTemplates: () =>
    api.get('/templates/quick-start/list'),

  getCategoryStats: () =>
    api.get('/templates/stats/categories'),

  searchTemplates: (query: string) =>
    api.get(`/templates/search/${encodeURIComponent(query)}`),

  // 诊断和修复API - 使用公开API实例
  diagnoseTemplates: () =>
    publicApi.get('/templates/diagnose'),

  quickFixTemplates: () =>
    publicApi.post('/templates/quick-fix'),

  getTemplateCount: () =>
    api.get('/templates/count'),
}

export const teamsAPI = {
  // 创建团队
  createTeam: (data: any) =>
    api.post('/teams', data),

  // 获取用户的团队列表
  getUserTeams: () =>
    api.get('/teams/my'),

  // 发现团队
  discoverTeams: (page = 1, limit = 20) =>
    api.get(`/teams/discover?page=${page}&limit=${limit}`),

  // 加入团队
  joinTeam: (data: any) =>
    api.post('/teams/join', data),

  // 邀请用户加入团队
  inviteToTeam: (data: any) =>
    api.post('/teams/invite', data),

  // 获取团队详情
  getTeamById: (id: string) =>
    api.get(`/teams/${id}`),

  // 更新团队信息
  updateTeam: (id: string, data: any) =>
    api.put(`/teams/${id}`, data),

  // 离开团队
  leaveTeam: (id: string) =>
    api.delete(`/teams/${id}/leave`),

  // 踢出成员
  kickMember: (data: any) =>
    api.delete('/teams/kick', { data }),

  // 转让队长
  transferLeadership: (data: any) =>
    api.put('/teams/transfer-leadership', data),

  // 解散团队
  disbandTeam: (id: string) =>
    api.delete(`/teams/${id}`),

  // 获取团队邀请列表
  getTeamInvites: (id: string) =>
    api.get(`/teams/${id}/invites`),

  // 获取用户收到的团队邀请
  getReceivedInvites: () =>
    api.get('/teams/invites/received'),

  // 响应团队邀请
  respondToInvite: (data: any) =>
    api.post('/teams/invites/respond', data),

  // 重新生成邀请码
  regenerateInviteCode: (id: string) =>
    api.post(`/teams/${id}/regenerate-code`),

  // 通过邀请码获取团队信息
  getTeamByInviteCode: (code: string) =>
    api.get(`/teams/by-code/${code}`),

  // 团队游戏相关API
  joinTeamGame: (teamId: string, gameId: string) =>
    api.post(`/teams/${teamId}/join-game/${gameId}`),

  leaveTeamGame: (teamId: string, gameId: string) =>
    api.delete(`/teams/${teamId}/leave-game/${gameId}`),

  getTeamGames: (teamId: string) =>
    api.get(`/teams/${teamId}/games`),

  getAvailableTeamGames: (teamId: string) =>
    api.get(`/teams/${teamId}/available-games`),
}

export const friendsAPI = {
  // 发送好友请求
  sendFriendRequest: (username: string) =>
    api.post('/friends/request', { username }),

  // 响应好友请求
  respondToFriendRequest: (friendshipId: string, accept: boolean) =>
    api.post('/friends/respond', { friendshipId, accept }),

  // 获取好友列表
  getFriends: () => api.get('/friends'),

  // 获取待处理的好友请求
  getPendingRequests: () => api.get('/friends/pending'),

  // 删除好友
  removeFriend: (friendshipId: string) =>
    api.delete(`/friends/${friendshipId}`),

  // 检查好友关系
  checkFriendship: (userId: string) =>
    api.get(`/friends/check/${userId}`),

  // 屏蔽用户
  blockUser: (userId: string) =>
    api.post('/friends/block', { userId }),

  // 取消屏蔽
  unblockUser: (userId: string) =>
    api.post('/friends/unblock', { userId }),

  // 获取屏蔽列表
  getBlockedUsers: () =>
    api.get('/friends/blocked'),

  // 获取好友推荐
  getFriendRecommendations: () =>
    api.get('/friends/recommendations'),
}

export const notificationsAPI = {
  // 获取通知列表
  getNotifications: (limit?: number, offset?: number) =>
    api.get('/notifications', { params: { limit, offset } }),

  // 获取未读通知数量
  getUnreadCount: () =>
    api.get('/notifications/unread-count'),

  // 标记通知为已读
  markAsRead: (notificationId: string) =>
    api.post(`/notifications/${notificationId}/read`),

  // 标记所有通知为已读
  markAllAsRead: () =>
    api.post('/notifications/read-all'),

  // 删除通知
  deleteNotification: (notificationId: string) =>
    api.delete(`/notifications/${notificationId}`),
}

export const notificationSettingsAPI = {
  // 获取通知设置
  getSettings: () =>
    api.get('/notification-settings'),

  // 更新通知设置
  updateSettings: (settings: any) =>
    api.put('/notification-settings', settings),

  // 重置为默认设置
  resetSettings: () =>
    api.put('/notification-settings/reset'),

  // 获取通知统计
  getStats: () =>
    api.get('/notification-settings/stats'),
}

export const vipAPI = {
  getPlans: () =>
    api.get('/vip/plans'),

  getStatus: () =>
    api.get('/vip/status'),

  subscribe: (data: { tier: string; paymentMethod?: string }) =>
    api.post('/vip/subscribe', data),

  getHistory: () =>
    api.get('/vip/history'),

  checkFeature: (feature: string) =>
    api.get(`/vip/check/${feature}`, { params: { feature } }),

  getUsage: () =>
    api.get('/vip/usage'),
};

// 商城API
export const shopAPI = {
  getItems: (category?: string) =>
    api.get('/shop/items', { params: { category } }),

  getCategories: () =>
    api.get('/shop/categories'),

  getItem: (itemId: string) =>
    api.get(`/shop/items/${itemId}`),

  exchangeItem: (itemId: string, deliveryInfo?: string) =>
    api.post('/shop/exchange', { itemId, deliveryInfo }),

  getExchanges: (page?: number, limit?: number) =>
    api.get('/shop/exchanges', { params: { page, limit } }),

  getPointsBalance: () =>
    api.get('/shop/points/balance'),
};

// 成就API
export const achievementsAPI = {
  getAllAchievements: () =>
    api.get('/achievements'),

  getUserAchievements: () =>
    api.get('/achievements/user'),

  checkAchievements: () =>
    api.post('/achievements/check'),
};

export const adminAPI = {
  checkStatus: () =>
    adminApi.get('/admin/check'),

  getOverviewStats: () =>
    adminApi.get('/admin/stats/overview'),

  getUsers: (params?: any) =>
    adminApi.get('/admin/users', { params }),

  getUserDetail: (id: string) =>
    api.get(`/admin/users/${id}`),

  banUser: (id: string, data?: { reason?: string; duration?: number }) =>
    adminApi.put(`/admin/users/${id}/ban`, data || {}),

  unbanUser: (id: string) =>
    adminApi.put(`/admin/users/${id}/unban`),

  deleteUser: (id: string) =>
    adminApi.delete(`/admin/users/${id}`),

  restoreUser: (id: string) =>
    adminApi.put(`/admin/users/${id}/restore`),

  getGames: (params?: any) =>
    adminApi.get('/admin/games', { params }),

  suspendGame: (id: string) =>
    adminApi.put(`/admin/games/${id}/suspend`),

  resumeGame: (id: string) =>
    adminApi.put(`/admin/games/${id}/resume`),

  deleteGame: (id: string) =>
    adminApi.delete(`/admin/games/${id}`),

  getReports: (params?: any) =>
    adminApi.get('/admin/reports', { params }),

  approveReport: (id: string) =>
    adminApi.put(`/admin/reports/${id}/approve`),

  rejectReport: (id: string) =>
    adminApi.put(`/admin/reports/${id}/reject`),

  handleReport: (id: string, data: { status: string; resolution?: string }) =>
    adminApi.put(`/admin/reports/${id}/handle`, data),

  getDetailedStats: (timeRange?: string) =>
    adminApi.get('/admin/stats/detailed', { params: { timeRange } }),

  getRecentActivities: (limit?: number) =>
    adminApi.get('/admin/stats/recent-activities', { params: { limit } }),

  getAdminActions: (params?: any) =>
    adminApi.get('/admin/actions', { params }),

  // 证据管理相关API
  getEvidenceStats: () =>
    adminApi.get('/admin/evidence/stats'),

  getEvidenceList: (params?: any) =>
    adminApi.get('/admin/evidence', { params }),

  verifyEvidence: (evidenceId: string, isValid: boolean) =>
    adminApi.put(`/admin/evidence/${evidenceId}/verify`, { isValid }),

  exportEvidenceData: (params?: any) =>
    adminApi.get('/admin/evidence/export', { params, responseType: 'blob' }),

  getGamesList: () =>
    adminApi.get('/admin/games'),

  // 仲裁管理相关API
  getDisputes: (params?: any) =>
    adminApi.get('/disputes/admin/list', { params }),

  assignDispute: (disputeId: string) =>
    adminApi.put(`/disputes/admin/${disputeId}/assign`),

  resolveDispute: (disputeId: string, data: { decision: string; resolution: string; compensationAmount?: number; handlerType?: string }) =>
    adminApi.put(`/disputes/admin/${disputeId}/resolve`, {
      ...data,
      handlerType: data.handlerType || 'HUMAN_MANUAL'
    }),

  // VIP管理相关API
  getVipStats: () =>
    adminApi.get('/admin/vip/stats'),

  getVipUsers: (params?: any) =>
    adminApi.get('/admin/vip/users', { params }),

  extendVip: (userId: string, days: number) =>
    adminApi.put(`/admin/vip/${userId}/extend`, { days }),

  revokeVip: (userId: string) =>
    adminApi.put(`/admin/vip/${userId}/revoke`),

  upgradeVip: (userId: string, tier: string) =>
    adminApi.put(`/admin/vip/${userId}/upgrade`, { tier }),
}

// 消息API
export const messagesAPI = {
  // 发送消息
  sendMessage: (data: { receiverId: string; content: string; type?: string }) =>
    api.post('/messages', data),

  // 获取聊天列表
  getConversationList: () =>
    api.get('/messages/conversations'),

  // 获取与某个用户的聊天记录
  getConversation: (friendId: string, limit?: number, offset?: number) =>
    api.get(`/messages/conversation/${friendId}`, { params: { limit, offset } }),

  // 获取未读消息数
  getUnreadCount: () =>
    api.get('/messages/unread-count'),

  // 标记消息为已读
  markAsRead: (messageIds: string[]) =>
    api.post('/messages/mark-read', { messageIds }),

  // 删除消息
  deleteMessage: (messageId: string) =>
    api.delete(`/messages/${messageId}`),
}

// 推荐码API
export const referralAPI = {
  // 生成推荐码
  generateReferralCode: () =>
    api.post('/referral/generate'),

  // 使用推荐码
  useReferralCode: (data: { userId: string; referralCode: string }) =>
    api.post('/referral/use', data),

  // 获取推荐统计
  getReferralStats: () =>
    api.get('/referral/stats'),

  // 生成分享链接
  generateShareLink: (data: { type: 'app' | 'game' | 'achievement' | 'user_achievement' | 'achievements_overview'; targetId?: string }) =>
    api.post('/referral/share-link', data),

  // 发放推荐奖励（管理员）
  grantRewards: (data: { userId: string; referredUserId: string }) =>
    api.post('/referral/grant-rewards', data),
}

// 用户API
export const usersAPI = {
  // 搜索用户
  searchUsers: (query: string) =>
    api.get('/users/search/query', { params: { q: query } }),

  // 高级搜索
  advancedSearch: (params: any) =>
    api.get('/users/advanced-search', { params }),

  // 获取推荐用户
  getRecommendations: (params: any) =>
    api.get('/users/recommendations', { params }),

  // 获取热门用户
  getTrending: (params: any) =>
    api.get('/users/trending', { params }),

  // 根据用户名获取用户信息
  getUserByUsername: (username: string) =>
    api.get(`/users/${username}`),

  // 获取用户资料
  getProfile: (username: string) =>
    api.get(`/users/profile/${username}`),

  // 更新用户资料
  updateProfile: (data: any) =>
    api.put('/users/profile', data),

  // 修改密码
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/users/me/password', data),

  // 获取用户统计
  getStats: () =>
    api.get('/users/stats'),

  // 获取头像上传签名 URL
  getAvatarUploadUrl: (data: { contentType: string }) =>
    api.post('/users/avatar/upload-url', data),

  // 确认头像上传完成
  confirmAvatarUpload: (data: { avatarUrl: string }) =>
    api.post('/users/avatar/confirm', data),
}

export const favoritesAPI = {
  // 收藏游戏
  favoriteGame: (gameId: string) =>
    api.post(`/favorites/${gameId}`),

  // 取消收藏游戏
  unfavoriteGame: (gameId: string) =>
    api.delete(`/favorites/${gameId}`),

  // 获取我的收藏列表
  getMyFavorites: (page?: number, limit?: number) =>
    api.get('/favorites/my', { params: { page, limit } }),

  // 检查是否收藏了某个游戏
  checkFavorite: (gameId: string) =>
    api.get(`/favorites/check/${gameId}`),
}

export const feedbackAPI = {
  // 提交反馈
  submit: (data: {
    type: 'BUG' | 'SUGGESTION' | 'OTHER';
    content: string;
    email?: string;
    userAgent?: string;
    url?: string;
  }) => api.post('/feedback', data),

  // 获取所有反馈（管理员）
  getAll: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }) => api.get('/feedback', { params }),

  // 处理反馈（管理员）
  handle: (id: string, data: {
    status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    adminNotes?: string;
  }) => api.patch(`/feedback/${id}`, data),

  // 获取反馈统计（管理员）
  getStats: () => api.get('/feedback/stats'),
}
