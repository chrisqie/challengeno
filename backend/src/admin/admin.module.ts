import { Module, forwardRef } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserManagementService } from './user-management.service';
import { ContentModerationService } from './content-moderation.service';
import { AdminAnalyticsService } from './admin-analytics.service';
import { SystemConfigService } from './system-config.service';
import { ShopManagementService } from './shop-management.service';
import { AdminGuard } from './guards/admin.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { FeaturedGamesService } from '../common/featured-games.service';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => NotificationsModule),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    UserManagementService,
    ContentModerationService,
    AdminAnalyticsService,
    SystemConfigService,
    ShopManagementService,
    AdminGuard,
    FeaturedGamesService,
  ],
  exports: [
    AdminService,
    UserManagementService,
    ContentModerationService,
    AdminAnalyticsService,
    SystemConfigService,
    ShopManagementService,
    AdminGuard,
  ],
})
export class AdminModule {}
