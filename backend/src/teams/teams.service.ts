import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TeamType, TeamRole, TeamStatus, InviteStatus, TeamParticipationStatus } from '@prisma/client';
import { CreateTeamDto, JoinTeamDto, InviteToTeamDto } from './dto/team.dto';
import { generateInviteCode } from '../utils/invite-code.util';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  // 创建团队
  async createTeam(userId: string, createTeamDto: CreateTeamDto) {
    // 检查用户是否已经创建了太多团队
    const userTeamsCount = await this.prisma.team.count({
      where: { creatorId: userId, status: TeamStatus.ACTIVE }
    });

    if (userTeamsCount >= 5) { // 限制每个用户最多创建5个团队
      throw new ForbiddenException('您最多只能创建5个团队');
    }

    // 生成邀请码（如果是私密团队或竞技团队）
    let inviteCode = null;
    if (createTeamDto.teamType === TeamType.PRIVATE || createTeamDto.teamType === TeamType.COMPETITIVE) {
      inviteCode = generateInviteCode();
    }

    const team = await this.prisma.team.create({
      data: {
        ...createTeamDto,
        creatorId: userId,
        inviteCode,
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                isVip: true,
              }
            }
          }
        }
      }
    });

    // 创建者自动成为队长
    await this.prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId,
        role: TeamRole.LEADER,
      }
    });

    return team;
  }

  // 获取用户的团队列表
  async getUserTeams(userId: string) {
    const teams = await this.prisma.team.findMany({
      where: {
        members: {
          some: { userId }
        },
        status: TeamStatus.ACTIVE
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                isVip: true,
              }
            }
          }
        },
        _count: {
          select: {
            members: true,
            games: true,
          }
        }
      }
    });

    return teams.map(team => ({
      ...team,
      memberCount: team._count.members,
      gameCount: team._count.games,
      userRole: team.members.find(m => m.userId === userId)?.role || TeamRole.MEMBER,
    }));
  }

  // 发现团队（公开团队）
  async discoverTeams(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const teams = await this.prisma.team.findMany({
      where: {
        teamType: TeamType.CASUAL,
        status: TeamStatus.ACTIVE,
        members: {
          none: { userId } // 排除用户已加入的团队
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true,
          }
        },
        _count: {
          select: {
            members: true,
            games: true,
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ],
      skip,
      take: limit,
    });

    return teams.map(team => ({
      ...team,
      memberCount: team._count.members,
      gameCount: team._count.games,
    }));
  }

  // 加入团队
  async joinTeam(userId: string, joinTeamDto: JoinTeamDto) {
    let team;

    if (joinTeamDto.inviteCode) {
      // 通过邀请码加入
      team = await this.prisma.team.findUnique({
        where: { inviteCode: joinTeamDto.inviteCode },
        include: { members: true }
      });

      if (!team) {
        throw new NotFoundException('邀请码无效');
      }
    } else if (joinTeamDto.teamId) {
      // 直接加入公开团队
      team = await this.prisma.team.findUnique({
        where: { id: joinTeamDto.teamId },
        include: { members: true }
      });

      if (!team) {
        throw new NotFoundException('团队不存在');
      }

      if (team.teamType !== TeamType.CASUAL) {
        throw new ForbiddenException('该团队需要邀请码才能加入');
      }
    } else {
      throw new BadRequestException('请提供团队ID或邀请码');
    }

    // 检查团队状态
    if (team.status !== TeamStatus.ACTIVE) {
      throw new ForbiddenException('团队已不活跃');
    }

    // 检查是否已经是成员
    const existingMember = team.members.find(m => m.userId === userId);
    if (existingMember) {
      throw new BadRequestException('您已经是该团队的成员');
    }

    // 检查团队是否已满
    if (team.members.length >= team.maxMembers) {
      throw new ForbiddenException('团队已满');
    }

    // 加入团队
    await this.prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId,
        role: TeamRole.MEMBER,
      }
    });

    return { message: '成功加入团队', teamId: team.id };
  }

  // 邀请用户加入团队
  async inviteToTeam(userId: string, inviteDto: InviteToTeamDto) {
    const team = await this.prisma.team.findUnique({
      where: { id: inviteDto.teamId },
      include: {
        members: {
          where: { userId }
        }
      }
    });

    if (!team) {
      throw new NotFoundException('团队不存在');
    }

    // 检查权限（只有队长可以邀请）
    const userMember = team.members[0];
    if (!userMember || userMember.role !== TeamRole.LEADER) {
      throw new ForbiddenException('只有队长可以邀请新成员');
    }

    // 检查被邀请用户是否存在
    const invitee = await this.prisma.user.findUnique({
      where: { username: inviteDto.username }
    });

    if (!invitee) {
      throw new NotFoundException('用户不存在');
    }

    // 检查是否已经是成员
    const existingMember = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: team.id,
          userId: invitee.id
        }
      }
    });

    if (existingMember) {
      throw new BadRequestException('该用户已经是团队成员');
    }

    // 检查是否已有待处理的邀请
    const existingInvite = await this.prisma.teamInvite.findFirst({
      where: {
        teamId: team.id,
        inviteeId: invitee.id,
        status: InviteStatus.PENDING,
        expiresAt: { gt: new Date() }
      }
    });

    if (existingInvite) {
      throw new BadRequestException('已向该用户发送过邀请');
    }

    // 创建邀请
    const invite = await this.prisma.teamInvite.create({
      data: {
        teamId: team.id,
        inviterId: userId,
        inviteeId: invitee.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后过期
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            creator: {
              select: { username: true }
            }
          }
        },
        inviter: {
          select: { username: true }
        }
      }
    });

    return invite;
  }

  // 获取团队详情
  async getTeamById(teamId: string, userId?: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                isVip: true,
              }
            }
          },
          orderBy: [
            { role: 'asc' }, // 队长优先
            { joinedAt: 'asc' }
          ]
        },
        games: {
          include: {
            game: {
              select: {
                id: true,
                title: true,
                status: true,
                createdAt: true,
              }
            }
          },
          orderBy: { game: { createdAt: 'desc' } },
          take: 10 // 最近10个游戏
        }
      }
    });

    if (!team) {
      throw new NotFoundException('团队不存在');
    }

    let userRole = null;
    if (userId) {
      const userMember = team.members.find(m => m.userId === userId);
      userRole = userMember?.role || null;
    }

    return {
      ...team,
      userRole,
      memberCount: team.members.length,
      recentGames: team.games.map(tg => tg.game),
    };
  }

  // 更新团队信息
  async updateTeam(userId: string, teamId: string, updateTeamDto: any) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          where: { userId }
        }
      }
    });

    if (!team) {
      throw new NotFoundException('团队不存在');
    }

    // 检查权限（只有队长可以更新）
    const userMember = team.members[0];
    if (!userMember || userMember.role !== TeamRole.LEADER) {
      throw new ForbiddenException('只有队长可以更新团队信息');
    }

    return this.prisma.team.update({
      where: { id: teamId },
      data: updateTeamDto,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                isVip: true,
              }
            }
          }
        }
      }
    });
  }

  // 离开团队
  async leaveTeam(userId: string, teamId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: true
      }
    });

    if (!team) {
      throw new NotFoundException('团队不存在');
    }

    const userMember = team.members.find(m => m.userId === userId);
    if (!userMember) {
      throw new BadRequestException('您不是该团队的成员');
    }

    // 如果是队长离开，需要转让队长或解散团队
    if (userMember.role === TeamRole.LEADER) {
      const otherMembers = team.members.filter(m => m.userId !== userId);
      if (otherMembers.length > 0) {
        // 转让给最早加入的成员
        const newLeader = otherMembers.sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime())[0];
        await this.prisma.teamMember.update({
          where: { id: newLeader.id },
          data: { role: TeamRole.LEADER }
        });
      } else {
        // 没有其他成员，解散团队
        await this.prisma.team.update({
          where: { id: teamId },
          data: { status: TeamStatus.DISBANDED }
        });
      }
    }

    // 删除成员记录
    await this.prisma.teamMember.delete({
      where: { id: userMember.id }
    });

    return { message: '成功离开团队' };
  }

  // 踢出成员
  async kickMember(userId: string, kickDto: any) {
    const team = await this.prisma.team.findUnique({
      where: { id: kickDto.teamId },
      include: {
        members: true
      }
    });

    if (!team) {
      throw new NotFoundException('团队不存在');
    }

    // 检查权限（只有队长可以踢人）
    const userMember = team.members.find(m => m.userId === userId);
    if (!userMember || userMember.role !== TeamRole.LEADER) {
      throw new ForbiddenException('只有队长可以踢出成员');
    }

    const targetMember = team.members.find(m => m.userId === kickDto.userId);
    if (!targetMember) {
      throw new NotFoundException('该用户不是团队成员');
    }

    if (targetMember.role === TeamRole.LEADER) {
      throw new ForbiddenException('不能踢出队长');
    }

    await this.prisma.teamMember.delete({
      where: { id: targetMember.id }
    });

    return { message: '成功踢出成员' };
  }

  // 转让队长
  async transferLeadership(userId: string, transferDto: any) {
    const team = await this.prisma.team.findUnique({
      where: { id: transferDto.teamId },
      include: {
        members: true
      }
    });

    if (!team) {
      throw new NotFoundException('团队不存在');
    }

    // 检查权限（只有队长可以转让）
    const currentLeader = team.members.find(m => m.userId === userId);
    if (!currentLeader || currentLeader.role !== TeamRole.LEADER) {
      throw new ForbiddenException('只有队长可以转让队长职位');
    }

    const newLeader = team.members.find(m => m.userId === transferDto.newLeaderId);
    if (!newLeader) {
      throw new NotFoundException('新队长不是团队成员');
    }

    // 执行转让
    await this.prisma.$transaction([
      this.prisma.teamMember.update({
        where: { id: currentLeader.id },
        data: { role: TeamRole.MEMBER }
      }),
      this.prisma.teamMember.update({
        where: { id: newLeader.id },
        data: { role: TeamRole.LEADER }
      })
    ]);

    return { message: '成功转让队长职位' };
  }

  // 解散团队
  async disbandTeam(userId: string, teamId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          where: { userId }
        }
      }
    });

    if (!team) {
      throw new NotFoundException('团队不存在');
    }

    // 检查权限（只有队长可以解散）
    const userMember = team.members[0];
    if (!userMember || userMember.role !== TeamRole.LEADER) {
      throw new ForbiddenException('只有队长可以解散团队');
    }

    await this.prisma.team.update({
      where: { id: teamId },
      data: { status: TeamStatus.DISBANDED }
    });

    return { message: '团队已解散' };
  }

  // 获取团队邀请列表
  async getTeamInvites(userId: string, teamId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          where: { userId }
        }
      }
    });

    if (!team) {
      throw new NotFoundException('团队不存在');
    }

    // 检查权限（只有队长可以查看邀请列表）
    const userMember = team.members[0];
    if (!userMember || userMember.role !== TeamRole.LEADER) {
      throw new ForbiddenException('只有队长可以查看邀请列表');
    }

    return this.prisma.teamInvite.findMany({
      where: { teamId },
      include: {
        inviter: {
          select: {
            id: true,
            username: true,
            fullName: true,
          }
        },
        invitee: {
          select: {
            id: true,
            username: true,
            fullName: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // 获取用户收到的团队邀请
  async getReceivedInvites(userId: string) {
    return this.prisma.teamInvite.findMany({
      where: {
        inviteeId: userId,
        status: InviteStatus.PENDING,
        expiresAt: { gt: new Date() }
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            description: true,
            creator: {
              select: {
                username: true,
                fullName: true,
              }
            }
          }
        },
        inviter: {
          select: {
            username: true,
            fullName: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // 响应团队邀请
  async respondToInvite(userId: string, respondDto: any) {
    const invite = await this.prisma.teamInvite.findUnique({
      where: { id: respondDto.inviteId },
      include: {
        team: {
          include: {
            members: true
          }
        }
      }
    });

    if (!invite) {
      throw new NotFoundException('邀请不存在');
    }

    if (invite.inviteeId !== userId) {
      throw new ForbiddenException('这不是您的邀请');
    }

    if (invite.status !== InviteStatus.PENDING) {
      throw new BadRequestException('邀请已处理');
    }

    if (invite.expiresAt < new Date()) {
      throw new BadRequestException('邀请已过期');
    }

    if (respondDto.accept) {
      // 接受邀请
      // 检查团队是否已满
      if (invite.team.members.length >= invite.team.maxMembers) {
        throw new ForbiddenException('团队已满');
      }

      // 检查是否已经是成员
      const existingMember = invite.team.members.find(m => m.userId === userId);
      if (existingMember) {
        throw new BadRequestException('您已经是该团队的成员');
      }

      // 加入团队
      await this.prisma.$transaction([
        this.prisma.teamMember.create({
          data: {
            teamId: invite.teamId,
            userId,
            role: TeamRole.MEMBER,
          }
        }),
        this.prisma.teamInvite.update({
          where: { id: invite.id },
          data: { status: InviteStatus.ACCEPTED }
        })
      ]);

      return { message: '成功加入团队', teamId: invite.teamId };
    } else {
      // 拒绝邀请
      await this.prisma.teamInvite.update({
        where: { id: invite.id },
        data: { status: InviteStatus.DECLINED }
      });

      return { message: '已拒绝邀请' };
    }
  }

  // 重新生成邀请码
  async regenerateInviteCode(userId: string, teamId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          where: { userId }
        }
      }
    });

    if (!team) {
      throw new NotFoundException('团队不存在');
    }

    // 检查权限（只有队长可以重新生成邀请码）
    const userMember = team.members[0];
    if (!userMember || userMember.role !== TeamRole.LEADER) {
      throw new ForbiddenException('只有队长可以重新生成邀请码');
    }

    const newInviteCode = generateInviteCode();

    await this.prisma.team.update({
      where: { id: teamId },
      data: { inviteCode: newInviteCode }
    });

    return { inviteCode: newInviteCode };
  }

  // 通过邀请码获取团队信息
  async getTeamByInviteCode(code: string) {
    const team = await this.prisma.team.findUnique({
      where: { inviteCode: code },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true,
          }
        },
        _count: {
          select: {
            members: true,
            games: true,
          }
        }
      }
    });

    if (!team) {
      throw new NotFoundException('邀请码无效');
    }

    if (team.status !== TeamStatus.ACTIVE) {
      throw new ForbiddenException('团队已不活跃');
    }

    return {
      id: team.id,
      name: team.name,
      description: team.description,
      teamType: team.teamType,
      creator: team.creator,
      memberCount: team._count.members,
      maxMembers: team.maxMembers,
      gameCount: team._count.games,
    };
  }

  // 团队参与游戏
  async joinTeamGame(userId: string, teamId: string, gameId: string) {
    // 检查用户是否是团队成员
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      },
      include: {
        team: true
      }
    });

    if (!teamMember) {
      throw new ForbiddenException('您不是该团队的成员');
    }

    // 检查是否是队长
    if (teamMember.role !== TeamRole.LEADER) {
      throw new ForbiddenException('只有队长可以代表团队参与游戏');
    }

    // 检查游戏是否存在且是团队游戏
    const game = await this.prisma.betGame.findUnique({
      where: { id: gameId },
      include: {
        teamParticipations: true
      }
    });

    if (!game) {
      throw new NotFoundException('游戏不存在');
    }

    if (!game.isTeamGame) {
      throw new BadRequestException('该游戏不是团队游戏');
    }

    // 检查团队是否已经参与
    const existingParticipation = game.teamParticipations.find(tp => tp.teamId === teamId);
    if (existingParticipation) {
      throw new BadRequestException('团队已经参与了该游戏');
    }

    // 检查游戏是否还能接受新团队
    if (game.maxTeams && game.teamParticipations.length >= game.maxTeams) {
      throw new BadRequestException('游戏已达到最大团队数量');
    }

    // 检查团队规模是否符合要求
    const teamMembersCount = await this.prisma.teamMember.count({
      where: { teamId }
    });

    if (game.minTeamSize && teamMembersCount < game.minTeamSize) {
      throw new BadRequestException(`团队成员数量不足，至少需要${game.minTeamSize}人`);
    }

    if (game.maxTeamSize && teamMembersCount > game.maxTeamSize) {
      throw new BadRequestException(`团队成员数量过多，最多允许${game.maxTeamSize}人`);
    }

    // 创建团队参与记录
    const participation = await this.prisma.teamGameParticipation.create({
      data: {
        gameId,
        teamId,
        status: TeamParticipationStatus.ACTIVE
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            creator: {
              select: {
                username: true
              }
            }
          }
        },
        game: {
          select: {
            id: true,
            title: true,
            teamMode: true
          }
        }
      }
    });

    return participation;
  }

  // 团队退出游戏
  async leaveTeamGame(userId: string, teamId: string, gameId: string) {
    // 检查权限
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      }
    });

    if (!teamMember || teamMember.role !== TeamRole.LEADER) {
      throw new ForbiddenException('只有队长可以代表团队退出游戏');
    }

    // 查找参与记录
    const participation = await this.prisma.teamGameParticipation.findUnique({
      where: {
        gameId_teamId: {
          gameId,
          teamId
        }
      }
    });

    if (!participation) {
      throw new NotFoundException('团队未参与该游戏');
    }

    // 更新状态为已退出
    await this.prisma.teamGameParticipation.update({
      where: { id: participation.id },
      data: { status: TeamParticipationStatus.WITHDRAWN }
    });

    return { message: '团队已退出游戏' };
  }

  // 获取团队参与的游戏列表
  async getTeamGames(userId: string, teamId: string) {
    // 检查权限
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      }
    });

    if (!teamMember) {
      throw new ForbiddenException('您不是该团队的成员');
    }

    const participations = await this.prisma.teamGameParticipation.findMany({
      where: { teamId },
      include: {
        game: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            teamMode: true,
            startDate: true,
            endDate: true,
            createdAt: true,
            creator: {
              select: {
                username: true
              }
            }
          }
        }
      },
      orderBy: { joinedAt: 'desc' }
    });

    return participations.map(p => ({
      ...p.game,
      participationStatus: p.status,
      joinedAt: p.joinedAt,
      teamScore: p.teamScore,
      teamRank: p.teamRank,
      isWinner: p.isWinner
    }));
  }

  // 获取可参与的团队游戏
  async getAvailableTeamGames(userId: string, teamId: string) {
    // 检查权限
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      },
      include: {
        team: true
      }
    });

    if (!teamMember) {
      throw new ForbiddenException('您不是该团队的成员');
    }

    const teamMembersCount = await this.prisma.teamMember.count({
      where: { teamId }
    });

    // 获取团队尚未参与的团队游戏
    const games = await this.prisma.betGame.findMany({
      where: {
        isTeamGame: true,
        status: 'OPEN',
        teamParticipations: {
          none: { teamId }
        },
        // 检查团队规模限制
        OR: [
          { minTeamSize: null },
          { minTeamSize: { lte: teamMembersCount } }
        ],
        AND: [
          {
            OR: [
              { maxTeamSize: null },
              { maxTeamSize: { gte: teamMembersCount } }
            ]
          }
        ]
      },
      include: {
        creator: {
          select: {
            username: true
          }
        },
        _count: {
          select: {
            teamParticipations: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return games.map(game => ({
      ...game,
      currentTeams: game._count.teamParticipations,
      canJoin: !game.maxTeams || game._count.teamParticipations < game.maxTeams
    }));
  }

  // 获取团队统计信息
  async getTeamStats(userId: string, teamId: string) {
    // 验证用户权限
    await this.validateTeamMembership(userId, teamId);

    const [
      teamInfo,
      gamesCount,
      successfulGames,
      totalMembers,
      activeMembers,
      teamPoints
    ] = await Promise.all([
      this.prisma.team.findUnique({
        where: { id: teamId },
        select: {
          id: true,
          name: true,
          createdAt: true,
          status: true
        }
      }),
      // 暂时设为0，避免复杂查询
      Promise.resolve(0), // gamesCount
      Promise.resolve(0), // successfulGames
      this.prisma.teamMember.count({
        where: { teamId }
      }),
      // 暂时设为总成员数，避免复杂查询
      this.prisma.teamMember.count({
        where: { teamId }
      }),
      this.calculateTeamPoints(teamId)
    ]);

    const successRate = gamesCount > 0 ? (successfulGames / gamesCount) * 100 : 0;
    const teamAge = Math.floor((Date.now() - teamInfo!.createdAt.getTime()) / (1000 * 60 * 60 * 24));

    return {
      teamInfo,
      stats: {
        totalGames: gamesCount,
        successfulGames,
        successRate: Math.round(successRate * 100) / 100,
        totalMembers,
        activeMembers,
        teamAge,
        totalPoints: teamPoints.total,
        averagePointsPerMember: totalMembers > 0 ? Math.round(teamPoints.total / totalMembers) : 0
      },
      pointsBreakdown: teamPoints.breakdown
    };
  }

  // 计算团队积分
  private async calculateTeamPoints(teamId: string) {
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
      }
    };
  }

  // 获取团队积分排行榜
  async getTeamLeaderboard(userId: string, teamId: string) {
    // 验证用户权限
    await this.validateTeamMembership(userId, teamId);

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

    const leaderboard = teamMembers.map(member => {
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

    return leaderboard;
  }

  // 获取团队活动历史
  async getTeamActivities(userId: string, teamId: string, limit: number = 20) {
    // 验证用户权限
    await this.validateTeamMembership(userId, teamId);

    // 暂时简化实现，只返回团队成员信息
    const memberActivities = await this.prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            username: true,
            fullName: true
          }
        }
      },
      orderBy: { joinedAt: 'desc' },
      take: limit
    });

    const activities = memberActivities.map((activity: any) => ({
      type: 'member_joined',
      timestamp: activity.joinedAt,
      data: {
        userId: activity.userId,
        username: activity.user.username,
        fullName: activity.user.fullName,
        role: activity.role
      }
    }));

    return activities;
  }

  // 获取团队成员贡献统计
  async getTeamMemberContributions(userId: string, teamId: string) {
    // 验证用户权限
    await this.validateTeamMembership(userId, teamId);

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
            laborPoints: true
          }
        }
      }
    });

    const memberContributions = teamMembers.map(member => {
      const totalPoints = member.user.participationPoints + member.user.trustPoints + member.user.laborPoints;

      return {
        userId: member.user.id,
        username: member.user.username,
        fullName: member.user.fullName,
        role: member.role,
        joinedAt: member.joinedAt,
        contribution: {
          gamesParticipated: 0, // 暂时设为0，需要复杂查询
          successfulGames: 0,   // 暂时设为0，需要复杂查询
          successRate: 0,       // 暂时设为0，需要复杂查询
          totalPoints,
          lastActivity: null    // 暂时设为null，需要复杂查询
        }
      };
    });

    return memberContributions.sort((a, b) => b.contribution.totalPoints - a.contribution.totalPoints);
  }

  // 获取团队游戏结果统计
  async getTeamGameResults(userId: string, teamId: string, period?: string) {
    // 验证用户权限
    await this.validateTeamMembership(userId, teamId);

    // 暂时返回简化的统计信息
    const stats = {
      total: 0,
      success: 0,
      failure: 0,
      pending: 0,
      byCategory: {} as Record<string, { total: number; success: number; failure: number }>
    };

    return {
      stats,
      games: []
    };
  }

  // 验证团队成员身份的辅助方法
  private async validateTeamMembership(userId: string, teamId: string) {
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

    return membership;
  }
}
