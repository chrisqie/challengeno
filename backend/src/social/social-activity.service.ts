import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface SocialActivity {
  id: string;
  type: 'GAME_CREATED' | 'GAME_JOINED' | 'GAME_COMPLETED' | 'ACHIEVEMENT_UNLOCKED' | 'FRIEND_ADDED' | 'VIP_UPGRADED';
  userId: string;
  username: string;
  userAvatar?: string;
  isVip: boolean;
  title: string;
  description: string;
  data: any;
  timestamp: Date;
  visibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
}

@Injectable()
export class SocialActivityService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // 创建社交动态
  async createActivity(
    userId: string,
    type: SocialActivity['type'],
    title: string,
    description: string,
    data: any = {},
    visibility: SocialActivity['visibility'] = 'PUBLIC'
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        avatar: true,
        isVip: true,
        privacyMode: true
      }
    });

    if (!user) return null;

    // 根据用户隐私设置调整可见性
    if (user.privacyMode === 'FRIENDS_ONLY' && visibility === 'PUBLIC') {
      visibility = 'FRIENDS_ONLY';
    }

    // 这里应该创建一个社交动态表，暂时使用通知表模拟
    const activity = {
      id: `activity_${Date.now()}_${userId}`,
      type,
      userId,
      username: user.username,
      userAvatar: user.avatar,
      isVip: user.isVip,
      title,
      description,
      data,
      timestamp: new Date(),
      visibility
    };

    // 通知好友（如果是公开或好友可见）
    if (visibility !== 'PRIVATE') {
      await this.notifyFriendsOfActivity(userId, activity);
    }

    return activity;
  }

  // 获取用户的社交动态
  async getUserActivities(userId: string, limit: number = 20, offset: number = 0) {
    // 暂时返回模拟数据，实际应该从数据库查询
    const activities: SocialActivity[] = [];

    // 获取用户最近的游戏活动
    const recentGames = await this.prisma.betParticipant.findMany({
      where: { userId },
      include: {
        game: {
          select: {
            id: true,
            title: true,
            category: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, avatar: true, isVip: true }
    });

    if (!user) return [];

    // 转换为社交动态格式
    recentGames.forEach(participation => {
      activities.push({
        id: `game_${participation.id}`,
        type: 'GAME_JOINED',
        userId,
        username: user.username,
        userAvatar: user.avatar,
        isVip: user.isVip,
        title: '参与了游戏',
        description: `参与了游戏"${participation.game.title}"`,
        data: {
          gameId: participation.game.id,
          gameTitle: participation.game.title,
          category: participation.game.category,
          result: participation.finalResult
        },
        timestamp: participation.createdAt,
        visibility: 'PUBLIC'
      });
    });

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // 获取好友动态流
  async getFriendsActivityFeed(userId: string, limit: number = 50, offset: number = 0) {
    // 获取用户的好友列表
    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId, status: 'ACCEPTED' },
          { addresseeId: userId, status: 'ACCEPTED' }
        ]
      }
    });

    const friendIds = friendships.map(f => 
      f.requesterId === userId ? f.addresseeId : f.requesterId
    );

    // 获取好友的活动
    const friendActivities: SocialActivity[] = [];

    for (const friendId of friendIds.slice(0, 10)) { // 限制查询数量
      const activities = await this.getUserActivities(friendId, 5, 0);
      friendActivities.push(...activities.filter(a => a.visibility !== 'PRIVATE'));
    }

    // 添加一些系统推荐的公开活动
    const publicActivities = await this.getPublicActivities(10);
    friendActivities.push(...publicActivities);

    return friendActivities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(offset, offset + limit);
  }

  // 获取公开活动
  async getPublicActivities(limit: number = 20) {
    const activities: SocialActivity[] = [];

    // 获取最近的游戏创建活动
    const recentGames = await this.prisma.betGame.findMany({
      where: { 
        status: 'OPEN',
        visibility: 'PUBLIC'
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            avatar: true,
            isVip: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    recentGames.forEach(game => {
      activities.push({
        id: `public_game_${game.id}`,
        type: 'GAME_CREATED',
        userId: game.creator.id,
        username: game.creator.username,
        userAvatar: game.creator.avatar,
        isVip: game.creator.isVip,
        title: '创建了新游戏',
        description: `创建了游戏"${game.title}"`,
        data: {
          gameId: game.id,
          gameTitle: game.title,
          category: game.category,
          maxParticipants: game.maxParticipants
        },
        timestamp: game.createdAt,
        visibility: 'PUBLIC'
      });
    });

    return activities;
  }

  // 点赞动态
  async likeActivity(userId: string, activityId: string) {
    // 这里应该在数据库中记录点赞
    // 暂时返回成功状态
    return {
      success: true,
      message: '点赞成功',
      activityId,
      userId
    };
  }

  // 评论动态
  async commentOnActivity(userId: string, activityId: string, content: string) {
    // 这里应该在数据库中记录评论
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, avatar: true, isVip: true }
    });

    if (!user) throw new Error('用户不存在');

    return {
      id: `comment_${Date.now()}_${userId}`,
      activityId,
      userId,
      username: user.username,
      userAvatar: user.avatar,
      isVip: user.isVip,
      content,
      timestamp: new Date()
    };
  }

  // 获取动态的互动统计
  async getActivityInteractions(activityId: string) {
    // 暂时返回模拟数据
    return {
      likes: Math.floor(Math.random() * 20),
      comments: Math.floor(Math.random() * 10),
      shares: Math.floor(Math.random() * 5)
    };
  }

  // 获取热门动态
  async getTrendingActivities(limit: number = 20) {
    const publicActivities = await this.getPublicActivities(limit * 2);
    
    // 简单的热门算法：最近创建的VIP用户活动优先
    return publicActivities
      .sort((a, b) => {
        const aScore = (a.isVip ? 2 : 1) * (Date.now() - a.timestamp.getTime());
        const bScore = (b.isVip ? 2 : 1) * (Date.now() - b.timestamp.getTime());
        return aScore - bScore;
      })
      .slice(0, limit);
  }

  // 搜索动态
  async searchActivities(query: string, userId: string, limit: number = 20) {
    const activities = await this.getFriendsActivityFeed(userId, 100, 0);
    
    return activities.filter(activity => 
      activity.title.toLowerCase().includes(query.toLowerCase()) ||
      activity.description.toLowerCase().includes(query.toLowerCase()) ||
      activity.username.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit);
  }

  // 通知好友新动态
  private async notifyFriendsOfActivity(userId: string, activity: SocialActivity) {
    if (activity.visibility === 'PRIVATE') return;

    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId, status: 'ACCEPTED' },
          { addresseeId: userId, status: 'ACCEPTED' }
        ]
      }
    });

    const friendIds = friendships.map(f => 
      f.requesterId === userId ? f.addresseeId : f.requesterId
    );

    // 只通知重要活动（成就解锁、VIP升级等）
    if (['ACHIEVEMENT_UNLOCKED', 'VIP_UPGRADED'].includes(activity.type)) {
      for (const friendId of friendIds) {
        await this.notificationsService.createNotification(
          friendId,
          'FRIEND_ACTIVITY' as any,
          '好友动态',
          `您的好友 ${activity.username} ${activity.description}`,
          { activityId: activity.id, friendId: userId }
        );
      }
    }
  }

  // 记录游戏相关活动
  async recordGameActivity(userId: string, gameId: string, type: 'CREATED' | 'JOINED' | 'COMPLETED', result?: string) {
    const game = await this.prisma.betGame.findUnique({
      where: { id: gameId },
      select: { title: true, category: true }
    });

    if (!game) return;

    let title = '';
    let description = '';

    switch (type) {
      case 'CREATED':
        title = '创建了新游戏';
        description = `创建了游戏"${game.title}"`;
        break;
      case 'JOINED':
        title = '参与了游戏';
        description = `参与了游戏"${game.title}"`;
        break;
      case 'COMPLETED':
        title = '完成了游戏';
        description = `完成了游戏"${game.title}"${result ? ` - ${result}` : ''}`;
        break;
    }

    return this.createActivity(
      userId,
      type === 'CREATED' ? 'GAME_CREATED' : type === 'JOINED' ? 'GAME_JOINED' : 'GAME_COMPLETED',
      title,
      description,
      { gameId, gameTitle: game.title, category: game.category, result },
      'PUBLIC'
    );
  }
}
