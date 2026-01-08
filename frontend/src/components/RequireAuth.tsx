import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { LogIn, UserPlus } from 'lucide-react'

interface RequireAuthProps {
  children: ReactNode
  fallback?: ReactNode
  showModal?: boolean
}

/**
 * 权限检查组件 - 需要登录才能访问
 * 
 * @param children - 需要登录才能显示的内容
 * @param fallback - 未登录时显示的内容（可选）
 * @param showModal - 是否显示登录提示弹窗（默认false）
 */
const RequireAuth = ({ children, fallback, showModal = false }: RequireAuthProps) => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  // 已登录，显示内容
  if (user) {
    return <>{children}</>
  }

  // 未登录，显示fallback或默认提示
  if (fallback) {
    return <>{fallback}</>
  }

  // 默认登录提示
  if (showModal) {
    return <LoginModal />
  }

  return <LoginPrompt />
}

/**
 * 登录提示组件（内联）
 */
const LoginPrompt = () => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <LogIn className="w-4 h-4" />
      <span>请先</span>
      <button
        onClick={() => navigate('/login')}
        className="text-blue-600 hover:text-blue-700 font-medium"
      >
        登录
      </button>
      <span>或</span>
      <button
        onClick={() => navigate('/register')}
        className="text-blue-600 hover:text-blue-700 font-medium"
      >
        注册
      </button>
    </div>
  )
}

/**
 * 登录提示弹窗
 */
const LoginModal = () => {
  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 animate-fade-in">
        <div className="text-center">
          {/* 图标 */}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>

          {/* 标题 */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            需要登录
          </h2>

          {/* 描述 */}
          <p className="text-gray-600 mb-6">
            登录后即可参与挑战、创建游戏、结交好友
          </p>

          {/* 按钮 */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              登录
            </button>
            <button
              onClick={() => navigate('/register')}
              className="flex-1 bg-white text-blue-600 py-3 px-6 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              注册
            </button>
          </div>

          {/* 关闭按钮 */}
          <button
            onClick={() => window.history.back()}
            className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
          >
            返回
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * 登录按钮组件（用于替代需要登录的操作）
 */
export const LoginButton = ({ text = '登录后使用', className = '' }: { text?: string; className?: string }) => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/login')}
      className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${className}`}
    >
      <LogIn className="w-4 h-4" />
      {text}
    </button>
  )
}

export default RequireAuth

