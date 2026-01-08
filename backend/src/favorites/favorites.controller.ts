import { Controller, Get, Post, Delete, Param, Query, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  /**
   * 收藏游戏
   * POST /api/favorites/:gameId
   */
  @Post(':gameId')
  async favoriteGame(@Request() req, @Param('gameId') gameId: string) {
    return this.favoritesService.favoriteGame(req.user.sub, gameId);
  }

  /**
   * 取消收藏游戏
   * DELETE /api/favorites/:gameId
   */
  @Delete(':gameId')
  async unfavoriteGame(@Request() req, @Param('gameId') gameId: string) {
    return this.favoritesService.unfavoriteGame(req.user.sub, gameId);
  }

  /**
   * 获取我的收藏列表
   * GET /api/favorites/my
   */
  @Get('my')
  async getMyFavorites(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 20;
    return this.favoritesService.getUserFavorites(req.user.sub, pageNum, limitNum);
  }

  /**
   * 检查是否收藏了某个游戏
   * GET /api/favorites/check/:gameId
   */
  @Get('check/:gameId')
  async checkFavorite(@Request() req, @Param('gameId') gameId: string) {
    const isFavorited = await this.favoritesService.checkFavorite(req.user.sub, gameId);
    return { isFavorited };
  }
}

