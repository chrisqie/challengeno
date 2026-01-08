import React, { useState, useEffect } from 'react'
import { Clock, Calendar, Users, FileText, MessageSquare, Gavel, Archive } from 'lucide-react'
import { TimeUtil } from '../utils/time'
import { useTranslation } from 'react-i18next'

interface TimeOption {
  label: string
  value: string
  description: string
  getJoinDeadline: () => Date
  getStartDate: () => Date
  getEndDate: () => Date
}

interface GameTimeData {
  joinDeadline: string      // 加入截止时间
  startDate: string         // 游戏开始时间
  endDate: string           // 游戏结束时间
  evidenceDeadline: string  // 证据提交截止
  reviewDeadline: string    // 互评截止时间
  arbitrationDeadline: string // 仲裁截止时间
}

interface GameTimeSelectorProps {
  onTimeChange: (timeData: GameTimeData, label: string) => void
  defaultDurationHours?: number
  className?: string
}

const GameTimeSelector: React.FC<GameTimeSelectorProps> = ({
  onTimeChange,
  defaultDurationHours = 168, // 默认7天
  className = ''
}) => {
  const { t } = useTranslation()
  const [selectedOption, setSelectedOption] = useState<string>('five_minutes')
  const [selectedLabel, setSelectedLabel] = useState<string>('')

  const getTimeOptions = (): TimeOption[] => {
    const now = new Date()

    // 15分钟后开始游戏，给用户10分钟加入时间
    const quickJoin = new Date(now.getTime() + 5 * 60 * 1000)  // 5分钟后可以加入
    const quickStart = new Date(now.getTime() + 15 * 60 * 1000) // 15分钟后开始
    const quickEnd = new Date(quickStart.getTime() + defaultDurationHours * 60 * 60 * 1000)

    // 1小时后开始游戏，给用户30分钟加入时间
    const oneHourJoin = new Date(now.getTime() + 30 * 60 * 1000) // 30分钟后可以加入
    const oneHourStart = new Date(now.getTime() + 60 * 60 * 1000) // 1小时后开始
    const oneHourEnd = new Date(oneHourStart.getTime() + defaultDurationHours * 60 * 60 * 1000)

    // 今晚7点开始加入，8点开始游戏
    const tonight7Join = new Date()
    tonight7Join.setHours(19, 0, 0, 0)
    if (tonight7Join <= now) {
      tonight7Join.setDate(tonight7Join.getDate() + 1)
    }
    const tonight8Start = new Date(tonight7Join.getTime() + 60 * 60 * 1000)
    const tonight8End = new Date(tonight8Start.getTime() + defaultDurationHours * 60 * 60 * 1000)

    // 明早7点开始加入，8点开始游戏
    const tomorrow7Join = new Date()
    tomorrow7Join.setDate(tomorrow7Join.getDate() + 1)
    tomorrow7Join.setHours(7, 0, 0, 0)
    const tomorrow8Start = new Date(tomorrow7Join.getTime() + 60 * 60 * 1000)
    const tomorrow8End = new Date(tomorrow8Start.getTime() + defaultDurationHours * 60 * 60 * 1000)

    // 本周末（周六上午9点开始加入，10点开始游戏）
    const thisWeekendJoin = new Date()
    const daysUntilSaturday = (6 - thisWeekendJoin.getDay()) % 7 || 7
    thisWeekendJoin.setDate(thisWeekendJoin.getDate() + daysUntilSaturday)
    thisWeekendJoin.setHours(9, 0, 0, 0)
    const thisWeekendStart = new Date(thisWeekendJoin.getTime() + 60 * 60 * 1000)
    const thisWeekendEnd = new Date(thisWeekendStart.getTime() + defaultDurationHours * 60 * 60 * 1000)

    return [
      {
        label: t('game.startTime.15min'),
        value: 'fifteen_minutes',
        description: t('game.startTime.15minDesc'),
        getJoinDeadline: () => quickJoin,
        getStartDate: () => quickStart,
        getEndDate: () => quickEnd
      },
      {
        label: t('game.startTime.1hour'),
        value: 'one_hour',
        description: t('game.startTime.1hourDesc'),
        getJoinDeadline: () => oneHourJoin,
        getStartDate: () => oneHourStart,
        getEndDate: () => oneHourEnd
      },
      {
        label: t('game.startTime.tonight8'),
        value: 'tonight_8',
        description: t('game.startTime.tonight8Desc'),
        getJoinDeadline: () => tonight7Join,
        getStartDate: () => tonight8Start,
        getEndDate: () => tonight8End
      },
      {
        label: t('game.startTime.tomorrow8'),
        value: 'tomorrow_8',
        description: t('game.startTime.tomorrow8Desc'),
        getJoinDeadline: () => tomorrow7Join,
        getStartDate: () => tomorrow8Start,
        getEndDate: () => tomorrow8End
      },
      {
        label: t('game.startTime.weekend'),
        value: 'weekend',
        description: t('game.startTime.weekendDesc'),
        getJoinDeadline: () => thisWeekendJoin,
        getStartDate: () => thisWeekendStart,
        getEndDate: () => thisWeekendEnd
      }
    ]
  }

  const calculateAllTimes = (option: TimeOption): GameTimeData => {
    const joinDeadline = option.getJoinDeadline()
    const startDate = option.getStartDate()
    const endDate = option.getEndDate()
    
    // 证据提交截止：游戏结束后24小时
    const evidenceDeadline = new Date(endDate.getTime() + 24 * 60 * 60 * 1000)

    // 互评截止：证据提交截止后30分钟（测试环境）
    const reviewDeadline = new Date(evidenceDeadline.getTime() + 30 * 60 * 1000)

    // 仲裁截止：互评截止后30分钟（测试环境）
    const arbitrationDeadline = new Date(reviewDeadline.getTime() + 30 * 60 * 1000)

    // 直接使用ISO字符串，避免时区转换问题
    return {
      joinDeadline: joinDeadline.toISOString(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      evidenceDeadline: evidenceDeadline.toISOString(),
      reviewDeadline: reviewDeadline.toISOString(),
      arbitrationDeadline: arbitrationDeadline.toISOString()
    }
  }

  const handleOptionChange = (optionValue: string) => {
    setSelectedOption(optionValue)
    const options = getTimeOptions()
    const selectedOpt = options.find(opt => opt.value === optionValue)
    
    if (selectedOpt) {
      setSelectedLabel(selectedOpt.label)
      const timeData = calculateAllTimes(selectedOpt)
      onTimeChange(timeData, selectedOpt.label)
    }
  }

  // 初始化时自动选择第一个选项
  useEffect(() => {
    handleOptionChange('fifteen_minutes')
  }, [defaultDurationHours])

  const timeOptions = getTimeOptions()

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid gap-3">
        {timeOptions.map((option) => (
          <div
            key={option.value}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedOption === option.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
            onClick={() => handleOptionChange(option.value)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedOption === option.value
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedOption === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </div>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {/* 时间流程预览 */}
      {selectedLabel && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">{t('game.timeline.preview')}</h4>
          <div className="space-y-2 text-sm">
            {(() => {
              const selectedOpt = timeOptions.find(opt => opt.value === selectedOption)
              if (!selectedOpt) return null

              const timeData = calculateAllTimes(selectedOpt)

              return (
                <>
                  <div className="flex items-center space-x-2 text-green-600">
                    <Users className="w-4 h-4" />
                    <span>{t('game.timeline.joinDeadline')} {TimeUtil.formatDate(TimeUtil.toServerTime(timeData.joinDeadline))}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Calendar className="w-4 h-4" />
                    <span>{t('game.timeline.gameStart')} {TimeUtil.formatDate(TimeUtil.toServerTime(timeData.startDate))}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-orange-600">
                    <Clock className="w-4 h-4" />
                    <span>{t('game.timeline.gameEnd')} {TimeUtil.formatDate(TimeUtil.toServerTime(timeData.endDate))}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-600">
                    <FileText className="w-4 h-4" />
                    <span>{t('game.timeline.evidenceDeadline')} {TimeUtil.formatDate(TimeUtil.toServerTime(timeData.evidenceDeadline))}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-pink-600">
                    <MessageSquare className="w-4 h-4" />
                    <span>{t('game.timeline.reviewDeadline')} {TimeUtil.formatDate(TimeUtil.toServerTime(timeData.reviewDeadline))}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-red-600">
                    <Gavel className="w-4 h-4" />
                    <span>{t('game.timeline.arbitrationDeadline')} {TimeUtil.formatDate(TimeUtil.toServerTime(timeData.arbitrationDeadline))}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Archive className="w-4 h-4" />
                    <span>{t('game.timeline.gameClosure')}</span>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

export default GameTimeSelector
