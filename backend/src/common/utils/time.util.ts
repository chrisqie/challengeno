/**
 * 简化的时间处理工具类
 * 统一使用UTC时间，简单可靠
 */
export class TimeUtil {
  /**
   * 将任意时间转换为UTC Date对象
   */
  static toUTC(date: Date | string): Date {
    return new Date(date);
  }

  /**
   * 验证游戏时间设置是否合理
   */
  static validateGameTimes(startDate: string, endDate: string, evidenceDeadline: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const deadline = new Date(evidenceDeadline);

    // 调试信息
    console.log('后端时间验证:', {
      now: now.toISOString(),
      start: start.toISOString(),
      end: end.toISOString(),
      deadline: deadline.toISOString(),
      比较: {
        'start <= now': start <= now,
        'end <= start': end <= start,
        'deadline <= end': deadline <= end
      }
    });

    // 开始时间必须在当前时间之后（允许1分钟的误差，支持快速开始）
    const nowPlusOneMinute = new Date(now.getTime() + 60 * 1000);
    if (start < nowPlusOneMinute) {
      errors.push('开始时间必须在当前时间1分钟之后');
    }

    if (end <= start) {
      errors.push('结束时间必须在开始时间之后');
    }

    if (deadline <= end) {
      errors.push('证据提交截止时间必须晚于游戏结束时间，以便参与者有时间提交证据');
    }

    // 合理的时间间隔限制（测试模式）
    const minDuration = 2 * 60 * 1000; // 2分钟（测试用）
    const maxDuration = 30 * 24 * 60 * 60 * 1000; // 30天

    if (end.getTime() - start.getTime() < minDuration) {
      errors.push('游戏持续时间不能少于2分钟');
    }

    if (end.getTime() - start.getTime() > maxDuration) {
      errors.push('游戏持续时间不能超过30天');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
