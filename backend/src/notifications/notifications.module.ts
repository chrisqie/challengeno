import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsController } from './notifications.controller';
import { NotificationSettingsController } from './notification-settings.controller';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email.service';
import { NotificationSettingsService } from './notification-settings.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [NotificationsController, NotificationSettingsController],
  providers: [NotificationsService, EmailService, NotificationSettingsService],
  exports: [NotificationsService, EmailService, NotificationSettingsService],
})
export class NotificationsModule {}
