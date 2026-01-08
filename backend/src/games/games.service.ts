import { Injectable, BadRequestException, ForbiddenException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { PointsService } from '../points/points.service';
import { AchievementsService } from '../achievements/achievements.service';
import { VipService } from '../vip/vip.service';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';
import { FileValidationService } from '../common/file-validation.service';
import { FeaturedGamesService } from '../common/featured-games.service';
import { GameSettlementService } from './game-settlement.service';
import { AntiFraudService } from './anti-fraud.service';
import { LocationService } from '../location/location.service';
import { UploadService } from '../upload/upload.service';
import { CreateGameDto } from './dto/create-game.dto';
import { SubmitEvidenceDto } from './dto/submit-evidence.dto';
import { PeerEvaluationDto, EvaluationResult } from './dto/peer-evaluation.dto';
import { ReportGameDto } from './dto/report-game.dto';
import { GameStatus, GameCategory, GameVisibility, FriendshipStatus, ReportTargetType } from '@prisma/client';
import { TimeUtil } from '../common/utils/time.util';

@Injectable()
export class GamesService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    @Inject(forwardRef(() => PointsService))
    private pointsService: PointsService,
    private vipService: VipService,
    @Inject(forwardRef(() => AchievementsService))
    private achievementsService: AchievementsService,
    private emailService: EmailService,
    private notificationsService: NotificationsService,
    private fileValidationService: FileValidationService,
    @Inject(forwardRef(() => FeaturedGamesService))
    private featuredGamesService: FeaturedGamesService,
    @Inject(forwardRef(() => GameSettlementService))
    private gameSettlementService: GameSettlementService,
    private antiFraudService: AntiFraudService,
    private locationService: LocationService,
    private uploadService: UploadService,
  ) {}

  async createGame(userId: string, createGameDto: CreateGameDto, clientIP?: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 验证完整时间流程
    const timeValidation = this.validateGameTimeFlow(createGameDto);
    if (timeValidation.length > 0) {
      throw new BadRequestException(`时间设置错误: ${timeValidation.join(', ')}`);
    }

    // 转换所有时间字段为UTC
    const startDate = TimeUtil.toUTC(createGameDto.startDate);
    const endDate = TimeUtil.toUTC(createGameDto.endDate);
    const evidenceDeadline = TimeUtil.toUTC(createGameDto.evidenceDeadline);

    // 自动计算缺失的时间字段
    const now = new Date();
    const joinDeadline = createGameDto.joinDeadline ?
      TimeUtil.toUTC(createGameDto.joinDeadline) :
      (() => {
        // 🔧 智能计算加入截止时间
        const timeUntilStart = startDate.getTime() - now.getTime(); // 距离开始还有多久（毫秒）
        const oneHour = 60 * 60 * 1000;

        // 如果距离开始时间超过1小时，设为开始前1小时
        if (timeUntilStart > oneHour) {
          return new Date(startDate.getTime() - oneHour);
        }

        // 如果距离开始时间不足1小时，设为当前时间（快速开始游戏）
        console.log('🕐 快速开始游戏，加入截止时间设为当前时间:', {
          游戏开始时间: startDate.toISOString(),
          当前时间: now.toISOString(),
          距离开始: `${Math.floor(timeUntilStart / 60000)}分钟`,
          加入截止时间: now.toISOString()
        });
        return now;
      })();
    const reviewDeadline = createGameDto.reviewDeadline ?
      TimeUtil.toUTC(createGameDto.reviewDeadline) :
      new Date(evidenceDeadline.getTime() + 30 * 60 * 1000); // 默认证据截止后30分钟（测试环境）
    const arbitrationDeadline = createGameDto.arbitrationDeadline ?
      TimeUtil.toUTC(createGameDto.arbitrationDeadline) :
      new Date(reviewDeadline.getTime() + 30 * 60 * 1000); // 默认互评截止后30分钟（测试环境）

    // 年龄限制检查
    const age = this.calculateAge(user.dateOfBirth);
    if (age < 18) {
      throw new ForbiddenException('未满18岁不能创建游戏');
    }

    // 18-21岁用户限制
    if (age >= 18 && age < 21) {
      const restrictedCategories: GameCategory[] = [GameCategory.HEALTH, GameCategory.FITNESS, GameCategory.LEARNING];
      if (!restrictedCategories.includes(createGameDto.category)) {
        throw new ForbiddenException('18-21岁用户只能创建健康、健身或学习类挑战');
      }

      // 检查今日创建游戏数量
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const todayGamesCount = await this.prisma.betGame.count({
        where: {
          creatorId: userId,
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      });

      if (todayGamesCount >= 3) {
        throw new ForbiddenException('18-21岁用户每天最多只能创建3个挑战');
      }
    }

    // 检查VIP权限和每日创建限制
    const vipStatus = await this.vipService.getUserVipStatus(userId);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayGamesCount = await this.prisma.betGame.count({
      where: {
        creatorId: userId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    // 检查每日创建限制
    let dailyLimit = user.dailyGameLimit || 5; // 默认限制
    if (vipStatus.isVip && vipStatus.features) {
      const features = vipStatus.features as any;
      const vipLimit = features?.maxDailyGames || 10;
      if (vipLimit === -1) {
        dailyLimit = 999; // 无限制
      } else if (vipLimit && vipLimit > dailyLimit) {
        dailyLimit = vipLimit;
      }
    }

    if (todayGamesCount >= dailyLimit) {
      if (vipStatus.isVip) {
        throw new ForbiddenException(`您今日已达到创建限制(${dailyLimit}个)`);
      } else {
        throw new ForbiddenException(`您今日已达到创建限制(${dailyLimit}个)，升级VIP可获得更多创建次数`);
      }
    }

    // 检查特殊功能权限
    if (createGameDto.visibility === GameVisibility.FRIENDS_ONLY && !vipStatus.isVip) {
      throw new ForbiddenException('仅好友可见功能需要VIP会员');
    }

    // 检查团队游戏权限
    if (createGameDto.isTeamGame && !vipStatus.isVip) {
      throw new ForbiddenException('创建团队游戏需要VIP会员');
    }

    // 验证团队游戏参数
    if (createGameDto.isTeamGame) {
      if (!createGameDto.teamMode) {
        throw new BadRequestException('团队游戏必须指定游戏模式');
      }
      if (!createGameDto.maxTeams || createGameDto.maxTeams < 2) {
        throw new BadRequestException('团队游戏至少需要2个团队');
      }
      if (createGameDto.minTeamSize && createGameDto.maxTeamSize &&
          createGameDto.minTeamSize > createGameDto.maxTeamSize) {
        throw new BadRequestException('最小团队规模不能大于最大团队规模');
      }
    }

    // 验证模板ID（如果提供了）
    if (createGameDto.templateId) {
      // 跳过虚拟模板ID的验证（以 "no-template-" 开头的ID）
      if (!createGameDto.templateId.startsWith('no-template-')) {
        const template = await this.prisma.gameTemplate.findUnique({
          where: { id: createGameDto.templateId }
        });

        if (!template) {
          console.error(`模板不存在: ${createGameDto.templateId}`);
          throw new BadRequestException(`模板不存在: ${createGameDto.templateId}`);
        }

        if (!template.isActive) {
          throw new BadRequestException('所选模板已停用');
        }

        console.log(`使用模板: ${template.name} (${template.id})`);
      } else {
        console.log(`跳过模板验证（虚拟模板）: ${createGameDto.templateId}`);
        // 对于虚拟模板，将templateId设置为null，避免数据库外键约束错误
        createGameDto.templateId = null;
      }
    }

    // 获取创建者IP位置信息
    let creatorIpLocation = null;
    let creatorIpCountry = null;
    let creatorIpCity = null;

    if (clientIP && clientIP !== '127.0.0.1') {
      try {
        const locationInfo = await this.locationService.getLocationByIP(clientIP);
        if (locationInfo) {
          creatorIpLocation = this.locationService.formatLocationDisplay(locationInfo);
          creatorIpCountry = locationInfo.country_name || locationInfo.country;
          creatorIpCity = locationInfo.city;

          console.log('🌍 创建者IP位置信息:', {
            ip: clientIP,
            location: creatorIpLocation,
            country: creatorIpCountry,
            city: creatorIpCity
          });
        }
      } catch (error) {
        console.warn('获取IP位置信息失败:', error.message);
      }
    }

    // 创建游戏
    // 提取模板配置，其他字段正常处理
    const { templateConfig, dynamicConfig, ...gameData } = createGameDto as any;

    console.log('创建游戏数据:', {
      ...gameData,
      templateConfig,
      dynamicConfig,
      creatorId: userId,
      startDate,
      endDate,
      evidenceDeadline,
    });

    const game = await this.prisma.betGame.create({
      data: {
        ...gameData,
        creatorId: userId,
        // 完整时间流程
        joinDeadline,
        startDate,
        endDate,
        evidenceDeadline,
        reviewDeadline,
        arbitrationDeadline,
        currentParticipants: 1, // 创建者自动参与
        // 存储模板配置
        templateConfig: templateConfig || null,
        dynamicConfig: dynamicConfig || null,
        // 创建者IP位置信息
        creatorIpLocation,
        creatorIpCountry,
        creatorIpCity,
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true,
            trustPoints: true,
          },
        },
        template: true,
      },
    });

    // 创建者自动参与游戏
    await this.prisma.betParticipant.create({
      data: {
        gameId: game.id,
        userId,
      },
    });

    // 更新用户统计和积分
    await this.usersService.updateGameStats(userId, 'created');
    await this.pointsService.updateGamePoints(userId, 'create', game.id);

    // 检查成就
    await this.achievementsService.checkAndUnlockAchievements(userId, 'game_created');

    return game;
  }

  async findAll(filters?: {
    category?: GameCategory | 'all';
    status?: GameStatus | 'all' | 'open' | 'in_progress' | 'peer_review' | 'completed' | 'expired';
    featured?: boolean;
    search?: string;
    sortBy?: string;
    limit?: number;
    offset?: number;
    isTeamGame?: boolean;
    locationFilter?: 'local' | 'tough';
    maxDistance?: number;
    minDistance?: number;
  }, userId?: string) {
    const where: any = {};

    if (filters?.category && filters.category !== 'all') {
      where.category = filters.category;
    }

    if (filters?.status && filters.status !== 'all') {
      const now = new Date();

      if (filters.status === 'open') {
        // 开放中：真正可以加入的游戏（状态为OPEN且还未开始）
        where.AND = [
          { status: GameStatus.OPEN },
          { startDate: { gt: now } }
        ];
      } else if (filters.status === 'in_progress') {
        // 进行中：游戏已开始但未结束（包括游戏中、证据提交期）
        where.AND = [
          {
            OR: [
              { status: GameStatus.IN_PROGRESS },
              { status: GameStatus.EVIDENCE_SUBMISSION },
              {
                status: GameStatus.OPEN,
                startDate: { lte: now }
              }
            ]
          },
          { endDate: { gt: now } }
        ];
      } else if (filters.status === 'peer_review') {
        // 互评期：正在进行互评
        where.status = GameStatus.PEER_REVIEW;
      } else if (filters.status === 'completed' || filters.status === 'expired') {
        // 已结束：只包含正常完成和争议状态，不包括被举报关闭的游戏
        where.status = {
          in: [GameStatus.COMPLETED, GameStatus.DISPUTED]
        };
      } else {
        // 处理其他GameStatus枚举值
        where.status = filters.status as GameStatus;
      }
    } else {
      // 默认只显示开放和进行中的游戏，不包括被举报关闭的游戏
      where.status = {
        in: [GameStatus.OPEN, GameStatus.IN_PROGRESS],
      };
    }

    if (filters?.featured) {
      // 热门游戏：使用智能排序，不限制特定条件
      // 让智能排序算法来决定热门程度
    }

    // 团队游戏筛选
    if (filters?.isTeamGame !== undefined) {
      where.isTeamGame = filters.isTeamGame;
    }

    // 添加搜索功能
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // 地理位置和难度过滤
    if (filters?.locationFilter === 'local') {
      // Local: 本地挑战 - 只显示有地理位置限制的游戏
      const locationConditions = [
        {
          locationRestriction: 'LOCAL'
          // 显示所有本地挑战，不限制距离（因为我们还没有用户位置）
        },
        {
          locationRestriction: 'CUSTOM'
          // 显示所有自定义位置的挑战
        }
      ];

      // 如果已经有OR条件，需要合并
      if (where.OR) {
        where.AND = [
          { OR: where.OR },
          { OR: locationConditions }
        ];
        delete where.OR;
      } else {
        where.OR = locationConditions;
      }
    } else if (filters?.locationFilter === 'tough') {
      // Tough: 艰难挑战 - 持续时间长、参与人数多、困难类别
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const toughConditions = [
        // 持续时间 >= 7天 (从现在开始计算，游戏结束时间距离现在至少7天)
        {
          AND: [
            { endDate: { gte: sevenDaysFromNow } },
            { startDate: { lte: now } } // 确保游戏已经开始或即将开始
          ]
        },
        // 参与人数要求 >= 10人
        {
          maxParticipants: { gte: 10 }
        },
        // 困难类别 - 扩展更多困难类别
        {
          category: {
            in: ['FITNESS', 'LEARNING', 'HEALTH', 'PERSONAL']
          }
        }
      ];

      // 如果已经有OR条件，需要合并
      if (where.OR) {
        where.AND = [
          { OR: where.OR },
          { OR: toughConditions }
        ];
        delete where.OR;
      } else {
        where.OR = toughConditions;
      }
    }

    // 设置排序
    let orderBy: any;
    let useSmartSort = false;

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'smart':
        case 'newest':
          // 智能排序：即将开始的优先，然后是最新发布的
          useSmartSort = true;
          orderBy = [{ createdAt: 'desc' }]; // 临时排序，后面会重新排序
          break;
        case 'oldest':
          orderBy = [{ createdAt: 'asc' }];
          break;
        case 'ending_soon':
          orderBy = [{ startDate: 'asc' }];
          break;
        case 'most_participants':
          orderBy = [{ currentParticipants: 'desc' }];
          break;
        case 'least_participants':
          orderBy = [{ currentParticipants: 'asc' }];
          break;
        case 'featured':
          orderBy = [
            { isFeatured: 'desc' },
            { createdAt: 'desc' }
          ];
          break;
        default:
          // 默认使用智能排序
          useSmartSort = true;
          orderBy = [{ createdAt: 'desc' }];
          break;
      }
    } else {
      // 没有指定排序时，使用智能排序
      useSmartSort = true;
      orderBy = [{ createdAt: 'desc' }];
    }

    // 获取所有游戏
    let allGames = await this.prisma.betGame.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        visibility: true,
        stakeType: true,
        betAmount: true,
        currency: true,
        evidenceType: true,
        maxParticipants: true,
        currentParticipants: true,
        createdAt: true,
        joinDeadline: true,
        startDate: true,
        endDate: true,
        evidenceDeadline: true,
        reviewDeadline: true,
        disputeSubmissionDeadline: true,
        arbitrationDeadline: true,
        isFeatured: true,
        viewCount: true,
        favoritesCount: true,
        isTeamGame: true,
        creatorId: true, // 添加creatorId字段
        // 地理位置限制
        locationRestriction: true,
        maxDistance: true,
        customLocation: true,
        // IP位置信息
        creatorIpLocation: true,
        creatorIpCountry: true,
        creatorIpCity: true,
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true,
            trustPoints: true,
            isVip: true,
            country: true,
            countryCode: true,
            city: true,
            isDeleted: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy,
      take: useSmartSort ? undefined : (filters?.limit || 20), // 智能排序时先获取所有数据
      skip: useSmartSort ? undefined : (filters?.offset || 0),
    });

    // 如果使用智能排序，重新排序游戏
    if (useSmartSort) {
      allGames = this.applySmartSort(allGames);

      // 应用分页
      const offset = filters?.offset || 0;
      const limit = filters?.limit || 20;
      allGames = allGames.slice(offset, offset + limit);
    }

    // 如果没有用户ID，只返回公开游戏
    if (!userId) {
      const publicGames = allGames.filter(game => game.visibility === GameVisibility.PUBLIC || !game.visibility);
      return publicGames.map(game => ({ ...game, isFavorited: false }));
    }

    // 获取用户的好友列表
    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId, status: FriendshipStatus.ACCEPTED },
          { addresseeId: userId, status: FriendshipStatus.ACCEPTED },
        ],
      },
    });

    const friendIds = friendships.map(friendship =>
      friendship.requesterId === userId ? friendship.addresseeId : friendship.requesterId
    );

    // 过滤游戏：公开游戏 + 自己创建的游戏 + 好友创建的仅好友可见游戏
    const filteredGames = allGames.filter(game => {
      // 公开游戏或没有设置可见性的游戏（向后兼容）
      if (game.visibility === GameVisibility.PUBLIC || !game.visibility) {
        return true;
      }
      // 自己创建的游戏
      if (game.creatorId === userId) {
        return true;
      }
      // 好友创建的仅好友可见游戏
      if (game.visibility === GameVisibility.FRIENDS_ONLY && friendIds.includes(game.creatorId)) {
        return true;
      }
      return false;
    });

    // 批量查询用户的收藏状态
    const gameIds = filteredGames.map(game => game.id);
    const favorites = await this.prisma.favorite.findMany({
      where: {
        userId,
        gameId: { in: gameIds },
      },
      select: {
        gameId: true,
      },
    });

    const favoritedGameIds = new Set(favorites.map(fav => fav.gameId));

    // 添加收藏状态到每个游戏
    return filteredGames.map(game => ({
      ...game,
      isFavorited: favoritedGameIds.has(game.id),
    }));
  }

  /**
   * 智能排序：优化热门算法，综合考虑多个因素
   */
  private applySmartSort(games: any[]): any[] {
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 计算每个游戏的热门度分数
    const gamesWithScore = games.map(game => {
      const startDate = new Date(game.startDate);
      const createdAt = new Date(game.createdAt);
      let score = 0;

      // 1. 参与度分数 (40%)
      const participationRate = game.currentParticipants / game.maxParticipants;
      score += participationRate * 40;

      // 2. 时间紧迫性分数 (30%)
      if (startDate > now && startDate <= next24Hours) {
        score += 30; // 即将开始的游戏优先
      } else if (startDate > now) {
        const hoursUntilStart = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        score += Math.max(0, 30 - hoursUntilStart / 24); // 距离开始时间越近分数越高
      }

      // 3. 新鲜度分数 (20%)
      if (createdAt >= last7Days) {
        const daysSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
        score += Math.max(0, 20 - daysSinceCreated * 3); // 越新分数越高
      }

      // 4. 推荐加成 (10%)
      if (game.isFeatured) {
        score += 10;
      }

      return { ...game, hotScore: score };
    });

    // 按热门度分数排序
    return gamesWithScore.sort((a, b) => b.hotScore - a.hotScore);
  }

  async findById(id: string, userId?: string) {
    const game = await this.prisma.betGame.findUnique({
      where: { id },
      select: {
        // 基本信息
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        visibility: true,
        stakeType: true,
        betAmount: true,
        currency: true,
        evidenceType: true,
        evidenceInstructions: true,
        maxParticipants: true,
        currentParticipants: true,
        createdAt: true,
        joinDeadline: true,
        startDate: true,
        endDate: true,
        evidenceDeadline: true,
        reviewDeadline: true,
        disputeSubmissionDeadline: true,
        arbitrationDeadline: true,
        isFeatured: true,
        viewCount: true,
        favoritesCount: true,
        isTeamGame: true,
        creatorId: true, // 添加creatorId字段
        // 地理位置限制
        locationRestriction: true,
        maxDistance: true,
        customLocation: true,
        // 创建者IP位置信息
        creatorIpLocation: true,
        creatorIpCountry: true,
        creatorIpCity: true,
        // 模板配置
        templateConfig: true,
        dynamicConfig: true,
        // 关联数据
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true,
            trustPoints: true,
            isVip: true,
            country: true,
            countryCode: true,
            city: true,
            isDeleted: true,
          },
        },
        template: true,
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                trustPoints: true,
                isDeleted: true,
              },
            },
          },
        },
      },
    });

    if (!game) {
      throw new NotFoundException('游戏不存在');
    }

    // 自动结算：如果互评截止时间已过且游戏还在互评阶段，立即触发结算
    if (game.status === GameStatus.PEER_REVIEW && game.reviewDeadline) {
      const now = new Date();
      if (now > game.reviewDeadline) {
        try {
          console.log(`Auto-settling game ${game.id} on access...`);
          // 同步结算，确保数据一致性
          await this.gameSettlementService.settleGame(game.id);
          console.log(`Game ${game.id} auto-settled successfully`);

          // 重新查询游戏以获取最新状态和结果
          const updatedGame = await this.prisma.betGame.findUnique({
            where: { id },
            select: {
              id: true,
              title: true,
              description: true,
              category: true,
              status: true,
              visibility: true,
              stakeType: true,
              betAmount: true,
              currency: true,
              evidenceType: true,
              evidenceInstructions: true,
              maxParticipants: true,
              currentParticipants: true,
              createdAt: true,
              joinDeadline: true,
              startDate: true,
              endDate: true,
              evidenceDeadline: true,
              reviewDeadline: true,
              disputeSubmissionDeadline: true,
              arbitrationDeadline: true,
              isFeatured: true,
              viewCount: true,
              favoritesCount: true,
              isTeamGame: true,
              creatorId: true,
              locationRestriction: true,
              maxDistance: true,
              customLocation: true,
              creatorIpLocation: true,
              creatorIpCountry: true,
              creatorIpCity: true,
              templateConfig: true,
              dynamicConfig: true,
              creator: {
                select: {
                  id: true,
                  username: true,
                  fullName: true,
                  trustPoints: true,
                  isVip: true,
                  country: true,
                  countryCode: true,
                  city: true,
                },
              },
              template: true,
              participants: {
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      fullName: true,
                      trustPoints: true,
                    },
                  },
                },
              },
            },
          });

          if (updatedGame) {
            Object.assign(game, updatedGame);
          }
        } catch (error) {
          console.error(`Failed to auto-settle game ${game.id}:`, error);
          // 结算失败不影响查询，继续返回当前状态
        }
      }
    }

    // 检查游戏可见性权限
    if (game.visibility === GameVisibility.FRIENDS_ONLY && userId) {
      // 如果不是游戏创建者，需要检查是否为好友
      if (game.creatorId !== userId) {
        const friendship = await this.prisma.friendship.findFirst({
          where: {
            OR: [
              { requesterId: userId, addresseeId: game.creatorId, status: FriendshipStatus.ACCEPTED },
              { requesterId: game.creatorId, addresseeId: userId, status: FriendshipStatus.ACCEPTED },
            ],
          },
        });

        if (!friendship) {
          throw new NotFoundException('游戏不存在');
        }
      }
    } else if (game.visibility === GameVisibility.FRIENDS_ONLY && !userId) {
      // 未登录用户无法查看仅好友可见的游戏
      throw new NotFoundException('游戏不存在');
    }

    // 如果提供了用户ID，检查用户是否已参与和是否已收藏
    let userParticipation = null;
    let isFavorited = false;
    if (userId) {
      userParticipation = game.participants.find(p => p.userId === userId);

      // 检查是否已收藏
      const favorite = await this.prisma.favorite.findUnique({
        where: {
          userId_gameId: {
            userId,
            gameId: id,
          },
        },
      });
      isFavorited = !!favorite;

      // 增加浏览量（异步执行，不影响响应速度）
      this.featuredGamesService.incrementViewCount(id).catch(error => {
        console.error('增加浏览量失败:', error);
      });
    }

    return {
      ...game,
      userParticipation,
      isFavorited,
    };
  }

  /**
   * 检查用户对某个游戏的加入-离开次数限制
   */
  private async checkJoinLimit(userId: string, gameId: string): Promise<boolean> {
    // 获取用户的加入-离开历史
    const history = await this.prisma.gameJoinHistory.findMany({
      where: { userId, gameId },
      orderBy: { createdAt: 'asc' }
    });

    // 计算加入-离开的完整循环次数
    let joinLeaveCount = 0;
    for (let i = 0; i < history.length; i++) {
      if (history[i].action === 'JOIN') {
        // 检查下一个是否是 LEAVE
        if (i + 1 < history.length && history[i + 1].action === 'LEAVE') {
          joinLeaveCount++;
          i++; // 跳过 LEAVE
        }
      }
    }

    // 获取用户VIP状态
    const vipStatus = await this.vipService.getUserVipStatus(userId);
    const maxJoinLeaveCount = vipStatus.isVip ? 5 : 3;

    return joinLeaveCount < maxJoinLeaveCount;
  }

  async joinGame(gameId: string, userId: string) {
    const game = await this.findById(gameId, userId);
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 🔧 检查加入-离开次数限制
    const canJoin = await this.checkJoinLimit(userId, gameId);
    if (!canJoin) {
      const vipStatus = await this.vipService.getUserVipStatus(userId);
      const maxCount = vipStatus.isVip ? 5 : 3;
      throw new BadRequestException(
        `您已达到该游戏的最大加入次数限制（${maxCount}次）。如需更多次数，请升级VIP会员。`
      );
    }

    // 检查游戏状态和时间
    const now = new Date();
    const startDate = new Date(game.startDate);
    const endDate = new Date(game.endDate);

    // 游戏已过期
    if (endDate < now) {
      throw new BadRequestException('游戏已过期，无法加入');
    }

    // 严格时间窗口：游戏开始后立即禁止加入，确保公平性
    if (startDate <= now) {
      throw new BadRequestException('游戏已开始，无法加入');
    }

    // 游戏状态检查
    if (game.status !== GameStatus.OPEN) {
      throw new BadRequestException('游戏不在开放状态');
    }

    // 检查是否已参与
    const existingParticipation = await this.prisma.betParticipant.findUnique({
      where: {
        gameId_userId: {
          gameId,
          userId,
        },
      },
    });

    if (existingParticipation) {
      throw new BadRequestException('您已经参与了这个游戏');
    }

    // 防刷机制：检查用户今日加入游戏次数
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayJoinCount = await this.prisma.betParticipant.count({
      where: {
        userId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    // 普通用户每日最多加入20个游戏，VIP用户50个
    const vipStatus = await this.vipService.getUserVipStatus(userId);
    const dailyJoinLimit = vipStatus.isVip ? 50 : 20;

    if (todayJoinCount >= dailyJoinLimit) {
      throw new BadRequestException(`您今日加入游戏次数已达上限(${dailyJoinLimit}次)${vipStatus.isVip ? '' : '，升级VIP可获得更多次数'}`);
    }

    // 检查参与人数限制
    if (game.currentParticipants >= game.maxParticipants) {
      throw new BadRequestException('游戏参与人数已满');
    }

    // 年龄限制检查
    const age = this.calculateAge(user.dateOfBirth);
    if (age < 18) {
      throw new ForbiddenException('未满18岁不能参与游戏');
    }

    // 创建参与记录
    await this.prisma.betParticipant.create({
      data: {
        gameId,
        userId,
      },
    });

    // 🔧 记录加入历史
    await this.prisma.gameJoinHistory.create({
      data: {
        userId,
        gameId,
        action: 'JOIN'
      }
    });

    // 更新游戏参与人数
    await this.prisma.betGame.update({
      where: { id: gameId },
      data: {
        currentParticipants: {
          increment: 1,
        },
      },
    });

    // 更新用户统计和积分
    await this.usersService.updateGameStats(userId, 'joined');
    await this.pointsService.updateGamePoints(userId, 'join', gameId);

    return { success: true, message: '成功加入游戏' };
  }

  async leaveGame(gameId: string, userId: string) {
    const game = await this.findById(gameId, userId);
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 检查是否已参与
    const participation = await this.prisma.betParticipant.findUnique({
      where: {
        gameId_userId: {
          gameId,
          userId,
        },
      },
    });

    if (!participation) {
      throw new BadRequestException('您没有参与这个游戏');
    }

    // 检查是否为创建者
    if (game.creatorId === userId) {
      throw new BadRequestException('游戏创建者不能退出游戏');
    }

    // 严格时间窗口：游戏开始后立即禁止退出，确保承诺性
    const now = new Date();
    const startDate = new Date(game.startDate);

    if (startDate <= now || game.status !== GameStatus.OPEN) {
      throw new BadRequestException('游戏已开始，无法退出');
    }

    // 检查是否已提交证据
    if (participation.evidenceSubmitted) {
      throw new BadRequestException('已提交证据，无法退出游戏');
    }

    // 删除参与记录
    await this.prisma.betParticipant.delete({
      where: {
        gameId_userId: {
          gameId,
          userId,
        },
      },
    });

    // 🔧 记录离开历史
    await this.prisma.gameJoinHistory.create({
      data: {
        userId,
        gameId,
        action: 'LEAVE'
      }
    });

    // 更新游戏参与人数
    await this.prisma.betGame.update({
      where: { id: gameId },
      data: {
        currentParticipants: {
          decrement: 1,
        },
      },
    });

    // 更新用户统计（减少参与次数）
    await this.usersService.updateGameStats(userId, 'left');

    // 扣除加入时获得的积分
    await this.pointsService.updateGamePoints(userId, 'leave', gameId);

    return { success: true, message: '成功退出游戏' };
  }

  // 获取证据验证信息
  getEvidenceValidationInfo() {
    return {
      fileSizeLimits: this.fileValidationService.getFileSizeLimits(),
      supportedTypes: this.fileValidationService.getSupportedTypes(),
    };
  }

  async getUserGames(userId: string, type: 'created' | 'joined' | 'all' = 'all') {
    const where: any = {};

    if (type === 'created') {
      where.creatorId = userId;
    } else if (type === 'joined') {
      where.participants = {
        some: {
          userId,
        },
      };
    } else {
      where.OR = [
        { creatorId: userId },
        {
          participants: {
            some: {
              userId,
            },
          },
        },
      ];
    }

    return this.prisma.betGame.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true,
            trustPoints: true,
            isVip: true,
            country: true,
            countryCode: true,
            city: true,
            isDeleted: true,
          },
        },
        participants: {
          where: { userId },
          select: {
            id: true,
            evidenceSubmitted: true,
            finalResult: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * 获取证据上传签名 URL（前端直接上传到 OSS）
   */
  async getEvidenceUploadUrl(
    gameId: string,
    userId: string,
    contentType: string,
    evidenceType: 'PHOTO' | 'VIDEO'
  ) {
    const game = await this.findById(gameId, userId);

    // 检查游戏状态
    if (game.status !== GameStatus.EVIDENCE_SUBMISSION) {
      throw new BadRequestException('当前不在证据提交阶段');
    }

    // 检查是否是参与者
    const participant = await this.prisma.betParticipant.findUnique({
      where: {
        gameId_userId: {
          gameId,
          userId,
        },
      },
    });

    if (!participant) {
      throw new BadRequestException('您不是此游戏的参与者');
    }

    // 检查是否已提交证据
    if (participant.evidenceSubmitted) {
      throw new BadRequestException('您已经提交过证据');
    }

    // 检查证据提交截止时间
    if (new Date() > game.evidenceDeadline) {
      throw new BadRequestException('证据提交时间已过');
    }

    // 生成预签名 URL
    const fileType = evidenceType === 'PHOTO' ? 'image' : 'video';
    const folder = `evidence/${gameId}`;

    const presignedUrl = await this.uploadService.generatePresignedUploadUrl(
      fileType,
      folder,
      contentType,
      userId
    );

    return {
      success: true,
      data: presignedUrl,
    };
  }

  async submitEvidence(gameId: string, userId: string, submitEvidenceDto: SubmitEvidenceDto) {
    const game = await this.findById(gameId, userId);

    // 检查游戏状态
    if (game.status !== GameStatus.EVIDENCE_SUBMISSION) {
      throw new BadRequestException('当前不在证据提交阶段');
    }

    // 检查是否是参与者
    const participant = await this.prisma.betParticipant.findUnique({
      where: {
        gameId_userId: {
          gameId,
          userId,
        },
      },
    });

    if (!participant) {
      throw new BadRequestException('您不是此游戏的参与者');
    }

    // 检查是否已提交证据
    if (participant.evidenceSubmitted) {
      throw new BadRequestException('您已经提交过证据');
    }

    // 检查证据提交截止时间
    if (new Date() > game.evidenceDeadline) {
      throw new BadRequestException('证据提交时间已过');
    }

    // 验证规则：
    // 1. 如果有文件（OSS URL），文字说明可选且无字数限制
    // 2. 如果没有文件，必须有至少20字符的文字说明
    const hasUrl = submitEvidenceDto.evidenceContent &&
                   (submitEvidenceDto.evidenceContent.startsWith('https://') ||
                    submitEvidenceDto.evidenceContent.startsWith('http://'));

    const hasDescription = submitEvidenceDto.evidenceDescription &&
                          submitEvidenceDto.evidenceDescription.trim().length > 0;

    const descriptionLength = submitEvidenceDto.evidenceDescription?.trim().length || 0;

    // 对于TEXT类型，evidenceContent也可能包含文字内容
    const hasTextInContent = submitEvidenceDto.evidenceContent &&
                             !hasUrl &&
                             submitEvidenceDto.evidenceContent.trim().length >= 20;

    console.log('Evidence validation:', {
      hasUrl,
      hasDescription,
      descriptionLength,
      hasTextInContent,
      evidenceType: submitEvidenceDto.evidenceType,
      evidenceContentLength: submitEvidenceDto.evidenceContent?.length,
      evidenceContentPreview: submitEvidenceDto.evidenceContent?.substring(0, 100),
      evidenceDescriptionPreview: submitEvidenceDto.evidenceDescription?.substring(0, 50)
    });

    // 如果没有文件URL，必须有至少20字符的文字说明
    if (!hasUrl && !hasTextInContent) {
      if (!hasDescription || descriptionLength < 20) {
        throw new BadRequestException('请上传文件或填写至少20字符的文字说明');
      }
    }

    // 如果有文件URL，文字说明可选（可以为空或任意长度）

    // 确定最终的证据内容
    let evidenceUrl: string | null = null;
    if (hasUrl) {
      evidenceUrl = submitEvidenceDto.evidenceContent;
      console.log('Evidence URL received:', evidenceUrl);
    }

    // 更新参与者证据信息
    const updatedParticipant = await this.prisma.betParticipant.update({
      where: {
        gameId_userId: {
          gameId,
          userId,
        },
      },
      data: {
        evidenceSubmitted: true,
        evidenceType: submitEvidenceDto.evidenceType,
        // 如果有文件URL，存储到evidenceContent；如果只有文字，也存储到evidenceContent
        evidenceContent: evidenceUrl || submitEvidenceDto.evidenceDescription,
        // 文字说明单独存储（可选）
        evidenceDescription: submitEvidenceDto.evidenceDescription || null,
        evidenceSubmittedAt: new Date(),
        selfReportedSuccess: submitEvidenceDto.selfReportedSuccess,
      },
    });

    // 检查是否所有参与者都已提交证据
    const allParticipants = await this.prisma.betParticipant.findMany({
      where: { gameId },
    });

    const submittedCount = allParticipants.filter(p => p.evidenceSubmitted).length;

    // 如果所有人都提交了证据，或者到了截止时间，进入互评阶段
    if (submittedCount === allParticipants.length) {
      await this.prisma.betGame.update({
        where: { id: gameId },
        data: { status: GameStatus.PEER_REVIEW },
      });
    }

    return updatedParticipant;
  }

  async submitPeerEvaluation(gameId: string, evaluatorId: string, peerEvaluationDto: PeerEvaluationDto) {
    try {
      console.log('submitPeerEvaluation called with:', { gameId, evaluatorId, peerEvaluationDto });

      const game = await this.findById(gameId, evaluatorId);

      // 检查游戏状态
      if (game.status !== GameStatus.PEER_REVIEW) {
        throw new BadRequestException('当前不在互评阶段');
      }

      // 检查互评截止时间（证据截止时间后48小时）
      const now = new Date();
      const evidenceDeadline = new Date(game.evidenceDeadline);
      const peerReviewDeadline = new Date(evidenceDeadline.getTime() + 48 * 60 * 60 * 1000); // 证据截止后48小时

      if (now > peerReviewDeadline) {
        throw new BadRequestException('互评时间已过，无法提交评价');
      }

    // 检查评价者是否是参与者
    const evaluator = await this.prisma.betParticipant.findUnique({
      where: {
        gameId_userId: {
          gameId,
          userId: evaluatorId,
        },
      },
    });

    if (!evaluator) {
      throw new BadRequestException('您不是此游戏的参与者');
    }

    // 检查被评价者是否是参与者
    const evaluated = await this.prisma.betParticipant.findUnique({
      where: {
        gameId_userId: {
          gameId,
          userId: peerEvaluationDto.evaluatedUserId,
        },
      },
    });

    if (!evaluated) {
      throw new BadRequestException('被评价用户不是此游戏的参与者');
    }

    // 检查参与者总数
    const totalParticipants = await this.prisma.betParticipant.count({
      where: { gameId },
    });

    // 只有在多人游戏时才禁止自己评价自己
    // 单人游戏允许自己评价自己
    if (totalParticipants > 1 && evaluatorId === peerEvaluationDto.evaluatedUserId) {
      throw new BadRequestException('不能评价自己');
    }

    // 检查是否已经评价过
    const existingEvaluation = await this.prisma.peerEvaluation.findFirst({
      where: {
        gameId,
        evaluatorId,
        evaluatedId: peerEvaluationDto.evaluatedUserId,
      },
    });

    if (existingEvaluation) {
      throw new BadRequestException('您已经评价过此用户');
    }

    try {
      // 创建互评记录
      const evaluation = await this.prisma.peerEvaluation.create({
        data: {
          gameId,
          evaluatorId,
          evaluatedId: peerEvaluationDto.evaluatedUserId,
          evaluation: peerEvaluationDto.evaluation,
          reasoning: peerEvaluationDto.reasoning,
        },
      });

      // 更新统计
      await this.prisma.betParticipant.update({
        where: {
          gameId_userId: {
            gameId,
            userId: evaluatorId,
          },
        },
        data: {
          peerEvaluationsGiven: {
            increment: 1,
          },
        },
      });

      await this.prisma.betParticipant.update({
        where: {
          gameId_userId: {
            gameId,
            userId: peerEvaluationDto.evaluatedUserId,
          },
        },
        data: {
          peerEvaluationsReceived: {
            increment: 1,
          },
        },
      });

      // 不再为每次互评发送通知，避免通知过多
      // 用户可以在游戏详情页查看互评结果
      // 互评阶段开始时已经发送过通知了

      // 检查是否所有互评都完成了
      await this.checkAndCompleteGame(gameId);

      return evaluation;
    } catch (dbError) {
      console.error('Database error in submitPeerEvaluation:', dbError);
      throw new BadRequestException('提交互评失败，请稍后重试');
    }
    } catch (error) {
      console.error('Error in submitPeerEvaluation:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('提交互评失败，请稍后重试');
    }
  }

  async getGameParticipants(gameId: string, userId?: string) {
    const game = await this.findById(gameId, userId);

    // 检查用户是否是参与者（仅当提供了userId时）
    let userParticipant = null;
    if (userId) {
      userParticipant = await this.prisma.betParticipant.findUnique({
        where: {
          gameId_userId: {
            gameId,
            userId,
          },
        },
      });
    }

    // 获取所有参与者信息
    const participants = await this.prisma.betParticipant.findMany({
      where: { gameId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            trustPoints: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    // 如果用户不是参与者（包括匿名用户），只返回基本信息（不包含敏感的证据信息）
    if (!userParticipant) {
      return participants.map(participant => ({
        id: participant.id,
        userId: participant.userId,
        evidenceSubmitted: participant.evidenceSubmitted,
        finalResult: participant.finalResult,
        user: participant.user,
        joinedAt: participant.joinedAt,
      }));
    }

    // 如果是参与者，返回完整信息（包括所有人的证据）
    return participants.map(participant => ({
      id: participant.id,
      userId: participant.userId,
      position: participant.position,
      joinedAt: participant.joinedAt,
      evidenceSubmitted: participant.evidenceSubmitted,
      evidenceType: participant.evidenceType,
      evidenceContent: participant.evidenceContent,
      evidenceSubmittedAt: participant.evidenceSubmittedAt,
      selfReportedSuccess: participant.selfReportedSuccess,
      peerEvaluationsReceived: participant.peerEvaluationsReceived,
      peerEvaluationsGiven: participant.peerEvaluationsGiven,
      finalResult: participant.finalResult,
      completionVerified: participant.completionVerified,
      user: participant.user,
    }));
  }

  async getUserEvaluations(gameId: string, userId: string) {
    // 检查用户是否是参与者
    const userParticipant = await this.prisma.betParticipant.findUnique({
      where: {
        gameId_userId: {
          gameId,
          userId,
        },
      },
    });

    if (!userParticipant) {
      throw new BadRequestException('您不是此游戏的参与者');
    }

    // 获取用户已提交的评价
    const evaluations = await this.prisma.peerEvaluation.findMany({
      where: {
        gameId,
        evaluatorId: userId,
      },
      select: {
        evaluatedId: true,
        evaluation: true,
        reasoning: true,
        createdAt: true,
      },
    });

    return evaluations;
  }

  async getAllEvaluations(gameId: string, userId: string) {
    // 获取游戏信息
    const game = await this.findById(gameId, userId);

    // 检查是否可以查看所有评价：游戏完成 或 互评截止时间已过
    const now = new Date();
    const canViewEvaluations = game.status === GameStatus.COMPLETED ||
      (game.status === GameStatus.PEER_REVIEW && game.reviewDeadline && now > game.reviewDeadline);

    if (!canViewEvaluations) {
      throw new BadRequestException('互评尚未结束，无法查看所有评价');
    }

    // 检查用户是否是参与者
    const userParticipant = await this.prisma.betParticipant.findUnique({
      where: {
        gameId_userId: {
          gameId,
          userId,
        },
      },
    });

    if (!userParticipant) {
      throw new BadRequestException('您不是此游戏的参与者');
    }

    // 获取所有评价，按被评价者分组
    const evaluations = await this.prisma.peerEvaluation.findMany({
      where: { gameId },
      include: {
        evaluator: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
        evaluated: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // 按被评价者分组
    const evaluationsByUser: Record<string, any[]> = {};
    evaluations.forEach(evaluation => {
      const evaluatedId = evaluation.evaluatedId;
      if (!evaluationsByUser[evaluatedId]) {
        evaluationsByUser[evaluatedId] = [];
      }
      evaluationsByUser[evaluatedId].push({
        evaluatorId: evaluation.evaluatorId,
        evaluatorUsername: evaluation.evaluator.username,
        evaluatorFullName: evaluation.evaluator.fullName,
        evaluation: evaluation.evaluation,
        reasoning: evaluation.reasoning,
        createdAt: evaluation.createdAt,
      });
    });

    return evaluationsByUser;
  }

  private async checkAndCompleteGame(gameId: string) {
    const participants = await this.prisma.betParticipant.findMany({
      where: { gameId },
    });

    const totalParticipants = participants.length;
    const expectedEvaluations = totalParticipants * (totalParticipants - 1); // 每人评价其他所有人

    const completedEvaluations = await this.prisma.peerEvaluation.count({
      where: { gameId },
    });

    // 如果所有互评都完成了，计算最终结果
    if (completedEvaluations >= expectedEvaluations) {
      await this.calculateGameResults(gameId);
    }
  }

  private async calculateGameResults(gameId: string) {
    return this.gameSettlementService.settleGame(gameId);
  }

  // 获取游戏结算结果
  async getGameSettlement(gameId: string) {
    return this.gameSettlementService.getGameSettlement(gameId);
  }



  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    return age;
  }

  async getUserGameStats(userId: string, period: string = '30d') {
    // 计算时间范围
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0); // 全部时间
    }

    // 获取用户创建的游戏
    const createdGames = await this.prisma.betGame.findMany({
      where: {
        creatorId: userId,
        createdAt: { gte: startDate }
      },
      include: {
        participants: true,
        _count: { select: { participants: true } }
      }
    });

    // 获取用户参与的游戏
    const participatedGames = await this.prisma.betParticipant.findMany({
      where: {
        userId,
        joinedAt: { gte: startDate }
      },
      include: {
        game: {
          include: {
            _count: { select: { participants: true } }
          }
        }
      }
    });

    // 计算统计数据
    const totalCreated = createdGames.length;
    const totalJoined = participatedGames.length;
    const totalCompleted = participatedGames.filter(p =>
      p.finalResult && p.finalResult !== 'PENDING'
    ).length;

    const successfulGames = participatedGames.filter(p =>
      p.finalResult === 'SUCCESS'
    ).length;

    const successRate = totalCompleted > 0 ? Math.round((successfulGames / totalCompleted) * 100) : 0;

    const averageParticipants = createdGames.length > 0
      ? Math.round(createdGames.reduce((sum, game) => sum + game._count.participants, 0) / createdGames.length)
      : 0;

    // 分类统计
    const categoryStats = await this.getCategoryStats(userId, startDate);

    // 最近活动
    const recentActivity = await this.getRecentActivity(userId, 10);

    // 本月统计
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyCreated = await this.prisma.betGame.count({
      where: { creatorId: userId, createdAt: { gte: thisMonth } }
    });
    const monthlyJoined = await this.prisma.betParticipant.count({
      where: { userId, joinedAt: { gte: thisMonth } }
    });
    const monthlyCompleted = await this.prisma.betParticipant.count({
      where: {
        userId,
        joinedAt: { gte: thisMonth },
        finalResult: { not: 'PENDING' }
      }
    });

    return {
      totalCreated,
      totalJoined,
      totalCompleted,
      successRate,
      averageParticipants,
      favoriteCategory: categoryStats[0]?.category || 'HEALTH',
      monthlyStats: {
        created: monthlyCreated,
        joined: monthlyJoined,
        completed: monthlyCompleted
      },
      categoryStats,
      recentActivity
    };
  }

  private async getCategoryStats(userId: string, startDate: Date) {
    const participations = await this.prisma.betParticipant.findMany({
      where: {
        userId,
        joinedAt: { gte: startDate }
      },
      include: {
        game: {
          select: {
            category: true
          }
        }
      }
    });

    const categoryMap = new Map();

    participations.forEach(p => {
      const category = p.game.category;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { count: 0, successful: 0 });
      }
      const stats = categoryMap.get(category);
      stats.count++;
      if (p.finalResult === 'SUCCESS') {
        stats.successful++;
      }
    });

    return Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      count: stats.count,
      successRate: stats.count > 0 ? Math.round((stats.successful / stats.count) * 100) : 0
    })).sort((a, b) => b.count - a.count);
  }

  private async getRecentActivity(userId: string, limit: number = 10) {
    // 获取最近的游戏创建和参与活动
    const createdGames = await this.prisma.betGame.findMany({
      where: { creatorId: userId },
      select: {
        title: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    const joinedGames = await this.prisma.betParticipant.findMany({
      where: { userId },
      include: {
        game: {
          select: {
            title: true
          }
        }
      },
      orderBy: { joinedAt: 'desc' },
      take: limit
    });

    const activities = [
      ...createdGames.map(game => ({
        date: game.createdAt.toLocaleDateString(),
        action: '创建了挑战',
        gameTitle: game.title
      })),
      ...joinedGames.map(p => ({
        date: p.joinedAt.toLocaleDateString(),
        action: '参与了挑战',
        gameTitle: p.game.title
      }))
    ];

    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  // 测试方法：检测游戏防刷风险
  async checkGameFraud(gameId: string) {
    const game = await this.findById(gameId);

    if (game.status !== GameStatus.PEER_REVIEW && game.status !== GameStatus.COMPLETED) {
      throw new BadRequestException('游戏尚未进入互评阶段，无法进行防刷检测');
    }

    const fraudResult = await this.antiFraudService.detectEvaluationFraud(gameId);

    return {
      gameId,
      gameTitle: game.title,
      gameStatus: game.status,
      fraudDetection: fraudResult,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 验证游戏完整时间流程
   */
  private validateGameTimeFlow(createGameDto: any): string[] {
    const errors: string[] = [];
    const now = new Date();

    try {
      const startDate = new Date(createGameDto.startDate);
      const endDate = new Date(createGameDto.endDate);
      const evidenceDeadline = new Date(createGameDto.evidenceDeadline);

      // 计算或使用提供的时间
      const joinDeadline = createGameDto.joinDeadline ?
        new Date(createGameDto.joinDeadline) :
        new Date(startDate.getTime() - 60 * 60 * 1000);
      const reviewDeadline = createGameDto.reviewDeadline ?
        new Date(createGameDto.reviewDeadline) :
        new Date(evidenceDeadline.getTime() + 30 * 60 * 1000);
      const arbitrationDeadline = createGameDto.arbitrationDeadline ?
        new Date(createGameDto.arbitrationDeadline) :
        new Date(reviewDeadline.getTime() + 30 * 60 * 1000);

      // 1. 加入截止时间验证（支持快速开始游戏）
      // 对于快速开始游戏，加入截止时间可能是过去时间，这是正常的
      // 只要游戏开始时间是未来时间即可
      if (startDate < now) {
        const timeDiff = (now.getTime() - startDate.getTime()) / 1000; // 秒
        if (timeDiff > 60) { // 只有超过1分钟才报错
          errors.push('游戏开始时间必须是未来时间');
        }
      }

      // 2. 游戏开始时间必须晚于加入截止时间（快速开始游戏允许相等）
      const timeDiffStartToJoin = startDate.getTime() - joinDeadline.getTime();
      if (timeDiffStartToJoin < 0) {
        errors.push('游戏开始时间不能早于加入截止时间');
      }
      // 对于快速开始游戏，允许开始时间等于加入截止时间

      // 3. 游戏结束时间必须晚于开始时间
      if (endDate <= startDate) {
        errors.push('游戏结束时间必须晚于开始时间');
      }

      // 4. 证据提交截止必须晚于游戏结束时间
      if (evidenceDeadline <= endDate) {
        errors.push('证据提交截止时间必须晚于游戏结束时间');
      }

      // 5. 互评截止必须晚于证据提交截止
      if (reviewDeadline <= evidenceDeadline) {
        errors.push('互评截止时间必须晚于证据提交截止时间');
      }

      // 6. 仲裁截止必须晚于互评截止
      if (arbitrationDeadline <= reviewDeadline) {
        errors.push('仲裁截止时间必须晚于互评截止时间');
      }

      // 7. 检查合理的时间间隔（支持快速开始游戏）
      const joinToStart = startDate.getTime() - joinDeadline.getTime();
      if (joinToStart < 0) { // 加入截止时间不能晚于开始时间
        errors.push('加入截止时间不能晚于游戏开始时间');
      }
      // 对于快速开始游戏，允许0间隔（立即开始）

      const gameMinDuration = 2 * 60 * 1000; // 至少2分钟
      const gameMaxDuration = 30 * 24 * 60 * 60 * 1000; // 最多30天
      const gameDuration = endDate.getTime() - startDate.getTime();

      if (gameDuration < gameMinDuration) {
        errors.push('游戏持续时间至少需要2分钟');
      }
      if (gameDuration > gameMaxDuration) {
        errors.push('游戏持续时间不能超过30天');
      }

    } catch (error) {
      errors.push('时间格式无效');
    }

    return errors;
  }

  // 举报游戏
  async reportGame(gameId: string, reporterId: string, reportGameDto: ReportGameDto) {
    // 检查游戏是否存在
    const game = await this.prisma.betGame.findUnique({
      where: { id: gameId },
      select: { id: true, title: true, creatorId: true }
    });

    if (!game) {
      throw new NotFoundException('游戏不存在');
    }

    // 不能举报自己创建的游戏
    if (game.creatorId === reporterId) {
      throw new BadRequestException('不能举报自己创建的游戏');
    }

    // 检查是否已经举报过
    const existingReport = await this.prisma.report.findFirst({
      where: {
        reporterId,
        targetType: ReportTargetType.GAME,
        targetId: gameId,
        status: { in: ['PENDING', 'INVESTIGATING'] }
      }
    });

    if (existingReport) {
      throw new BadRequestException('您已经举报过此游戏，请等待处理');
    }

    // 创建举报记录
    const report = await this.prisma.report.create({
      data: {
        reporterId,
        targetType: ReportTargetType.GAME,
        targetId: gameId,
        reason: reportGameDto.reason,
        description: reportGameDto.description,
      },
      include: {
        reporter: {
          select: { id: true, username: true, fullName: true }
        }
      }
    });

    return {
      success: true,
      message: '举报已提交，我们会尽快处理',
      report
    };
  }

}
