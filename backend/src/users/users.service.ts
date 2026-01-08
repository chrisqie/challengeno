import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        dateOfBirth: true,
        participationPoints: true,
        trustPoints: true,
        laborPoints: true,
        totalGamesCreated: true,
        totalGamesJoined: true,
        gamesCompleted: true,
        privacyMode: true,
        dailyGameLimit: true,
        preferredLanguage: true,
        isVip: true,
        vipExpiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        dateOfBirth: true,
        avatar: true,
        bio: true,
        location: true,
        phone: true,
        website: true,
        interests: true,
        participationPoints: true,
        trustPoints: true,
        laborPoints: true,
        totalGamesCreated: true,
        totalGamesJoined: true,
        gamesCompleted: true,
        privacyMode: true,
        dailyGameLimit: true,
        preferredLanguage: true,
        isVip: true,
        vipExpiresAt: true,
        // 隐私设置
        showEmail: true,
        showPhone: true,
        showLocation: true,
        showBirthDate: true,
        allowFriendRequests: true,
        allowGameInvites: true,
        // 位置信息
        country: true,
        countryCode: true,
        city: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async searchUsers(query: string, currentUserId: string) {
    if (!query || query.trim().length === 0) {
      return [];
    }

    // 搜索用户名包含查询字符串的用户
    const users = await this.prisma.user.findMany({
      where: {
        username: {
          contains: query.trim(),
          mode: 'insensitive', // 不区分大小写
        },
        NOT: {
          id: currentUserId, // 排除当前用户自己
        },
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        trustPoints: true,
        isVip: true,
        totalGamesCreated: true,
        totalGamesJoined: true,
      },
      take: 20, // 最多返回20个结果
      orderBy: {
        trustPoints: 'desc', // 按信任度排序
      },
    });

    // 获取每个用户与当前用户的好友关系状态
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const friendship = await this.prisma.friendship.findFirst({
          where: {
            OR: [
              { requesterId: currentUserId, addresseeId: user.id },
              { requesterId: user.id, addresseeId: currentUserId },
            ],
          },
          select: {
            status: true,
            requesterId: true,
          },
        });

        let friendshipStatus = 'none'; // none, pending_sent, pending_received, accepted, blocked
        if (friendship) {
          if (friendship.status === 'ACCEPTED') {
            friendshipStatus = 'accepted';
          } else if (friendship.status === 'PENDING') {
            // 判断是发送的还是接收的
            friendshipStatus = friendship.requesterId === currentUserId ? 'pending_sent' : 'pending_received';
          } else if (friendship.status === 'BLOCKED') {
            friendshipStatus = 'blocked';
          }
        }

        return {
          ...user,
          friendshipStatus,
        };
      })
    );

    return usersWithStatus;
  }

  async updatePoints(userId: string, pointType: 'participation' | 'trust' | 'labor', change: number) {
    const updateData: any = {};
    
    switch (pointType) {
      case 'participation':
        updateData.participationPoints = { increment: change };
        break;
      case 'trust':
        updateData.trustPoints = { increment: change };
        break;
      case 'labor':
        updateData.laborPoints = { increment: change };
        break;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  async updateGameStats(userId: string, type: 'created' | 'joined' | 'left' | 'completed') {
    const updateData: any = {};

    switch (type) {
      case 'created':
        updateData.totalGamesCreated = { increment: 1 };
        break;
      case 'joined':
        updateData.totalGamesJoined = { increment: 1 };
        break;
      case 'left':
        updateData.totalGamesJoined = { decrement: 1 };
        break;
      case 'completed':
        updateData.gamesCompleted = { increment: 1 };
        break;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  async updateUserAvatar(userId: string, avatarUrl: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
    });
  }
}
