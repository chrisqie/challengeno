import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface UserManagementFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'ACTIVE' | 'BANNED' | 'SUSPENDED' | 'VIP' | 'ALL';
  role?: 'USER' | 'ADMIN' | 'ALL';
  registrationDate?: {
    from?: Date;
    to?: Date;
  };
  lastActiveDate?: {
    from?: Date;
    to?: Date;
  };
  sortBy?: 'createdAt' | 'lastActive' | 'trustPoints' | 'totalGames';
  sortOrder?: 'asc' | 'desc';
}

export interface UserActionLog {
  id: string;
  userId: string;
  adminId: string;
  action: 'BAN' | 'UNBAN' | 'SUSPEND' | 'UNSUSPEND' | 'DELETE' | 'RESTORE' | 'WARN' | 'VIP_GRANT' | 'VIP_REVOKE';
  reason: string;
  duration?: number; // 天数
  createdAt: Date;
  expiresAt?: Date;
}

@Injectable()
export class UserManagementService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // 获取用户列表
  async getUsers(filters: UserManagementFilters) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      role,
      registrationDate,
      lastActiveDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    // 搜索条件
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } }
      ];
    }

    // 状态筛选
    if (status && status !== 'ALL') {
      switch (status) {
        case 'VIP':
          where.isVip = true;
          break;
        case 'BANNED':
          // 暂时跳过，因为数据库中可能没有isBanned字段
          break;
        case 'ACTIVE':
          where.isVip = { not: null }; // 简化条件
          break;
      }
    }

    // 角色筛选
    if (role && role !== 'ALL') {
      where.isAdmin = role === 'ADMIN';
    }

    // 注册日期筛选
    if (registrationDate) {
      where.createdAt = {};
      if (registrationDate.from) {
        where.createdAt.gte = registrationDate.from;
      }
      if (registrationDate.to) {
        where.createdAt.lte = registrationDate.to;
      }
    }

    let users: any[];
    let total: number;

    try {
      [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            avatar: true,
            isVip: true,
            vipExpiresAt: true,
            isAdmin: true,
            adminRole: true,
            isBanned: true,
            isDeleted: true,
            trustPoints: true,
            participationPoints: true,
            laborPoints: true,
            totalGamesCreated: true,
            totalGamesJoined: true,
            gamesCompleted: true,
            createdAt: true,
            updatedAt: true,
            privacyMode: true,
            preferredLanguage: true
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit
        }),
        this.prisma.user.count({ where })
      ]);
    } catch (error) {
      // 如果字段不存在（迁移未执行），使用基础查询
      console.warn('Ban/Delete fields not found in user-management getUsers, using basic query:', error.message);
      [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            avatar: true,
            isVip: true,
            vipExpiresAt: true,
            isAdmin: true,
            adminRole: true,
            trustPoints: true,
            participationPoints: true,
            laborPoints: true,
            totalGamesCreated: true,
            totalGamesJoined: true,
            gamesCompleted: true,
            createdAt: true,
            updatedAt: true,
            privacyMode: true,
            preferredLanguage: true
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit
        }),
        this.prisma.user.count({ where })
      ]);
    }

    return {
      users: users.map(user => ({
        ...user,
        status: this.getUserStatus(user),
        lastActive: user.updatedAt, // 简化为updatedAt
        totalPoints: user.participationPoints + user.trustPoints + user.laborPoints
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // 获取用户详情
  async getUserDetail(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        createdGames: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
            maxParticipants: true,
            currentParticipants: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        participations: {
          select: {
            id: true,
            game: {
              select: {
                id: true,
                title: true,
                status: true,
                createdAt: true
              }
            },
            finalResult: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        pointsHistory: {
          select: {
            id: true,
            pointType: true,
            change: true,
            reason: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        vipSubscriptions: {
          select: {
            id: true,
            tier: true,
            startDate: true,
            endDate: true,
            isActive: true,
            paymentAmount: true
          },
          orderBy: { startDate: 'desc' },
          take: 5
        }
      }
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 获取用户操作日志
    const actionLogs = await this.getUserActionLogs(userId, 10);

    // 计算统计信息
    const stats = {
      totalPoints: user.participationPoints + user.trustPoints + user.laborPoints,
      winRate: user.gamesCompleted > 0 ?
        Math.round((user.participations.filter(p => p.finalResult === 'SUCCESS').length / user.gamesCompleted) * 100) : 0,
      averageGameDuration: 0, // 需要复杂计算
      trustLevel: this.getTrustLevel(user.trustPoints),
      accountAge: Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
      status: this.getUserStatus(user)
    };

    return {
      ...user,
      stats,
      actionLogs
    };
  }

  // 封禁用户
  async banUser(userId: string, adminId: string, reason: string, duration?: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, isAdmin: true }
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    if (user.isAdmin) {
      throw new ForbiddenException('不能封禁管理员用户');
    }

    // 计算封禁到期时间
    const banUntil = duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000) : null;

    // 更新用户封禁状态
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isBanned: true,
        bannedUntil: banUntil,
        banReason: reason
      }
    });

    // 记录操作日志
    await this.logUserAction({
      userId,
      adminId,
      action: 'BAN',
      reason,
      duration,
      expiresAt: duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000) : undefined
    });

    // 发送通知给用户
    await this.notificationsService.createNotification(
      userId,
      'SYSTEM',
      '账户已被封禁',
      `您的账户因"${reason}"被封禁${duration ? `${duration}天` : '永久'}`,
      { reason, duration, adminId }
    );

    return {
      success: true,
      message: `用户 ${user.username} 已被封禁`,
      duration: duration || '永久'
    };
  }

  // 解封用户
  async unbanUser(userId: string, adminId: string, reason: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true }
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 更新用户状态，解除封禁
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isBanned: false,
        bannedUntil: null,
        banReason: null
      }
    });

    await this.logUserAction({
      userId,
      adminId,
      action: 'UNBAN',
      reason
    });

    await this.notificationsService.createNotification(
      userId,
      'SYSTEM',
      '账户已解封',
      `您的账户已被解封，原因：${reason}`,
      { reason, adminId }
    );

    return {
      success: true,
      message: `用户 ${user.username} 已被解封`
    };
  }

  // 警告用户
  async warnUser(userId: string, adminId: string, reason: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true }
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    await this.logUserAction({
      userId,
      adminId,
      action: 'WARN',
      reason
    });

    await this.notificationsService.createNotification(
      userId,
      'ACCOUNT_WARNING' as any,
      '账户警告',
      `您收到了一个警告：${reason}`,
      { reason, adminId }
    );

    return {
      success: true,
      message: `已向用户 ${user.username} 发送警告`
    };
  }

  // 删除用户（软删除）
  async deleteUser(userId: string, adminId: string, reason: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, isAdmin: true, isDeleted: true }
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    if (user.isAdmin) {
      throw new ForbiddenException('不能删除管理员用户');
    }

    if (user.isDeleted) {
      throw new BadRequestException('该用户已被删除');
    }

    // 软删除：只标记为已删除，不实际删除数据
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deleteReason: reason,
        // 同时封禁账户，防止登录
        isBanned: true,
        banReason: '账户已删除'
      }
    });

    // 记录操作日志
    await this.logUserAction({
      userId,
      adminId,
      action: 'DELETE',
      reason
    });

    // 发送通知给用户
    await this.notificationsService.createNotification(
      userId,
      'SYSTEM',
      '账户已被删除',
      `您的账户已被管理员删除。原因：${reason}`,
      { reason, adminId }
    );

    return {
      success: true,
      message: `用户 ${user.username} 已被标记为删除（软删除）`
    };
  }

  // 恢复用户（取消软删除）
  async restoreUser(userId: string, adminId: string, reason: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, isAdmin: true, isDeleted: true }
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    if (!user.isDeleted) {
      throw new BadRequestException('该用户未被删除');
    }

    // 恢复用户：取消删除标记和封禁
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: false,
        deletedAt: null,
        deleteReason: null,
        // 同时解除封禁
        isBanned: false,
        bannedUntil: null,
        banReason: null
      }
    });

    // 记录操作日志
    await this.logUserAction({
      userId,
      adminId,
      action: 'RESTORE',
      reason
    });

    // 发送通知给用户
    await this.notificationsService.createNotification(
      userId,
      'SYSTEM',
      '账户已恢复',
      `您的账户已被管理员恢复。原因：${reason}`,
      { reason, adminId }
    );

    return {
      success: true,
      message: `用户 ${user.username} 已恢复`
    };
  }

  // 获取用户操作日志
  async getUserActionLogs(userId: string, limit: number = 20): Promise<UserActionLog[]> {
    // 暂时返回模拟数据，实际应该从数据库查询
    return [];
  }

  // 记录用户操作
  private async logUserAction(actionData: Omit<UserActionLog, 'id' | 'createdAt'>) {
    // 暂时跳过，实际应该保存到数据库
    console.log('User action logged:', actionData);
  }

  // 获取用户状态
  private getUserStatus(user: any): string {
    if (user.isAdmin) return 'ADMIN';
    if (user.isVip) return 'VIP';
    // if (user.isBanned) return 'BANNED';
    return 'ACTIVE';
  }

  // 获取信任等级
  private getTrustLevel(trustPoints: number): string {
    if (trustPoints >= 90) return 'EXCELLENT';
    if (trustPoints >= 80) return 'GOOD';
    if (trustPoints >= 70) return 'FAIR';
    if (trustPoints >= 60) return 'POOR';
    return 'VERY_POOR';
  }
}
