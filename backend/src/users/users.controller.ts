import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  @Get('test')
  async test() {
    return { message: 'UsersController is working!' };
  }

  // 测试头像上传功能 (公开接口，无需认证)
  @Public()
  @Get('avatar/test')
  async testAvatarUpload() {
    // 检查上传目录 - 使用项目根目录
    const uploadsDir = path.join(process.cwd(), 'uploads', 'avatars');
    const dirExists = fs.existsSync(uploadsDir);

    let files = [];
    if (dirExists) {
      try {
        files = fs.readdirSync(uploadsDir);
      } catch (error) {
        files = [`Error reading directory: ${error.message}`];
      }
    }

    return {
      success: true,
      message: '头像上传模块测试',
      timestamp: new Date().toISOString(),
      uploadDir: uploadsDir,
      dirExists,
      files: files.slice(0, 10), // 只显示前10个文件
      permissions: dirExists ? await this.checkDirectoryPermissions(uploadsDir) : null,
    };
  }

  // 检查目录权限
  private async checkDirectoryPermissions(dirPath: string) {
    const fs = require('fs');
    try {
      const stats = fs.statSync(dirPath);
      return {
        readable: fs.constants.R_OK,
        writable: fs.constants.W_OK,
        mode: stats.mode.toString(8),
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get('username/:username')
  async findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  // 获取用户资料 (兼容前端路由)
  @Get('profile/:username')
  async getProfile(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  // 兼容前端的profile路由
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getMyProfileCompat(@Request() req) {
    return this.getMyProfile(req);
  }

  // 兼容前端的profile更新路由
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfileCompat(@Request() req, @Body() updateData: any) {
    return this.updateProfile(req, updateData);
  }

  // 获取当前用户详细资料
  @UseGuards(JwtAuthGuard)
  @Get('me/profile')
  async getMyProfile(@Request() req) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        dateOfBirth: true,
        avatar: true,
        bio: true,
        location: true,
        phone: true,
        website: true,
        interests: true,
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
        createdAt: true,
        updatedAt: true,
        // 隐私设置
        showEmail: true,
        showPhone: true,
        showLocation: true,
        showBirthDate: true,
        allowFriendRequests: true,
        allowGameInvites: true,
        // 位置信息
        country: true,
        countryCode: true,
        city: true,
        // allowFriendRequests: true,
        // allowGameInvites: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  // 更新用户资料
  @UseGuards(JwtAuthGuard)
  @Put('me/profile')
  async updateProfile(@Request() req, @Body() updateData: any) {
    const userId = req.user.sub;

    // 调试日志
    console.log('🔧 用户资料更新请求:', {
      userId,
      updateData: JSON.stringify(updateData, null, 2)
    });

    // 验证数据 - 现在允许位置相关字段
    const allowedFields = [
      'email', 'fullName', 'preferredLanguage', 'bio', 'location', 'phone', 'website', 'interests',
      'showEmail', 'showPhone', 'showLocation', 'showBirthDate',
      'allowFriendRequests', 'allowGameInvites'
    ];

    const filteredData = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    // 如果要更新邮箱,检查邮箱是否已被其他用户使用
    if (filteredData['email']) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: filteredData['email'] },
        select: { id: true }
      });

      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException('该邮箱已被其他用户使用');
      }
    }

    // 调试日志
    console.log('🔍 过滤后的数据:', {
      allowedFields,
      filteredData: JSON.stringify(filteredData, null, 2)
    });

    // 特殊处理兴趣数组
    if (updateData.interests && Array.isArray(updateData.interests)) {
      filteredData['interests'] = updateData.interests;
    }

    // 特殊处理位置信息 - 将location字段解析为结构化的country和city
    if (updateData.location && typeof updateData.location === 'string') {
      const locationStr = updateData.location.trim();

      // 简单的位置解析逻辑
      const parseLocation = (location: string) => {
        // 常见的位置格式：
        // "韩国首尔" -> country: "韩国", city: "首尔", countryCode: "KR"
        // "中国北京" -> country: "中国", city: "北京", countryCode: "CN"
        // "美国纽约" -> country: "美国", city: "纽约", countryCode: "US"

        const locationMap = {
          '韩国': { country: '韩国', countryCode: 'KR' },
          '中国': { country: '中国', countryCode: 'CN' },
          '美国': { country: '美国', countryCode: 'US' },
          '日本': { country: '日本', countryCode: 'JP' },
          '英国': { country: '英国', countryCode: 'GB' },
          '法国': { country: '法国', countryCode: 'FR' },
          '德国': { country: '德国', countryCode: 'DE' },
        };

        for (const [countryName, info] of Object.entries(locationMap)) {
          if (location.includes(countryName)) {
            const city = location.replace(countryName, '').trim();
            return {
              country: info.country,
              countryCode: info.countryCode,
              city: city || null
            };
          }
        }

        // 如果无法解析，将整个字符串作为城市
        return {
          country: null,
          countryCode: null,
          city: location
        };
      };

      const parsedLocation = parseLocation(locationStr);
      filteredData['country'] = parsedLocation.country;
      filteredData['countryCode'] = parsedLocation.countryCode;
      filteredData['city'] = parsedLocation.city;

      // 调试日志
      console.log('📍 位置解析结果:', {
        原始位置: locationStr,
        解析结果: parsedLocation
      });
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: filteredData,
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          bio: true,
          location: true,
          phone: true,
          website: true,
          interests: true,
          avatar: true,
          showEmail: true,
          showPhone: true,
          showLocation: true,
          showBirthDate: true,
          allowFriendRequests: true,
          allowGameInvites: true,
          preferredLanguage: true,
          country: true,
          countryCode: true,
          city: true,
          updatedAt: true,
        },
      });

      return {
        success: true,
        message: '资料更新成功',
        user: updatedUser,
      };
    } catch (error) {
      throw new BadRequestException('更新失败，请检查输入数据');
    }
  }

  // 获取头像上传签名 URL
  @UseGuards(JwtAuthGuard)
  @Post('avatar/upload-url')
  async getAvatarUploadUrl(@Request() req, @Body() body: { contentType: string }) {
    if (!body.contentType) {
      throw new BadRequestException('请提供文件类型');
    }

    const userId = req.user.sub;

    try {
      const presignedUrl = await this.uploadService.generatePresignedUploadUrl(
        'image',
        'avatars',
        body.contentType,
        userId
      );

      return {
        success: true,
        data: presignedUrl,
      };
    } catch (error) {
      console.error('生成上传签名失败:', error);
      throw new BadRequestException(error.message || '获取上传签名失败');
    }
  }

  // 确认头像上传完成
  @UseGuards(JwtAuthGuard)
  @Post('avatar/confirm')
  async confirmAvatarUpload(@Request() req, @Body() body: { avatarUrl: string }) {
    if (!body.avatarUrl) {
      throw new BadRequestException('请提供头像URL');
    }

    const userId = req.user.sub;

    try {
      // 获取用户当前头像
      const currentUser = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true },
      });

      // 删除旧头像（如果是OSS上的文件）
      if (currentUser?.avatar && currentUser.avatar.startsWith('https://')) {
        await this.uploadService.deleteFile(currentUser.avatar);
      }

      // 更新用户头像
      await this.usersService.updateUserAvatar(userId, body.avatarUrl);

      return {
        success: true,
        message: '头像更新成功',
        avatarUrl: body.avatarUrl,
      };
    } catch (error) {
      console.error('头像更新失败:', error);
      throw new BadRequestException(error.message || '头像更新失败，请重试');
    }
  }

  // 修改密码
  @UseGuards(JwtAuthGuard)
  @Post('me/password')
  async changePassword(
    @Request() req,
    @Body() body: { currentPassword: string; newPassword: string }
  ) {
    const userId = req.user.sub;

    if (!body.currentPassword || !body.newPassword) {
      throw new BadRequestException('请提供当前密码和新密码');
    }

    // 验证新密码强度
    if (body.newPassword.length < 8) {
      throw new BadRequestException('新密码至少需要8个字符');
    }

    // 检查是否为纯数字
    if (/^\d+$/.test(body.newPassword)) {
      throw new BadRequestException('密码不能为纯数字');
    }

    // 检查是否为纯字母
    if (/^[a-zA-Z]+$/.test(body.newPassword)) {
      throw new BadRequestException('密码不能为纯字母');
    }

    // 检查是否为常见弱密码
    const weakPasswords = ['12345678', '87654321', 'abcdefgh', 'password', 'qwertyui'];
    if (weakPasswords.includes(body.newPassword.toLowerCase())) {
      throw new BadRequestException('密码过于简单，请使用更复杂的密码');
    }

    // 检查连续字符
    if (/(.)\1{3,}/.test(body.newPassword)) {
      throw new BadRequestException('密码不能包含4个或以上连续相同字符');
    }

    try {
      // 获取用户当前密码哈希
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { passwordHash: true },
      });

      if (!user) {
        throw new NotFoundException('用户不存在');
      }

      // 验证当前密码
      const bcrypt = require('bcrypt');
      const isPasswordValid = await bcrypt.compare(body.currentPassword, user.passwordHash);
      if (!isPasswordValid) {
        throw new BadRequestException('当前密码错误');
      }

      // 加密新密码
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(body.newPassword, saltRounds);

      // 更新密码
      await this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newPasswordHash },
      });

      return {
        success: true,
        message: '密码修改成功',
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('修改密码失败:', error);
      throw new BadRequestException('修改密码失败，请重试');
    }
  }

  // 获取用户统计信息
  @UseGuards(JwtAuthGuard)
  @Get('me/stats')
  async getMyStats(@Request() req) {
    const userId = req.user.sub;

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          participationPoints: true,
          trustPoints: true,
          laborPoints: true,
          totalGamesCreated: true,
          totalGamesJoined: true,
          gamesCompleted: true,
          isVip: true,
          vipExpiresAt: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new NotFoundException('用户不存在');
      }

      // 计算用户等级
      const totalGames = user.totalGamesCreated + user.totalGamesJoined;
      const userLevel = Math.floor(totalGames / 10) + 1;

      // 计算总积分（信任积分不计入可用积分）
      const totalPoints = user.participationPoints + user.laborPoints;

      return {
        success: true,
        data: {
          points: {
            participation: user.participationPoints,
            trust: user.trustPoints,
            labor: user.laborPoints,
            total: totalPoints,
          },
          games: {
            created: user.totalGamesCreated,
            joined: user.totalGamesJoined,
            completed: user.gamesCompleted,
            total: totalGames,
          },
          level: userLevel,
          vip: {
            isVip: user.isVip,
            expiresAt: user.vipExpiresAt,
          },
          memberSince: user.createdAt,
        },
      };
    } catch (error) {
      throw new BadRequestException('获取统计信息失败');
    }
  }
}
