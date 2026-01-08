import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService
  ) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    try {
      // 强制从数据库获取完整用户信息，使用select避免查询不存在的字段
      const user = await this.prisma.user.findUnique({
        where: { id: req.user.sub },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          avatar: true,
          dateOfBirth: true,
          participationPoints: true,
          trustPoints: true,
          laborPoints: true,
          totalGamesCreated: true,
          totalGamesJoined: true,
          gamesCompleted: true,
          privacyMode: true,
          dailyGameLimit: true,
          preferredLanguage: true,
          isVip: true,
          vipExpiresAt: true,
          isAdmin: true,
          adminRole: true,
          adminCreatedAt: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      if (!user) {
        return { error: 'User not found' };
      }

      // 强制返回管理员字段
      const result = {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        dateOfBirth: user.dateOfBirth,
        participationPoints: user.participationPoints,
        trustPoints: user.trustPoints,
        laborPoints: user.laborPoints,
        totalGamesCreated: user.totalGamesCreated,
        totalGamesJoined: user.totalGamesJoined,
        gamesCompleted: user.gamesCompleted,
        privacyMode: user.privacyMode,
        dailyGameLimit: user.dailyGameLimit,
        preferredLanguage: user.preferredLanguage,
        isVip: user.isVip,
        vipExpiresAt: user.vipExpiresAt,
        isAdmin: user.isAdmin || false,
        adminRole: user.adminRole || null,
        adminCreatedAt: user.adminCreatedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      console.log('Profile API returning:', {
        isAdmin: result.isAdmin,
        adminRole: result.adminRole
      });

      return result;
    } catch (error) {
      console.error('Profile API error:', error);
      return { error: 'Database error' };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Request() req) {
    const user = await this.authService.getUserById(req.user.sub);
    if (!user) {
      return null;
    }

    // 计算用户年龄和权限等级
    const age = this.authService.calculateUserAge(user.dateOfBirth);
    const permissionLevel = this.authService.getUserPermissionLevel(age);

    return {
      ...user,
      age,
      permissionLevel,
    };
  }

  // 请求密码重置
  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.requestPasswordReset(forgotPasswordDto.email);
  }

  // 验证重置令牌
  @Public()
  @Post('verify-reset-token')
  async verifyResetToken(@Body() body: { token: string }) {
    return this.authService.verifyResetToken(body.token);
  }

  // 重置密码
  @Public()
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
}
