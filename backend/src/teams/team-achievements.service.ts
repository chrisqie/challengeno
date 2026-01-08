import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface TeamAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'TEAMWORK' | 'PERFORMANCE' | 'MILESTONE' | 'SPECIAL';
  condition: {
    type: 'GAMES_WON' | 'MEMBERS_COUNT' | 'TOTAL_POINTS' | 'WIN_STREAK' | 'TEAM_AGE' | 'CATEGORY_MASTER';
    value: number;
    period?: 'WEEK' | 'MONTH' | 'ALL_TIME';
    category?: string;
  };
  points: number;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}

@Injectable()
export class TeamAchievementsService {
  constructor(private prisma: PrismaService) {}

  // 预定义的团队成就
  private readonly TEAM_ACHIEVEMENTS: TeamAchievement[] = [
    // 团队合作类
    {
      id: 'team_first_win',
      name: '首胜团队',
      description: '团队首次获得游戏胜利',
      icon: '🏆',
      category: 'TEAMWORK',
      condition: { type: 'GAMES_WON', value: 1 },
      points: 50,
      rarity: 'COMMON'
    },
    {
      id: 'team_10_wins',
      name: '十胜团队',
      description: '团队累计获得10次游戏胜利',
      icon: '🎯',
      category: 'PERFORMANCE',
      condition: { type: 'GAMES_WON', value: 10 },
      points: 200,
      rarity: 'RARE'
    },
    {
      id: 'team_50_wins',
      name: '五十胜团队',
      description: '团队累计获得50次游戏胜利',
      icon: '⭐',
      category: 'PERFORMANCE',
      condition: { type: 'GAMES_WON', value: 50 },
      points: 500,
      rarity: 'EPIC'
    },
    {
      id: 'team_100_wins',
      name: '百胜团队',
      description: '团队累计获得100次游戏胜利',
      icon: '👑',
      category: 'PERFORMANCE',
      condition: { type: 'GAMES_WON', value: 100 },
      points: 1000,
      rarity: 'LEGENDARY'
    },

    // 成员规模类
    {
      id: 'team_5_members',
      name: '小团队',
      description: '团队成员达到5人',
      icon: '👥',
      category: 'MILESTONE',
      condition: { type: 'MEMBERS_COUNT', value: 5 },
      points: 100,
      rarity: 'COMMON'
    },
    {
      id: 'team_10_members',
      name: '大团队',
      description: '团队成员达到10人',
      icon: '👨‍👩‍👧‍👦',
      category: 'MILESTONE',
      condition: { type: 'MEMBERS_COUNT', value: 10 },
      points: 300,
      rarity: 'RARE'
    },

    // 积分类
    {
      id: 'team_1000_points',
      name: '千分团队',
      description: '团队总积分达到1000分',
      icon: '💎',
      category: 'MILESTONE',
      condition: { type: 'TOTAL_POINTS', value: 1000 },
      points: 200,
      rarity: 'RARE'
    },
    {
      id: 'team_5000_points',
      name: '五千分团队',
      description: '团队总积分达到5000分',
      icon: '💰',
      category: 'MILESTONE',
      condition: { type: 'TOTAL_POINTS', value: 5000 },
      points: 500,
      rarity: 'EPIC'
    },

    // 连胜类
    {
      id: 'team_5_win_streak',
      name: '五连胜',
      description: '团队连续获得5次游戏胜利',
      icon: '🔥',
      category: 'PERFORMANCE',
      condition: { type: 'WIN_STREAK', value: 5 },
      points: 300,
      rarity: 'RARE'
    },
    {
      id: 'team_10_win_streak',
      name: '十连胜',
      description: '团队连续获得10次游戏胜利',
      icon: '⚡',
      category: 'PERFORMANCE',
      condition: { type: 'WIN_STREAK', value: 10 },
      points: 800,
      rarity: 'EPIC'
    },

    // 时间类
    {
      id: 'team_30_days',
      name: '月度团队',
      description: '团队成立满30天',
      icon: '📅',
      category: 'MILESTONE',
      condition: { type: 'TEAM_AGE', value: 30 },
      points: 150,
      rarity: 'COMMON'
    },
    {
      id: 'team_365_days',
      name: '年度团队',
      description: '团队成立满365天',
      icon: '🎂',
      category: 'MILESTONE',
      condition: { type: 'TEAM_AGE', value: 365 },
      points: 1000,
      rarity: 'LEGENDARY'
    },

    // 分类专精类
    {
      id: 'fitness_master_team',
      name: '健身专家团队',
      description: '在健身分类中获得20次胜利',
      icon: '💪',
      category: 'SPECIAL',
      condition: { type: 'CATEGORY_MASTER', value: 20, category: 'FITNESS' },
      points: 400,
      rarity: 'EPIC'
    },
    {
      id: 'study_master_team',
      name: '学习专家团队',
      description: '在学习分类中获得20次胜利',
      icon: '📚',
      category: 'SPECIAL',
      condition: { type: 'CATEGORY_MASTER', value: 20, category: 'STUDY' },
      points: 400,
      rarity: 'EPIC'
    }
  ];

