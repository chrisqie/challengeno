import { Controller, Post, Get, Patch, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { HandleFeedbackDto } from './dto/handle-feedback.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { AdminGuard } from '../admin/guards/admin.guard';
import { FeedbackStatus } from '@prisma/client';

@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  // 提交反馈（允许匿名）
  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  async createFeedback(@Request() req: any, @Body() createFeedbackDto: CreateFeedbackDto) {
    const userId = req.user?.sub;
    return this.feedbackService.createFeedback(userId, createFeedbackDto);
  }

  // 获取反馈统计（管理员）
  @Get('stats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getFeedbackStats() {
    return this.feedbackService.getFeedbackStats();
  }

  // 获取所有反馈（管理员）
  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAllFeedbacks(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('status') status?: FeedbackStatus,
    @Query('type') type?: string,
  ) {
    return this.feedbackService.getAllFeedbacks({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      type,
    });
  }

  // 处理反馈（管理员）
  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async handleFeedback(
    @Request() req: any,
    @Param('id') id: string,
    @Body() handleFeedbackDto: HandleFeedbackDto,
  ) {
    return this.feedbackService.handleFeedback(id, req.user.sub, handleFeedbackDto);
  }
}

