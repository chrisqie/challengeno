import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { authAPI } from '../services/api'
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface ForgotPasswordForm {
  email: string
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordForm>()

  const email = watch('email')

  const forgotPasswordMutation = useMutation(
    (email: string) => authAPI.forgotPassword(email),
    {
      onSuccess: () => {
        setEmailSent(true)
        toast.success('密码重置邮件已发送！')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '发送失败，请重试')
      },
    }
  )

  const onSubmit = (data: ForgotPasswordForm) => {
    forgotPasswordMutation.mutate(data.email)
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                邮件已发送！
              </h1>
              <p className="text-gray-600 mb-6">
                我们已向 <strong>{email}</strong> 发送了密码重置邮件
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="text-sm font-medium text-blue-900 mb-2">📧 下一步操作：</h3>
                <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
                  <li>检查您的邮箱收件箱</li>
                  <li>点击邮件中的重置链接</li>
                  <li>设置新密码</li>
                  <li>使用新密码登录</li>
                </ol>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="text-sm font-medium text-yellow-900 mb-2">⚠️ 注意事项：</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• 重置链接有效期为 24 小时</li>
                  <li>• 如果没收到邮件，请检查垃圾箱</li>
                  <li>• 每次只能有一个有效的重置链接</li>
                </ul>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  返回登录
                </button>
                <button
                  onClick={() => setEmailSent(false)}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  重新发送
                </button>
              </div>
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

        {/* 忘记密码表单 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              忘记密码？
            </h1>
            <p className="text-gray-600">
              输入您的邮箱地址，我们将发送密码重置链接
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址
              </label>
              <input
                {...register('email', {
                  required: '请输入邮箱地址',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '请输入有效的邮箱地址',
                  },
                })}
                type="email"
                className="input"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={forgotPasswordMutation.isLoading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {forgotPasswordMutation.isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  发送中...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  发送重置邮件
                </>
              )}
            </button>
          </form>

          {/* 帮助信息 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              记起密码了？{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                立即登录
              </button>
            </p>
          </div>
        </div>

        {/* 安全提示 */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">🔒 安全提示</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 重置链接仅在 24 小时内有效</li>
            <li>• 我们不会通过邮件索要您的密码</li>
            <li>• 如果您没有请求重置，请忽略此邮件</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

