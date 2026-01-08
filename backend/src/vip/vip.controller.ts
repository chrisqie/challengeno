import { Controller, Get, Post, Body, UseGuards, Request, Query, Param, Put, Delete } from '@nestjs/common';
import { VipService } from './vip.service';
import { VipPermissionsService } from './vip-permissions.service';
import { VipFeaturesService } from './vip-features.service';
import { VipAdminService } from './vip-admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateVipSubscriptionDto } from './dto/create-vip-subscription.dto';
import { VipTier } from '@prisma/client';

@Controller('vip')
@UseGuards(JwtAuthGuard)
export class VipController {
  constructor(
    private vipService: VipService,
    private vipPermissionsService: VipPermissionsService,
    private vipFeaturesService: VipFeaturesService,
    private vipAdminService: VipAdminService,
  ) {}

  // 获取VIP套餐信息
  @Get('plans')
  async getVipPlans(): Promise<any> {
    return this.vipService.getVipPlans();
  }

  // 获取用户VIP状态
  @Get('status')
  async getVipStatus(@Request() req: any): Promise<any> {
    return this.vipService.getUserVipStatus(req.user.sub);
  }

  // 购买VIP
  @Post('subscribe')
  async subscribeVip(@Body() createVipSubscriptionDto: CreateVipSubscriptionDto, @Request() req: any): Promise<any> {
    return this.vipService.createVipSubscription(req.user.sub, createVipSubscriptionDto);
  }

  // 管理员升级用户VIP (用于测试)
  @Post('upgrade')
  @UseGuards(AdminGuard)
  async upgradeUser(
    @Body() upgradeDto: { username?: string; tier: VipTier; duration: number },
    @Request() req: any
  ) {
    const targetUsername = upgradeDto.username || req.user.username;
    return this.vipService.upgradeUserVip(targetUsername, upgradeDto.tier, upgradeDto.duration);
  }

  // 获取VIP特权列表
  @Get('benefits')
  async getVipBenefits(@Query('tier') tier?: string) {
    return this.vipService.getVipBenefits(tier);
  }

  // 获取VIP订阅历史
  @Get('history')
  async getVipHistory(@Request() req: any): Promise<any> {
    return this.vipService.getUserVipHistory(req.user.sub);
  }

  // VIP权限相关API

  // 检查单个VIP权限
  @Get('permissions/:permission')
  async checkVipPermission(
    @Param('permission') permission: string,
    @Request() req: any
  ) {
    return this.vipPermissionsService.checkVipPermission(req.user.sub, permission);
  }

  // 批量检查VIP权限
  @Post('permissions/check')
  async checkMultiplePermissions(
    @Body() body: { permissions: string[] },
    @Request() req: any
  ) {
    return this.vipPermissionsService.checkMultiplePermissions(req.user.sub, body.permissions);
  }

  // 获取用户所有可用权限
  @Get('permissions')
  async getUserPermissions(@Request() req: any) {
    const permissions = await this.vipPermissionsService.getUserAvailablePermissions(req.user.sub);
    return { permissions };
  }

  // 获取VIP限制信息
  @Get('limits')
  async getVipLimits(@Request() req: any) {
    return this.vipPermissionsService.getVipLimits(req.user.sub);
  }

  // VIP特权功能API

  // 获取VIP专属游戏模板
  @Get('features/templates')
  async getVipTemplates(@Request() req: any) {
    return this.vipFeaturesService.getVipGameTemplates(req.user.sub);
  }

  // 获取VIP专属主题
  @Get('features/themes')
  async getVipThemes(@Request() req: any) {
    return this.vipFeaturesService.getVipThemes(req.user.sub);
  }

  // 获取VIP专属徽章
  @Get('features/badges')
  async getVipBadges(@Request() req: any) {
    return this.vipFeaturesService.getVipBadges(req.user.sub);
  }

  // 获取VIP专属统计数据
  @Get('features/statistics')
  async getVipStatistics(@Request() req: any) {
    return this.vipFeaturesService.getVipStatistics(req.user.sub);
  }

  // 获取VIP专属游戏列表
  @Get('features/games')
  async getVipGames(@Request() req: any) {
    return this.vipFeaturesService.getVipExclusiveGames(req.user.sub);
  }

  // 导出用户数据（精英VIP专属）
  @Get('features/export-data')
  async exportUserData(@Request() req: any) {
    return this.vipFeaturesService.exportUserData(req.user.sub);
  }

  // 获取VIP支持状态
  @Get('features/support-status')
  async getVipSupportStatus(@Request() req: any) {
    return this.vipFeaturesService.getVipSupportStatus(req.user.sub);
  }

  // 检查VIP权限
  @Get('check/:feature')
  async checkVipFeature(@Request() req: any, @Query('feature') feature: string): Promise<any> {
    return this.vipService.checkVipFeature(req.user.sub, feature);
  }

  // 获取VIP使用统计
  @Get('usage')
  async getVipUsage(@Request() req: any): Promise<any> {
    return this.vipService.getUserVipUsage(req.user.sub);
  }

  // 管理员VIP管理API

  // 获取VIP统计数据
  @Get('admin/statistics')
  @UseGuards(AdminGuard)
  async getAdminVipStatistics() {
    return this.vipAdminService.getVipStatistics();
  }

  // 获取VIP用户列表
  @Get('admin/users')
  @UseGuards(AdminGuard)
  async getVipUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('tier') tier?: VipTier,
    @Query('status') status?: 'ACTIVE' | 'EXPIRED' | 'ALL'
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 20;
    return this.vipAdminService.getVipUsers(pageNum, limitNum, tier, status);
  }

  // 延长用户VIP
  @Put('admin/users/:userId/extend')
  @UseGuards(AdminGuard)
  async extendUserVip(
    @Param('userId') userId: string,
    @Body() body: { days: number; reason?: string }
  ) {
    return this.vipAdminService.extendVipSubscription(userId, body.days, body.reason);
  }

  // 升级用户VIP等级
  @Put('admin/users/:userId/upgrade')
  @UseGuards(AdminGuard)
  async upgradeUserVipTier(
    @Param('userId') userId: string,
    @Body() body: { tier: VipTier; reason?: string }
  ) {
    return this.vipAdminService.upgradeVipTier(userId, body.tier, body.reason);
  }

  // 撤销用户VIP
  @Delete('admin/users/:userId/revoke')
  @UseGuards(AdminGuard)
  async revokeUserVip(
    @Param('userId') userId: string,
    @Body() body: { reason: string }
  ) {
    return this.vipAdminService.revokeVipStatus(userId, body.reason);
  }

  // 获取即将过期的VIP用户
  @Get('admin/expiring-users')
  @UseGuards(AdminGuard)
  async getExpiringVipUsers(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days) : 7;
    return this.vipAdminService.getExpiringVipUsers(daysNum);
  }
}
