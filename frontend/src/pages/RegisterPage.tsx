import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/authStore'
import { Eye, EyeOff, AlertTriangle, Gift } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  fullName: string
  dateOfBirth: string
  referralCode?: string
  agreeTerms: boolean
}

const RegisterPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { register: registerUser } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [ageWarning, setAgeWarning] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>()

  const password = watch('password')

  // 从URL参数获取推荐码
  useEffect(() => {
    const refCode = searchParams.get('ref')
    if (refCode) {
      setValue('referralCode', refCode)
    }
  }, [searchParams, setValue])

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      const { confirmPassword, agreeTerms, ...registerData } = data
      const success = await registerUser(registerData)
      if (success) {
        navigate('/')
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
          <p className="text-gray-600">{t('auth.register.title')} {t('auth.register.subtitle')}</p>
        </div>

        {/* Register Form */}
        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.register.username')}
              </label>
              <input
                {...register('username', {
                  required: t('auth.register.errors.usernameRequired'),
                  minLength: { value: 3, message: t('auth.register.errors.usernameLength') },
                  maxLength: { value: 20, message: t('auth.register.errors.usernameLength') },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: 'Username can only contain letters, numbers and underscores',
                  },
                })}
                type="text"
                className="input"
                placeholder={t('auth.register.usernamePlaceholder')}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.register.email')}
              </label>
              <input
                {...register('email', {
                  required: t('auth.register.errors.emailRequired'),
                  pattern: {
                    value: /^[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
                    message: t('auth.register.errors.emailInvalid'),
                  },
                  validate: (value) => {
                    // Additional email format validation
                    if (value.includes('..') || value.includes('.-') || value.includes('-.')) {
                      return t('auth.register.errors.emailInvalid')
                    }
                    if (value.startsWith('.') || value.startsWith('-') || value.startsWith('_')) {
                      return 'Email cannot start with special characters'
                    }
                    if (value.includes('%') || value.includes('#') || value.includes('&')) {
                      return 'Email contains invalid special characters'
                    }
                    return true
                  },
                })}
                type="email"
                className="input"
                placeholder={t('auth.register.emailPlaceholder')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.register.fullName')}
              </label>
              <input
                {...register('fullName', {
                  required: t('auth.register.errors.fullNameRequired'),
                  minLength: { value: 2, message: t('auth.register.errors.fullNameLength') },
                })}
                type="text"
                className="input"
                placeholder={t('auth.register.fullNamePlaceholder')}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.register.dateOfBirth')}
              </label>
              <input
                {...register('dateOfBirth', {
                  required: t('auth.register.errors.dateOfBirthRequired'),
                  validate: (value) => {
                    const birthDate = new Date(value)
                    const today = new Date()
                    let age = today.getFullYear() - birthDate.getFullYear()
                    const monthDiff = today.getMonth() - birthDate.getMonth()

                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                      age--
                    }

                    if (age < 18) {
                      setAgeWarning(null)
                      return t('auth.register.errors.under18')
                    }

                    // 18-21 age restriction warning
                    if (age >= 18 && age < 21) {
                      setAgeWarning(t('auth.register.errors.ageWarning18to21'))
                    } else {
                      setAgeWarning(null)
                    }

                    return true
                  },
                })}
                type="date"
                className="input"
                max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
              )}
              {ageWarning && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800">{ageWarning}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Referral Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.register.referralCode')}
              </label>
              <input
                {...register('referralCode')}
                type="text"
                className="input"
                placeholder={t('auth.register.referralCodePlaceholder')}
              />
              <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                <Gift className="w-3 h-3" />
                {t('auth.register.referralCodeHint')}
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.register.password')}
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: t('auth.register.errors.passwordRequired'),
                    minLength: { value: 6, message: t('auth.register.errors.passwordLength') },
                    validate: (value) => {
                      // Check for numbers only
                      if (/^\d+$/.test(value)) {
                        return 'Password cannot be numbers only'
                      }

                      // Check for letters only
                      if (/^[a-zA-Z]+$/.test(value)) {
                        return 'Password cannot be letters only'
                      }

                      // Check for common weak passwords
                      const weakPasswords = ['12345678', '87654321', 'abcdefgh', 'password', 'qwertyui']
                      if (weakPasswords.includes(value.toLowerCase())) {
                        return 'Password is too simple, please use a stronger password'
                      }

                      // Check for birthday format (YYYYMMDD, DDMMYYYY, MMDDYYYY)
                      if (/^\d{8}$/.test(value)) {
                        return 'Password cannot be in birthday format'
                      }

                      // Check for consecutive characters
                      if (/(.)\1{3,}/.test(value)) {
                        return 'Password cannot contain 4 or more consecutive identical characters'
                      }

                      return true
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder={t('auth.register.passwordPlaceholder')}
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
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.register.confirmPassword')}
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword', {
                    required: t('auth.register.errors.passwordRequired'),
                    validate: (value) => value === password || t('auth.register.errors.passwordMismatch'),
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder={t('auth.register.confirmPasswordPlaceholder')}
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

            {/* Terms Agreement */}
            <div className="flex items-start space-x-2">
              <input
                {...register('agreeTerms', {
                  required: t('auth.register.errors.agreeTermsRequired'),
                })}
                type="checkbox"
                className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label className="text-sm text-gray-600">
                {t('auth.register.agreeTerms')}{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700">
                  {t('auth.register.termsOfService')}
                </a>{' '}
                {t('auth.register.and')}{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700">
                  {t('auth.register.privacyPolicy')}
                </a>
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-sm text-red-600">{errors.agreeTerms.message}</p>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>{t('common.loading')}</span>
                </div>
              ) : (
                t('auth.register.registerButton')
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t('auth.register.haveAccount')}{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {t('auth.register.logInNow')}
              </Link>
            </p>
          </div>
        </div>

        {/* 免责声明 */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            本平台不提供现金/财务对赌功能，并禁止此类行为。
            <br />
            18-21岁用户仅可使用健康模板与受限频次。
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
