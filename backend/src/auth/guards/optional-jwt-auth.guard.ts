import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // 重写handleRequest，允许未认证的请求通过
  handleRequest(err: any, user: any) {
    // 如果有错误或没有用户，返回null而不是抛出异常
    if (err || !user) {
      return null;
    }
    return user;
  }

  // 重写canActivate，始终返回true
  canActivate(context: ExecutionContext) {
    // 调用父类的canActivate，但捕获任何错误
    return super.canActivate(context) as Promise<boolean> | boolean;
  }
}

