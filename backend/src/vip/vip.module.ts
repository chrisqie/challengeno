import { Module } from '@nestjs/common';
import { VipController } from './vip.controller';
import { VipService } from './vip.service';
import { VipPermissionsService } from './vip-permissions.service';
import { VipFeaturesService } from './vip-features.service';
import { VipAdminService } from './vip-admin.service';
import { VipDecoratorService } from './vip-decorator.service';
import { VipPermissionGuard } from './guards/vip-permission.guard';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VipController],
  providers: [
    VipService,
    VipPermissionsService,
    VipFeaturesService,
    VipAdminService,
    VipDecoratorService,
    VipPermissionGuard,
  ],
  exports: [
    VipService,
    VipPermissionsService,
    VipFeaturesService,
    VipAdminService,
    VipDecoratorService,
    VipPermissionGuard,
  ],
})
export class VipModule {}
