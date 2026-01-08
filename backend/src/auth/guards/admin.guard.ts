import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.sub) {
      throw new ForbiddenException('需要登录');
    }

    // 检查用户是否为管理员
    const userData = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: { isAdmin: true }
    });

    if (!userData?.isAdmin) {
      throw new ForbiddenException('需要管理员权限');
    }

    return true;
  }
}
