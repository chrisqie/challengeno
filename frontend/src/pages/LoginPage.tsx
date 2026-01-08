import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/authStore'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

interface LoginForm {
  username: string
  password: string
}

const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 从localStorage恢复登录限制状态
  const [failedAttempts, setFailedAttempts] = useState(() => {
    const stored = localStorage.getItem('login-failed-attempts')
    return stored ? parseInt(stored, 10) : 0
  })

  const [lockoutTime, setLockoutTime] = useState<number | null>(() => {
    const stored = localStorage.getItem('login-lockout-time')
    if (stored) {
      const lockTime = parseInt(stored, 10)
      // 检查锁定是否已过期
      if (Date.now() < lockTime) {
        return lockTime
      } else {
        // 锁定已过期，清除存储
        localStorage.removeItem('login-lockout-time')
        localStorage.removeItem('login-failed-attempts')
        return null
      }
    }
    return null
  })

  const [remainingTime, setRemainingTime] = useState(() => {
    const stored = localStorage.getItem('login-lockout-time')
    if (stored) {
      const lockTime = parseInt(stored, 10)
      const remaining = Math.ceil((lockTime - Date.now()) / 1000)
      return remaining > 0 ? remaining : 0
    }
    return 0
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors
  } = useForm<LoginForm>()

  // 倒计时效果
  useEffect(() => {
    if (lockoutTime && remainingTime > 0) {
      const timer = setInterval(() => {
        const now = Date.now()
        const remaining = Math.ceil((lockoutTime - now) / 1000)

        if (remaining <= 0) {
          setLockoutTime(null)
          setRemainingTime(0)
          setFailedAttempts(0)
          // 清除localStorage中的锁定状态
          localStorage.removeItem('login-lockout-time')
          localStorage.removeItem('login-failed-attempts')
        } else {
          setRemainingTime(remaining)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [lockoutTime, remainingTime])

  const onSubmit = async (data: LoginForm) => {
    // 检查是否在锁定期间
    if (lockoutTime && Date.now() < lockoutTime) {
      return
    }

    setIsLoading(true)
    clearErrors()

    try {
      const success = await login(data.username, data.password)
      if (success) {
        // 登录成功，重置失败次数和清除存储
        setFailedAttempts(0)
        setLockoutTime(null)
        localStorage.removeItem('login-failed-attempts')
        localStorage.removeItem('login-lockout-time')
        navigate('/')
      } else {
        // 登录失败，增加失败次数
        const newFailedAttempts = failedAttempts + 1
        setFailedAttempts(newFailedAttempts)
        localStorage.setItem('login-failed-attempts', newFailedAttempts.toString())

        if (newFailedAttempts >= 5) {
          // 5次失败后锁定15分钟
          const lockTime = Date.now() + 15 * 60 * 1000
          setLockoutTime(lockTime)
          setRemainingTime(15 * 60)
          localStorage.setItem('login-lockout-time', lockTime.toString())
          setError('root', {
            message: '登录失败次数过多，账户已被锁定15分钟'
          })
        } else {
          setError('root', {
            message: `用户名或密码错误 (剩余尝试次数: ${5 - newFailedAttempts})`
          })
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">CN</span>
            </div>
            <span className="font-bold text-2xl gradient-text">{t('common.appName')}</span>
          </div>
          <p className="text-gray-600">{t('auth.login.title')} {t('common.slogan')}</p>
        </div>

        {/* Login Form */}
        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.login.username')}
              </label>
              <input
                {...register('username', {
                  required: t('auth.login.errors.usernameRequired'),
                })}
                type="text"
                className="input"
                placeholder={t('auth.login.usernamePlaceholder')}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.login.password')}
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: t('auth.login.errors.passwordRequired'),
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder={t('auth.login.passwordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {t('auth.login.forgotPassword')}
                </button>
              </div>
            </div>

            {/* Login Error */}
            {errors.root && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{errors.root.message}</p>
                </div>
              </div>
            )}

            {/* Lockout Warning */}
            {lockoutTime && remainingTime > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800">
                    {t('auth.login.errors.accountLocked', {
                      time: `${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')}`
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || (lockoutTime ? Date.now() < lockoutTime : false)}
              className="w-full btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>{t('common.loading')}</span>
                </div>
              ) : (
                t('auth.login.loginButton')
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t('auth.login.noAccount')}{' '}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {t('auth.login.signUpNow')}
              </Link>
            </p>
          </div>
        </div>

        {/* 免责声明 */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            本平台不提供现金/财务对赌功能，并禁止此类行为。
            <br />
            18岁以下用户禁止注册使用。
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
