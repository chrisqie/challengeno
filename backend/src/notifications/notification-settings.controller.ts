import { Controller, Get, Put, Body, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationSettingsService, NotificationSettingsDto } from './notification-settings.service';

@Controller('notification-settings')
@UseGuards(JwtAuthGuard)
export class NotificationSettingsController {
  constructor(private notificationSettingsService: NotificationSettingsService) {}

  // 获取用户通知设置
  @Get()
  async getSettings(@Request() req) {
    return this.notificationSettingsService.getUserSettings(req.user.sub);
  }

  // 更新用户通知设置
  @Put()
  async updateSettings(
    @Request() req,
    @Body() settings: NotificationSettingsDto
  ) {
    return this.notificationSettingsService.updateUserSettings(req.user.sub, settings);
  }

  // 重置为默认设置
  @Put('reset')
  async resetSettings(@Request() req) {
    return this.notificationSettingsService.resetToDefaults(req.user.sub);
  }

  // 获取通知统计信息
  @Get('stats')
  async getStats(@Request() req) {
    return this.notificationSettingsService.getNotificationStats(req.user.sub);
  }
}
