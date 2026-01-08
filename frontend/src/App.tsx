import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { useEffect, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from './components/Layout'
import PageLoader from './components/PageLoader'
import MobileBottomNav from './components/MobileBottomNav'
import PWAInstallPrompt from './components/PWAInstallPrompt'

// 核心页面 - 立即加载（首屏需要）
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// 其他页面 - 懒加载
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const CreateGamePage = lazy(() => import('./pages/CreateGamePage'))
const CreateGameWizardPage = lazy(() => import('./pages/CreateGameWizardPage'))
const GameDetailPage = lazy(() => import('./pages/GameDetailPage'))
const SubmitEvidencePageV2 = lazy(() => import('./pages/SubmitEvidencePageV2'))
const PeerEvaluationPage = lazy(() => import('./pages/PeerEvaluationPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const EnhancedProfilePage = lazy(() => import('./pages/EnhancedProfilePage'))
const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage'))
const UserDiscoveryPage = lazy(() => import('./pages/UserDiscoveryPage'))
const MyGamesPage = lazy(() => import('./pages/MyGamesPage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))
const FriendsPage = lazy(() => import('./pages/FriendsPage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
const NotificationSettingsPage = lazy(() => import('./pages/NotificationSettingsPage'))
const VipPage = lazy(() => import('./pages/VipPage'))
const ShopPage = lazy(() => import('./pages/ShopPage'))
const ShopExchangesPage = lazy(() => import('./pages/ShopExchangesPage'))
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'))
const TemplateSelectionPage = lazy(() => import('./pages/TemplateSelectionPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const TeamsPage = lazy(() => import('./pages/TeamsPage'))
const TeamDetailPage = lazy(() => import('./pages/TeamDetailPage'))
const ChatPage = lazy(() => import('./pages/ChatPage'))
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'))
const FriendRecommendationsPage = lazy(() => import('./pages/FriendRecommendationsPage'))
const LocationTestPage = lazy(() => import('./pages/LocationTestPage'))
const LocationDebugPage = lazy(() => import('./pages/LocationDebugPage'))
const BlockedUsersPage = lazy(() => import('./pages/BlockedUsersPage'))
const ArbitrationPage = lazy(() => import('./pages/ArbitrationPage'))
const AdminArbitrationPage = lazy(() => import('./pages/AdminArbitrationPage'))
const PointsHistoryPage = lazy(() => import('./pages/PointsHistoryPage'))
const PointsStatsPage = lazy(() => import('./pages/PointsStatsPage'))
const UserStatsPage = lazy(() => import('./pages/UserStatsPage'))
const CategoryPage = lazy(() => import('./pages/CategoryPage').then(m => ({ default: m.CategoryPage })))
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'))
const DisputesPage = lazy(() => import('./pages/DisputesPage'))
const DisputeDetailPage = lazy(() => import('./pages/DisputeDetailPage'))
const CreateDisputePage = lazy(() => import('./pages/CreateDisputePage'))
const AdminDisputesPage = lazy(() => import('./pages/AdminDisputesPage'))
const PrivacySettingsPage = lazy(() => import('./pages/PrivacySettingsPage'))
const ReferralPage = lazy(() => import('./pages/ReferralPage'))
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'))
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'))
const AdminGamesPage = lazy(() => import('./pages/AdminGamesPage'))
const AdminReportsPage = lazy(() => import('./pages/AdminReportsPage'))
const AdminStatsPage = lazy(() => import('./pages/AdminStatsPage'))
const AdminVipPage = lazy(() => import('./pages/AdminVipPage'))
const AdminShopPage = lazy(() => import('./pages/AdminShopPage'))
const AdminTeamsPage = lazy(() => import('./pages/admin/TeamManagementPage'))
const AdminFeedbackPage = lazy(() => import('./pages/AdminFeedbackPage'))
const DebugVipPage = lazy(() => import('./pages/DebugVipPage'))
const TemplateDiagnosePage = lazy(() => import('./pages/TemplateDiagnosePage'))
const TimezoneTestPage = lazy(() => import('./pages/TimezoneTestPage'))

function App() {
  const { t } = useTranslation()
  const { user, isLoading, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return <PageLoader message={t('common.initializing')} fullScreen />
  }

  return (
    <>
      <Suspense fallback={<PageLoader message={t('common.loading')} fullScreen />}>
        <Routes>
          {/* 公开路由 */}
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* 管理后台路由 */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/games" element={<AdminGamesPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/stats" element={<AdminStatsPage />} />
        <Route path="/admin/vip" element={<AdminVipPage />} />
        <Route path="/admin/shop" element={<AdminShopPage />} />
        <Route path="/admin/teams" element={<AdminTeamsPage />} />
        <Route path="/admin/arbitration" element={<AdminArbitrationPage />} />
        <Route path="/admin/disputes" element={<AdminDisputesPage />} />
        <Route path="/admin/feedback" element={<AdminFeedbackPage />} />

        {/* 调试路由 - 不需要认证 */}
        <Route path="/debug-templates" element={<TemplateDiagnosePage />} />
        <Route path="/debug-vip" element={<DebugVipPage />} />
        <Route path="/timezone-test" element={<TimezoneTestPage />} />
        <Route path="/location-test" element={<LocationTestPage />} />
        <Route path="/location-debug" element={<LocationDebugPage />} />

        {/* 主路由 - Layout包裹所有页面 */}
        <Route path="/" element={<Layout />}>
          {/* 公开访问的页面 */}
          <Route index element={<HomePage />} />
          <Route path="game/:id" element={<GameDetailPage />} />
          <Route path="category/:categoryId" element={<CategoryPage />} />
          <Route path="category/:categoryId/:subcategoryId" element={<CategoryPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />

          {/* 需要登录的页面 */}
          <Route path="create" element={user ? <CreateGamePage /> : <Navigate to="/login" />} />
          <Route path="create-wizard" element={user ? <CreateGameWizardPage /> : <Navigate to="/login" />} />
          <Route path="templates" element={user ? <TemplateSelectionPage /> : <Navigate to="/login" />} />
          <Route path="game/:id/evidence" element={user ? <SubmitEvidencePageV2 /> : <Navigate to="/login" />} />
          <Route path="game/:id/evaluate" element={user ? <PeerEvaluationPage /> : <Navigate to="/login" />} />
          <Route path="profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="enhanced-profile" element={user ? <EnhancedProfilePage /> : <Navigate to="/login" />} />
          <Route path="change-password" element={user ? <ChangePasswordPage /> : <Navigate to="/login" />} />
          <Route path="my-games" element={user ? <MyGamesPage /> : <Navigate to="/login" />} />
          <Route path="favorites" element={user ? <FavoritesPage /> : <Navigate to="/login" />} />
          <Route path="friends" element={user ? <FriendsPage /> : <Navigate to="/login" />} />
          <Route path="friends/recommendations" element={user ? <FriendRecommendationsPage /> : <Navigate to="/login" />} />
          <Route path="friends/blocked" element={user ? <BlockedUsersPage /> : <Navigate to="/login" />} />
          <Route path="discover" element={user ? <UserDiscoveryPage /> : <Navigate to="/login" />} />
          <Route path="notifications" element={user ? <NotificationsPage /> : <Navigate to="/login" />} />
          <Route path="notifications/settings" element={user ? <NotificationSettingsPage /> : <Navigate to="/login" />} />
          <Route path="vip" element={user ? <VipPage /> : <Navigate to="/login" />} />
          <Route path="shop" element={user ? <ShopPage /> : <Navigate to="/login" />} />
          <Route path="shop/exchanges" element={user ? <ShopExchangesPage /> : <Navigate to="/login" />} />
          <Route path="achievements" element={user ? <AchievementsPage /> : <Navigate to="/login" />} />
          <Route path="settings" element={user ? <SettingsPage /> : <Navigate to="/login" />} />
          <Route path="teams" element={user ? <TeamsPage /> : <Navigate to="/login" />} />
          <Route path="teams/:id" element={user ? <TeamDetailPage /> : <Navigate to="/login" />} />
          <Route path="chat/:friendId" element={user ? <ChatPage /> : <Navigate to="/login" />} />
          <Route path="user/:username" element={user ? <UserProfilePage /> : <Navigate to="/login" />} />
          <Route path="arbitration/:gameId" element={user ? <ArbitrationPage /> : <Navigate to="/login" />} />
          <Route path="points/history" element={user ? <PointsHistoryPage /> : <Navigate to="/login" />} />
          <Route path="points/stats" element={user ? <PointsStatsPage /> : <Navigate to="/login" />} />
          <Route path="stats" element={user ? <UserStatsPage /> : <Navigate to="/login" />} />
          <Route path="disputes" element={user ? <DisputesPage /> : <Navigate to="/login" />} />
          <Route path="disputes/create" element={user ? <CreateDisputePage /> : <Navigate to="/login" />} />
          <Route path="disputes/:id" element={user ? <DisputeDetailPage /> : <Navigate to="/login" />} />
          <Route path="settings/privacy" element={user ? <PrivacySettingsPage /> : <Navigate to="/login" />} />
          <Route path="referral" element={user ? <ReferralPage /> : <Navigate to="/login" />} />
        </Route>

        {/* 404 重定向 */}
        <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>

      {/* 移动端底部导航 */}
      <MobileBottomNav />

      {/* PWA安装提示 */}
      <PWAInstallPrompt />
    </>
  )
}

export default App
