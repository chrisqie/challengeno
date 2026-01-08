import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // 检查用户是否存在和是否被封禁/删除
    let user: any;
    try {
      user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          username: true,
          isBanned: true,
          bannedUntil: true,
          banReason: true,
          isDeleted: true,
        },
      });
    } catch (error) {
      // 如果字段不存在（迁移未执行），使用基础查询
      console.warn('Ban/Delete fields not found in JWT validation, using basic query:', error.message);
      user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          username: true,
        },
      });
    }

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    // 检查用户是否已被删除（如果字段存在）
    if (user.isDeleted) {
      throw new UnauthorizedException('该账户已被删除');
    }

    // 检查是否被封禁（如果字段存在）
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

    return { sub: payload.sub, username: payload.username };
  }
}
