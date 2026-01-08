import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  /**
   * 收藏游戏
   */
  async favoriteGame(userId: string, gameId: string) {
    // 检查游戏是否存在
    const game = await this.prisma.betGame.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new NotFoundException('游戏不存在');
    }

    // 检查是否已经收藏
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });

    if (existingFavorite) {
      throw new BadRequestException('已经收藏过该游戏');
    }

    // 创建收藏记录
    const favorite = await this.prisma.favorite.create({
      data: {
        userId,
        gameId,
      },
    });

    // 更新游戏的收藏数量
    await this.prisma.betGame.update({
      where: { id: gameId },
      data: {
        favoritesCount: {
          increment: 1,
        },
      },
    });

    return {
      message: '收藏成功',
      favorite,
    };
  }

  /**
   * 取消收藏游戏
   */
  async unfavoriteGame(userId: string, gameId: string) {
    // 检查收藏是否存在
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('未收藏该游戏');
    }

    // 删除收藏记录
    await this.prisma.favorite.delete({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });

    // 更新游戏的收藏数量
    await this.prisma.betGame.update({
      where: { id: gameId },
      data: {
        favoritesCount: {
          decrement: 1,
        },
      },
    });

    return {
      message: '取消收藏成功',
    };
  }

  /**
   * 获取用户的收藏列表
   */
  async getUserFavorites(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      this.prisma.favorite.findMany({
        where: { userId },
        include: {
          game: {
            include: {
              creator: {
                select: {
                  id: true,
                  username: true,
                  fullName: true,
                  avatar: true,
                  trustPoints: true,
                  isVip: true,
                },
              },
              participants: {
                select: {
                  id: true,
                  userId: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.favorite.count({
        where: { userId },
      }),
    ]);

    return {
      favorites: favorites.map(fav => ({
        id: fav.id,
        gameId: fav.gameId,
        createdAt: fav.createdAt,
        game: fav.game,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 检查用户是否收藏了某个游戏
   */
  async checkFavorite(userId: string, gameId: string): Promise<boolean> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });

    return !!favorite;
  }
}

