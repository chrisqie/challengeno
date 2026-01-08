import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 配置Day.js插件
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

/**
 * 简化的时间处理工具
 * 使用Day.js处理时区和格式化
 */
export class TimeUtil {
  /**
   * 获取用户时区偏移字符串（如：+8, -5）
   */
  static getTimezoneOffsetString(): string {
    const offset = -new Date().getTimezoneOffset() / 60
    return offset >= 0 ? `+${offset}` : `${offset}`
  }

  /**
   * 获取时区名称（如：Asia/Shanghai）
   */
  static getTimezoneName(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  /**
   * 将datetime-local输入值转换为UTC ISO字符串发送给服务器
   * datetime-local的值是本地时间，需要正确转换为UTC
   */
  static toServerTime(localDateTime: string): string {
    // datetime-local格式: "2025-10-28T14:30"
    // 这个时间是用户本地时区的时间，需要转换为UTC

    // 使用原生Date构造函数，它会将输入视为本地时间
    const localDate = new Date(localDateTime)
    const utcISOString = localDate.toISOString()

    console.log('🌍 时间转换调试:', {
      输入datetime_local: localDateTime,
      解析为本地Date: localDate.toString(),
      本地时间戳: localDate.getTime(),
      转换为UTC_ISO: utcISOString,
      时区偏移分钟: localDate.getTimezoneOffset(),
      验证: `本地${localDateTime} -> UTC ${utcISOString}`
    })

    return utcISOString
  }

  /**
   * 将服务器UTC时间转换为本地显示时间（带时区信息）
   */
  static toLocalDisplayWithTimezone(serverTime: string | Date): string {
    const localTime = dayjs.utc(serverTime).local()
    const offset = this.getTimezoneOffsetString()
    const hour = localTime.hour()

    let timeStr = ''
    if (hour === 0) {
      timeStr = localTime.format('YYYY-MM-DD 午夜00:mm')
    } else if (hour === 12) {
      timeStr = localTime.format('YYYY-MM-DD 中午12:mm')
    } else if (hour < 12) {
      timeStr = localTime.format('YYYY-MM-DD 上午HH:mm')
    } else {
      timeStr = localTime.format('YYYY-MM-DD 下午HH:mm')
    }

    return `${timeStr} (UTC${offset})`
  }

  /**
   * 将服务器UTC时间转换为本地显示时间（使用浏览器原生国际化）
   */
  static toLocalDisplay(serverTime: string | Date): string {
    // 服务器时间是UTC，需要转换为本地时间显示
    const date = new Date(serverTime)

    // 使用浏览器原生国际化API，自动根据用户语言显示
    // 这会自动处理"下午"、"PM"、"午後"等不同语言的时间格式
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // 使用24小时制，更清晰
    })
  }

  /**
   * 格式化当前时间显示（使用浏览器原生国际化）
   */
  static formatCurrentTime(): string {
    const now = new Date()

    // 使用浏览器原生国际化API
    return now.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // 使用24小时制
    })
  }

  /**
   * 计算时间差并格式化显示（全球同步版本）
   * 服务器时间是UTC，需要正确处理时区
   */
  static formatTimeUntil(targetTime: string | Date): string {
    // 确保正确处理UTC时间
    const target = dayjs.utc(targetTime).local() // 服务器UTC时间转本地时间
    const now = dayjs() // 当前本地时间
    const diff = target.diff(now)

    // 移除频繁的日志输出，避免首页无限刷新
    // console.log('倒计时计算调试:', {
    //   服务器UTC时间: dayjs.utc(targetTime).format('YYYY-MM-DD HH:mm:ss UTC'),
    //   本地目标时间: target.format('YYYY-MM-DD HH:mm:ss'),
    //   当前本地时间: now.format('YYYY-MM-DD HH:mm:ss'),
    //   时间差毫秒: diff,
    //   时间差分钟: Math.floor(diff / (1000 * 60))
    // })

    if (diff <= 0) return '已开始'

    const totalMinutes = Math.floor(diff / (1000 * 60))
    const totalHours = Math.floor(diff / (1000 * 60 * 60))
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (totalMinutes < 60) return `${totalMinutes}分钟后开始`
    if (totalHours < 24) return `${totalHours}小时后开始`
    return `${totalDays}天后开始`
  }

  /**
   * 格式化为datetime-local输入控件格式
   * 确保使用真正的本地时间，不进行任何时区转换
   */
  static toDateTimeLocalValue(date: Date): string {
    // 创建一个新的Date对象，确保使用本地时间
    const localDate = new Date(date.getTime())

    // 获取本地时间的各个组件
    const year = localDate.getFullYear()
    const month = String(localDate.getMonth() + 1).padStart(2, '0')
    const day = String(localDate.getDate()).padStart(2, '0')
    const hours = String(localDate.getHours()).padStart(2, '0')
    const minutes = String(localDate.getMinutes()).padStart(2, '0')

    const formatted = `${year}-${month}-${day}T${hours}:${minutes}`

    // console.log('🕐 时间格式化调试:', {
    //   输入Date: date.toString(),
    //   本地时间字符串: localDate.toString(),
    //   时区偏移分钟: localDate.getTimezoneOffset(),
    //   格式化结果: formatted,
    //   验证: `应该显示本地时间 ${hours}:${minutes}`
    // })

    return formatted
  }

  /**
   * 验证时间输入是否合理
   */
  static validateGameTimes(startDate: string, endDate: string, evidenceDeadline: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = []
    const now = dayjs()

    // 解析datetime-local格式的输入
    const start = dayjs(startDate)
    const end = dayjs(endDate)
    const deadline = dayjs(evidenceDeadline)

    // 调试信息
    console.log('时间验证调试:', {
      输入: { startDate, endDate, evidenceDeadline },
      解析: {
        start: start.format('YYYY-MM-DD HH:mm:ss'),
        end: end.format('YYYY-MM-DD HH:mm:ss'),
        deadline: deadline.format('YYYY-MM-DD HH:mm:ss'),
        now: now.format('YYYY-MM-DD HH:mm:ss')
      },
      比较: {
        'start <= now': start.isBefore(now) || start.isSame(now, 'minute'),
        'end <= start': end.isBefore(start) || end.isSame(start, 'minute'),
        'deadline <= end': deadline.isBefore(end) || deadline.isSame(end, 'minute')
      }
    })

    // 开始时间必须在当前时间之后（至少1分钟后）
    if (start.isBefore(now) || start.isSame(now, 'minute')) {
      const formatTime = (time: dayjs.Dayjs) => {
        const hour = time.hour()
        if (hour === 0) return time.format('午夜00:mm')
        if (hour === 12) return time.format('中午12:mm')
        if (hour < 12) return time.format('上午HH:mm')
        return time.format('下午HH:mm')
      }
      errors.push(`开始时间(${formatTime(start)})必须在当前时间(${formatTime(now)})之后。提示：如果您想设置下午1点，请确保选择"下午01:00"而不是"上午01:00"`)
    }

    // 结束时间必须在开始时间之后
    if (end.isBefore(start) || end.isSame(start, 'minute')) {
      const formatTime = (time: dayjs.Dayjs) => {
        const hour = time.hour()
        if (hour === 0) return time.format('午夜00:mm')
        if (hour === 12) return time.format('中午12:mm')
        if (hour < 12) return time.format('上午HH:mm')
        return time.format('下午HH:mm')
      }
      errors.push(`结束时间(${formatTime(end)})必须在开始时间(${formatTime(start)})之后。提示：如果您想设置中午12:48，请选择"下午12:48"而不是"上午12:48"`)
    }

    // 证据提交截止时间必须在游戏结束时间之后
    if (deadline.isBefore(end) || deadline.isSame(end, 'minute')) {
      const formatTime = (time: dayjs.Dayjs) => {
        const hour = time.hour()
        if (hour === 0) return time.format('午夜00:mm')
        if (hour === 12) return time.format('中午12:mm')
        if (hour < 12) return time.format('上午HH:mm')
        return time.format('下午HH:mm')
      }
      errors.push(`证据提交截止时间(${formatTime(deadline)})必须晚于游戏结束时间(${formatTime(end)})，以便参与者有时间提交证据`)
    }

    // 游戏持续时间检查（测试模式）
    const durationMinutes = end.diff(start, 'minute')
    if (durationMinutes < 2) {
      errors.push(`游戏持续时间不能少于2分钟，当前为${durationMinutes}分钟`)
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * 格式化相对时间显示（全球同步版本）
   */
  static formatRelativeTime(dateString: string): string {
    // 确保正确处理UTC时间
    return dayjs.utc(dateString).local().fromNow()
  }

  /**
   * 获取用户当前时区信息
   */
  static getUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  /**
   * 获取时区偏移量（小时）
   */
  static getTimezoneOffset(): number {
    return -new Date().getTimezoneOffset() / 60
  }

  /**
   * 全球时区同步测试函数
   * 用于验证时间同步是否正确
   */
  static testGlobalTimeSync(serverUTCTime: string): {
    serverUTC: string
    userTimezone: string
    timezoneOffset: number
    localDisplay: string
    timeUntil: string
  } {
    const utcTime = dayjs.utc(serverUTCTime)
    const localTime = utcTime.local()

    return {
      serverUTC: utcTime.format('YYYY-MM-DD HH:mm:ss UTC'),
      userTimezone: this.getUserTimezone(),
      timezoneOffset: this.getTimezoneOffset(),
      localDisplay: this.toLocalDisplay(serverUTCTime),
      timeUntil: this.formatTimeUntil(serverUTCTime)
    }
  }

  /**
   * 格式化日期显示（使用浏览器原生国际化）
   */
  static formatDate(dateString: string): string {
    // 服务器返回的是UTC时间，需要转换为本地时间显示
    const date = new Date(dateString)

    // 使用浏览器原生国际化API，自动根据用户语言显示
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // 使用24小时制
    })
  }
}
