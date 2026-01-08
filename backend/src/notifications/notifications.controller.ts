import { Controller, Get, Post, Delete, Param, Query, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  // 获取用户通知列表
  @Get()
  async getNotifications(
    @Request() req,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 20;
    const offsetNum = offset ? parseInt(offset, 10) : 0;
    
    return this.notificationsService.getUserNotifications(
      req.user.sub,
      limitNum,
      offsetNum
    );
  }

  // 获取未读通知数量
  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    const count = await this.notificationsService.getUnreadCount(req.user.sub);
    return { count };
  }

  // 标记通知为已读
  @Post(':id/read')
  async markAsRead(@Request() req, @Param('id') notificationId: string) {
    return this.notificationsService.markAsRead(req.user.sub, notificationId);
  }

  // 标记所有通知为已读
  @Post('read-all')
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.sub);
  }

  // 删除通知
  @Delete(':id')
  async deleteNotification(@Request() req, @Param('id') notificationId: string) {
    return this.notificationsService.deleteNotification(req.user.sub, notificationId);
  }
}
