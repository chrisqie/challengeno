import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import BottomNav from './BottomNav'
import Footer from './Footer'
import FeedbackButton from './FeedbackButton'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* 顶部导航栏 */}
      <Navbar />

      {/* 主要内容区域 */}
      <main className="pb-20 pt-16 flex-1">
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>

      {/* 页面底部版权信息 */}
      <Footer />

      {/* 底部导航栏 */}
      <BottomNav />

      {/* 反馈按钮 */}
      <FeedbackButton />
    </div>
  )
}

export default Layout
