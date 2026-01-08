import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ShopService } from './shop.service';
import { PointType, ExchangeStatus } from '@prisma/client';

@Controller('shop')
@UseGuards(JwtAuthGuard)
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  // 获取商城商品列表
  @Get('items')
  async getShopItems(@Query('category') category?: string): Promise<any> {
    return this.shopService.getShopItems(category);
  }

  // 获取商品分类
  @Get('categories')
  async getCategories(): Promise<any> {
    return this.shopService.getCategories();
  }

  // 获取单个商品详情
  @Get('items/:id')
  async getShopItem(@Param('id') itemId: string): Promise<any> {
    return this.shopService.getShopItem(itemId);
  }

  // 兑换商品
  @Post('exchange')
  async exchangeItem(
    @Request() req: any,
    @Body() body: { itemId: string; deliveryInfo?: string }
  ): Promise<any> {
    return this.shopService.exchangeItem(req.user.sub, body.itemId, body.deliveryInfo);
  }

  // 获取用户兑换历史
  @Get('exchanges')
  async getUserExchanges(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ): Promise<any> {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 20;
    return this.shopService.getUserExchanges(req.user.sub, pageNum, limitNum);
  }

  // 获取用户积分余额
  @Get('points/balance')
  async getUserPointsBalance(@Request() req: any): Promise<any> {
    return this.shopService.getUserPointsBalance(req.user.sub);
  }

  // 管理员：添加商品
  @Post('admin/items')
  async createShopItem(
    @Body() body: {
      name: string;
      description?: string;
      image?: string;
      category: string;
      pointType: PointType;
      pointCost: number;
      stock?: number;
      sortOrder?: number;
    }
  ): Promise<any> {
    return this.shopService.createShopItem(body);
  }

  // 管理员：更新商品
  @Put('admin/items/:id')
  async updateShopItem(
    @Param('id') itemId: string,
    @Body() body: any
  ): Promise<any> {
    return this.shopService.updateShopItem(itemId, body);
  }

  // 管理员：删除商品
  @Delete('admin/items/:id')
  async deleteShopItem(@Param('id') itemId: string): Promise<any> {
    return this.shopService.deleteShopItem(itemId);
  }

  // 管理员：获取所有兑换记录
  @Get('admin/exchanges')
  async getAllExchanges(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: ExchangeStatus
  ): Promise<any> {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 20;
    return this.shopService.getAllExchanges(pageNum, limitNum, status);
  }

  // 管理员：更新兑换状态
  @Put('admin/exchanges/:id')
  async updateExchangeStatus(
    @Param('id') exchangeId: string,
    @Body() body: { status: ExchangeStatus; notes?: string }
  ): Promise<any> {
    return this.shopService.updateExchangeStatus(exchangeId, body.status, body.notes);
  }

  // 管理员：获取商城统计
  @Get('admin/stats')
  async getShopStats(): Promise<any> {
    return this.shopService.getShopStats();
  }
}
