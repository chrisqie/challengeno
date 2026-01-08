import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AdminService } from './admin.service';
import { UserManagementService } from './user-management.service';
import { ContentModerationService } from './content-moderation.service';
import { AdminAnalyticsService } from './admin-analytics.service';
import { SystemConfigService } from './system-config.service';
import { ShopManagementService } from './shop-management.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { CreateReportDto } from './dto/create-report.dto';
import { HandleReportDto } from './dto/handle-report.dto';
import { AdminActionDto } from './dto/admin-action.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private adminService: AdminService,
    private userManagementService: UserManagementService,
    private contentModerationService: ContentModerationService,
    private adminAnalyticsService: AdminAnalyticsService,
    private systemConfigService: SystemConfigService,
    private shopManagementService: ShopManagementService,
  ) {}

  // 管理员认证检查
  @Get('check')
  async checkAdminStatus(@Request() req) {
    return this.adminService.checkAdminStatus(req.user.sub);
  }

  // 用户管理
  @Get('users')
  async getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getUsers({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      search,
      status,
    });
  }

  @Get('users/:id')
  async getUserDetail(@Param('id') id: string) {
    return this.adminService.getUserDetail(id);
  }

  @Put('users/:id/ban')
  async banUserSimple(
    @Param('id') id: string,
    @Body() body: { reason?: string; duration?: number },
    @Request() req
  ) {
    return this.userManagementService.banUser(id, req.user.sub, body.reason || '违规行为', body.duration);
  }

  @Put('users/:id/unban')
  async unbanUserSimple(
    @Param('id') id: string,
    @Request() req
  ) {
    return this.userManagementService.unbanUser(id, req.user.sub, '管理员解封');
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string, @Request() req) {
    return this.userManagementService.deleteUser(id, req.user.sub, '管理员删除');
  }

  @Put('users/:id/restore')
  async restoreUser(@Param('id') id: string, @Request() req) {
    return this.userManagementService.restoreUser(id, req.user.sub, '管理员恢复');
  }

  // 游戏管理
  @Get('games')
  async getGames(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getGames({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
      search,
    });
  }

  @Put('games/:id/suspend')
  async suspendGame(@Param('id') id: string, @Request() req) {
    return this.adminService.suspendGame(id, req.user.sub);
  }

  @Put('games/:id/resume')
  async resumeGame(@Param('id') id: string, @Request() req) {
    return this.adminService.resumeGame(id, req.user.sub);
  }

  @Delete('games/:id')
  async deleteGame(@Param('id') id: string, @Request() req) {
    return this.adminService.deleteGame(id, req.user.sub);
  }

  @Put('games/:id/featured')
  async toggleGameFeatured(@Param('id') id: string, @Request() req) {
    return this.adminService.toggleGameFeatured(id, req.user.sub);
  }

  @Post('games/update-featured')
  async updateFeaturedGames(@Request() req) {
    return this.adminService.updateFeaturedGames(req.user.sub);
  }

  @Get('games/featured-stats')
  async getFeaturedGamesStats(@Request() req) {
    return this.adminService.getFeaturedGamesStats(req.user.sub);
  }

  // 举报管理
  @Get('reports')
  async getReports(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
  ) {
    return this.adminService.getReports({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
      type,
    });
  }

  @Post('reports')
  async createReport(@Body() createReportDto: CreateReportDto, @Request() req) {
    return this.adminService.createReport(createReportDto, req.user.sub);
  }

  @Put('reports/:id/approve')
  async approveReport(@Param('id') id: string, @Request() req) {
    return this.adminService.approveReport(id, req.user.sub);
  }

  @Put('reports/:id/reject')
  async rejectReport(@Param('id') id: string, @Request() req) {
    return this.adminService.rejectReport(id, req.user.sub);
  }

  @Put('reports/:id/handle')
  async handleReport(
    @Param('id') id: string,
    @Body() handleReportDto: HandleReportDto,
    @Request() req,
  ) {
    return this.adminService.handleReport(id, handleReportDto, req.user.sub);
  }

  // 系统统计
  @Get('stats/overview')
  async getOverviewStats() {
    return this.adminService.getOverviewStats();
  }

  @Get('stats/users')
  async getUserStats(@Query('period') period?: string) {
    return this.adminService.getUserStats(period);
  }

  @Get('stats/games')
  async getGameStats(@Query('period') period?: string) {
    return this.adminService.getGameStats(period);
  }

  @Get('stats/detailed')
  async getDetailedStats(@Query('timeRange') timeRange?: string) {
    return this.adminService.getDetailedStats(timeRange);
  }

  @Get('stats/recent-activities')
  async getRecentActivities(@Query('limit') limit?: string) {
    return this.adminService.getRecentActivities(limit ? parseInt(limit) : 10);
  }

  // VIP管理相关API
  @Get('vip/stats')
  async getVipStats() {
    return this.adminService.getVipStats();
  }

  @Get('vip/users')
  async getVipUsers(@Query() query: any) {
    return this.adminService.getVipUsers(query);
  }

  @Put('vip/:userId/extend')
  async extendVip(@Param('userId') userId: string, @Body() body: { days: number }, @Request() req) {
    return this.adminService.extendVip(userId, body.days, req.user.sub);
  }

  @Put('vip/:userId/revoke')
  async revokeVip(@Param('userId') userId: string, @Request() req) {
    return this.adminService.revokeVip(userId, req.user.sub);
  }

  @Put('vip/:userId/upgrade')
  async upgradeVip(@Param('userId') userId: string, @Body() body: { tier: string }, @Request() req) {
    return this.adminService.upgradeVip(userId, body.tier, req.user.sub);
  }

  // 管理员操作记录
  @Get('actions')
  async getAdminActions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('adminId') adminId?: string,
  ) {
    return this.adminService.getAdminActions({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      adminId,
    });
  }

  @Post('actions')
  async logAdminAction(@Body() adminActionDto: AdminActionDto, @Request() req) {
    return this.adminService.logAdminAction(adminActionDto, req.user.sub);
  }

  // 团队管理
  @Get('teams')
  async getTeams(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('isPublic') isPublic?: string,
  ) {
    return this.adminService.getTeams({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 50,
      search,
      isPublic: isPublic !== undefined ? isPublic === 'true' : undefined,
    });
  }

  @Get('teams/:id')
  async getTeamDetail(@Param('id') id: string) {
    return this.adminService.getTeamDetail(id);
  }

  @Delete('teams/:id')
  async deleteTeam(@Param('id') id: string, @Request() req) {
    return this.adminService.deleteTeam(id, req.user.sub);
  }

  // === 增强的用户管理API ===

  // 获取用户列表（增强版）
  @Get('users/enhanced')
  async getEnhancedUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('role') role?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    return this.userManagementService.getUsers({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      search,
      status: status as any,
      role: role as any,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any
    });
  }

  // 获取用户详情（增强版）
  @Get('users/:id/enhanced')
  async getEnhancedUserDetail(@Param('id') id: string) {
    return this.userManagementService.getUserDetail(id);
  }

  // 警告用户
  @Post('users/:id/warn')
  async warnUser(
    @Param('id') id: string,
    @Body() body: { reason: string },
    @Request() req
  ) {
    return this.userManagementService.warnUser(id, req.user.sub, body.reason);
  }

  // === 内容审核API ===

  // 获取待审核内容
  @Get('moderation/pending')
  async getPendingContent(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('contentType') contentType?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string
  ) {
    return this.contentModerationService.getPendingContent({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      contentType: contentType as any,
      status: status as any,
      priority: priority as any
    });
  }

  // 审核游戏内容
  @Post('moderation/games/:id')
  async moderateGame(
    @Param('id') id: string,
    @Body() body: { action: 'APPROVE' | 'REJECT' | 'FLAG'; reason: string },
    @Request() req
  ) {
    return this.contentModerationService.moderateGame(id, req.user.sub, body.action, body.reason);
  }

  // 处理举报
  @Post('moderation/reports/:id')
  async handleContentReport(
    @Param('id') id: string,
    @Body() body: { action: 'RESOLVE' | 'DISMISS'; resolution: string },
    @Request() req
  ) {
    return this.contentModerationService.handleReport(id, req.user.sub, body.action, body.resolution);
  }

  // 批量审核
  @Post('moderation/batch')
  async batchModerate(
    @Body() body: { contentIds: string[]; action: 'APPROVE' | 'REJECT'; reason: string },
    @Request() req
  ) {
    return this.contentModerationService.batchModerate(body.contentIds, req.user.sub, body.action, body.reason);
  }

  // 获取审核统计
  @Get('moderation/stats')
  async getModerationStats(@Query('period') period?: string) {
    return this.contentModerationService.getModerationStats(period as any);
  }

  // 自动检测不当内容
  @Post('moderation/auto-detect')
  async autoDetectContent() {
    return this.contentModerationService.autoDetectInappropriateContent();
  }

  // === 数据分析API ===

  // 获取仪表板概览
  @Get('analytics/dashboard')
  async getDashboardOverview(
    @Query('period') period?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const filters = {
      period: (period as any) || 'week',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    };
    return this.adminAnalyticsService.getDashboardOverview(filters);
  }

  // 获取用户分析
  @Get('analytics/users')
  async getUserAnalytics(
    @Query('period') period?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const filters = {
      period: (period as any) || 'week',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    };
    return this.adminAnalyticsService.getUserAnalytics(filters);
  }

  // 获取游戏分析
  @Get('analytics/games')
  async getGameAnalytics(
    @Query('period') period?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const filters = {
      period: (period as any) || 'week',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    };
    return this.adminAnalyticsService.getGameAnalytics(filters);
  }

  // 获取收入分析
  @Get('analytics/revenue')
  async getRevenueAnalytics(
    @Query('period') period?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const filters = {
      period: (period as any) || 'week',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    };
    return this.adminAnalyticsService.getRevenueAnalytics(filters);
  }

  // 获取系统分析
  @Get('analytics/system')
  async getSystemAnalytics() {
    return this.adminAnalyticsService.getSystemAnalytics();
  }

  // === 系统配置API ===

  // 获取所有配置
  @Get('config')
  async getAllConfigs(
    @Query('category') category?: string,
    @Query('isPublic') isPublic?: string
  ) {
    return this.systemConfigService.getAllConfigs(
      category,
      isPublic ? isPublic === 'true' : undefined
    );
  }

  // 获取单个配置
  @Get('config/:key')
  async getConfig(@Param('key') key: string) {
    return this.systemConfigService.getConfig(key);
  }

  // 更新配置
  @Put('config/:key')
  async updateConfig(
    @Param('key') key: string,
    @Body() body: { value: any },
    @Request() req
  ) {
    return this.systemConfigService.updateConfig(key, body.value, req.user.sub);
  }

  // 批量更新配置
  @Put('config/batch')
  async updateMultipleConfigs(
    @Body() body: { updates: Array<{ key: string; value: any }> },
    @Request() req
  ) {
    return this.systemConfigService.updateMultipleConfigs(body.updates, req.user.sub);
  }

  // 重置配置
  @Post('config/:key/reset')
  async resetConfig(@Param('key') key: string, @Request() req) {
    return this.systemConfigService.resetConfig(key, req.user.sub);
  }

  // 维护模式管理
  @Get('maintenance')
  async getMaintenanceMode() {
    return this.systemConfigService.getMaintenanceMode();
  }

  @Put('maintenance')
  async setMaintenanceMode(
    @Body() body: { enabled: boolean; message?: string; allowedUsers?: string[] },
    @Request() req
  ) {
    return this.systemConfigService.setMaintenanceMode(body, req.user.sub);
  }

  // 系统公告管理
  @Get('announcements')
  async getAnnouncements(@Query('isActive') isActive?: string) {
    return this.systemConfigService.getAnnouncements(
      isActive ? isActive === 'true' : undefined
    );
  }

  @Post('announcements')
  async createAnnouncement(
    @Body() body: {
      title: string;
      content: string;
      type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
      targetUsers?: 'ALL' | 'VIP' | 'ADMIN' | 'NEW_USERS';
      startDate?: string;
      endDate?: string;
    },
    @Request() req
  ) {
    const announcement = {
      ...body,
      isActive: true,
      createdBy: req.user.sub,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined
    };
    return this.systemConfigService.createAnnouncement(announcement);
  }

  @Put('announcements/:id')
  async updateAnnouncement(
    @Param('id') id: string,
    @Body() body: any
  ) {
    return this.systemConfigService.updateAnnouncement(id, body);
  }

  @Delete('announcements/:id')
  async deleteAnnouncement(@Param('id') id: string) {
    return this.systemConfigService.deleteAnnouncement(id);
  }

  // 功能开关管理
  @Get('features')
  async getFeatureFlags() {
    return this.systemConfigService.getFeatureFlags();
  }

  @Put('features/:feature')
  async updateFeatureFlag(
    @Param('feature') feature: string,
    @Body() body: { enabled: boolean },
    @Request() req
  ) {
    return this.systemConfigService.updateFeatureFlag(feature, body.enabled, req.user.sub);
  }

  // 系统状态
  @Get('system/status')
  async getSystemStatus() {
    return this.systemConfigService.getSystemStatus();
  }

  // ==================== 商城管理 ====================

  // 测试商城管理模块
  @Get('shop/test')
  async testShopModule() {
    const fs = require('fs');
    const path = require('path');

    // 检查上传目录
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'shop');
    const dirExists = fs.existsSync(uploadsDir);

    let files = [];
    if (dirExists) {
      try {
        files = fs.readdirSync(uploadsDir);
      } catch (error) {
        files = [`Error reading directory: ${error.message}`];
      }
    }

    return {
      success: true,
      message: '商城管理模块正常工作',
      timestamp: new Date().toISOString(),
      uploadDir: uploadsDir,
      dirExists,
      files: files.slice(0, 10), // 只显示前10个文件
    };
  }

  // 获取所有商品
  @Get('shop/items')
  async getAllShopItems(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 20;
    const activeFilter = isActive !== undefined ? isActive === 'true' : undefined;

    return this.shopManagementService.getAllShopItems(pageNum, limitNum, category, activeFilter);
  }

  // 创建商品
  @Post('shop/items')
  async createShopItem(
    @Body() body: {
      name: string;
      description?: string;
      category: string;
      pointType: 'PARTICIPATION' | 'TRUST' | 'LABOR';
      pointCost: number;
      stock?: number;
      isActive?: boolean;
      sortOrder?: number;
    }
  ) {
    return this.shopManagementService.createShopItem(body);
  }

  // 更新商品
  @Put('shop/items/:itemId')
  async updateShopItem(
    @Param('itemId') itemId: string,
    @Body() body: {
      name?: string;
      description?: string;
      category?: string;
      pointType?: 'PARTICIPATION' | 'TRUST' | 'LABOR';
      pointCost?: number;
      stock?: number;
      isActive?: boolean;
      sortOrder?: number;
    }
  ) {
    return this.shopManagementService.updateShopItem(itemId, body);
  }

  // 删除商品
  @Delete('shop/items/:itemId')
  async deleteShopItem(@Param('itemId') itemId: string) {
    return this.shopManagementService.deleteShopItem(itemId);
  }

  // 批量更新商品
  @Put('shop/items/batch')
  async batchUpdateShopItems(
    @Body() body: {
      itemIds: string[];
      isActive?: boolean;
      sortOrder?: number;
    }
  ) {
    return this.shopManagementService.batchUpdateShopItems(body.itemIds, {
      isActive: body.isActive,
      sortOrder: body.sortOrder,
    });
  }

  // 获取商城统计
  @Get('shop/statistics')
  async getShopStatistics() {
    return this.shopManagementService.getShopStatistics();
  }

  // 上传商品图片
  @Post('shop/items/:itemId/image')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/shop',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        callback(null, `shop-item-${uniqueSuffix}${ext}`);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.startsWith('image/')) {
        return callback(new BadRequestException('只能上传图片文件'), false);
      }
      callback(null, true);
    },
  }))
  async uploadShopItemImage(
    @Param('itemId') itemId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('请选择要上传的图片');
    }

    return this.shopManagementService.uploadShopItemImage(itemId, file.filename);
  }
}
