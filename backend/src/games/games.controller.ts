import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { SubmitEvidenceDto } from './dto/submit-evidence.dto';
import { PeerEvaluationDto } from './dto/peer-evaluation.dto';
import { ReportGameDto } from './dto/report-game.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { SchedulerService } from '../scheduler/scheduler.service';
import { GameCategory, GameStatus } from '@prisma/client';

@Controller('games')
export class GamesController {
  constructor(
    private gamesService: GamesService,
    private schedulerService: SchedulerService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createGame(@Request() req, @Body() createGameDto: CreateGameDto) {
    // 获取客户端IP地址
    const clientIP = this.getClientIP(req);
    return this.gamesService.createGame(req.user.sub, createGameDto, clientIP);
  }

  /**
   * 获取客户端真实IP地址
   */
  private getClientIP(req: any): string {
    // 尝试从各种头部获取真实IP
    const forwarded = req.headers['x-forwarded-for'] as string;
    const realIP = req.headers['x-real-ip'] as string;
    const cfConnectingIP = req.headers['cf-connecting-ip'] as string;

    let ip = '';

    if (forwarded) {
      // x-forwarded-for 可能包含多个IP，取第一个
      ip = forwarded.split(',')[0].trim();
    } else if (realIP) {
      ip = realIP;
    } else if (cfConnectingIP) {
      ip = cfConnectingIP;
    } else {
      // 最后使用连接IP
      ip = req.connection?.remoteAddress || req.socket?.remoteAddress || '127.0.0.1';
    }

    // 处理IPv6映射的IPv4地址 (::ffff:x.x.x.x)
    if (ip.startsWith('::ffff:')) {
      ip = ip.substring(7); // 移除 "::ffff:" 前缀
    }

    // 处理IPv6地址，如果是IPv6则尝试获取公网IP
    if (ip.includes(':') && !ip.includes('.')) {
      // 对于IPv6地址，我们无法直接处理，返回空让API自动检测
      return '';
    }

    console.log('🌐 获取到的客户端IP:', ip);
    return ip;
  }

  @Get('evidence/validation-info')
  async getEvidenceValidationInfo() {
    return this.gamesService.getEvidenceValidationInfo();
  }

  @Public()
  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async getGames(
    @Request() req,
    @Query('category') category?: GameCategory | 'all',
    @Query('status') status?: GameStatus | 'all',
    @Query('featured') featured?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('isTeamGame') isTeamGame?: string,
    @Query('locationFilter') locationFilter?: 'local' | 'tough',
    @Query('maxDistance') maxDistance?: string,
    @Query('minDistance') minDistance?: string,
  ) {
    const filters = {
      category,
      status,
      featured: featured === 'true',
      search,
      sortBy,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      isTeamGame: isTeamGame === 'true' ? true : isTeamGame === 'false' ? false : undefined,
      locationFilter,
      maxDistance: maxDistance ? parseInt(maxDistance) : undefined,
      minDistance: minDistance ? parseInt(minDistance) : undefined,
    };

    // 用户ID可能为null（匿名用户）
    const userId = req.user?.sub || null;
    return this.gamesService.findAll(filters, userId);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyGames(
    @Request() req,
    @Query('type') type?: 'created' | 'joined' | 'all',
  ) {
    return this.gamesService.getUserGames(req.user.sub, type);
  }

  @Public()
  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getGame(@Param('id') id: string, @Request() req) {
    // 用户ID可能为null（匿名用户）
    const userId = req.user?.sub || null;
    return this.gamesService.findById(id, userId);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  async joinGame(@Param('id') id: string, @Request() req) {
    return this.gamesService.joinGame(id, req.user.sub);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  async leaveGame(@Param('id') id: string, @Request() req) {
    return this.gamesService.leaveGame(id, req.user.sub);
  }

  // 获取证据上传签名 URL
  @Post(':id/evidence/upload-url')
  @UseGuards(JwtAuthGuard)
  async getEvidenceUploadUrl(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { contentType: string; evidenceType: 'PHOTO' | 'VIDEO' }
  ) {
    return this.gamesService.getEvidenceUploadUrl(id, req.user.sub, body.contentType, body.evidenceType);
  }

  @Post(':id/evidence')
  @UseGuards(JwtAuthGuard)
  async submitEvidence(
    @Param('id') id: string,
    @Request() req,
    @Body() submitEvidenceDto: SubmitEvidenceDto
  ) {
    return this.gamesService.submitEvidence(id, req.user.sub, submitEvidenceDto);
  }

  @Post(':id/evaluate')
  @UseGuards(JwtAuthGuard)
  async submitPeerEvaluation(
    @Param('id') id: string,
    @Request() req,
    @Body() peerEvaluationDto: PeerEvaluationDto
  ) {
    console.log('Received peer evaluation request:', {
      gameId: id,
      evaluatorId: req.user.sub,
      peerEvaluationDto,
      evaluatedUserIdType: typeof peerEvaluationDto.evaluatedUserId,
      evaluatedUserIdLength: peerEvaluationDto.evaluatedUserId?.length
    });

    return this.gamesService.submitPeerEvaluation(id, req.user.sub, peerEvaluationDto);
  }

  @Public()
  @Get(':id/participants')
  @UseGuards(OptionalJwtAuthGuard)
  async getGameParticipants(@Param('id') id: string, @Request() req) {
    // 用户ID可能为null（匿名用户）
    const userId = req.user?.sub || null;
    const participants = await this.gamesService.getGameParticipants(id, userId);

    // 添加调试信息
    console.log('Participants debug info:', participants.map(p => ({
      participantUserId: p.userId,
      userIdFromUser: p.user?.id,
      participantUserIdType: typeof p.userId,
      userIdFromUserType: typeof p.user?.id,
      participantUserIdLength: p.userId?.length,
      userIdFromUserLength: p.user?.id?.length
    })));

    return participants;
  }

  @Get(':id/my-evaluations')
  @UseGuards(JwtAuthGuard)
  async getMyEvaluations(@Param('id') id: string, @Request() req) {
    return this.gamesService.getUserEvaluations(id, req.user.sub);
  }

  @Get(':id/all-evaluations')
  @UseGuards(JwtAuthGuard)
  async getAllEvaluations(@Param('id') id: string, @Request() req) {
    return this.gamesService.getAllEvaluations(id, req.user.sub);
  }

  @Get(':id/settlement')
  @UseGuards(JwtAuthGuard)
  async getGameSettlement(@Param('id') id: string, @Request() req) {
    return this.gamesService.getGameSettlement(id);
  }

  // 举报游戏 - 放在这里避免路由冲突
  @Post(':id/report')
  @UseGuards(JwtAuthGuard)
  async reportGame(
    @Param('id') id: string,
    @Request() req,
    @Body() reportGameDto: ReportGameDto
  ) {
    return this.gamesService.reportGame(id, req.user.sub, reportGameDto);
  }

  @Get('stats/user')
  @UseGuards(JwtAuthGuard)
  async getUserGameStats(
    @Request() req,
    @Query('period') period?: string,
  ) {
    return this.gamesService.getUserGameStats(req.user.sub, period);
  }

  // 测试API：手动触发游戏状态更新
  @Post('dev/trigger-status-update')
  async triggerStatusUpdate() {
    await this.schedulerService.triggerStatusUpdate();
    return { message: 'Game status update triggered successfully' };
  }

  // 测试API：检测游戏的防刷风险
  @Get(':id/fraud-detection')
  @UseGuards(JwtAuthGuard)
  async checkGameFraud(@Param('id') gameId: string) {
    return this.gamesService.checkGameFraud(gameId);
  }

}
