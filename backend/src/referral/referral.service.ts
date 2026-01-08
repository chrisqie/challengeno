import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReferralRewardType, NotificationType, PointType } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { PointsService } from '../points/points.service';

@Injectable()
export class ReferralService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private pointsService: PointsService
  ) {}

  // 生成推荐码
  async generateReferralCode(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true, username: true }
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 如果已有推荐码，直接返回
    if (user.referralCode) {
      return user.referralCode;
    }

    // 生成新的推荐码：用户名前4位 + 6位随机字符
    const username = user.username.substring(0, 4).toUpperCase();
    const randomPart = this.generateRandomCode(6);
    const referralCode = `${username}${randomPart}`;

    // 检查是否重复，如果重复则重新生成
    const existing = await this.prisma.user.findUnique({
      where: { referralCode }
    });

    if (existing) {
      // 如果重复，使用纯随机码
      const pureRandomCode = this.generateRandomCode(8);
      await this.prisma.user.update({
        where: { id: userId },
        data: { referralCode: pureRandomCode }
      });
      return pureRandomCode;
    }

    // 保存推荐码
    await this.prisma.user.update({
      where: { id: userId },
      data: { referralCode }
    });

    return referralCode;
  }

  // 使用推荐码注册
  async useReferralCode(newUserId: string, referralCode: string): Promise<void> {
    if (!referralCode) return;

    // 查找推荐人
    const referrer = await this.prisma.user.findUnique({
      where: { referralCode },
      select: { id: true, username: true, fullName: true }
    });

    if (!referrer) {
      throw new BadRequestException('推荐码无效');
    }

    if (referrer.id === newUserId) {
      throw new BadRequestException('不能使用自己的推荐码');
    }

    // 检查新用户是否已经被推荐过
    const existingUser = await this.prisma.user.findUnique({
      where: { id: newUserId },
      select: { referredBy: true }
    });

    if (existingUser?.referredBy) {
      throw new BadRequestException('该用户已经使用过推荐码');
    }

    // 更新新用户的推荐关系
    await this.prisma.user.update({
      where: { id: newUserId },
      data: { referredBy: referrer.id }
    });

    // 创建推荐奖励记录（推荐人获得3天VIP + 20参与积分）
    await this.createReferralReward(
      referrer.id,
      newUserId,
      ReferralRewardType.VIP_DAYS,
      3,
      `推荐新用户获得3天VIP奖励`
    );

    await this.createReferralReward(
      referrer.id,
      newUserId,
      ReferralRewardType.PARTICIPATION_POINTS,
      20,
      `推荐新用户获得20参与积分奖励`
    );

    // 立即发放奖励
    await this.grantReferralReward(referrer.id, newUserId);
  }

  // 创建推荐奖励记录
  private async createReferralReward(
    userId: string,
    referredUserId: string,
    rewardType: ReferralRewardType,
    rewardValue: number,
    description: string
  ): Promise<void> {
    await this.prisma.referralReward.create({
      data: {
        userId,
        referredUserId,
        rewardType,
        rewardValue,
        description,
        isGranted: false
      }
    });
  }

  // 发放推荐奖励
  async grantReferralReward(userId: string, referredUserId: string): Promise<void> {
    const rewards = await this.prisma.referralReward.findMany({
      where: {
        userId,
        referredUserId,
        isGranted: false
      }
    });

    for (const reward of rewards) {
      if (reward.rewardType === ReferralRewardType.VIP_DAYS) {
        // 发放VIP天数
        await this.grantVipDays(userId, reward.rewardValue);
      } else if (reward.rewardType === ReferralRewardType.PARTICIPATION_POINTS) {
        // 发放参与积分（使用PointsService确保创建历史记录）
        await this.pointsService.updateUserPoints(
          userId,
          PointType.PARTICIPATION,
          reward.rewardValue,
          reward.description
        );
      } else if (reward.rewardType === ReferralRewardType.TRUST_POINTS) {
        // 发放信任积分（使用PointsService确保创建历史记录）
        await this.pointsService.updateUserPoints(
          userId,
          PointType.TRUST,
          reward.rewardValue,
          reward.description
        );
      } else if (reward.rewardType === ReferralRewardType.LABOR_POINTS) {
        // 发放劳动积分（使用PointsService确保创建历史记录）
        await this.pointsService.updateUserPoints(
          userId,
          PointType.LABOR,
          reward.rewardValue,
          reward.description
        );
      }

      // 标记为已发放
      await this.prisma.referralReward.update({
        where: { id: reward.id },
        data: {
          isGranted: true,
          grantedAt: new Date()
        }
      });

      // 发送奖励通知
      try {
        let notificationTitle = '';
        let notificationMessage = '';

        if (reward.rewardType === ReferralRewardType.VIP_DAYS) {
          notificationTitle = '🎉 推荐奖励已到账！';
          notificationMessage = `恭喜您获得${reward.rewardValue}天VIP会员奖励！感谢您推荐好友加入BetTogether。`;
        } else if (reward.rewardType === ReferralRewardType.PARTICIPATION_POINTS) {
          notificationTitle = '🏆 推荐积分奖励！';
          notificationMessage = `恭喜您获得${reward.rewardValue}参与积分奖励！感谢您推荐好友加入BetTogether。`;
        } else {
          notificationTitle = '🎁 推荐奖励已到账！';
          notificationMessage = reward.description;
        }

        await this.notificationsService.createNotification(
          userId,
          NotificationType.SYSTEM,
          notificationTitle,
          notificationMessage,
          {
            rewardType: reward.rewardType,
            rewardValue: reward.rewardValue,
            referredUserId: reward.referredUserId
          }
        );
      } catch (error) {
        console.error('发送推荐奖励通知失败:', error);
        // 通知失败不影响奖励发放
      }
    }
  }

  // 发放VIP天数
  private async grantVipDays(userId: string, days: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isVip: true, vipExpiresAt: true }
    });

    if (!user) return;

    const now = new Date();
    let newExpiresAt: Date;

    if (user.isVip && user.vipExpiresAt && user.vipExpiresAt > now) {
      // 如果已是VIP且未过期，在现有基础上延长
      newExpiresAt = new Date(user.vipExpiresAt);
      newExpiresAt.setDate(newExpiresAt.getDate() + days);
    } else {
      // 如果不是VIP或已过期，从现在开始计算
      newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + days);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isVip: true,
        vipExpiresAt: newExpiresAt
      }
    });
  }

  // 注意：grantPoints方法已移除，现在使用PointsService.updateUserPoints
  // 这样可以确保积分变化被正确记录到积分历史中

  // 获取用户推荐统计
  async getReferralStats(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        referralCode: true,
        referredUsers: {
          select: {
            id: true,
            username: true,
            fullName: true,
            createdAt: true,
            isVip: true
          }
        },
        referralRewards: {
          include: {
            referredUser: {
              select: {
                username: true,
                fullName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const totalReferred = user.referredUsers.length;
    const totalRewards = user.referralRewards.filter(r => r.isGranted).length;
    const pendingRewards = user.referralRewards.filter(r => !r.isGranted).length;

    return {
      referralCode: user.referralCode,
      totalReferred,
      totalRewards,
      pendingRewards,
      referredUsers: user.referredUsers,
      rewardHistory: user.referralRewards
    };
  }

  // 生成随机码
  private generateRandomCode(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // 生成分享链接
  async generateShareLink(userId: string, type: 'app' | 'game' | 'achievement' | 'user_achievement' | 'achievements_overview', targetId?: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true }
    });

    if (!user?.referralCode) {
      throw new BadRequestException('请先生成推荐码');
    }

    // 使用当前服务器的URL作为基础URL
    const baseUrl = process.env.FRONTEND_URL || 'http://142.171.117.89';

    if (type === 'app') {
      return `${baseUrl}/register?ref=${user.referralCode}`;
    } else if (type === 'game' && targetId) {
      return `${baseUrl}/game/${targetId}?ref=${user.referralCode}`;
    } else if (type === 'achievement' && targetId) {
      return `${baseUrl}/game/${targetId}?ref=${user.referralCode}&highlight=achievement`;
    } else if (type === 'user_achievement' && targetId) {
      return `${baseUrl}/achievements?ref=${user.referralCode}&highlight=${targetId}`;
    } else if (type === 'achievements_overview') {
      return `${baseUrl}/achievements?ref=${user.referralCode}&user=${userId}`;
    }

    throw new BadRequestException('无效的分享类型或缺少目标ID');
  }
}