  // 检查团队成就
  async checkTeamAchievements(teamId: string) {
    const unlockedAchievements = [];

    for (const achievement of this.TEAM_ACHIEVEMENTS) {
      const isUnlocked = await this.checkTeamAchievementCondition(teamId, achievement);
      
      if (isUnlocked) {
        // 检查是否已经解锁过
        const existingAchievement = await this.getTeamAchievement(teamId, achievement.id);
        
        if (!existingAchievement) {
          await this.unlockTeamAchievement(teamId, achievement);
          unlockedAchievements.push(achievement);
        }
      }
    }

    return unlockedAchievements;
  }

  // 检查单个成就条件
  private async checkTeamAchievementCondition(teamId: string, achievement: TeamAchievement): Promise<boolean> {
    const { condition } = achievement;

    switch (condition.type) {
      case 'GAMES_WON':
        // 暂时返回false，需要复杂查询
        return false;

      case 'MEMBERS_COUNT':
        const memberCount = await this.prisma.teamMember.count({
          where: { teamId }
        });
        return memberCount >= condition.value;

      case 'TOTAL_POINTS':
        const teamMembers = await this.prisma.teamMember.findMany({
          where: { teamId },
          include: {
            user: {
              select: {
                participationPoints: true,
                trustPoints: true,
                laborPoints: true
              }
            }
          }
        });
        
        const totalPoints = teamMembers.reduce((sum, member) => {
          return sum + member.user.participationPoints + member.user.trustPoints + member.user.laborPoints;
        }, 0);
        
        return totalPoints >= condition.value;

      case 'WIN_STREAK':
        // 暂时返回false，需要复杂查询
        return false;

      case 'TEAM_AGE':
        const team = await this.prisma.team.findUnique({
          where: { id: teamId },
          select: { createdAt: true }
        });
        
        if (!team) return false;
        
        const ageInDays = Math.floor((Date.now() - team.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        return ageInDays >= condition.value;

      case 'CATEGORY_MASTER':
        // 暂时返回false，需要复杂查询
        return false;

      default:
        return false;
    }
  }

  // 解锁团队成就
  private async unlockTeamAchievement(teamId: string, achievement: TeamAchievement) {
    // 这里需要创建团队成就表来记录
    // 暂时只记录日志
    console.log(`团队 ${teamId} 解锁成就: ${achievement.name}`);
    
    // 为团队所有成员发放成就积分
    const teamMembers = await this.prisma.teamMember.findMany({
      where: { teamId },
      select: { userId: true }
    });

    // 这里可以调用积分服务为每个成员发放奖励积分
    // await this.pointsService.updateUserPoints(...)
  }

  // 获取团队成就
  private async getTeamAchievement(teamId: string, achievementId: string) {
    // 暂时返回null，需要团队成就表
    return null;
  }

  // 获取团队所有成就
  async getTeamAchievements(teamId: string) {
    const achievements = [];
    
    for (const achievement of this.TEAM_ACHIEVEMENTS) {
      const isUnlocked = await this.checkTeamAchievementCondition(teamId, achievement);
      const progress = await this.calculateAchievementProgress(teamId, achievement);
      
      achievements.push({
        ...achievement,
        unlocked: isUnlocked,
        progress: progress,
        unlockedAt: null // 需要从数据库获取
      });
    }

    return achievements.sort((a, b) => {
      if (a.unlocked && !b.unlocked) return -1;
      if (!a.unlocked && b.unlocked) return 1;
      return b.progress - a.progress;
    });
  }

  // 计算成就进度
  private async calculateAchievementProgress(teamId: string, achievement: TeamAchievement): Promise<number> {
    const { condition } = achievement;

    switch (condition.type) {
      case 'MEMBERS_COUNT':
        const memberCount = await this.prisma.teamMember.count({
          where: { teamId }
        });
        return Math.min(100, (memberCount / condition.value) * 100);

      case 'TOTAL_POINTS':
        const teamMembers = await this.prisma.teamMember.findMany({
          where: { teamId },
          include: {
            user: {
              select: {
                participationPoints: true,
                trustPoints: true,
                laborPoints: true
              }
            }
          }
        });
        
        const totalPoints = teamMembers.reduce((sum, member) => {
          return sum + member.user.participationPoints + member.user.trustPoints + member.user.laborPoints;
        }, 0);
        
        return Math.min(100, (totalPoints / condition.value) * 100);

      case 'TEAM_AGE':
        const team = await this.prisma.team.findUnique({
          where: { id: teamId },
          select: { createdAt: true }
        });
        
        if (!team) return 0;
        
        const ageInDays = Math.floor((Date.now() - team.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        return Math.min(100, (ageInDays / condition.value) * 100);

      default:
        return 0;
    }
  }
}
