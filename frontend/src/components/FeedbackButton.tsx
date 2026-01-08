import { useState } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { feedbackAPI } from '../services/api'
import { useTranslation } from 'react-i18next'

interface FeedbackButtonProps {
  className?: string
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ className = '' }) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [email, setEmail] = useState('')
  const [type, setType] = useState<'BUG' | 'SUGGESTION' | 'OTHER'>('SUGGESTION')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!feedback.trim()) {
      toast.error(t('feedback.errors.emptyContent'))
      return
    }

    setIsSubmitting(true)

    try {
      await feedbackAPI.submit({
        type,
        content: feedback,
        email: email.trim() || undefined,
        userAgent: navigator.userAgent,
        url: window.location.href
      })

      toast.success(t('feedback.success'), {
        duration: 4000,
        icon: '🎉'
      })
      setFeedback('')
      setEmail('')
      setType('SUGGESTION')
      setIsOpen(false)
    } catch (error: any) {
      const message = error.response?.data?.message || t('feedback.errors.submitFailed')
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-36 right-4 z-40 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${className}`}
        title={t('feedback.title')}
      >
        <MessageSquare size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{t('feedback.title')}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('feedback.type.label')}
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'BUG' | 'SUGGESTION' | 'OTHER')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SUGGESTION">{t('feedback.type.suggestion')}</option>
                  <option value="BUG">{t('feedback.type.bug')}</option>
                  <option value="OTHER">{t('feedback.type.other')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('feedback.content.label')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={t('feedback.content.placeholder')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('feedback.email.label')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('feedback.email.placeholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 提交按钮 */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  {t('feedback.buttons.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !feedback.trim()}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      <span>{t('feedback.buttons.submit')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="px-4 pb-4 text-xs text-gray-500">
              <p>{t('feedback.note')}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FeedbackButton
