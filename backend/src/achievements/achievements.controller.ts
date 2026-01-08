import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AchievementsService } from './achievements.service';
import { AchievementCategory, AchievementType, AchievementRarity } from '@prisma/client';

@Controller('achievements')
@UseGuards(JwtAuthGuard)
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  // 获取所有成就
  @Get()
  async getAllAchievements(): Promise<any> {
    return this.achievementsService.getAllAchievements();
  }

  // 获取用户成就
  @Get('user')
  async getUserAchievements(@Request() req: any): Promise<any> {
    return this.achievementsService.getUserAchievements(req.user.sub);
  }

  // 手动检查成就（用于测试）
  @Post('check')
  async checkAchievements(@Request() req: any): Promise<any> {
    await this.achievementsService.checkAndUnlockAchievements(req.user.sub);
    return { message: '成就检查完成' };
  }

  // 管理员：创建成就
  @Post('admin')
  async createAchievement(
    @Body() body: {
      name: string;
      description: string;
      icon?: string;
      category: AchievementCategory;
      type: AchievementType;
      condition: any;
      reward: any;
      rarity?: AchievementRarity;
      sortOrder?: number;
    }
  ): Promise<any> {
    return this.achievementsService.createAchievement(body);
  }

  // 管理员：更新成就
  @Put('admin/:id')
  async updateAchievement(
    @Param('id') id: string,
    @Body() body: any
  ): Promise<any> {
    return this.achievementsService.updateAchievement(id, body);
  }

  // 管理员：删除成就
  @Delete('admin/:id')
  async deleteAchievement(@Param('id') id: string): Promise<any> {
    return this.achievementsService.deleteAchievement(id);
  }

  // 管理员：获取成就统计
  @Get('admin/stats')
  async getAchievementStats(): Promise<any> {
    return this.achievementsService.getAchievementStats();
  }
}
