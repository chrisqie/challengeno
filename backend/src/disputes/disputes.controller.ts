import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request, UseGuards, ParseEnumPipe } from '@nestjs/common';
import { DisputesService, CreateDisputeDto, ResolveDisputeDto, AddDisputeEvidenceDto } from './disputes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../admin/guards/admin.guard';
import { DisputeStatus, DisputePriority } from '@prisma/client';

@Controller('disputes')
@UseGuards(JwtAuthGuard)
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  // 创建争议
  @Post()
  async createDispute(@Request() req, @Body() createDisputeDto: CreateDisputeDto) {
    return this.disputesService.createDispute(req.user.sub, createDisputeDto);
  }

  // 获取用户的争议列表
  @Get()
  async getDisputes(
    @Request() req,
    @Query('status') status?: DisputeStatus,
    @Query('gameId') gameId?: string,
    @Query('type') type?: 'initiated' | 'targeted' | 'all'
  ) {
    return this.disputesService.getDisputes(req.user.sub, {
      status,
      gameId,
      type: type || 'all'
    });
  }

  // 获取争议详情
  @Get(':id')
  async getDisputeById(@Param('id') id: string, @Request() req) {
    return this.disputesService.getDisputeById(id, req.user.sub);
  }

  // 添加争议证据
  @Post(':id/evidence')
  async addDisputeEvidence(
    @Param('id') id: string,
    @Request() req,
    @Body() evidenceDto: AddDisputeEvidenceDto
  ) {
    return this.disputesService.addDisputeEvidence(id, req.user.sub, evidenceDto);
  }

  // 取消争议
  @Delete(':id')
  async cancelDispute(@Param('id') id: string, @Request() req) {
    return this.disputesService.cancelDispute(id, req.user.sub);
  }

  // 管理员接口 - 获取所有争议
  @Get('admin/list')
  @UseGuards(AdminGuard)
  async getAdminDisputes(
    @Query('status') status?: DisputeStatus,
    @Query('priority') priority?: DisputePriority,
    @Query('handlerId') handlerId?: string
  ) {
    return this.disputesService.getAdminDisputes({
      status,
      priority,
      handlerId
    });
  }

  // 管理员接口 - 分配争议
  @Put('admin/:id/assign')
  @UseGuards(AdminGuard)
  async assignDispute(@Param('id') id: string, @Request() req) {
    return this.disputesService.assignDispute(id, req.user.sub);
  }

  // 管理员接口 - 解决争议
  @Put('admin/:id/resolve')
  @UseGuards(AdminGuard)
  async resolveDispute(
    @Param('id') id: string,
    @Request() req,
    @Body() resolveDto: ResolveDisputeDto
  ) {
    return this.disputesService.resolveDispute(id, req.user.sub, resolveDto);
  }
}
