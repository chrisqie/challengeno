import { Controller, Get, Post, Param, Query, UseGuards, Request, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PointsShopService } from './points-shop.service';

@Controller('points-shop')
export class PointsShopController {
  constructor(private pointsShopService: PointsShopService) {}

  // 获取商城商品列表
  @Get('items')
  async getShopItems(
    @Query('category') category?: string,
    @Query('available') available?: string
  ) {
    const isAvailable = available ? available === 'true' : undefined;
    const items = await this.pointsShopService.getShopItems(category, isAvailable);
    
    return {
      success: true,
      data: {
        items,
        categories: ['VIP', 'PHYSICAL', 'VIRTUAL', 'PRIVILEGE'],
        notice: '积分商城正在完善中，兑换功能暂时关闭，敬请期待！'
      }
    };
  }

  // 获取商品详情
  @Get('items/:id')
  async getShopItem(@Param('id') id: string) {
    const item = await this.pointsShopService.getShopItem(id);
    
    if (!item) {
      return {
        success: false,
        message: '商品不存在'
      };
    }

    return {
      success: true,
      data: item
    };
  }

  // 检查用户是否可以兑换商品
  @UseGuards(JwtAuthGuard)
  @Get('items/:id/check')
  async checkRedemption(@Param('id') id: string, @Request() req) {
    const result = await this.pointsShopService.canUserRedeemItem(req.user.sub, id);
    
    return {
      success: true,
      data: result
    };
  }

  // 兑换商品
  @UseGuards(JwtAuthGuard)
  @Post('items/:id/redeem')
  async redeemItem(@Param('id') id: string, @Request() req) {
    const result = await this.pointsShopService.redeemItem(req.user.sub, id);
    
    return result;
  }

  // 获取用户兑换历史
  @UseGuards(JwtAuthGuard)
  @Get('my/history')
  async getMyRedemptionHistory(@Request() req) {
    const history = await this.pointsShopService.getUserRedemptionHistory(req.user.sub);
    
    return {
      success: true,
      data: {
        history,
        total: history.length
      }
    };
  }

  // 获取商城统计（管理员用）
  @Get('stats')
  async getShopStats() {
    const stats = await this.pointsShopService.getShopStats();
    
    return {
      success: true,
      data: stats
    };
  }

  // 获取用户积分信息
  @UseGuards(JwtAuthGuard)
  @Get('my/points')
  async getMyPoints(@Request() req) {
    // 这个功能可以复用用户服务的统计功能
    return {
      success: true,
      data: {
        message: '请使用 /users/me/stats 获取详细积分信息'
      }
    };
  }
}
