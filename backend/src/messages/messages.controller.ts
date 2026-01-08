import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  // 发送消息
  @Post()
  async sendMessage(@Request() req, @Body() sendMessageDto: SendMessageDto) {
    return this.messagesService.sendMessage(req.user.sub, sendMessageDto);
  }

  // 获取聊天列表
  @Get('conversations')
  async getConversationList(@Request() req) {
    return this.messagesService.getConversationList(req.user.sub);
  }

  // 获取与某个用户的聊天记录
  @Get('conversation/:friendId')
  async getConversation(
    @Request() req,
    @Param('friendId') friendId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const limitNum = limit ? parseInt(limit) : 50;
    const offsetNum = offset ? parseInt(offset) : 0;
    return this.messagesService.getConversation(req.user.sub, friendId, limitNum, offsetNum);
  }

  // 获取未读消息数
  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    const count = await this.messagesService.getUnreadCount(req.user.sub);
    return { count };
  }

  // 标记消息为已读
  @Post('mark-read')
  async markAsRead(@Request() req, @Body('messageIds') messageIds: string[]) {
    return this.messagesService.markAsRead(req.user.sub, messageIds);
  }

  // 删除消息
  @Delete(':id')
  async deleteMessage(@Request() req, @Param('id') messageId: string) {
    return this.messagesService.deleteMessage(req.user.sub, messageId);
  }
}

