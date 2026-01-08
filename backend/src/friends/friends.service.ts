import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../email/email.service';
import { FriendshipStatus } from '@prisma/client';

@Injectable()
export class FriendsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private emailService: EmailService,
  ) {}

  async sendFriendRequest(requesterId: string, addresseeUsername: string) {
    // 查找被添加的用户
    const addressee = await this.prisma.user.findUnique({
      where: { username: addresseeUsername },
    });

    if (!addressee) {
      throw new NotFoundException('用户不存在');
    }

    if (requesterId === addressee.id) {
      throw new BadRequestException('不能添加自己为好友');
    }

    // 检查是否已经存在好友关系
    const existingFriendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId: addressee.id },
          { requesterId: addressee.id, addresseeId: requesterId },
        ],
      },
    });

    if (existingFriendship) {
      if (existingFriendship.status === FriendshipStatus.ACCEPTED) {
        throw new BadRequestException('已经是好友了');
      } else if (existingFriendship.status === FriendshipStatus.PENDING) {
        throw new BadRequestException('好友请求已发送');
      } else if (existingFriendship.status === FriendshipStatus.BLOCKED) {
        throw new BadRequestException('无法添加此用户');
      }
    }

    // 创建好友请求
    const friendship = await this.prisma.friendship.create({
      data: {
        requesterId,
        addresseeId: addressee.id,
        status: FriendshipStatus.PENDING,
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
        addressee: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });

    // 发送通知给被添加的用户
    const requester = await this.prisma.user.findUnique({ where: { id: requesterId } });
    await this.notificationsService.notifyFriendRequest(
      addressee.id,
      requester?.username || 'Unknown'
    );

    // 发送邮件通知（异步，不阻塞流程）
    if (requester) {
      this.emailService.sendFriendRequestEmail(
        addressee.email,
        addressee.fullName,
        requester.fullName
      ).catch(error => {
        console.error('Failed to send friend request email:', error);
      });
    }

    return friendship;
  }

  async respondToFriendRequest(userId: string, friendshipId: string, accept: boolean) {
    const friendship = await this.prisma.friendship.findUnique({
      where: { id: friendshipId },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });

    if (!friendship) {
      throw new NotFoundException('好友请求不存在');
    }

    if (friendship.addresseeId !== userId) {
      throw new BadRequestException('无权处理此请求');
    }

    if (friendship.status !== FriendshipStatus.PENDING) {
      throw new BadRequestException('请求已处理');
    }

    const updatedFriendship = await this.prisma.friendship.update({
      where: { id: friendshipId },
      data: {
        status: accept ? FriendshipStatus.ACCEPTED : FriendshipStatus.BLOCKED,
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
        addressee: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });

    // 发送通知给请求者
    const currentUser = await this.prisma.user.findUnique({ where: { id: userId } });
    if (accept) {
      await this.notificationsService.notifyFriendAccepted(
        friendship.requesterId,
        currentUser?.username || 'Unknown'
      );
    } else {
      // 拒绝时也发送通知
      await this.notificationsService.notifyFriendRejected(
        friendship.requesterId,
        currentUser?.username || 'Unknown'
      );
    }

    return updatedFriendship;
  }

  async getFriends(userId: string) {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId, status: FriendshipStatus.ACCEPTED },
          { addresseeId: userId, status: FriendshipStatus.ACCEPTED },
        ],
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            fullName: true,
            trustPoints: true,
            isVip: true,
            totalGamesCreated: true,
            totalGamesJoined: true,
            isDeleted: true,
          },
        },
        addressee: {
          select: {
            id: true,
            username: true,
            fullName: true,
            trustPoints: true,
            isVip: true,
            totalGamesCreated: true,
            totalGamesJoined: true,
            isDeleted: true,
          },
        },
      },
    });

    // 返回好友信息（排除自己）
    return friendships.map(friendship => {
      const friend = friendship.requesterId === userId 
        ? friendship.addressee 
        : friendship.requester;
      
      return {
        id: friendship.id,
        friend,
        createdAt: friendship.createdAt,
      };
    });
  }

  async getPendingRequests(userId: string) {
    const pendingRequests = await this.prisma.friendship.findMany({
      where: {
        addresseeId: userId,
        status: FriendshipStatus.PENDING,
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            fullName: true,
            trustPoints: true,
            isDeleted: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return pendingRequests;
  }

  async removeFriend(userId: string, friendshipId: string) {
    const friendship = await this.prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      throw new NotFoundException('好友关系不存在');
    }

    if (friendship.requesterId !== userId && friendship.addresseeId !== userId) {
      throw new BadRequestException('无权删除此好友关系');
    }

    await this.prisma.friendship.delete({
      where: { id: friendshipId },
    });

    return { success: true, message: '已删除好友' };
  }

  async checkFriendship(userId: string, targetUserId: string) {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: targetUserId },
          { requesterId: targetUserId, addresseeId: userId },
        ],
      },
    });

    return {
      isFriend: friendship?.status === FriendshipStatus.ACCEPTED,
      status: friendship?.status || null,
      friendshipId: friendship?.id || null,
    };
  }

  async blockUser(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new BadRequestException('不能屏蔽自己');
    }

    // 检查目标用户是否存在
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('用户不存在');
    }

    // 查找现有关系
    const existingFriendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: targetUserId },
          { requesterId: targetUserId, addresseeId: userId },
        ],
      },
    });

    if (existingFriendship) {
      // 更新为屏蔽状态
      return this.prisma.friendship.update({
        where: { id: existingFriendship.id },
        data: { status: FriendshipStatus.BLOCKED },
      });
    } else {
      // 创建新的屏蔽关系
      return this.prisma.friendship.create({
        data: {
          requesterId: userId,
          addresseeId: targetUserId,
          status: FriendshipStatus.BLOCKED,
        },
      });
    }
  }

  async unblockUser(userId: string, targetUserId: string) {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        requesterId: userId,
        addresseeId: targetUserId,
        status: FriendshipStatus.BLOCKED,
      },
    });

    if (!friendship) {
      throw new NotFoundException('未找到屏蔽记录');
    }

    // 删除屏蔽关系
    return this.prisma.friendship.delete({
      where: { id: friendship.id },
    });
  }

  async getBlockedUsers(userId: string) {
    const blockedFriendships = await this.prisma.friendship.findMany({
      where: {
        requesterId: userId,
        status: FriendshipStatus.BLOCKED,
      },
      include: {
        addressee: {
          select: {
            id: true,
            username: true,
            fullName: true,
            trustPoints: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return blockedFriendships.map(f => ({
      id: f.id,
      user: f.addressee,
      blockedAt: f.createdAt,
    }));
  }

  async getFriendRecommendations(userId: string) {
    // 获取当前用户的好友ID列表
    const currentFriends = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId, status: FriendshipStatus.ACCEPTED },
          { addresseeId: userId, status: FriendshipStatus.ACCEPTED },
        ],
      },
      select: {
        requesterId: true,
        addresseeId: true,
      },
    });

    const friendIds = currentFriends.map(f =>
      f.requesterId === userId ? f.addresseeId : f.requesterId
    );

    // 获取已有关系的用户ID（包括待处理、屏蔽等）
    const existingRelations = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId },
          { addresseeId: userId },
        ],
      },
      select: {
        requesterId: true,
        addresseeId: true,
      },
    });

    const excludeIds = [
      userId,
      ...existingRelations.map(r => r.requesterId === userId ? r.addresseeId : r.requesterId),
    ];

    // 推荐算法：
    // 1. 好友的好友（共同好友）
    // 2. 参与相同游戏的用户
    // 3. 信任度高的用户

    // 获取好友的好友
    const friendsOfFriends = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: { in: friendIds }, status: FriendshipStatus.ACCEPTED },
          { addresseeId: { in: friendIds }, status: FriendshipStatus.ACCEPTED },
        ],
        NOT: {
          OR: [
            { requesterId: { in: excludeIds } },
            { addresseeId: { in: excludeIds } },
          ],
        },
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            fullName: true,
            trustPoints: true,
            isVip: true,
            totalGamesCreated: true,
            totalGamesJoined: true,
            isDeleted: true,
          },
        },
        addressee: {
          select: {
            id: true,
            username: true,
            fullName: true,
            trustPoints: true,
            isVip: true,
            totalGamesCreated: true,
            totalGamesJoined: true,
            isDeleted: true,
          },
        },
      },
      take: 20,
    });

    // 统计共同好友数
    const recommendationMap = new Map();

    friendsOfFriends.forEach(f => {
      const recommendedUser = friendIds.includes(f.requesterId) ? f.addressee : f.requester;

      if (recommendationMap.has(recommendedUser.id)) {
        recommendationMap.get(recommendedUser.id).mutualFriends += 1;
      } else {
        recommendationMap.set(recommendedUser.id, {
          ...recommendedUser,
          mutualFriends: 1,
          reason: 'mutual_friends',
        });
      }
    });

    // 如果推荐不足，添加高信任度用户
    if (recommendationMap.size < 10) {
      const highTrustUsers = await this.prisma.user.findMany({
        where: {
          id: { notIn: excludeIds },
          trustPoints: { gte: 80 },
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
        orderBy: {
          trustPoints: 'desc',
        },
        take: 10 - recommendationMap.size,
      });

      highTrustUsers.forEach(user => {
        if (!recommendationMap.has(user.id)) {
          recommendationMap.set(user.id, {
            ...user,
            mutualFriends: 0,
            reason: 'high_trust',
          });
        }
      });
    }

    // 转换为数组并排序
    const recommendations = Array.from(recommendationMap.values())
      .sort((a, b) => {
        // 优先按共同好友数排序
        if (b.mutualFriends !== a.mutualFriends) {
          return b.mutualFriends - a.mutualFriends;
        }
        // 其次按信任度排序
        return b.trustPoints - a.trustPoints;
      })
      .slice(0, 10);

    return recommendations;
  }
}
