import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  @Public()
  @Get()
  async checkHealth() {
    try {
      // 检查数据库连接
      await this.prisma.$queryRaw`SELECT 1`;
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'connected',
        version: process.env.npm_package_version || '1.0.0',
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'disconnected',
        error: error.message,
      };
    }
  }

  @Public()
  @Get('test')
  async testEndpoint() {
    return {
      message: 'Test endpoint working',
      timestamp: new Date().toISOString(),
      server: 'bet-together-backend',
      version: '1.0.0'
    };
  }

  @Public()
  @Get('upload-config')
  async checkUploadConfig() {
    return this.uploadService.getConfigStatus();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin-stats')
  async getAdminStats(@Request() req) {
    // 检查管理员权限
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
      select: { isAdmin: true, adminRole: true },
    });

    if (!user?.isAdmin) {
      return { error: '需要管理员权限' };
    }

    const totalUsers = await this.prisma.user.count();
    const totalGames = await this.prisma.betGame.count();

    return {
      totalUsers,
      totalGames,
      activeUsers: totalUsers,
      pendingReports: 0,
    };
  }
}
