import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { usersAPI } from '../services/api'
import { ArrowLeft, Eye, EyeOff, Lock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

interface ChangePasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ChangePasswordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordForm>()

  const newPassword = watch('newPassword')

  const changePasswordMutation = useMutation(
    (data: { currentPassword: string; newPassword: string }) =>
      usersAPI.changePassword(data),
    {
      onSuccess: () => {
        toast.success(t('changePassword.changeSuccess'))
        navigate('/profile')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || t('changePassword.changeFailed'))
      },
    }
  )

  const onSubmit = (data: ChangePasswordForm) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('common.back')}
        </button>

        {/* 修改密码表单 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('changePassword.title')}</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {t('changePassword.subtitle')}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* 当前密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('changePassword.currentPassword')}
              </label>
              <div className="relative">
                <input
                  {...register('currentPassword', {
                    required: t('changePassword.enterCurrentPassword'),
                  })}
                  type={showCurrentPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder={t('changePassword.enterCurrentPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* 新密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('changePassword.newPassword')}
              </label>
              <div className="relative">
                <input
                  {...register('newPassword', {
                    required: t('changePassword.enterNewPassword'),
                    minLength: { value: 8, message: t('changePassword.minLength') },
                    validate: (value) => {
                      if (/^\d+$/.test(value)) {
                        return t('changePassword.noDigitsOnly')
                      }
                      if (/^[a-zA-Z]+$/.test(value)) {
                        return t('changePassword.noLettersOnly')
                      }
                      const weakPasswords = ['12345678', '87654321', 'abcdefgh', 'password', 'qwertyui']
                      if (weakPasswords.includes(value.toLowerCase())) {
                        return t('changePassword.tooWeak')
                      }
                      if (/(.)\1{3,}/.test(value)) {
                        return t('changePassword.noRepeatingChars')
                      }
                      return true
                    },
                  })}
                  type={showNewPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder={t('changePassword.enterNewPassword')}
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
                <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
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
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* 提交按钮 */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={changePasswordMutation.isLoading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {changePasswordMutation.isLoading ? '修改中...' : '确认修改'}
              </button>
            </div>
          </form>
        </div>

        {/* 安全提示 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">安全提示</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 请使用包含字母、数字的复杂密码</li>
            <li>• 不要使用生日、电话号码等容易被猜到的密码</li>
            <li>• 定期更换密码可以提高账户安全性</li>
            <li>• 不要在多个网站使用相同的密码</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

