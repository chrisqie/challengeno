import { Module, forwardRef } from '@nestjs/common';
import { SocialController } from './social.controller';
import { SocialActivityService } from './social-activity.service';
import { SocialInteractionService } from './social-interaction.service';
import { SocialCommunityService } from './social-community.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => NotificationsModule),
  ],
  controllers: [SocialController],
  providers: [
    SocialActivityService,
    SocialInteractionService,
    SocialCommunityService,
  ],
  exports: [
    SocialActivityService,
    SocialInteractionService,
    SocialCommunityService,
  ],
})
export class SocialModule {}
