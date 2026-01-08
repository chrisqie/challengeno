import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AnalyticsFilters {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate?: Date;
  endDate?: Date;
  timezone?: string;
}

export interface UserAnalytics {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  retentionRate: number;
  averageSessionTime: number;
  userGrowthRate: number;
  topCountries: Array<{ country: string; count: number; percentage: number }>;
  ageDistribution: Array<{ ageGroup: string; count: number; percentage: number }>;
  deviceTypes: Array<{ device: string; count: number; percentage: number }>;
}

export interface GameAnalytics {
  totalGames: number;
  newGames: number;
  activeGames: number;
  completedGames: number;
  cancelledGames: number;
  averageParticipants: number;
  averageGameDuration: number;
  popularCategories: Array<{ category: string; count: number; percentage: number }>;
  gameCompletionRate: number;
  averageStakeAmount: number;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  vipRevenue: number;
  subscriptionRevenue: number;
  transactionFees: number;
  revenueGrowthRate: number;
  averageRevenuePerUser: number;
  monthlyRecurringRevenue: number;
  churnRate: number;
  lifetimeValue: number;
}

export interface SystemAnalytics {
  serverUptime: number;
  averageResponseTime: number;
  errorRate: number;
  apiCallsCount: number;
  databasePerformance: {
    queryTime: number;
    connectionPool: number;
    slowQueries: number;
  };
  storageUsage: {
    total: number;
    used: number;
    available: number;
  };
}

@Injectable()
export class AdminAnalyticsService {
  constructor(private prisma: PrismaService) {}

