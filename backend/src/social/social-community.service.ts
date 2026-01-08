import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  isPublic: boolean;
  memberCount: number;
  creatorId: string;
  createdAt: Date;
  tags: string[];
  rules: string[];
  avatar?: string;
  banner?: string;
}

export interface GroupMember {
  userId: string;
  username: string;
  fullName: string;
  avatar?: string;
  isVip: boolean;
  role: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER';
  joinedAt: Date;
  lastActiveAt: Date;
}

export interface GroupPost {
  id: string;
  groupId: string;
  authorId: string;
  authorUsername: string;
  authorAvatar?: string;
  isVip: boolean;
  title: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'GAME_SHARE' | 'POLL';
  attachments: any[];
  isPinned: boolean;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
}

@Injectable()
export class SocialCommunityService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // 创建社区群组
  async createGroup(creatorId: string, groupData: {
    name: string;
    description: string;
    category: string;
    isPublic: boolean;
    tags?: string[];
    rules?: string[];
  }) {
    // 检查群组名称是否已存在
    const existingGroup = await this.checkGroupNameExists(groupData.name);
    if (existingGroup) {
      throw new BadRequestException('群组名称已存在');
    }

    // 暂时使用模拟数据，实际应该创建数据库记录
    const group: CommunityGroup = {
      id: `group_${Date.now()}_${creatorId}`,
      name: groupData.name,
      description: groupData.description,
      category: groupData.category,
      isPublic: groupData.isPublic,
      memberCount: 1,
      creatorId,
      createdAt: new Date(),
      tags: groupData.tags || [],
      rules: groupData.rules || []
    };

    return group;
  }

  // 加入群组
  async joinGroup(userId: string, groupId: string) {
    const group = await this.getGroupById(groupId);
    if (!group) {
      throw new NotFoundException('群组不存在');
    }

    // 检查是否已经是成员
    const isMember = await this.checkGroupMembership(userId, groupId);
    if (isMember) {
      throw new BadRequestException('已经是群组成员');
    }

    // 如果是私有群组，需要申请
    if (!group.isPublic) {
      return this.requestToJoinGroup(userId, groupId);
    }

    // 直接加入公开群组
    const member: GroupMember = {
      userId,
      username: '', // 需要查询用户信息
      fullName: '',
      isVip: false,
      role: 'MEMBER',
      joinedAt: new Date(),
      lastActiveAt: new Date()
    };

    // 通知群组管理员
    await this.notifyGroupAdmins(groupId, 'NEW_MEMBER', {
      userId,
      groupId,
      groupName: group.name
    });

    return {
      success: true,
      member,
      message: '成功加入群组'
    };
  }

  // 申请加入私有群组
  async requestToJoinGroup(userId: string, groupId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, fullName: true, isVip: true }
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 创建加入申请
    const request = {
      id: `join_request_${Date.now()}_${userId}`,
      groupId,
      userId,
      username: user.username,
      fullName: user.fullName,
      isVip: user.isVip,
      status: 'PENDING',
      createdAt: new Date()
    };

    // 通知群组管理员
    await this.notifyGroupAdmins(groupId, 'JOIN_REQUEST', {
      requestId: request.id,
      userId,
      username: user.username,
      groupId
    });

    return {
      success: true,
      request,
      message: '申请已提交，等待管理员审核'
    };
  }

  // 离开群组
  async leaveGroup(userId: string, groupId: string) {
    const membership = await this.checkGroupMembership(userId, groupId);
    if (!membership) {
      throw new BadRequestException('不是群组成员');
    }

    // 群主不能直接离开，需要先转让群主
    if (membership.role === 'OWNER') {
      throw new BadRequestException('群主不能直接离开群组，请先转让群主权限');
    }

    return {
      success: true,
      message: '成功离开群组'
    };
  }

  // 获取群组列表
  async getGroups(filters: {
    category?: string;
    isPublic?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const { category, isPublic, search, limit = 20, offset = 0 } = filters;

    // 暂时返回模拟数据
    const groups: CommunityGroup[] = [
      {
        id: 'group_1',
        name: '游戏爱好者',
        description: '分享游戏心得，交流游戏技巧',
        category: '游戏',
        isPublic: true,
        memberCount: 156,
        creatorId: 'user_1',
        createdAt: new Date('2024-01-01'),
        tags: ['游戏', '交流', '分享'],
        rules: ['友善交流', '禁止广告', '尊重他人']
      },
      {
        id: 'group_2',
        name: 'VIP专属俱乐部',
        description: 'VIP用户专属交流群组',
        category: 'VIP',
        isPublic: false,
        memberCount: 89,
        creatorId: 'user_2',
        createdAt: new Date('2024-01-15'),
        tags: ['VIP', '专属', '高端'],
        rules: ['仅限VIP用户', '高质量讨论', '保护隐私']
      }
    ];

    let filteredGroups = groups;

    if (category) {
      filteredGroups = filteredGroups.filter(g => g.category === category);
    }

    if (isPublic !== undefined) {
      filteredGroups = filteredGroups.filter(g => g.isPublic === isPublic);
    }

    if (search) {
      filteredGroups = filteredGroups.filter(g => 
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    return filteredGroups.slice(offset, offset + limit);
  }

  // 获取用户加入的群组
  async getUserGroups(userId: string) {
    // 暂时返回模拟数据
    return [
      {
        id: 'group_1',
        name: '游戏爱好者',
        role: 'MEMBER',
        joinedAt: new Date('2024-01-10'),
        lastActiveAt: new Date(),
        unreadCount: 3
      }
    ];
  }

  // 发布群组帖子
  async createGroupPost(userId: string, groupId: string, postData: {
    title: string;
    content: string;
    type: 'TEXT' | 'IMAGE' | 'GAME_SHARE' | 'POLL';
    attachments?: any[];
  }) {
    // 检查用户是否是群组成员
    const membership = await this.checkGroupMembership(userId, groupId);
    if (!membership) {
      throw new BadRequestException('不是群组成员，无法发布帖子');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, avatar: true, isVip: true }
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const post: GroupPost = {
      id: `post_${Date.now()}_${userId}`,
      groupId,
      authorId: userId,
      authorUsername: user.username,
      authorAvatar: user.avatar,
      isVip: user.isVip,
      title: postData.title,
      content: postData.content,
      type: postData.type,
      attachments: postData.attachments || [],
      isPinned: false,
      isLocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0
      }
    };

    // 通知群组成员（除了发布者）
    await this.notifyGroupMembers(groupId, userId, 'NEW_POST', {
      postId: post.id,
      postTitle: post.title,
      authorUsername: user.username,
      groupId
    });

    return post;
  }

  // 获取群组帖子
  async getGroupPosts(groupId: string, userId: string, filters: {
    type?: string;
    isPinned?: boolean;
    limit?: number;
    offset?: number;
  } = {}) {
    // 检查用户是否有权限查看
    const group = await this.getGroupById(groupId);
    if (!group) {
      throw new NotFoundException('群组不存在');
    }

    if (!group.isPublic) {
      const membership = await this.checkGroupMembership(userId, groupId);
      if (!membership) {
        throw new BadRequestException('无权限查看私有群组内容');
      }
    }

    // 暂时返回模拟数据
    const posts: GroupPost[] = [
      {
        id: 'post_1',
        groupId,
        authorId: 'user_1',
        authorUsername: 'gamer123',
        isVip: true,
        title: '分享一个有趣的游戏策略',
        content: '今天发现了一个很有效的游戏策略...',
        type: 'TEXT',
        attachments: [],
        isPinned: true,
        isLocked: false,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
        stats: {
          likes: 15,
          comments: 8,
          shares: 3,
          views: 45
        }
      }
    ];

    const { type, isPinned, limit = 20, offset = 0 } = filters;
    let filteredPosts = posts;

    if (type) {
      filteredPosts = filteredPosts.filter(p => p.type === type);
    }

    if (isPinned !== undefined) {
      filteredPosts = filteredPosts.filter(p => p.isPinned === isPinned);
    }

    return filteredPosts.slice(offset, offset + limit);
  }

  // 获取热门群组
  async getTrendingGroups(limit: number = 10) {
    const groups = await this.getGroups({ limit: 50 });
    
    // 简单的热门算法：按成员数量排序
    return groups
      .sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, limit);
  }

  // 搜索群组
  async searchGroups(query: string, filters: {
    category?: string;
    isPublic?: boolean;
    limit?: number;
  } = {}) {
    return this.getGroups({
      search: query,
      ...filters
    });
  }

  // 私有方法：检查群组名称是否存在
  private async checkGroupNameExists(name: string): Promise<boolean> {
    // 暂时返回false，实际应该查询数据库
    return false;
  }

  // 私有方法：获取群组信息
  private async getGroupById(groupId: string): Promise<CommunityGroup | null> {
    // 暂时返回模拟数据
    if (groupId === 'group_1') {
      return {
        id: 'group_1',
        name: '游戏爱好者',
        description: '分享游戏心得，交流游戏技巧',
        category: '游戏',
        isPublic: true,
        memberCount: 156,
        creatorId: 'user_1',
        createdAt: new Date('2024-01-01'),
        tags: ['游戏', '交流', '分享'],
        rules: ['友善交流', '禁止广告', '尊重他人']
      };
    }
    return null;
  }

  // 私有方法：检查群组成员身份
  private async checkGroupMembership(userId: string, groupId: string): Promise<GroupMember | null> {
    // 暂时返回模拟数据
    return {
      userId,
      username: 'user123',
      fullName: 'User Name',
      isVip: false,
      role: 'MEMBER',
      joinedAt: new Date('2024-01-10'),
      lastActiveAt: new Date()
    };
  }

  // 私有方法：通知群组管理员
  private async notifyGroupAdmins(groupId: string, type: string, data: any) {
    // 实际应该查询群组管理员并发送通知
  }

  // 私有方法：通知群组成员
  private async notifyGroupMembers(groupId: string, excludeUserId: string, type: string, data: any) {
    // 实际应该查询群组成员并发送通知
  }
}
