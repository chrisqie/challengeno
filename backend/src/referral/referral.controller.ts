import { Controller, Get, Post, Body, Request, UseGuards, Query } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('referral')
export class ReferralController {
  constructor(private referralService: ReferralService) {}

  // 生成推荐码
  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generateReferralCode(@Request() req) {
    const referralCode = await this.referralService.generateReferralCode(req.user.sub);
    return { referralCode };
  }

  // 使用推荐码（注册时调用）
  @Post('use')
  @Public()
  async useReferralCode(@Body() body: { userId: string; referralCode: string }) {
    await this.referralService.useReferralCode(body.userId, body.referralCode);
    return { success: true, message: '推荐码使用成功' };
  }

  // 获取推荐统计
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getReferralStats(@Request() req) {
    return this.referralService.getReferralStats(req.user.sub);
  }

  // 生成分享链接
  @Post('share-link')
  @UseGuards(JwtAuthGuard)
  async generateShareLink(
    @Request() req,
    @Body() body: { type: 'app' | 'game' | 'achievement' | 'user_achievement' | 'achievements_overview'; targetId?: string }
  ) {
    const shareLink = await this.referralService.generateShareLink(
      req.user.sub,
      body.type,
      body.targetId
    );
    return { shareLink };
  }

  // 发放待处理的推荐奖励（管理员接口）
  @Post('grant-rewards')
  @UseGuards(JwtAuthGuard)
  async grantPendingRewards(
    @Request() req,
    @Body() body: { userId: string; referredUserId: string }
  ) {
    // 这里可以添加管理员权限检查
    await this.referralService.grantReferralReward(body.userId, body.referredUserId);
    return { success: true, message: '奖励发放成功' };
  }
}
