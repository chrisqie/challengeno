import { Controller, Get, Post, Body, Query, Request, UseGuards, Param } from '@nestjs/common';
import { PointsService } from './points.service';
import { AchievementsService } from '../achievements/achievements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PointType } from '@prisma/client';

@Controller('points')
@UseGuards(JwtAuthGuard)
export class PointsController {
  constructor(
    private pointsService: PointsService,
    private achievementsService: AchievementsService,
  ) {}

  @Get('stats')
  async getUserPointsStats(@Request() req) {
    return this.pointsService.getUserPointsStats(req.user.sub);
  }

  @Get('history')
  async getUserPointsHistory(
    @Request() req,
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? parseInt(limit) : 50;
    return this.pointsService.getUserPointsHistory(req.user.sub, limitNum);
  }

  @Get('vip-check')
  async checkVIPExchange(@Request() req) {
    return this.pointsService.canExchangeVIP(req.user.sub);
  }

  @Get('detailed-stats')
  async getDetailedStats(@Request() req) {
    return this.pointsService.getUserDetailedStats(req.user.sub);
  }

  @Get('rankings')
  async getUserRankings(@Request() req) {
    return this.pointsService.getUserRankings(req.user.sub);
  }

  @Get('leaderboard/:type')
  async getLeaderboard(
    @Param('type') type: 'participation' | 'trust' | 'labor' | 'total',
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.pointsService.getPointsLeaderboard(type, limitNum);
  }

  // 获取用户成就
  @Get('achievements')
  async getUserAchievements(@Request() req) {
    return this.achievementsService.getUserAchievements(req.user.sub);
  }

  // 获取所有成就
  @Get('achievements/all')
  async getAllAchievements() {
    return this.achievementsService.getAllAchievements();
  }

  // 手动触发成就检查（测试用）
  @Post('achievements/check')
  async checkAchievements(@Request() req) {
    await this.achievementsService.checkAndUnlockAchievements(req.user.sub);
    return { message: '成就检查完成' };
  }

  // 获取积分趋势分析
  @Get('trends')
  async getPointsTrends(@Request() req, @Query('days') days?: string) {
    const daysNum = days ? parseInt(days) : 30;
    return this.pointsService.getUserPointsTrends(req.user.sub, daysNum);
  }

  // 获取成就进度
  @Get('achievements/progress')
  async getAchievementProgress(@Request() req) {
    return this.achievementsService.getUserAchievementProgress(req.user.sub);
  }

  // 获取用户积分详细信息
  @Get('user/:userId')
  async getUserPointsDetail(@Param('userId') userId: string) {
    const [stats, history, achievements] = await Promise.all([
      this.pointsService.getUserPointsStats(userId),
      this.pointsService.getUserPointsHistory(userId, 20),
      this.achievementsService.getUserAchievements(userId),
    ]);

    return {
      stats,
      recentHistory: history,
      achievements,
    };
  }

  // 测试API：模拟游戏完成奖励积分
  @Post('test/game-completion')
  async testGameCompletion(
    @Request() req,
    @Body() body: {
      gameId: string;
      finalResult: 'SUCCESS' | 'FAILURE';
      recognizeRate: number;
      evidenceQuality?: 'low' | 'medium' | 'high' | 'excellent';
    }
  ) {
    await this.pointsService.awardGameCompletionPoints(req.user.sub, body.gameId, {
      finalResult: body.finalResult,
      recognizeRate: body.recognizeRate,
      evidenceSubmitted: true,
      evidenceQuality: body.evidenceQuality || 'medium',
      participatedInEvaluation: true,
    });

    return { message: '积分奖励测试完成' };
  }

  // 测试API：获取系统统计
  @Get('admin/system-stats')
  async getSystemStats() {
    return this.pointsService.getSystemStats();
  }
}
