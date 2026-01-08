import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamPointsService } from './team-points.service';
import { TeamAchievementsService } from './team-achievements.service';
import { TeamGameService } from './team-game.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { 
  CreateTeamDto, 
  JoinTeamDto, 
  InviteToTeamDto, 
  RespondToInviteDto,
  UpdateTeamDto,
  KickMemberDto,
  TransferLeadershipDto
} from './dto/team.dto';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(
    private teamsService: TeamsService,
    private teamPointsService: TeamPointsService,
    private teamAchievementsService: TeamAchievementsService,
    private teamGameService: TeamGameService,
  ) {}

  // 创建团队
  @Post()
  async createTeam(@Request() req, @Body(ValidationPipe) createTeamDto: CreateTeamDto) {
    return this.teamsService.createTeam(req.user.sub, createTeamDto);
  }

  // 获取用户的团队列表
  @Get('my')
  async getUserTeams(@Request() req) {
    return this.teamsService.getUserTeams(req.user.sub);
  }

  // 发现团队（公开团队）
  @Get('discover')
  async discoverTeams(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 20;
    return this.teamsService.discoverTeams(req.user.sub, pageNum, limitNum);
  }

  // 加入团队
  @Post('join')
  async joinTeam(@Request() req, @Body(ValidationPipe) joinTeamDto: JoinTeamDto) {
    return this.teamsService.joinTeam(req.user.sub, joinTeamDto);
  }

  // 邀请用户加入团队
  @Post('invite')
  async inviteToTeam(@Request() req, @Body(ValidationPipe) inviteDto: InviteToTeamDto) {
    return this.teamsService.inviteToTeam(req.user.sub, inviteDto);
  }

  // 获取团队详情
  @Get(':id')
  async getTeamById(@Param('id') id: string, @Request() req) {
    return this.teamsService.getTeamById(id, req.user.sub);
  }

  // 更新团队信息
  @Put(':id')
  async updateTeam(
    @Param('id') id: string,
    @Request() req,
    @Body(ValidationPipe) updateTeamDto: UpdateTeamDto
  ) {
    return this.teamsService.updateTeam(req.user.sub, id, updateTeamDto);
  }

  // 离开团队
  @Delete(':id/leave')
  async leaveTeam(@Param('id') id: string, @Request() req) {
    return this.teamsService.leaveTeam(req.user.sub, id);
  }

  // 踢出成员
  @Delete('kick')
  async kickMember(@Request() req, @Body(ValidationPipe) kickDto: KickMemberDto) {
    return this.teamsService.kickMember(req.user.sub, kickDto);
  }

  // 转让队长
  @Put('transfer-leadership')
  async transferLeadership(@Request() req, @Body(ValidationPipe) transferDto: TransferLeadershipDto) {
    return this.teamsService.transferLeadership(req.user.sub, transferDto);
  }

  // 解散团队
  @Delete(':id')
  async disbandTeam(@Param('id') id: string, @Request() req) {
    return this.teamsService.disbandTeam(req.user.sub, id);
  }

  // 获取团队邀请列表
  @Get(':id/invites')
  async getTeamInvites(@Param('id') id: string, @Request() req) {
    return this.teamsService.getTeamInvites(req.user.sub, id);
  }

  // 获取用户收到的团队邀请
  @Get('invites/received')
  async getReceivedInvites(@Request() req) {
    return this.teamsService.getReceivedInvites(req.user.sub);
  }

  // 响应团队邀请
  @Post('invites/respond')
  async respondToInvite(@Request() req, @Body(ValidationPipe) respondDto: RespondToInviteDto) {
    return this.teamsService.respondToInvite(req.user.sub, respondDto);
  }

  // 重新生成邀请码
  @Post(':id/regenerate-code')
  async regenerateInviteCode(@Param('id') id: string, @Request() req) {
    return this.teamsService.regenerateInviteCode(req.user.sub, id);
  }

  // 通过邀请码获取团队信息
  @Get('by-code/:code')
  async getTeamByInviteCode(@Param('code') code: string) {
    return this.teamsService.getTeamByInviteCode(code);
  }

  // 团队游戏相关API

  // 团队参与游戏
  @Post(':teamId/join-game/:gameId')
  async joinTeamGame(
    @Param('teamId') teamId: string,
    @Param('gameId') gameId: string,
    @Request() req
  ) {
    return this.teamsService.joinTeamGame(req.user.sub, teamId, gameId);
  }

  // 团队退出游戏
  @Delete(':teamId/leave-game/:gameId')
  async leaveTeamGame(
    @Param('teamId') teamId: string,
    @Param('gameId') gameId: string,
    @Request() req
  ) {
    return this.teamsService.leaveTeamGame(req.user.sub, teamId, gameId);
  }

  // 获取团队参与的游戏列表
  @Get(':teamId/games')
  async getTeamGames(@Param('teamId') teamId: string, @Request() req) {
    return this.teamsService.getTeamGames(req.user.sub, teamId);
  }

  // 获取可参与的团队游戏
  @Get(':teamId/available-games')
  async getAvailableTeamGames(@Param('teamId') teamId: string, @Request() req) {
    return this.teamsService.getAvailableTeamGames(req.user.sub, teamId);
  }

  // 获取团队统计信息
  @Get(':teamId/stats')
  async getTeamStats(@Param('teamId') teamId: string, @Request() req) {
    return this.teamsService.getTeamStats(req.user.sub, teamId);
  }

  // 获取团队积分排行榜
  @Get(':teamId/leaderboard')
  async getTeamLeaderboard(@Param('teamId') teamId: string, @Request() req) {
    return this.teamsService.getTeamLeaderboard(req.user.sub, teamId);
  }

  // 获取团队活动历史
  @Get(':teamId/activities')
  async getTeamActivities(
    @Param('teamId') teamId: string,
    @Request() req,
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? parseInt(limit) : 20;
    return this.teamsService.getTeamActivities(req.user.sub, teamId, limitNum);
  }

  // 获取团队成员贡献统计
  @Get(':teamId/member-contributions')
  async getTeamMemberContributions(@Param('teamId') teamId: string, @Request() req) {
    return this.teamsService.getTeamMemberContributions(req.user.sub, teamId);
  }

  // 团队游戏结果统计
  @Get(':teamId/game-results')
  async getTeamGameResults(
    @Param('teamId') teamId: string,
    @Request() req,
    @Query('period') period?: string
  ) {
    return this.teamsService.getTeamGameResults(req.user.sub, teamId, period);
  }

  // 团队积分相关API

  // 获取团队积分详情
  @Get(':teamId/points')
  async getTeamPoints(@Param('teamId') teamId: string, @Request() req) {
    return this.teamPointsService.calculateTeamTotalPoints(teamId);
  }

  // 获取团队成员积分贡献
  @Get(':teamId/points/contributions')
  async getTeamPointsContributions(@Param('teamId') teamId: string, @Request() req) {
    return this.teamPointsService.getTeamMemberContributions(req.user.sub, teamId);
  }

  // 获取团队活跃度
  @Get(':teamId/activity')
  async getTeamActivity(
    @Param('teamId') teamId: string,
    @Request() req,
    @Query('days') days?: string
  ) {
    const daysNum = days ? parseInt(days) : 30;
    return this.teamPointsService.calculateTeamActivity(teamId, daysNum);
  }

  // 获取团队积分排行榜
  @Get('leaderboard/points')
  async getTeamPointsLeaderboard(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 20;
    return this.teamPointsService.getTeamPointsLeaderboard(limitNum);
  }

  // 团队成就相关API

  // 获取团队成就列表
  @Get(':teamId/achievements')
  async getTeamAchievements(@Param('teamId') teamId: string, @Request() req) {
    return this.teamAchievementsService.getTeamAchievements(teamId);
  }

  // 手动检查团队成就
  @Post(':teamId/achievements/check')
  async checkTeamAchievements(@Param('teamId') teamId: string, @Request() req) {
    return this.teamAchievementsService.checkTeamAchievements(teamId);
  }

  // 增强的团队游戏API

  // 增强版团队参与游戏
  @Post(':teamId/games/:gameId/join-enhanced')
  async joinTeamGameEnhanced(
    @Param('teamId') teamId: string,
    @Param('gameId') gameId: string,
    @Request() req
  ) {
    return this.teamGameService.joinTeamGameEnhanced(req.user.sub, teamId, gameId);
  }

  // 获取团队游戏统计
  @Get(':teamId/games/stats')
  async getTeamGameStats(
    @Param('teamId') teamId: string,
    @Request() req,
    @Query('period') period?: 'WEEK' | 'MONTH' | 'ALL_TIME'
  ) {
    return this.teamGameService.getTeamGameStats(teamId, period);
  }

  // 获取推荐的团队游戏
  @Get(':teamId/games/recommended')
  async getRecommendedTeamGames(
    @Param('teamId') teamId: string,
    @Request() req,
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.teamGameService.getRecommendedTeamGames(teamId, limitNum);
  }

  // 获取团队游戏排行榜
  @Get('games/leaderboard')
  async getTeamGameLeaderboard(
    @Query('category') category?: string,
    @Query('period') period?: 'WEEK' | 'MONTH' | 'ALL_TIME'
  ) {
    return this.teamGameService.getTeamGameLeaderboard(category, period);
  }
}
