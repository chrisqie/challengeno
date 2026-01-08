import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PointsService } from '../points/points.service';
import { PointType } from '@prisma/client';

@Injectable()
export class TeamPointsService {
  constructor(
    private prisma: PrismaService,
    private pointsService: PointsService,
  ) {}

  // 计算团队总积分
  async calculateTeamTotalPoints(teamId: string) {
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

    let totalParticipation = 0;
    let totalTrust = 0;
    let totalLabor = 0;

    teamMembers.forEach(member => {
      totalParticipation += member.user.participationPoints;
      totalTrust += member.user.trustPoints;
      totalLabor += member.user.laborPoints;
    });

    return {
      total: totalParticipation + totalTrust + totalLabor,
      breakdown: {
        participation: totalParticipation,
        trust: totalTrust,
        labor: totalLabor
      },
      memberCount: teamMembers.length,
      averagePerMember: teamMembers.length > 0 ? 
        Math.round((totalParticipation + totalTrust + totalLabor) / teamMembers.length) : 0
    };
  }

  // 团队游戏完成后的积分奖励
  async awardTeamGamePoints(
    teamId: string,
    gameId: string,
    teamResult: 'SUCCESS' | 'FAILURE',
    teamPerformanceData: {
      teamRecognizeRate: number;
      teamEvidenceQuality: 'low' | 'medium' | 'high' | 'excellent';
      participatingMembers: string[];
    }
  ) {
    const game = await this.prisma.betGame.findUnique({
      where: { id: gameId },
      select: {
        title: true,
        category: true
        // 移除不存在的difficulty字段
      }
    });

    if (!game) return;

    // 基础团队奖励积分
    let baseTeamPoints = 0;
    if (teamResult === 'SUCCESS') {
      baseTeamPoints = 20; // 团队成功基础奖励
      
      // 根据团队表现调整
      if (teamPerformanceData.teamRecognizeRate >= 0.9) {
        baseTeamPoints += 10; // 完美团队表现
      } else if (teamPerformanceData.teamRecognizeRate >= 0.8) {
        baseTeamPoints += 5; // 优秀团队表现
      }

      // 根据证据质量调整
      const qualityBonus = {
        'excellent': 8,
        'high': 5,
        'medium': 3,
        'low': 1
      };
      baseTeamPoints += qualityBonus[teamPerformanceData.teamEvidenceQuality];
    }

    // 为参与的团队成员发放积分
    for (const memberId of teamPerformanceData.participatingMembers) {
      // 个人基础积分
      await this.pointsService.updateUserPoints(
        memberId,
        PointType.PARTICIPATION,
        baseTeamPoints,
        `团队游戏${teamResult === 'SUCCESS' ? '成功' : '失败'}: ${game.title}`,
        gameId
      );

      // 团队协作奖励
      if (teamResult === 'SUCCESS') {
        await this.pointsService.updateUserPoints(
          memberId,
          PointType.LABOR,
          5,
          `团队协作奖励: ${game.title}`,
          gameId
        );
      }
    }

    // 记录团队积分历史
    await this.recordTeamPointsHistory(
      teamId,
      gameId,
      baseTeamPoints * teamPerformanceData.participatingMembers.length,
      `团队游戏${teamResult === 'SUCCESS' ? '成功' : '失败'}: ${game.title}`
    );
  }

  // 记录团队积分历史
  private async recordTeamPointsHistory(
    teamId: string,
    gameId: string,
    points: number,
    reason: string
  ) {
    // 这里可以创建一个团队积分历史表来记录
    // 暂时跳过，因为需要新的数据库表
    console.log(`团队 ${teamId} 获得 ${points} 积分: ${reason}`);
  }

  // 获取团队积分排行榜
  async getTeamPointsLeaderboard(limit: number = 20) {
    const teams = await this.prisma.team.findMany({
      where: { status: 'ACTIVE' },
      include: {
        members: {
          include: {
            user: {
              select: {
                participationPoints: true,
                trustPoints: true,
                laborPoints: true
              }
            }
          }
        },
        creator: {
          select: {
            username: true
          }
        }
      },
      take: limit * 2 // 取更多数据以便排序
    });

    const teamStats = teams.map(team => {
      const totalPoints = team.members.reduce((sum, member) => {
        return sum + member.user.participationPoints + member.user.trustPoints + member.user.laborPoints;
      }, 0);

      return {
        teamId: team.id,
        teamName: team.name,
        creatorUsername: team.creator.username,
        memberCount: team.members.length,
        totalPoints,
        averagePointsPerMember: team.members.length > 0 ? Math.round(totalPoints / team.members.length) : 0,
        createdAt: team.createdAt
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, limit);

    return teamStats;
  }

  // 获取团队成员积分贡献
  async getTeamMemberContributions(userId: string, teamId: string) {
    // 验证用户权限
    const membership = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      }
    });

    if (!membership) {
      throw new ForbiddenException('您不是该团队的成员');
    }

    const teamMembers = await this.prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            participationPoints: true,
            trustPoints: true,
            laborPoints: true,
            avatar: true
          }
        }
      },
      orderBy: {
        joinedAt: 'asc'
      }
    });

    const contributions = teamMembers.map(member => {
      const totalPoints = member.user.participationPoints + member.user.trustPoints + member.user.laborPoints;
      
      return {
        userId: member.user.id,
        username: member.user.username,
        fullName: member.user.fullName,
        avatar: member.user.avatar,
        role: member.role,
        joinedAt: member.joinedAt,
        points: {
          participation: member.user.participationPoints,
          trust: member.user.trustPoints,
          labor: member.user.laborPoints,
          total: totalPoints
        }
      };
    }).sort((a, b) => b.points.total - a.points.total);

    return contributions;
  }

  // 计算团队活跃度
  async calculateTeamActivity(teamId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      recentGames,
      memberActivity,
      teamMembers
    ] = await Promise.all([
      this.prisma.teamGameParticipation.count({
        where: {
          teamId,
          joinedAt: { gte: startDate }
        }
      }),
      // 暂时设为0，避免复杂查询
      Promise.resolve(0),
      this.prisma.teamMember.count({
        where: { teamId }
      })
    ]);

    return {
      recentGames,
      memberActivity: 0, // 暂时设为0
      totalMembers: teamMembers,
      activityScore: Math.round((recentGames * 10) / Math.max(teamMembers, 1))
    };
  }
}
