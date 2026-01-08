import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType, EmailFrequency } from '@prisma/client';

export interface NotificationSettingsDto {
  inAppEnabled?: boolean;
  emailEnabled?: boolean;
  emailFrequency?: EmailFrequency;
  pushEnabled?: boolean;
  gameInvites?: boolean;
  gameUpdates?: boolean;
  friendRequests?: boolean;
  achievements?: boolean;
  systemUpdates?: boolean;
  quietHoursEnabled?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

@Injectable()
export class NotificationSettingsService {
  private readonly logger = new Logger(NotificationSettingsService.name);

  constructor(private prisma: PrismaService) {}

  // 获取用户通知设置
  async getUserSettings(userId: string) {
    let settings = await this.prisma.notificationSettings.findUnique({
      where: { userId },
    });

    // 如果用户没有设置，创建默认设置
    if (!settings) {
      settings = await this.createDefaultSettings(userId);
    }

    return settings;
  }

  // 创建默认通知设置
  async createDefaultSettings(userId: string) {
    return this.prisma.notificationSettings.create({
      data: {
        userId,
        inAppEnabled: true,
        emailEnabled: true,
        emailFrequency: EmailFrequency.IMMEDIATE,
        pushEnabled: true,
        gameInvites: true,
        gameUpdates: true,
        friendRequests: true,
        achievements: true,
        systemUpdates: true,
        quietHoursEnabled: false,
      },
    });
  }

  // 更新用户通知设置
  async updateUserSettings(userId: string, settings: NotificationSettingsDto) {
    const existingSettings = await this.getUserSettings(userId);

    return this.prisma.notificationSettings.update({
      where: { id: existingSettings.id },
      data: {
        ...settings,
        updatedAt: new Date(),
      },
    });
  }

  // 检查用户是否允许接收特定类型的通知
  async shouldSendNotification(
    userId: string,
    type: NotificationType,
    channel: 'IN_APP' | 'EMAIL' | 'PUSH' = 'IN_APP'
  ): Promise<boolean> {
    const settings = await this.getUserSettings(userId);

    // 检查渠道是否启用
    if (channel === 'EMAIL' && !settings.emailEnabled) return false;
    if (channel === 'PUSH' && !settings.pushEnabled) return false;
    if (channel === 'IN_APP' && !settings.inAppEnabled) return false;

    // 检查免打扰时间
    if (settings.quietHoursEnabled && this.isInQuietHours(settings)) {
      // 只有紧急通知才能在免打扰时间发送
      const urgentTypes = [
        NotificationType.SYSTEM,
        NotificationType.VIP_EXPIRED,
      ];
      const isUrgent = urgentTypes.some(urgentType => urgentType === type);
      if (!isUrgent) return false;
    }

    // 检查具体通知类型设置
    switch (type) {
      case NotificationType.GAME_INVITE:
      case NotificationType.GAME_STARTED:
      case NotificationType.GAME_COMPLETED:
      case NotificationType.GAME_CANCELLED:
      case NotificationType.GAME_UNDER_REVIEW:
      case NotificationType.EVIDENCE_REQUIRED:
      case NotificationType.EVIDENCE_SUBMITTED:
      case NotificationType.PEER_REVIEW_REQUEST:
      case NotificationType.PEER_EVALUATION_STARTED:
      case NotificationType.REVIEW_COMPLETED:
        return settings.gameUpdates;

      case NotificationType.FRIEND_REQUEST:
      case NotificationType.FRIEND_ACCEPTED:
        return settings.friendRequests;

      case NotificationType.ACHIEVEMENT_UNLOCKED:
        return settings.achievements;

      case NotificationType.SYSTEM:
      case NotificationType.VIP_EXPIRED:
      case NotificationType.VIP_RENEWED:
      case NotificationType.SECURITY_ALERT:
        return settings.systemUpdates;

      default:
        return true;
    }
  }

  // 检查当前是否在免打扰时间内
  private isInQuietHours(settings: any): boolean {
    if (!settings.quietHoursEnabled || !settings.quietHoursStart || !settings.quietHoursEnd) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMinute] = settings.quietHoursStart.split(':').map(Number);
    const [endHour, endMinute] = settings.quietHoursEnd.split(':').map(Number);

    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    // 处理跨天的情况（如 22:00 - 08:00）
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      return currentTime >= startTime && currentTime <= endTime;
    }
  }

  // 获取邮件通知频率
  async getEmailFrequency(userId: string): Promise<EmailFrequency> {
    const settings = await this.getUserSettings(userId);
    return settings.emailFrequency;
  }

  // 批量获取用户设置（用于邮件汇总）
  async getUsersForEmailDigest(frequency: EmailFrequency): Promise<string[]> {
    const settings = await this.prisma.notificationSettings.findMany({
      where: {
        emailEnabled: true,
        emailFrequency: frequency,
      },
      select: {
        userId: true,
      },
    });

    return settings.map(s => s.userId);
  }

  // 重置用户设置为默认值
  async resetToDefaults(userId: string) {
    const existingSettings = await this.getUserSettings(userId);

    return this.prisma.notificationSettings.update({
      where: { id: existingSettings.id },
      data: {
        inAppEnabled: true,
        emailEnabled: true,
        emailFrequency: EmailFrequency.IMMEDIATE,
        pushEnabled: true,
        gameInvites: true,
        gameUpdates: true,
        friendRequests: true,
        achievements: true,
        systemUpdates: true,
        quietHoursEnabled: false,
        quietHoursStart: null,
        quietHoursEnd: null,
        updatedAt: new Date(),
      },
    });
  }

  // 获取通知统计信息
  async getNotificationStats(userId: string) {
    const settings = await this.getUserSettings(userId);
    
    // 计算最近30天的通知数量
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const notificationStats = await this.prisma.notification.groupBy({
      by: ['type'],
      where: {
        userId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: {
        id: true,
      },
    });

    const totalNotifications = await this.prisma.notification.count({
      where: {
        userId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const unreadNotifications = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return {
      settings,
      stats: {
        total: totalNotifications,
        unread: unreadNotifications,
        byType: notificationStats.reduce((acc, stat) => {
          acc[stat.type] = stat._count.id;
          return acc;
        }, {} as Record<string, number>),
      },
    };
  }
}
