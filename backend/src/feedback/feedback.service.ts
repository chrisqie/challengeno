import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { HandleFeedbackDto } from './dto/handle-feedback.dto';
import { FeedbackStatus } from '@prisma/client';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  // 创建反馈（用户提交）
  async createFeedback(userId: string | undefined, createFeedbackDto: CreateFeedbackDto) {
    return this.prisma.feedback.create({
      data: {
        userId: userId || null,
        type: createFeedbackDto.type,
        content: createFeedbackDto.content,
        email: createFeedbackDto.email,
        userAgent: createFeedbackDto.userAgent,
        url: createFeedbackDto.url,
      },
    });
  }

  // 获取所有反馈（管理员）
  async getAllFeedbacks(filters: {
    page: number;
    limit: number;
    status?: FeedbackStatus;
    type?: string;
  }) {
    const { page, limit, status, type } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (type && type !== 'all') {
      where.type = type;
    }

    const [feedbacks, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              fullName: true,
            },
          },
          handler: {
            select: {
              id: true,
              username: true,
              fullName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.feedback.count({ where }),
    ]);

    return {
      feedbacks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // 处理反馈（管理员）
  async handleFeedback(
    feedbackId: string,
    adminId: string,
    handleFeedbackDto: HandleFeedbackDto,
  ) {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id: feedbackId },
    });

    if (!feedback) {
      throw new NotFoundException('反馈不存在');
    }

    return this.prisma.feedback.update({
      where: { id: feedbackId },
      data: {
        status: handleFeedbackDto.status,
        adminNotes: handleFeedbackDto.adminNotes,
        handlerId: adminId,
        handledAt: new Date(),
      },
    });
  }

  // 获取反馈统计
  async getFeedbackStats() {
    const [total, pending, inProgress, resolved, closed] = await Promise.all([
      this.prisma.feedback.count(),
      this.prisma.feedback.count({ where: { status: FeedbackStatus.PENDING } }),
      this.prisma.feedback.count({ where: { status: FeedbackStatus.IN_PROGRESS } }),
      this.prisma.feedback.count({ where: { status: FeedbackStatus.RESOLVED } }),
      this.prisma.feedback.count({ where: { status: FeedbackStatus.CLOSED } }),
    ]);

    return {
      total,
      pending,
      inProgress,
      resolved,
      closed,
    };
  }
}

