import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;

    if (!userId) {
      throw new ForbiddenException('未认证用户');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true, adminRole: true },
    });

    if (!user?.isAdmin) {
      throw new ForbiddenException('需要管理员权限');
    }

    // 将管理员信息添加到请求中
    request.admin = {
      role: user.adminRole,
    };

    return true;
  }
}
