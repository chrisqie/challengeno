import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class FeaturedGamesService {
  constructor(private prisma: PrismaService) {}

  // 计算游戏热度分数
  private calculateHotScore(game: any): number {
    const now = new Date();
    const createdAt = new Date(game.createdAt);
    const daysSinceCreated = Math.max(1, (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    // 基础分数计算
    const viewScore = game.viewCount * 1.0; // 浏览量权重
    const participantScore = game.currentParticipants * 5.0; // 参与人数权重（更重要）
    const maxParticipantScore = (game.currentParticipants / game.maxParticipants) * 3.0; // 参与率权重
    
    // 时间衰减因子（新游戏有加成）
    const timeDecay = Math.max(0.1, 1 / Math.sqrt(daysSinceCreated));
    
    // 状态加成
    let statusBonus = 1.0;
    if (game.status === 'OPEN') statusBonus = 1.5; // 开放中的游戏有加成
    else if (game.status === 'IN_PROGRESS') statusBonus = 1.2; // 进行中的游戏有小加成
    
    // 总分计算
    const totalScore = (viewScore + participantScore + maxParticipantScore) * timeDecay * statusBonus;
    
    return Math.round(totalScore * 100) / 100; // 保留两位小数
  }

  // 更新热门游戏
  async updateFeaturedGames(): Promise<void> {
    try {
      console.log('🔄 开始更新热门游戏...');

      // 获取所有游戏及其统计数据
      const games = await this.prisma.betGame.findMany({
        select: {
          id: true,
          title: true,
          status: true,
          viewCount: true,
          currentParticipants: true,
          maxParticipants: true,
          createdAt: true,
          isFeatured: true,
        },
        where: {
          status: {
            in: ['OPEN', 'IN_PROGRESS', 'EVIDENCE_SUBMISSION', 'PEER_REVIEW']
          }
        }
      });

      if (games.length === 0) {
        console.log('⚠️  没有找到活跃游戏');
        return;
      }

      // 计算每个游戏的热度分数
      const gamesWithScore = games.map(game => ({
        ...game,
        hotScore: this.calculateHotScore(game)
      }));

      // 按热度分数排序
      gamesWithScore.sort((a, b) => b.hotScore - a.hotScore);

      // 确定热门游戏数量（最多5个，至少1个）
      const featuredCount = Math.min(5, Math.max(1, Math.ceil(games.length * 0.2)));
      const featuredGameIds = gamesWithScore.slice(0, featuredCount).map(g => g.id);

      // 使用事务避免死锁,并添加重试逻辑
      let retries = 3;
      while (retries > 0) {
        try {
          await this.prisma.$transaction(async (tx) => {
            // 先清除所有热门状态
            await tx.betGame.updateMany({
              data: { isFeatured: false }
            });

            // 设置新的热门游戏
            if (featuredGameIds.length > 0) {
              await tx.betGame.updateMany({
                where: { id: { in: featuredGameIds } },
                data: { isFeatured: true }
              });
            }
          }, {
            timeout: 10000, // 10秒超时
            isolationLevel: 'ReadCommitted' // 使用读已提交隔离级别减少锁冲突
          });
          break; // 成功则跳出循环
        } catch (error) {
          retries--;
          if (retries === 0) {
            throw error; // 重试次数用完,抛出错误
          }
          // 等待随机时间后重试(避免多个进程同时重试)
          await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
        }
      }

      console.log(`✅ 更新完成！设置了 ${featuredCount} 个热门游戏`);
      
      // 输出热门游戏信息
      const topGames = gamesWithScore.slice(0, featuredCount);
      topGames.forEach((game, index) => {
        console.log(`${index + 1}. ${game.title} (分数: ${game.hotScore}, 浏览: ${game.viewCount}, 参与: ${game.currentParticipants})`);
      });

    } catch (error) {
      console.error('❌ 更新热门游戏失败:', error);
    }
  }

  // 增加游戏浏览量
  async incrementViewCount(gameId: string): Promise<void> {
    try {
      await this.prisma.betGame.update({
        where: { id: gameId },
        data: { viewCount: { increment: 1 } }
      });
    } catch (error) {
      console.error('增加浏览量失败:', error);
    }
  }

  // 获取热门游戏统计信息
  async getFeaturedGamesStats() {
    const featuredGames = await this.prisma.betGame.findMany({
      where: { isFeatured: true },
      select: {
        id: true,
        title: true,
        viewCount: true,
        currentParticipants: true,
        maxParticipants: true,
        status: true,
        createdAt: true,
      },
      orderBy: [
        { viewCount: 'desc' },
        { currentParticipants: 'desc' }
      ]
    });

    return featuredGames.map(game => ({
      ...game,
      hotScore: this.calculateHotScore(game),
      participationRate: Math.round((game.currentParticipants / game.maxParticipants) * 100)
    }));
  }

  // 手动触发热门游戏更新（用于管理员）
  async manualUpdateFeaturedGames(): Promise<{ success: boolean; message: string; count: number }> {
    try {
      await this.updateFeaturedGames();
      
      const featuredCount = await this.prisma.betGame.count({
        where: { isFeatured: true }
      });

      return {
        success: true,
        message: '热门游戏更新成功',
        count: featuredCount
      };
    } catch (error) {
      return {
        success: false,
        message: '热门游戏更新失败: ' + error.message,
        count: 0
      };
    }
  }

  // 定时任务：每小时更新热门游戏
  @Cron(CronExpression.EVERY_HOUR)
  async handleFeaturedGamesUpdate() {
    console.log('⏰ 定时更新热门游戏...');
    await this.updateFeaturedGames();
  }

  // 定时任务：每天凌晨2点重新计算热门游戏
  @Cron('0 2 * * *')
  async handleDailyFeaturedGamesUpdate() {
    console.log('🌙 每日热门游戏重新计算...');
    await this.updateFeaturedGames();
  }
}
