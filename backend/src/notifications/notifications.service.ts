import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType, NotificationChannel, NotificationPriority } from '@prisma/client';
import { EmailService } from './email.service';
import { NotificationSettingsService } from './notification-settings.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private notificationSettingsService: NotificationSettingsService
  ) {}

  // 创建通知（增强版）
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any,
    options?: {
      channels?: NotificationChannel[];
      priority?: NotificationPriority;
      sendEmail?: boolean;
    }
  ) {
    try {
      // 检查用户通知设置
      const shouldSendInApp = await this.notificationSettingsService.shouldSendNotification(
        userId, type, 'IN_APP'
      );

      if (!shouldSendInApp && !options?.sendEmail) {
        this.logger.log(`Notification blocked by user settings: ${userId} - ${type}`);
        return null;
      }

      // 创建站内通知
      let notification = null;
      if (shouldSendInApp) {
        notification = await this.prisma.notification.create({
          data: {
            userId,
            type,
            title,
            message,
            data: data ? JSON.stringify(data) : null,
            channels: options?.channels || [NotificationChannel.IN_APP],
            priority: options?.priority || NotificationPriority.NORMAL,
          },
        });

        this.logger.log(`Created notification for user ${userId}: ${title}`);
      }

      // 发送邮件通知
      if (options?.sendEmail !== false) {
        await this.sendEmailNotification(userId, type, title, message, data);
      }

      return notification;
    } catch (error) {
      this.logger.error(`Failed to create notification: ${error.message}`);
      throw error;
    }
  }

  // 发送邮件通知
  private async sendEmailNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any
  ) {
    try {
      // 检查用户邮件通知设置
      const shouldSendEmail = await this.notificationSettingsService.shouldSendNotification(
        userId, type, 'EMAIL'
      );

      if (!shouldSendEmail) {
        return;
      }

      // 获取用户信息
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, fullName: true },
      });

      if (!user?.email) {
        this.logger.warn(`User ${userId} has no email address`);
        return;
      }

      // 生成邮件模板
      const emailTemplate = this.emailService.generateEmailTemplate(
        type,
        { title, message, ...data },
        user.fullName || 'User'
      );

      // 发送邮件
      const emailSent = await this.emailService.sendEmail(
        user.email,
        emailTemplate.subject,
        emailTemplate.html,
        emailTemplate.text
      );

      // 更新通知记录
      if (emailSent) {
        await this.prisma.notification.updateMany({
          where: {
            userId,
            type,
            createdAt: {
              gte: new Date(Date.now() - 5 * 60 * 1000), // 最近5分钟内的通知
            },
          },
          data: {
            emailSent: true,
            emailSentAt: new Date(),
          },
        });
      }
    } catch (error) {
      this.logger.error(`Failed to send email notification: ${error.message}`);
    }
  }

  // 批量创建通知
  async createBulkNotifications(notifications: Array<{
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
  }>) {
    try {
      const notificationData = notifications.map(notif => ({
        userId: notif.userId,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        data: notif.data ? JSON.stringify(notif.data) : null,
      }));

      const result = await this.prisma.notification.createMany({
        data: notificationData,
      });

      this.logger.log(`Created ${result.count} bulk notifications`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create bulk notifications: ${error.message}`);
      throw error;
    }
  }

  // 获取用户通知列表
  async getUserNotifications(userId: string, limit = 20, offset = 0) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  // 获取未读通知数量
  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  // 标记通知为已读
  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new Error('通知不存在');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  // 标记所有通知为已读
  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  // 删除通知
  async deleteNotification(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new Error('通知不存在');
    }

    return this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  // === Business-related notification methods ===
  // Now returns translation keys instead of hardcoded Chinese text
  // Frontend will use t(titleKey, data) to display localized messages

  // Friend request notification
  async notifyFriendRequest(addresseeId: string, requesterUsername: string) {
    return this.createNotification(
      addresseeId,
      NotificationType.FRIEND_REQUEST,
      'notifications.messages.friendRequest.title',
      'notifications.messages.friendRequest.message',
      { requesterUsername },
      { priority: NotificationPriority.NORMAL }
    );
  }

  // Achievement unlocked notification
  async notifyAchievementUnlocked(
    userId: string,
    achievementName: string,
    achievementDescription: string,
    achievementIcon?: string
  ) {
    return this.createNotification(
      userId,
      NotificationType.ACHIEVEMENT_UNLOCKED,
      'notifications.messages.achievementUnlocked.title',
      'notifications.messages.achievementUnlocked.message',
      {
        achievementName,
        achievementDescription,
        achievementIcon
      },
      {
        priority: NotificationPriority.HIGH,
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL]
      }
    );
  }

  // Game invitation notification
  async notifyGameInvite(
    userId: string,
    gameTitle: string,
    inviterName: string,
    gameId: string
  ) {
    return this.createNotification(
      userId,
      NotificationType.GAME_INVITE,
      'notifications.messages.gameInvite.title',
      'notifications.messages.gameInvite.message',
      { gameTitle, inviterName, gameId },
      { priority: NotificationPriority.NORMAL }
    );
  }

  // Game started notification
  async notifyGameStarted(userId: string, gameTitle: string, gameId: string) {
    return this.createNotification(
      userId,
      NotificationType.GAME_STARTED,
      'notifications.messages.gameStarted.title',
      'notifications.messages.gameStarted.message',
      { gameTitle, gameId },
      { priority: NotificationPriority.HIGH }
    );
  }

  // Evidence submission reminder
  async notifyEvidenceRequired(
    userId: string,
    gameTitle: string,
    gameId: string,
    deadline: Date
  ) {
    return this.createNotification(
      userId,
      NotificationType.EVIDENCE_REQUIRED,
      'notifications.messages.evidenceRequired.title',
      'notifications.messages.evidenceRequired.message',
      { gameTitle, gameId, deadline: deadline.toLocaleDateString() },
      {
        priority: NotificationPriority.HIGH,
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL]
      }
    );
  }

  // VIP expiration notification
  async notifyVipExpired(userId: string, expirationDate: Date) {
    return this.createNotification(
      userId,
      NotificationType.VIP_EXPIRED,
      'notifications.messages.vipExpired.title',
      'notifications.messages.vipExpired.message',
      { expirationDate: expirationDate.toLocaleDateString() },
      {
        priority: NotificationPriority.URGENT,
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL]
      }
    );
  }

  // Friend request accepted notification
  async notifyFriendAccepted(requesterId: string, addresseeUsername: string) {
    return this.createNotification(
      requesterId,
      NotificationType.FRIEND_ACCEPTED,
      'notifications.messages.friendAccepted.title',
      'notifications.messages.friendAccepted.message',
      { addresseeUsername }
    );
  }

  // Friend request rejected notification
  async notifyFriendRejected(requesterId: string, addresseeUsername: string) {
    return this.createNotification(
      requesterId,
      NotificationType.FRIEND_REJECTED,
      'notifications.messages.friendRejected.title',
      'notifications.messages.friendRejected.message',
      { addresseeUsername }
    );
  }

  // Game started notification (bulk)
  async notifyGameStartedBulk(participantIds: string[], gameTitle: string, gameId: string) {
    const notifications = participantIds.map(userId => ({
      userId,
      type: NotificationType.GAME_STARTED,
      title: 'notifications.messages.gameStarted.title',
      message: 'notifications.messages.gameStarted.message',
      data: { gameId, gameTitle },
    }));

    return this.createBulkNotifications(notifications);
  }

  // Game ended, evidence submission required notification (bulk)
  async notifyEvidenceRequiredBulk(participantIds: string[], gameTitle: string, gameId: string, deadline: Date) {
    const notifications = participantIds.map(userId => ({
      userId,
      type: NotificationType.EVIDENCE_REQUIRED,
      title: 'notifications.messages.evidenceRequired.title',
      message: 'notifications.messages.evidenceRequired.message',
      data: { gameId, gameTitle, deadline: deadline.toLocaleDateString() },
    }));

    return this.createBulkNotifications(notifications);
  }

  // Game completed notification
  async notifyGameCompleted(participantIds: string[], gameTitle: string, gameId: string) {
    const notifications = participantIds.map(userId => ({
      userId,
      type: NotificationType.GAME_COMPLETED,
      title: 'notifications.messages.gameCompleted.title',
      message: 'notifications.messages.gameCompleted.message',
      data: { gameId, gameTitle },
    }));

    return this.createBulkNotifications(notifications);
  }
}