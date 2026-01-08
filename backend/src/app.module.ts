import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { TemplatesModule } from './templates/templates.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { PointsModule } from './points/points.module';
import { FriendsModule } from './friends/friends.module';
import { FavoritesModule } from './favorites/favorites.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HealthModule } from './health/health.module';
import { VipModule } from './vip/vip.module';
import { AdminModule } from './admin/admin.module';
import { ShopModule } from './shop/shop.module';
import { AchievementsModule } from './achievements/achievements.module';
import { DisputesModule } from './disputes/disputes.module';
import { TeamsModule } from './teams/teams.module';
import { MessagesModule } from './messages/messages.module';
import { SocialModule } from './social/social.module';
import { PointsShopModule } from './points-shop/points-shop.module';
import { EmailModule } from './email/email.module';
import { ReferralModule } from './referral/referral.module';
import { LocationModule } from './location/location.module';
import { FeedbackModule } from './feedback/feedback.module';
import { TestModule } from './test/test.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    }]),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    GamesModule,
    TemplatesModule,
    SchedulerModule,
    PointsModule,
    FriendsModule,
    FavoritesModule,
    MessagesModule,
    NotificationsModule,
    HealthModule,
    VipModule,
    AdminModule,
    ShopModule,
    AchievementsModule,
    DisputesModule,
    TeamsModule,
    SocialModule,
    PointsShopModule,
    EmailModule,
    ReferralModule,
    LocationModule,
    FeedbackModule,
    TestModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
