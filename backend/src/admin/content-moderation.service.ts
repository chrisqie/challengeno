import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface ContentModerationFilters {
  page?: number;
  limit?: number;
  contentType?: 'GAME' | 'COMMENT' | 'EVIDENCE' | 'USER_PROFILE' | 'ALL';
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'ALL';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  reportedBy?: string;
  createdDate?: {
    from?: Date;
    to?: Date;
  };
  sortBy?: 'createdAt' | 'priority' | 'reportCount';
  sortOrder?: 'asc' | 'desc';
}

export interface ModerationAction {
  id: string;
  contentType: string;
  contentId: string;
  action: 'APPROVE' | 'REJECT' | 'FLAG' | 'DELETE' | 'EDIT';
  reason: string;
  adminId: string;
  adminUsername: string;
  createdAt: Date;
  details?: any;
}

export interface ContentReport {
  id: string;
  contentType: string;
  contentId: string;
  reporterId: string;
  reporterUsername: string;
  reason: string;
  category: 'SPAM' | 'INAPPROPRIATE' | 'HARASSMENT' | 'FRAUD' | 'COPYRIGHT' | 'OTHER';
  description: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: Date;
  handledAt?: Date;
  handlerId?: string;
  resolution?: string;
}

@Injectable()
export class ContentModerationService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // 获取待审核内容列表
  async getPendingContent(filters: ContentModerationFilters) {
    const {
      page = 1,
      limit = 20,
      contentType,
      status,
      priority,
      reportedBy,
      createdDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;

    // 获取游戏内容
    const games = await this.getPendingGames(filters);
    
    // 获取举报内容
    const reports = await this.getContentReports(filters);

    // 合并和排序结果
    const allContent = [
      ...games.map(game => ({
        id: game.id,
        type: 'GAME',
        title: game.title,
        description: game.description,
        creator: game.creator,
        createdAt: game.createdAt,
        status: 'PENDING',
        priority: this.calculatePriority(game),
        reportCount: 0 // 暂时设为0
      })),
      ...reports.map(report => ({
        id: report.id,
        type: 'REPORT',
        title: `举报: ${report.reason}`,
        description: report.description,
        creator: { username: report.reporterUsername },
        createdAt: report.createdAt,
        status: report.status,
        priority: report.priority,
        reportCount: 1
      }))
    ];

    // 排序
    allContent.sort((a, b) => {
      if (sortBy === 'createdAt') {
        return sortOrder === 'desc' 
          ? b.createdAt.getTime() - a.createdAt.getTime()
          : a.createdAt.getTime() - b.createdAt.getTime();
      }
      return 0;
    });

    const total = allContent.length;
    const paginatedContent = allContent.slice(skip, skip + limit);

    return {
      content: paginatedContent,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // 获取待审核游戏
  private async getPendingGames(filters: ContentModerationFilters) {
    return this.prisma.betGame.findMany({
      where: {
        // 可以添加需要审核的条件，比如新创建的游戏
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 最近24小时
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true,
            isVip: true,
            trustPoints: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }

  // 获取内容举报
  async getContentReports(filters: ContentModerationFilters): Promise<ContentReport[]> {
    // 暂时返回模拟数据，实际应该从数据库查询
    return [
      {
        id: 'report_1',
        contentType: 'GAME',
        contentId: 'game_123',
        reporterId: 'user_456',
        reporterUsername: 'reporter1',
        reason: '不当内容',
        category: 'INAPPROPRIATE',
        description: '游戏内容包含不当信息',
        status: 'PENDING',
        priority: 'MEDIUM',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2小时前
      }
    ];
  }

  // 审核游戏内容
  async moderateGame(gameId: string, adminId: string, action: 'APPROVE' | 'REJECT' | 'FLAG', reason: string) {
    const game = await this.prisma.betGame.findUnique({
      where: { id: gameId },
      include: {
        creator: {
          select: { id: true, username: true }
        }
      }
    });

    if (!game) {
      throw new NotFoundException('游戏不存在');
    }

    let updateData: any = {};
    let notificationTitle = '';
    let notificationMessage = '';

    switch (action) {
      case 'APPROVE':
        // 游戏通过审核
        updateData = { 
          // moderationStatus: 'APPROVED',
          // moderatedAt: new Date(),
          // moderatorId: adminId
        };
        notificationTitle = '游戏审核通过';
        notificationMessage = `您的游戏"${game.title}"已通过审核`;
        break;

      case 'REJECT':
        // 游戏被拒绝
        updateData = { 
          status: 'CANCELLED', // 使用现有状态
          // moderationStatus: 'REJECTED',
          // moderatedAt: new Date(),
          // moderatorId: adminId,
          // rejectionReason: reason
        };
        notificationTitle = '游戏审核未通过';
        notificationMessage = `您的游戏"${game.title}"未通过审核，原因：${reason}`;
        break;

      case 'FLAG':
        // 标记游戏需要进一步审核
        updateData = {
          // moderationStatus: 'FLAGGED',
          // flaggedAt: new Date(),
          // flagReason: reason
        };
        notificationTitle = '游戏需要修改';
        notificationMessage = `您的游戏"${game.title}"需要修改，原因：${reason}`;
        break;
    }

    // 更新游戏状态
    await this.prisma.betGame.update({
      where: { id: gameId },
      data: updateData
    });

    // 记录审核操作
    await this.logModerationAction({
      contentType: 'GAME',
      contentId: gameId,
      action,
      reason,
      adminId,
      details: { gameTitle: game.title, creatorId: game.creator.id }
    });

    // 通知游戏创建者
    await this.notificationsService.createNotification(
      game.creator.id,
      'CONTENT_MODERATION' as any,
      notificationTitle,
      notificationMessage,
      { gameId, action, reason, adminId }
    );

    return {
      success: true,
      message: `游戏"${game.title}"已${action === 'APPROVE' ? '通过审核' : action === 'REJECT' ? '被拒绝' : '被标记'}`
    };
  }

  // 处理内容举报
  async handleReport(reportId: string, adminId: string, action: 'RESOLVE' | 'DISMISS', resolution: string) {
    // 暂时返回成功状态，实际应该更新数据库
    await this.logModerationAction({
      contentType: 'REPORT',
      contentId: reportId,
      action: action === 'RESOLVE' ? 'APPROVE' : 'REJECT',
      reason: resolution,
      adminId,
      details: { reportId }
    });

    return {
      success: true,
      message: `举报已${action === 'RESOLVE' ? '处理' : '驳回'}`
    };
  }

  // 批量审核内容
  async batchModerate(contentIds: string[], adminId: string, action: 'APPROVE' | 'REJECT', reason: string) {
    const results = [];

    for (const contentId of contentIds) {
      try {
        // 假设都是游戏内容，实际需要根据内容类型分别处理
        const result = await this.moderateGame(contentId, adminId, action, reason);
        results.push({ contentId, success: true, message: result.message });
      } catch (error) {
        results.push({ contentId, success: false, message: error.message });
      }
    }

    return {
      success: true,
      results,
      summary: {
        total: contentIds.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    };
  }

  // 获取审核统计
  async getModerationStats(period: 'day' | 'week' | 'month' = 'week') {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    // 暂时返回模拟数据
    return {
      period,
      totalReports: 15,
      pendingReports: 3,
      resolvedReports: 12,
      dismissedReports: 0,
      contentModerated: {
        games: 8,
        comments: 4,
        profiles: 1
      },
      actionBreakdown: {
        approved: 10,
        rejected: 3,
        flagged: 2
      },
      averageResponseTime: '2.5 hours',
      topReportCategories: [
        { category: 'INAPPROPRIATE', count: 6 },
        { category: 'SPAM', count: 4 },
        { category: 'HARASSMENT', count: 3 },
        { category: 'FRAUD', count: 2 }
      ]
    };
  }

  // 获取审核历史
  async getModerationHistory(filters: { limit?: number; adminId?: string; contentType?: string }) {
    // 暂时返回模拟数据
    return [];
  }

  // 自动内容检测
  async autoDetectInappropriateContent() {
    // 简单的关键词检测
    const inappropriateKeywords = ['spam', 'scam', 'fraud', 'inappropriate'];
    
    const recentGames = await this.prisma.betGame.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // 最近1小时
        }
      },
      select: {
        id: true,
        title: true,
        description: true,
        creator: {
          select: { id: true, username: true }
        }
      }
    });

    const flaggedContent = [];

    for (const game of recentGames) {
      const content = `${game.title} ${game.description}`.toLowerCase();
      const foundKeywords = inappropriateKeywords.filter(keyword => 
        content.includes(keyword)
      );

      if (foundKeywords.length > 0) {
        flaggedContent.push({
          gameId: game.id,
          title: game.title,
          creator: game.creator,
          flaggedKeywords: foundKeywords,
          confidence: foundKeywords.length / inappropriateKeywords.length
        });
      }
    }

    return {
      totalScanned: recentGames.length,
      flaggedCount: flaggedContent.length,
      flaggedContent
    };
  }

  // 计算内容优先级
  private calculatePriority(content: any): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
    // 简单的优先级算法
    if (content.creator?.trustPoints < 50) return 'HIGH';
    if (content.creator?.isVip) return 'LOW';
    return 'MEDIUM';
  }

  // 记录审核操作
  private async logModerationAction(actionData: Omit<ModerationAction, 'id' | 'createdAt' | 'adminUsername'>) {
    // 暂时跳过，实际应该保存到数据库
    console.log('Moderation action logged:', actionData);
  }
}