  // 获取用户分析数据
  async getUserAnalytics(filters: AnalyticsFilters): Promise<UserAnalytics> {
    const { period, startDate, endDate } = filters;
    const dateRange = this.getDateRange(period, startDate, endDate);

    const [
      totalUsers,
      newUsers,
      previousPeriodUsers
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: dateRange.start,
            lte: dateRange.end
          }
        }
      }),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: dateRange.previousStart,
            lt: dateRange.start
          }
        }
      })
    ]);

    // 计算活跃用户（简化为最近更新的用户）
    const activeUsers = await this.prisma.user.count({
      where: {
        updatedAt: {
          gte: dateRange.start,
          lte: dateRange.end
        }
      }
    });

    // 计算增长率
    const userGrowthRate = previousPeriodUsers > 0 
      ? ((newUsers - previousPeriodUsers) / previousPeriodUsers) * 100 
      : 0;

    // 模拟其他数据
    const retentionRate = 75.5; // 模拟保留率
    const averageSessionTime = 25.3; // 模拟平均会话时间（分钟）

    return {
      totalUsers,
      newUsers,
      activeUsers,
      retentionRate,
      averageSessionTime,
      userGrowthRate,
      topCountries: [
        { country: 'United States', count: Math.floor(totalUsers * 0.35), percentage: 35 },
        { country: 'United Kingdom', count: Math.floor(totalUsers * 0.20), percentage: 20 },
        { country: 'Canada', count: Math.floor(totalUsers * 0.15), percentage: 15 },
        { country: 'Australia', count: Math.floor(totalUsers * 0.12), percentage: 12 },
        { country: 'Germany', count: Math.floor(totalUsers * 0.10), percentage: 10 },
        { country: 'Others', count: Math.floor(totalUsers * 0.08), percentage: 8 }
      ],
      ageDistribution: [
        { ageGroup: '18-24', count: Math.floor(totalUsers * 0.25), percentage: 25 },
        { ageGroup: '25-34', count: Math.floor(totalUsers * 0.35), percentage: 35 },
        { ageGroup: '35-44', count: Math.floor(totalUsers * 0.25), percentage: 25 },
        { ageGroup: '45-54', count: Math.floor(totalUsers * 0.10), percentage: 10 },
        { ageGroup: '55+', count: Math.floor(totalUsers * 0.05), percentage: 5 }
      ],
      deviceTypes: [
        { device: 'Mobile', count: Math.floor(totalUsers * 0.70), percentage: 70 },
        { device: 'Desktop', count: Math.floor(totalUsers * 0.25), percentage: 25 },
        { device: 'Tablet', count: Math.floor(totalUsers * 0.05), percentage: 5 }
      ]
    };
  }

  // 获取游戏分析数据
  async getGameAnalytics(filters: AnalyticsFilters): Promise<GameAnalytics> {
    const { period, startDate, endDate } = filters;
    const dateRange = this.getDateRange(period, startDate, endDate);

    const [
      totalGames,
      newGames,
      activeGames,
      completedGames,
      cancelledGames
    ] = await Promise.all([
      this.prisma.betGame.count(),
      this.prisma.betGame.count({
        where: {
          createdAt: {
            gte: dateRange.start,
            lte: dateRange.end
          }
        }
      }),
      this.prisma.betGame.count({
        where: {
          status: { in: ['OPEN', 'IN_PROGRESS', 'EVIDENCE_SUBMISSION', 'PEER_REVIEW'] }
        }
      }),
      this.prisma.betGame.count({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: dateRange.start,
            lte: dateRange.end
          }
        }
      }),
      this.prisma.betGame.count({
        where: {
          status: 'DISPUTED', // 使用现有的状态
          createdAt: {
            gte: dateRange.start,
            lte: dateRange.end
          }
        }
      })
    ]);

    // 计算平均参与者数量
    const gamesWithParticipants = await this.prisma.betGame.findMany({
      where: {
        createdAt: {
          gte: dateRange.start,
          lte: dateRange.end
        }
      },
      select: {
        currentParticipants: true
      }
    });

    const averageParticipants = gamesWithParticipants.length > 0
      ? gamesWithParticipants.reduce((sum, game) => sum + game.currentParticipants, 0) / gamesWithParticipants.length
      : 0;

    // 获取游戏分类统计
    const categoryStats = await this.prisma.betGame.groupBy({
      by: ['category'],
      where: {
        createdAt: {
          gte: dateRange.start,
          lte: dateRange.end
        }
      },
      _count: {
        category: true
      }
    });

    const popularCategories = categoryStats.map(stat => ({
      category: stat.category,
      count: stat._count.category,
      percentage: Math.round((stat._count.category / newGames) * 100)
    }));

    const gameCompletionRate = newGames > 0 ? (completedGames / newGames) * 100 : 0;

    return {
      totalGames,
      newGames,
      activeGames,
      completedGames,
      cancelledGames,
      averageParticipants: Math.round(averageParticipants * 10) / 10,
      averageGameDuration: 4.2, // 模拟平均游戏时长（天）
      popularCategories,
      gameCompletionRate: Math.round(gameCompletionRate * 10) / 10,
      averageStakeAmount: 25.50 // 模拟平均赌注金额
    };
  }

  // 获取收入分析数据
  async getRevenueAnalytics(filters: AnalyticsFilters): Promise<RevenueAnalytics> {
    const { period } = filters;

    // 获取VIP用户数量
    const vipUsers = await this.prisma.user.count({
      where: { isVip: true }
    });

    // 获取VIP订阅数据
    const vipSubscriptions = await this.prisma.vipSubscription.findMany({
      where: { isActive: true },
      select: { paymentAmount: true }
    });

    const vipRevenue = vipSubscriptions.reduce((sum, sub) => sum + Number(sub.paymentAmount || 0), 0);

    // 模拟其他收入数据
    const totalRevenue = vipRevenue * 1.3; // VIP收入 + 其他收入
    const subscriptionRevenue = vipRevenue;
    const transactionFees = totalRevenue * 0.1; // 10%手续费
    const revenueGrowthRate = 15.2; // 模拟增长率
    const totalUsers = await this.prisma.user.count();
    const averageRevenuePerUser = totalUsers > 0 ? totalRevenue / totalUsers : 0;

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      vipRevenue: Math.round(vipRevenue * 100) / 100,
      subscriptionRevenue: Math.round(subscriptionRevenue * 100) / 100,
      transactionFees: Math.round(transactionFees * 100) / 100,
      revenueGrowthRate,
      averageRevenuePerUser: Math.round(averageRevenuePerUser * 100) / 100,
      monthlyRecurringRevenue: Math.round((vipRevenue / 3) * 100) / 100, // 假设平均3个月订阅
      churnRate: 5.8, // 模拟流失率
      lifetimeValue: 156.50 // 模拟用户生命周期价值
    };
  }

  // 获取系统分析数据
  async getSystemAnalytics(): Promise<SystemAnalytics> {
    // 模拟系统性能数据
    return {
      serverUptime: 99.95,
      averageResponseTime: 85, // 毫秒
      errorRate: 0.12, // 百分比
      apiCallsCount: 1250000,
      databasePerformance: {
        queryTime: 12.5, // 平均查询时间（毫秒）
        connectionPool: 85, // 连接池使用率（百分比）
        slowQueries: 3 // 慢查询数量
      },
      storageUsage: {
        total: 1000, // GB
        used: 245, // GB
        available: 755 // GB
      }
    };
  }

  // 获取综合仪表板数据
  async getDashboardOverview(filters: AnalyticsFilters) {
    const [
      userAnalytics,
      gameAnalytics,
      revenueAnalytics,
      systemAnalytics
    ] = await Promise.all([
      this.getUserAnalytics(filters),
      this.getGameAnalytics(filters),
      this.getRevenueAnalytics(filters),
      this.getSystemAnalytics()
    ]);

    // 计算关键指标
    const keyMetrics = {
      totalUsers: userAnalytics.totalUsers,
      activeUsers: userAnalytics.activeUsers,
      totalGames: gameAnalytics.totalGames,
      totalRevenue: revenueAnalytics.totalRevenue,
      userGrowthRate: userAnalytics.userGrowthRate,
      revenueGrowthRate: revenueAnalytics.revenueGrowthRate,
      systemUptime: systemAnalytics.serverUptime,
      gameCompletionRate: gameAnalytics.gameCompletionRate
    };

    // 生成趋势数据（模拟）
    const trends = this.generateTrendData(filters.period);

    return {
      keyMetrics,
      trends,
      userAnalytics,
      gameAnalytics,
      revenueAnalytics,
      systemAnalytics,
      alerts: this.generateSystemAlerts(systemAnalytics),
      recommendations: this.generateRecommendations(userAnalytics, gameAnalytics, revenueAnalytics)
    };
  }

  // 生成趋势数据
  private generateTrendData(period: string) {
    const dataPoints = period === 'day' ? 24 : period === 'week' ? 7 : 30;
    const trends = {
      users: [],
      games: [],
      revenue: []
    };

    for (let i = 0; i < dataPoints; i++) {
      const baseUsers = 100 + Math.random() * 50;
      const baseGames = 20 + Math.random() * 15;
      const baseRevenue = 500 + Math.random() * 300;

      trends.users.push({
        date: new Date(Date.now() - (dataPoints - i) * (period === 'day' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000)),
        value: Math.round(baseUsers)
      });

      trends.games.push({
        date: new Date(Date.now() - (dataPoints - i) * (period === 'day' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000)),
        value: Math.round(baseGames)
      });

      trends.revenue.push({
        date: new Date(Date.now() - (dataPoints - i) * (period === 'day' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000)),
        value: Math.round(baseRevenue * 100) / 100
      });
    }

    return trends;
  }

  // 生成系统警报
  private generateSystemAlerts(systemAnalytics: SystemAnalytics) {
    const alerts = [];

    if (systemAnalytics.errorRate > 1.0) {
      alerts.push({
        type: 'ERROR',
        message: `错误率过高: ${systemAnalytics.errorRate}%`,
        severity: 'HIGH'
      });
    }

    if (systemAnalytics.averageResponseTime > 200) {
      alerts.push({
        type: 'PERFORMANCE',
        message: `响应时间过慢: ${systemAnalytics.averageResponseTime}ms`,
        severity: 'MEDIUM'
      });
    }

    if (systemAnalytics.storageUsage.used / systemAnalytics.storageUsage.total > 0.8) {
      alerts.push({
        type: 'STORAGE',
        message: `存储空间不足: ${Math.round((systemAnalytics.storageUsage.used / systemAnalytics.storageUsage.total) * 100)}%`,
        severity: 'HIGH'
      });
    }

    return alerts;
  }

  // 生成建议
  private generateRecommendations(userAnalytics: UserAnalytics, gameAnalytics: GameAnalytics, revenueAnalytics: RevenueAnalytics) {
    const recommendations = [];

    if (userAnalytics.retentionRate < 70) {
      recommendations.push({
        type: 'USER_RETENTION',
        message: '用户留存率较低，建议优化用户体验和增加互动功能',
        priority: 'HIGH'
      });
    }

    if (gameAnalytics.gameCompletionRate < 60) {
      recommendations.push({
        type: 'GAME_COMPLETION',
        message: '游戏完成率较低，建议简化游戏流程或提供更好的指导',
        priority: 'MEDIUM'
      });
    }

    if (revenueAnalytics.churnRate > 10) {
      recommendations.push({
        type: 'REVENUE',
        message: '用户流失率较高，建议改进VIP服务和用户支持',
        priority: 'HIGH'
      });
    }

    return recommendations;
  }

  // 获取日期范围
  private getDateRange(period: string, startDate?: Date, endDate?: Date) {
    const now = new Date();
    let start: Date, end: Date, previousStart: Date;

    if (startDate && endDate) {
      start = startDate;
      end = endDate;
      const duration = end.getTime() - start.getTime();
      previousStart = new Date(start.getTime() - duration);
    } else {
      switch (period) {
        case 'day':
          start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          end = now;
          previousStart = new Date(start.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          end = now;
          previousStart = new Date(start.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          end = now;
          previousStart = new Date(start.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'quarter':
          start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          end = now;
          previousStart = new Date(start.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          end = now;
          previousStart = new Date(start.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          end = now;
          previousStart = new Date(start.getTime() - 7 * 24 * 60 * 60 * 1000);
      }
    }

    return { start, end, previousStart };
  }
}
