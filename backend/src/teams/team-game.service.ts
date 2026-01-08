import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TeamPointsService } from './team-points.service';
import { TeamAchievementsService } from './team-achievements.service';

@Injectable()
export class TeamGameService {
  constructor(
    private prisma: PrismaService,
    private teamPointsService: TeamPointsService,
    private teamAchievementsService: TeamAchievementsService,
  ) {}

  // 团队参与游戏的增强版本
  async joinTeamGameEnhanced(userId: string, teamId: string, gameId: string) {
    // 验证用户权限
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      }
    });

    if (!teamMember || teamMember.role !== 'LEADER') {
      throw new ForbiddenException('只有队长可以代表团队参与游戏');
    }

    // 获取游戏信息
    const game = await this.prisma.betGame.findUnique({
      where: { id: gameId },
      include: {
        teamParticipations: true
      }
    });

    if (!game) {
      throw new NotFoundException('游戏不存在');
    }

    if (game.status !== 'OPEN') {
      throw new BadRequestException('游戏不在开放状态');
    }

    // 检查团队是否已经参与
    const existingParticipation = game.teamParticipations.find(p => p.teamId === teamId);
    if (existingParticipation) {
      throw new BadRequestException('团队已经参与了该游戏');
    }

    // 检查团队规模
    const teamMembersCount = await this.prisma.teamMember.count({
      where: { teamId }
    });

    if (game.minTeamSize && teamMembersCount < game.minTeamSize) {
      throw new BadRequestException(`团队成员数量不足，至少需要${game.minTeamSize}人`);
    }

    if (game.maxTeamSize && teamMembersCount > game.maxTeamSize) {
      throw new BadRequestException(`团队成员数量过多，最多允许${game.maxTeamSize}人`);
    }

    // 检查游戏团队数量限制
    if (game.maxTeams && game.teamParticipations.length >= game.maxTeams) {
      throw new BadRequestException('游戏已达到最大团队数量');
    }

    // 创建团队参与记录
    const participation = await this.prisma.teamGameParticipation.create({
      data: {
        gameId,
        teamId,
        status: 'ACTIVE'
      },
      include: {
        team: {
          select: {
            name: true
          }
        },
        game: {
          select: {
            title: true
          }
        }
      }
    });

    // 为团队所有成员创建个人参与记录
    const teamMembers = await this.prisma.teamMember.findMany({
      where: { teamId },
      select: { userId: true }
    });

    await Promise.all(
      teamMembers.map(member =>
        this.prisma.betParticipant.create({
          data: {
            gameId,
            userId: member.userId
            // 移除不存在的字段
          }
        })
      )
    );

    return {
      message: `团队 ${participation.team.name} 成功参与游戏 ${participation.game.title}`,
      participation
    };
  }

  // 团队游戏结算
  async settleTeamGame(gameId: string, teamId: string, result: 'SUCCESS' | 'FAILURE') {
    // 获取团队参与记录
    const participation = await this.prisma.teamGameParticipation.findUnique({
      where: {
        gameId_teamId: {
          gameId,
          teamId
        }
      },
      include: {
        team: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true
                  }
                }
              }
            }
          }
        },
        game: {
          select: {
            title: true,
            category: true
          }
        }
      }
    });

    if (!participation) {
      throw new NotFoundException('团队参与记录不存在');
    }

    // 更新团队参与结果 - 使用正确的字段名
    await this.prisma.teamGameParticipation.update({
      where: { id: participation.id },
      data: {
        isWinner: result === 'SUCCESS',
        status: result === 'SUCCESS' ? 'ACTIVE' : 'WITHDRAWN'
      }
    });

    // 计算团队表现数据
    const teamPerformanceData = await this.calculateTeamPerformance(gameId, teamId);

    // 发放团队积分奖励
    await this.teamPointsService.awardTeamGamePoints(
      teamId,
      gameId,
      result,
      teamPerformanceData
    );

    // 检查团队成就
    const newAchievements = await this.teamAchievementsService.checkTeamAchievements(teamId);

    return {
      result,
      teamPerformance: teamPerformanceData,
      newAchievements,
      message: `团队游戏结算完成，结果: ${result}`
    };
  }

  // 计算团队表现
  private async calculateTeamPerformance(gameId: string, teamId: string) {
    // 获取团队成员在该游戏中的表现
    const teamParticipants = await this.prisma.betParticipant.findMany({
      where: {
        gameId,
        // 使用正确的关联字段名
        user: {
          teamMemberships: {
            some: { teamId }
          }
        }
      },
      select: {
        userId: true,
        evidenceSubmitted: true,
        finalResult: true
        // 移除不存在的recognizeRate字段
      }
    });

    const participatingMembers = teamParticipants.map(p => p.userId);
    const successfulMembers = teamParticipants.filter(p => p.finalResult === 'SUCCESS');
    const evidenceSubmittedCount = teamParticipants.filter(p => p.evidenceSubmitted).length;

    // 暂时设置固定的团队认可度，因为字段不存在
    const teamRecognizeRate = 0.8;

    // 计算团队证据质量
    let teamEvidenceQuality: 'low' | 'medium' | 'high' | 'excellent' = 'low';
    const evidenceSubmissionRate = evidenceSubmittedCount / teamParticipants.length;
    
    if (evidenceSubmissionRate >= 0.9 && teamRecognizeRate >= 0.8) {
      teamEvidenceQuality = 'excellent';
    } else if (evidenceSubmissionRate >= 0.8 && teamRecognizeRate >= 0.7) {
      teamEvidenceQuality = 'high';
    } else if (evidenceSubmissionRate >= 0.6 && teamRecognizeRate >= 0.5) {
      teamEvidenceQuality = 'medium';
    }

    return {
      participatingMembers,
      successfulMembers: successfulMembers.length,
      evidenceSubmittedCount,
      teamRecognizeRate,
      teamEvidenceQuality,
      teamSuccessRate: successfulMembers.length / teamParticipants.length
    };
  }

  // 获取团队游戏统计
  async getTeamGameStats(teamId: string, period?: 'WEEK' | 'MONTH' | 'ALL_TIME') {
    let dateFilter = {};
    
    if (period) {
      const now = new Date();
      switch (period) {
        case 'WEEK':
          dateFilter = { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
          break;
        case 'MONTH':
          dateFilter = { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
          break;
      }
    }

    // 暂时返回简化的统计
    const totalGames = 0; // 需要复杂查询
    const successfulGames = 0; // 需要复杂查询
    const failedGames = 0; // 需要复杂查询

    return {
      period: period || 'ALL_TIME',
      stats: {
        totalGames,
        successfulGames,
        failedGames,
        successRate: totalGames > 0 ? (successfulGames / totalGames) * 100 : 0
      },
      categoryStats: {}, // 按分类统计，需要复杂查询
      recentGames: [] // 最近的游戏记录，需要复杂查询
    };
  }

  // 获取团队游戏排行榜
  async getTeamGameLeaderboard(category?: string, period?: 'WEEK' | 'MONTH' | 'ALL_TIME') {
    // 暂时返回简化的排行榜
    const teams = await this.prisma.team.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
        creator: {
          select: {
            username: true
          }
        },
        members: {
          select: {
            id: true
          }
        }
      },
      take: 20
    });

    const leaderboard = teams.map(team => ({
      teamId: team.id,
      teamName: team.name,
      creatorUsername: team.creator.username,
      memberCount: team.members.length,
      gamesWon: 0, // 需要复杂查询
      gamesPlayed: 0, // 需要复杂查询
      winRate: 0, // 需要复杂查询
      totalPoints: 0 // 需要复杂查询
    }));

    return {
      period: period || 'ALL_TIME',
      category: category || 'ALL',
      leaderboard
    };
  }

  // 获取推荐的团队游戏
  async getRecommendedTeamGames(teamId: string, limit: number = 10) {
    // 获取团队信息
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          select: {
            user: {
              select: {
                participationPoints: true,
                trustPoints: true,
                laborPoints: true
              }
            }
          }
        }
      }
    });

    if (!team) {
      throw new NotFoundException('团队不存在');
    }

    const memberCount = team.members.length;
    const teamTotalPoints = team.members.reduce((sum, member) => {
      return sum + member.user.participationPoints + member.user.trustPoints + member.user.laborPoints;
    }, 0);

    // 获取适合的游戏
    const games = await this.prisma.betGame.findMany({
      where: {
        status: 'OPEN',
        isTeamGame: true,
        AND: [
          {
            OR: [
              { minTeamSize: null },
              { minTeamSize: { lte: memberCount } }
            ]
          },
          {
            OR: [
              { maxTeamSize: null },
              { maxTeamSize: { gte: memberCount } }
            ]
          }
        ]
      },
      include: {
        teamParticipations: {
          where: { teamId }
        },
        _count: {
          select: {
            teamParticipations: true
          }
        }
      },
      take: limit * 2 // 取更多数据以便过滤
    });

    // 过滤已参与的游戏
    const availableGames = games
      .filter(game => game.teamParticipations.length === 0)
      .filter(game => !game.maxTeams || game._count.teamParticipations < game.maxTeams)
      .slice(0, limit);

    return availableGames.map(game => ({
      ...game,
      currentTeams: game._count.teamParticipations,
      canJoin: !game.maxTeams || game._count.teamParticipations < game.maxTeams,
      recommendationReason: this.getRecommendationReason(game, memberCount, teamTotalPoints)
    }));
  }

  // 获取推荐理由
  private getRecommendationReason(game: any, memberCount: number, teamTotalPoints: number): string {
    const reasons = [];

    if (game.minTeamSize && memberCount >= game.minTeamSize) {
      reasons.push('团队规模适合');
    }

    if (game.difficulty === 'MEDIUM') {
      reasons.push('难度适中');
    }

    if (game.category === 'FITNESS') {
      reasons.push('健身挑战');
    } else if (game.category === 'STUDY') {
      reasons.push('学习提升');
    }

    return reasons.length > 0 ? reasons.join('，') : '推荐参与';
  }
}
