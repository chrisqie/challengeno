import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ReferralService } from '../referral/referral.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private referralService: ReferralService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password, fullName, dateOfBirth, referralCode } = registerDto;

    // 检查年龄限制
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      throw new BadRequestException('用户必须年满18岁才能注册');
    }

    // 检查用户名和邮箱是否已存在
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException('用户名已存在');
      }
      if (existingUser.email === email) {
        throw new ConflictException('邮箱已存在');
      }
    }

    // 加密密码
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        fullName,
        dateOfBirth: birthDate,
        passwordHash,
        // 根据年龄设置默认限制
        dailyGameLimit: age < 21 ? 3 : 10,
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        dateOfBirth: true,
        participationPoints: true,
        trustPoints: true,
        laborPoints: true,
        privacyMode: true,
        isVip: true,
        createdAt: true,
      },
    });

    // 处理推荐码（如果有）
    if (referralCode) {
      try {
        await this.referralService.useReferralCode(user.id, referralCode);
        console.log(`User ${user.username} used referral code: ${referralCode}`);
      } catch (error) {
        console.error('Failed to process referral code:', error);
        // 推荐码处理失败不影响注册流程
      }
    }

    // 发送欢迎邮件（异步，不阻塞注册流程）
    console.log(`Attempting to send welcome email to: ${user.email}, username: ${user.username}`);
    this.emailService.sendWelcomeEmail(user.email, user.username).then(result => {
      console.log(`Welcome email send result: ${result}`);
    }).catch(error => {
      console.error('Failed to send welcome email:', error);
    });

    // 生成JWT token
    const payload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);

    return {
      user,
      accessToken,
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // 查找用户（支持用户名或邮箱登录）
    let user: any;
    try {
      user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { username },
            { email: username },
          ],
        },
        select: {
          id: true,
          username: true,
          email: true,
          passwordHash: true,
          isAdmin: true,
          adminRole: true,
          isBanned: true,
          bannedUntil: true,
          banReason: true,
          isDeleted: true,
          deletedAt: true,
        },
      });
    } catch (error) {
      // 如果字段不存在（迁移未执行），使用基础查询
      console.warn('Ban/Delete fields not found, using basic query:', error.message);
      user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { username },
            { email: username },
          ],
        },
        select: {
          id: true,
          username: true,
          email: true,
          passwordHash: true,
          isAdmin: true,
          adminRole: true,
        },
      });
    }

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 检查用户是否已被删除（如果字段存在）
    if (user.isDeleted) {
      throw new UnauthorizedException('该账户已被删除');
    }

    // 检查用户是否被封禁（如果字段存在）
    if (user.isBanned) {
      // 检查是否是永久封禁或临时封禁未到期
      if (!user.bannedUntil || new Date() < user.bannedUntil) {
        throw new UnauthorizedException(
          `您的账户已被封禁${user.bannedUntil ? `，解封时间：${user.bannedUntil.toLocaleString('zh-CN')}` : '（永久）'}。原因：${user.banReason || '违规行为'}`,
        );
      } else {
        // 临时封禁已到期，自动解封
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            isBanned: false,
            bannedUntil: null,
            banReason: null,
          },
        });
      }
    }

    // 生成JWT token
    const payload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);

    // 返回用户信息（不包含密码）
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
    };
  }

  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username },
        ],
      },
    });

    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
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
      },
    });
  }

  calculateUserAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    
    return age;
  }

  getUserPermissionLevel(age: number): string {
    if (age < 18) return 'FORBIDDEN';
    if (age >= 18 && age < 21) return 'RESTRICTED';
    if (age >= 21) return 'FULL';
    return 'RESTRICTED';
  }

  // 请求密码重置
  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    // 查找用户
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        isDeleted: true,
        isBanned: true,
      },
    });

    // 为了安全，即使用户不存在也返回成功消息（防止邮箱枚举攻击）
    if (!user) {
      return {
        success: true,
        message: '如果该邮箱已注册，您将收到密码重置邮件',
      };
    }

    // 检查用户状态
    if (user.isDeleted) {
      throw new BadRequestException('该账户已被删除');
    }

    if (user.isBanned) {
      throw new BadRequestException('该账户已被封禁，无法重置密码');
    }

    // 生成随机令牌（32字节，转为hex字符串）
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 令牌有效期：24小时
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // 删除该用户之前未使用的重置令牌
    await this.prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        used: false,
      },
    });

    // 创建新的重置令牌
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt,
      },
    });

    // 发送重置邮件
    try {
      await this.emailService.sendPasswordResetEmail(
        user.email,
        user.username,
        resetToken,
      );
    } catch (error) {
      console.error('发送密码重置邮件失败:', error);
      throw new BadRequestException('发送邮件失败，请稍后重试');
    }

    return {
      success: true,
      message: '密码重置邮件已发送，请检查您的邮箱',
    };
  }

  // 验证重置令牌并获取用户信息
  async verifyResetToken(token: string): Promise<{ valid: boolean; username?: string; email?: string; message?: string }> {
    // 查找令牌
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            isDeleted: true,
            isBanned: true,
          }
        }
      },
    });

    if (!resetToken) {
      return {
        valid: false,
        message: '无效的重置令牌',
      };
    }

    // 检查令牌是否已使用
    if (resetToken.used) {
      return {
        valid: false,
        message: '该重置令牌已被使用',
      };
    }

    // 检查令牌是否过期
    if (new Date() > resetToken.expiresAt) {
      return {
        valid: false,
        message: '重置令牌已过期，请重新申请',
      };
    }

    // 检查用户状态
    if (resetToken.user.isDeleted) {
      return {
        valid: false,
        message: '该账户已被删除',
      };
    }

    if (resetToken.user.isBanned) {
      return {
        valid: false,
        message: '该账户已被封禁',
      };
    }

    return {
      valid: true,
      username: resetToken.user.username,
      email: resetToken.user.email,
    };
  }

  // 重置密码
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    // 查找令牌
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      throw new BadRequestException('无效的重置令牌');
    }

    // 检查令牌是否已使用
    if (resetToken.used) {
      throw new BadRequestException('该重置令牌已被使用');
    }

    // 检查令牌是否过期
    if (new Date() > resetToken.expiresAt) {
      throw new BadRequestException('重置令牌已过期，请重新申请');
    }

    // 验证新密码强度
    if (newPassword.length < 8) {
      throw new BadRequestException('新密码至少需要8个字符');
    }

    // 检查是否为纯数字
    if (/^\d+$/.test(newPassword)) {
      throw new BadRequestException('密码不能为纯数字');
    }

    // 检查是否为纯字母
    if (/^[a-zA-Z]+$/.test(newPassword)) {
      throw new BadRequestException('密码不能为纯字母');
    }

    // 检查是否为常见弱密码
    const weakPasswords = ['12345678', '87654321', 'abcdefgh', 'password', 'qwertyui'];
    if (weakPasswords.includes(newPassword.toLowerCase())) {
      throw new BadRequestException('密码过于简单，请使用更复杂的密码');
    }

    // 检查连续字符
    if (/(.)\1{3,}/.test(newPassword)) {
      throw new BadRequestException('密码不能包含4个或以上连续相同字符');
    }

    // 加密新密码
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // 更新密码并标记令牌为已使用
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash: newPasswordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    return {
      success: true,
      message: '密码重置成功，请使用新密码登录',
    };
  }
}
