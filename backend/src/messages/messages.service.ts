import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  // 发送消息
  async sendMessage(senderId: string, dto: SendMessageDto) {
    // 检查接收者是否存在
    const receiver = await this.prisma.user.findUnique({
      where: { id: dto.receiverId },
    });

    if (!receiver) {
      throw new NotFoundException('接收者不存在');
    }

    // 检查是否是好友关系
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        status: 'ACCEPTED',
        OR: [
          { requesterId: senderId, addresseeId: dto.receiverId },
          { requesterId: dto.receiverId, addresseeId: senderId },
        ],
      },
    });

    if (!friendship) {
      throw new ForbiddenException('只能给好友发送消息');
    }

    // 确定消息类型
    const messageType = dto.type === 'EMOJI' ? 'EMOJI' : dto.type === 'SYSTEM' ? 'SYSTEM' : 'TEXT';

    // 创建消息
    const message = await this.prisma.message.create({
      data: {
        senderId,
        receiverId: dto.receiverId,
        content: dto.content,
        type: messageType as any,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            fullName: true,
            isVip: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });

    return message;
  }

  // 获取与某个用户的聊天记录
  async getConversation(userId: string, friendId: string, limit: number = 50, offset: number = 0) {
    // 检查是否是好友
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        status: 'ACCEPTED',
        OR: [
          { requesterId: userId, addresseeId: friendId },
          { requesterId: friendId, addresseeId: userId },
        ],
      },
    });

    if (!friendship) {
      throw new ForbiddenException('只能查看好友的聊天记录');
    }

    // 获取消息
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            fullName: true,
            isVip: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    // 标记接收到的消息为已读
    await this.prisma.message.updateMany({
      where: {
        senderId: friendId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return messages.reverse(); // 返回时按时间正序
  }

  // 获取聊天列表（最近联系人）
  async getConversationList(userId: string) {
    // 获取所有好友
    const friendships = await this.prisma.friendship.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [
          { requesterId: userId },
          { addresseeId: userId },
        ],
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            fullName: true,
            isVip: true,
          },
        },
        addressee: {
          select: {
            id: true,
            username: true,
            fullName: true,
            isVip: true,
          },
        },
      },
    });

    // 为每个好友获取最后一条消息和未读数
    const conversations = await Promise.all(
      friendships.map(async (friendship) => {
        const friend = friendship.requesterId === userId ? friendship.addressee : friendship.requester;

        // 获取最后一条消息
        const lastMessage = await this.prisma.message.findFirst({
          where: {
            OR: [
              { senderId: userId, receiverId: friend.id },
              { senderId: friend.id, receiverId: userId },
            ],
          },
          orderBy: { createdAt: 'desc' },
        });

        // 获取未读消息数
        const unreadCount = await this.prisma.message.count({
          where: {
            senderId: friend.id,
            receiverId: userId,
            isRead: false,
          },
        });

        return {
          friend,
          lastMessage,
          unreadCount,
          updatedAt: lastMessage?.createdAt || friendship.createdAt,
        };
      })
    );

    // 按最后消息时间排序
    return conversations.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  // 获取未读消息总数
  async getUnreadCount(userId: string) {
    return this.prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
  }

  // 标记消息为已读
  async markAsRead(userId: string, messageIds: string[]) {
    const result = await this.prisma.message.updateMany({
      where: {
        id: { in: messageIds },
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { updated: result.count };
  }

  // 删除消息（仅发送者可删除）
  async deleteMessage(userId: string, messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('消息不存在');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('只能删除自己发送的消息');
    }

    await this.prisma.message.delete({
      where: { id: messageId },
    });

    return { message: '消息已删除' };
  }
}

