import { useState, useEffect } from 'react'
import { Clock, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface TimeOption {
  label: string
  value: string
  getDateTime: () => Date
  description?: string
}

interface SimpleTimeSelectorProps {
  onTimeChange: (startTime: Date, label: string) => void
  className?: string
}

const SimpleTimeSelector: React.FC<SimpleTimeSelectorProps> = ({
  onTimeChange,
  className = ''
}) => {
  const { t } = useTranslation()
  const [selectedOption, setSelectedOption] = useState<string>('five_minutes')

  // 计算各种时间选项
  const getTimeOptions = (): TimeOption[] => {
    const now = new Date()

    // 5分钟后开始
    const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000)

    // 1小时后开始
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)

    // 今晚8点
    const tonight8 = new Date()
    tonight8.setHours(20, 0, 0, 0)
    if (tonight8 <= now) {
      tonight8.setDate(tonight8.getDate() + 1) // 如果已过今晚8点，则为明晚8点
    }

    // 明早8点
    const tomorrow8 = new Date()
    tomorrow8.setDate(tomorrow8.getDate() + 1)
    tomorrow8.setHours(8, 0, 0, 0)

    // 本周末（周六上午10点）
    const thisWeekend = new Date()
    const daysUntilSaturday = (6 - thisWeekend.getDay()) % 7 || 7 // 0=周日，6=周六
    thisWeekend.setDate(thisWeekend.getDate() + daysUntilSaturday)
    thisWeekend.setHours(10, 0, 0, 0)

    return [
      {
        label: t('simpleTimeSelector.options.fiveMinutes.label'),
        value: 'five_minutes',
        getDateTime: () => fiveMinutesLater,
        description: t('simpleTimeSelector.options.fiveMinutes.description')
      },
      {
        label: t('simpleTimeSelector.options.oneHour.label'),
        value: 'one_hour',
        getDateTime: () => oneHourLater,
        description: t('simpleTimeSelector.options.oneHour.description')
      },
      {
        label: t('simpleTimeSelector.options.tonight.label'),
        value: 'tonight_8',
        getDateTime: () => tonight8,
        description: t('simpleTimeSelector.options.tonight.description')
      },
      {
        label: t('simpleTimeSelector.options.tomorrow.label'),
        value: 'tomorrow_8',
        getDateTime: () => tomorrow8,
        description: t('simpleTimeSelector.options.tomorrow.description')
      },
      {
        label: t('simpleTimeSelector.options.weekend.label'),
        value: 'weekend',
        getDateTime: () => thisWeekend,
        description: t('simpleTimeSelector.options.weekend.description')
      }
    ]
  }

  const timeOptions = getTimeOptions()

  // 当选择改变时，通知父组件
  useEffect(() => {
    const selectedTimeOption = timeOptions.find(option => option.value === selectedOption)
    if (selectedTimeOption) {
      onTimeChange(selectedTimeOption.getDateTime(), selectedTimeOption.label)
    }
  }, [selectedOption])

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
        <Clock size={16} />
        <span>{t('simpleTimeSelector.title')}</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {timeOptions.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all
              ${selectedOption === option.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="startTime"
                value={option.value}
                checked={selectedOption === option.value}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-gray-500">{option.description}</div>
                )}
              </div>
            </div>
            <Calendar size={16} className="text-gray-400" />
          </label>
        ))}
      </div>

      {/* 说明文字 */}
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        💡 {t('simpleTimeSelector.hint')}
      </div>
    </div>
  )
}

export default SimpleTimeSelector
