import { Controller, Get, Post, Param, Query, UseGuards, Request } from '@nestjs/common';
import { TemplatesService, TemplateFilters } from './templates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GameCategory, VipTier, DifficultyLevel, RiskLevel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('templates')
export class TemplatesController {
  constructor(
    private templatesService: TemplatesService,
    private prisma: PrismaService
  ) {}

  @Public()
  @Get()
  async getTemplates(
    @Query('category') category?: GameCategory,
    @Query('subcategory') subcategory?: string,
    @Query('difficultyLevel') difficultyLevel?: DifficultyLevel,
    @Query('riskLevel') riskLevel?: RiskLevel,
    @Query('isQuickStart') isQuickStart?: string,
    @Query('isVipOnly') isVipOnly?: string,
    @Query('vipTier') vipTier?: VipTier,
    @Query('search') search?: string,
    @Query('language') language?: string, // Language parameter: 'en', 'es', 'ja'
    @Request() req?: any
  ) {
    console.log('🔍 Templates API called');
    console.log('Request user:', req?.user);
    console.log('Authorization header:', req?.headers?.authorization);

    // 获取用户VIP状态 - 支持可选认证
    let userVipTier = null;
    let user = null;

    // 尝试从Authorization头获取token
    const authHeader = req?.headers?.authorization;
    console.log('Raw auth header:', authHeader);

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        console.log('Extracted token:', token ? token.substring(0, 20) + '...' : 'empty');

        // 这里需要手动验证JWT token
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded:', decoded);

        if (decoded.sub) {
          user = await this.prisma.user.findUnique({
            where: { id: decoded.sub },
            select: {
              id: true,
              username: true,
              isVip: true,
              vipExpiresAt: true,
              isAdmin: true
            }
          });

          console.log('User data:', user);

          // 管理员自动获得最高等级VIP权限
          if (user?.isAdmin) {
            userVipTier = VipTier.ELITE;
            console.log('Admin user detected, VIP tier set to ELITE');
          } else if (user?.isVip && (!user.vipExpiresAt || user.vipExpiresAt > new Date())) {
            // 普通用户检查VIP是否有效，从订阅表获取具体等级
            const vipSubscription = await this.prisma.vipSubscription.findFirst({
              where: {
                userId: user.id,
                isActive: true,
                endDate: {
                  gt: new Date()
                }
              },
              orderBy: {
                createdAt: 'desc'
              }
            });

            if (vipSubscription) {
              userVipTier = vipSubscription.tier as VipTier;
              console.log(`VIP user detected, tier from subscription: ${userVipTier}`);
            } else {
              // 如果没有找到有效订阅，默认为BASIC
              userVipTier = VipTier.BASIC;
              console.log('VIP user detected, but no active subscription found, defaulting to BASIC');
            }
          } else {
            console.log('User is not VIP or VIP expired');
          }
        }
      } catch (error) {
        console.log('Token verification failed:', error.message);
      }
    } else {
      console.log('No authorization header found');
    }

    console.log('Final VIP tier:', userVipTier);

    // 处理搜索
    if (search) {
      return this.templatesService.searchTemplates(search, userVipTier);
    }

    // 构建过滤器
    const filters: TemplateFilters = {
      ...(category && { category }),
      ...(subcategory && { subcategory }),
      ...(difficultyLevel && { difficultyLevel }),
      ...(riskLevel && { riskLevel }),
      ...(isQuickStart !== undefined && { isQuickStart: isQuickStart === 'true' }),
      ...(isVipOnly !== undefined && { isVipOnly: isVipOnly === 'true' }),
      ...(vipTier && { vipTier }),
      ...(language && { language }) // Add language filter
    };

    // 如果有分类过滤，使用分类查询
    if (category) {
      return this.templatesService.findByCategory(category, subcategory, userVipTier);
    }

    const templates = await this.templatesService.findAll(userVipTier, filters);
    console.log(`Returning ${templates.length} templates`);

    const vipCount = templates.filter(t => t.isVipOnly).length;
    const freeCount = templates.filter(t => !t.isVipOnly).length;
    console.log(`VIP templates: ${vipCount}, Free templates: ${freeCount}`);

    return templates;
  }

  // 获取快速开始模板
  @Public()
  @Get('quick-start/list')
  async getQuickStartTemplates(@Request() req?: any) {
    // 获取用户VIP状态 (复用上面的逻辑)
    let userVipTier = null;
    const authHeader = req?.headers?.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.sub) {
          const user = await this.prisma.user.findUnique({
            where: { id: decoded.sub },
            select: { id: true, isVip: true, vipExpiresAt: true, isAdmin: true }
          });

          if (user?.isAdmin) {
            userVipTier = VipTier.ELITE;
          } else if (user?.isVip && (!user.vipExpiresAt || user.vipExpiresAt > new Date())) {
            const vipSubscription = await this.prisma.vipSubscription.findFirst({
              where: { userId: user.id, isActive: true, endDate: { gt: new Date() } },
              orderBy: { createdAt: 'desc' }
            });
            userVipTier = vipSubscription?.tier as VipTier || VipTier.BASIC;
          }
        }
      } catch (error) {
        console.log('Token verification failed:', error.message);
      }
    }

    return this.templatesService.getQuickStartTemplates(userVipTier);
  }

  // 获取分类统计
  @Public()
  @Get('stats/categories')
  async getCategoryStats(@Request() req?: any) {
    // 获取用户VIP状态 (简化版)
    let userVipTier = null;
    // ... 可以复用上面的VIP检查逻辑，这里简化处理

    return this.templatesService.getCategoryStats(userVipTier);
  }

  // 搜索模板
  @Public()
  @Get('search/:query')
  async searchTemplates(@Param('query') query: string, @Request() req?: any) {
    // 获取用户VIP状态 (简化版)
    let userVipTier = null;
    // ... 可以复用上面的VIP检查逻辑

    return this.templatesService.searchTemplates(query, userVipTier);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getTemplate(@Param('id') id: string) {
    return this.templatesService.findById(id);
  }

  // 开发环境用：强制重新初始化模板
  @Public()
  @Post('dev/reinitialize')
  async forceReinitialize() {
    const result = await this.templatesService.forceReinitializeTemplates();
    return {
      message: '模板重新初始化完成',
      ...result
    };
  }

  // 修复模板：如果没有模板则创建
  @Public()
  @Post('dev/fix-templates')
  async fixTemplates() {
    const count = await this.prisma.gameTemplate.count();
    if (count === 0) {
      await this.templatesService.forceReinitializeTemplates();
      const newCount = await this.templatesService.getTemplateCount();
      return { message: '模板已修复并重新创建', count: newCount };
    } else {
      return { message: `当前已有 ${count} 个模板，无需修复`, count };
    }
  }

  // 获取模板数量
  @Public()
  @Get('count')
  async getCount() {
    const count = await this.templatesService.getTemplateCount();
    return { count };
  }

  // 测试公开API - 不需要认证
  @Public()
  @Get('test-public')
  async testPublic() {
    return { message: 'Public API works!', timestamp: new Date().toISOString() };
  }

  // 诊断模板问题 - 公开API，不需要认证
  @Public()
  @Get('diagnose')
  async diagnoseTemplates() {
    try {
      console.log('🔍 开始诊断模板...');

      // 直接查询数据库，避免复杂的业务逻辑
      const count = await this.prisma.gameTemplate.count();
      console.log(`📊 模板数量: ${count}`);

      let sampleTemplates = [];
      if (count > 0) {
        // 获取前3个模板作为示例
        const templates = await this.prisma.gameTemplate.findMany({
          take: 3,
          select: {
            id: true,
            name: true,
            title: true,
            category: true,
            isActive: true
          }
        });
        sampleTemplates = templates;
        console.log(`📋 获取到示例模板:`, templates);
      }

      const result = {
        success: true,
        templateCount: count,
        hasTemplates: count > 0,
        sampleTemplates,
        message: count > 0 ? `发现 ${count} 个模板` : '没有找到模板，需要初始化'
      };

      console.log('✅ 诊断完成:', result);
      return result;
    } catch (error) {
      console.error('❌ 诊断失败:', error);
      console.error('错误堆栈:', error.stack);
      return {
        success: false,
        error: error.message,
        message: '模板诊断失败: ' + error.message
      };
    }
  }

  // 快速修复模板问题 - 公开API，不需要认证
  @Public()
  @Post('quick-fix')
  async quickFixTemplates() {
    try {
      console.log('🔧 开始快速修复模板...');
      const count = await this.templatesService.getTemplateCount();
      console.log(`📊 当前模板数量: ${count}`);

      if (count === 0) {
        console.log('🔧 检测到模板为空，开始快速修复...');
        const result = await this.templatesService.forceReinitializeTemplates();
        const newCount = await this.templatesService.getTemplateCount();

        console.log(`✅ 修复完成，创建了 ${newCount} 个模板`);
        return {
          success: true,
          message: `模板修复完成，创建了 ${newCount} 个模板`,
          beforeCount: count,
          afterCount: newCount,
          details: result
        };
      } else {
        console.log('✅ 模板正常，无需修复');
        return {
          success: true,
          message: `模板正常，当前有 ${count} 个模板`,
          count
        };
      }
    } catch (error) {
      console.error('❌ 修复失败:', error);
      return {
        success: false,
        error: error.message,
        message: '模板修复失败: ' + error.message
      };
    }
  }
}
