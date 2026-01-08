import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PointType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export interface CreateShopItemDto {
  name: string;
  description?: string;
  category: string;
  pointType: PointType;
  pointCost: number;
  stock?: number;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateShopItemDto {
  name?: string;
  description?: string;
  category?: string;
  pointType?: PointType;
  pointCost?: number;
  stock?: number;
  isActive?: boolean;
  sortOrder?: number;
}

@Injectable()
export class ShopManagementService {
  constructor(private prisma: PrismaService) {}

  // 获取所有商品（包括下架的）
  async getAllShopItems(page = 1, limit = 20, category?: string, isActive?: boolean) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [items, total] = await Promise.all([
      this.prisma.shopItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { sortOrder: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          _count: {
            select: {
              exchanges: true,
            },
          },
        },
      }),
      this.prisma.shopItem.count({ where }),
    ]);

    return {
      items: items.map(item => ({
        ...item,
        exchangeCount: item._count.exchanges,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 创建商品
  async createShopItem(data: CreateShopItemDto) {
    // 验证分类 - 使用英文分类名
    const validCategories = ['VIP', 'PHYSICAL', 'VIRTUAL', 'PRIVILEGE'];
    if (!validCategories.includes(data.category)) {
      throw new BadRequestException('无效的商品分类');
    }

    // 验证积分类型
    const validPointTypes = ['PARTICIPATION', 'TRUST', 'LABOR'];
    if (!validPointTypes.includes(data.pointType)) {
      throw new BadRequestException('无效的积分类型');
    }

    // 验证积分价格
    if (data.pointCost <= 0) {
      throw new BadRequestException('积分价格必须大于0');
    }

    const item = await this.prisma.shopItem.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        pointType: data.pointType,
        pointCost: data.pointCost,
        stock: data.stock ?? -1, // 默认无限库存
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    });

    return {
      success: true,
      message: '商品创建成功',
      data: item,
    };
  }

  // 更新商品
  async updateShopItem(itemId: string, data: UpdateShopItemDto) {
    const existingItem = await this.prisma.shopItem.findUnique({
      where: { id: itemId },
    });

    if (!existingItem) {
      throw new NotFoundException('商品不存在');
    }

    // 验证分类 - 使用英文分类名
    if (data.category) {
      const validCategories = ['VIP', 'PHYSICAL', 'VIRTUAL', 'PRIVILEGE'];
      if (!validCategories.includes(data.category)) {
        throw new BadRequestException('无效的商品分类');
      }
    }

    // 验证积分类型
    if (data.pointType) {
      const validPointTypes = ['PARTICIPATION', 'TRUST', 'LABOR'];
      if (!validPointTypes.includes(data.pointType)) {
        throw new BadRequestException('无效的积分类型');
      }
    }

    // 验证积分价格
    if (data.pointCost !== undefined && data.pointCost <= 0) {
      throw new BadRequestException('积分价格必须大于0');
    }

    const updatedItem = await this.prisma.shopItem.update({
      where: { id: itemId },
      data,
    });

    return {
      success: true,
      message: '商品更新成功',
      data: updatedItem,
    };
  }

  // 删除商品
  async deleteShopItem(itemId: string) {
    const existingItem = await this.prisma.shopItem.findUnique({
      where: { id: itemId },
      include: {
        _count: {
          select: {
            exchanges: true,
          },
        },
      },
    });

    if (!existingItem) {
      throw new NotFoundException('商品不存在');
    }

    // 如果有兑换记录，只能下架不能删除
    if (existingItem._count.exchanges > 0) {
      await this.prisma.shopItem.update({
        where: { id: itemId },
        data: { isActive: false },
      });

      return {
        success: true,
        message: '商品已下架（因为存在兑换记录，无法彻底删除）',
      };
    }

    // 删除商品图片文件
    if (existingItem.image) {
      try {
        const imagePath = path.join('./uploads/shop', path.basename(existingItem.image));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (error) {
        console.error('删除商品图片失败:', error);
      }
    }

    await this.prisma.shopItem.delete({
      where: { id: itemId },
    });

    return {
      success: true,
      message: '商品删除成功',
    };
  }

  // 上传商品图片
  async uploadShopItemImage(itemId: string, filename: string) {
    const existingItem = await this.prisma.shopItem.findUnique({
      where: { id: itemId },
    });

    if (!existingItem) {
      throw new NotFoundException('商品不存在');
    }

    // 删除旧图片
    if (existingItem.image) {
      try {
        const oldImagePath = path.join('./uploads/shop', path.basename(existingItem.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      } catch (error) {
        console.error('删除旧商品图片失败:', error);
      }
    }

    // 更新商品图片路径
    const imageUrl = `/uploads/shop/${filename}`;
    const updatedItem = await this.prisma.shopItem.update({
      where: { id: itemId },
      data: { image: imageUrl },
    });

    return {
      success: true,
      message: '商品图片上传成功',
      data: {
        imageUrl,
        item: updatedItem,
      },
    };
  }

  // 批量更新商品状态
  async batchUpdateShopItems(itemIds: string[], data: { isActive?: boolean; sortOrder?: number }) {
    const result = await this.prisma.shopItem.updateMany({
      where: {
        id: {
          in: itemIds,
        },
      },
      data,
    });

    return {
      success: true,
      message: `成功更新 ${result.count} 个商品`,
      data: { updatedCount: result.count },
    };
  }

  // 获取商品统计信息
  async getShopStatistics() {
    const [
      totalItems,
      activeItems,
      totalExchanges,
      categoryStats,
      pointTypeStats,
    ] = await Promise.all([
      this.prisma.shopItem.count(),
      this.prisma.shopItem.count({ where: { isActive: true } }),
      this.prisma.shopExchange.count(),
      this.prisma.shopItem.groupBy({
        by: ['category'],
        _count: { category: true },
      }),
      this.prisma.shopItem.groupBy({
        by: ['pointType'],
        _count: { pointType: true },
        _sum: { pointCost: true },
      }),
    ]);

    return {
      success: true,
      data: {
        totalItems,
        activeItems,
        inactiveItems: totalItems - activeItems,
        totalExchanges,
        categoryStats: categoryStats.map(stat => ({
          category: stat.category,
          count: stat._count.category,
        })),
        pointTypeStats: pointTypeStats.map(stat => ({
          pointType: stat.pointType,
          count: stat._count.pointType,
          totalCost: stat._sum.pointCost || 0,
        })),
      },
    };
  }
}
