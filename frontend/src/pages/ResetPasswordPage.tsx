import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { authAPI } from '../services/api'
import { ArrowLeft, Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface ResetPasswordForm {
  newPassword: string
  confirmPassword: string
}

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [userInfo, setUserInfo] = useState<{ username: string; email: string } | null>(null)
  const [verifying, setVerifying] = useState(true)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>()

  const newPassword = watch('newPassword')

  // 验证 token 并获取用户信息
  useEffect(() => {
    if (!token) {
      toast.error('无效的重置链接')
      navigate('/forgot-password')
      return
    }

    // 验证令牌
    authAPI.verifyResetToken(token)
      .then((response: any) => {
        if (response.data.valid) {
          setUserInfo({
            username: response.data.username,
            email: response.data.email,
          })
        } else {
          toast.error(response.data.message || '无效的重置令牌')
          navigate('/forgot-password')
        }
      })
      .catch((error: any) => {
        toast.error(error.response?.data?.message || '验证失败')
        navigate('/forgot-password')
      })
      .finally(() => {
        setVerifying(false)
      })
  }, [token, navigate])

  const resetPasswordMutation = useMutation(
    (data: { token: string; newPassword: string }) =>
      authAPI.resetPassword(data.token, data.newPassword),
    {
      onSuccess: () => {
        setResetSuccess(true)
        toast.success('密码重置成功！')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '重置失败，请重试')
      },
    }
  )

  const onSubmit = (data: ResetPasswordForm) => {
    if (!token) return
    resetPasswordMutation.mutate({
      token,
      newPassword: data.newPassword,
    })
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                密码重置成功！
              </h1>
              <p className="text-gray-600 mb-6">
                您的密码已成功重置，现在可以使用新密码登录了
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                前往登录
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 验证中
  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                验证重置链接...
              </h1>
              <p className="text-gray-600">
                请稍候
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          返回登录
        </button>

        {/* 重置密码表单 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              重置密码
            </h1>
            {userInfo && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  <strong>👤 用户ID：</strong>{userInfo.username}
                </p>
                <p className="text-sm text-blue-900 mt-1">
                  <strong>📧 邮箱：</strong>{userInfo.email}
                </p>
              </div>
            )}
            <p className="text-gray-600 mt-4">
              请输入您的新密码
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 新密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                新密码
              </label>
              <div className="relative">
                <input
                  {...register('newPassword', {
                    required: '请输入新密码',
                    minLength: { value: 8, message: '密码至少8个字符' },
                    validate: (value) => {
                      // 检查是否为纯数字
                      if (/^\d+$/.test(value)) {
                        return '密码不能为纯数字'
                      }

                      // 检查是否为纯字母
                      if (/^[a-zA-Z]+$/.test(value)) {
                        return '密码不能为纯字母'
                      }

                      // 检查是否为常见弱密码
                      const weakPasswords = ['12345678', '87654321', 'abcdefgh', 'password', 'qwertyui']
                      if (weakPasswords.includes(value.toLowerCase())) {
                        return '密码过于简单，请使用更复杂的密码'
                      }

                      // 检查连续字符
                      if (/(.)\1{3,}/.test(value)) {
                        return '密码不能包含4个或以上连续相同字符'
                      }

                      return true
                    },
                  })}
                  type={showNewPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="请输入新密码"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.newPassword.message}
                </p>
              )}
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-500">密码要求：</p>
                <ul className="text-xs text-gray-500 space-y-1 ml-4">
                  <li className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    至少8个字符
                  </li>
                  <li className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    包含字母和数字
                  </li>
                  <li className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    不能是常见弱密码
                  </li>
                </ul>
              </div>
            </div>

            {/* 确认新密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                确认新密码
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword', {
                    required: '请确认新密码',
                    validate: (value) => value === newPassword || '两次输入的密码不一致',
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="请再次输入新密码"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={resetPasswordMutation.isLoading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {resetPasswordMutation.isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  重置中...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  重置密码
                </>
              )}
            </button>
          </form>
        </div>

        {/* 安全提示 */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">🔒 安全提示</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 请使用包含字母、数字的复杂密码</li>
            <li>• 不要使用生日、电话号码等容易被猜到的密码</li>
            <li>• 不要在多个网站使用相同的密码</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
