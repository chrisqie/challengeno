import { Module, forwardRef } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { UsersModule } from '../users/users.module';
import { PointsModule } from '../points/points.module';
import { VipModule } from '../vip/vip.module';
import { AchievementsModule } from '../achievements/achievements.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { EmailModule } from '../email/email.module';
import { LocationModule } from '../location/location.module';
import { UploadModule } from '../upload/upload.module';
import { FileValidationService } from '../common/file-validation.service';
import { FeaturedGamesService } from '../common/featured-games.service';
import { GameSettlementService } from './game-settlement.service';
import { AntiFraudService } from './anti-fraud.service';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => PointsModule),
    VipModule,
    forwardRef(() => AchievementsModule),
    forwardRef(() => NotificationsModule),
    EmailModule,
    LocationModule,
    UploadModule,
    forwardRef(() => import('../scheduler/scheduler.module').then(m => m.SchedulerModule)),
  ],
  providers: [GamesService, FileValidationService, FeaturedGamesService, GameSettlementService, AntiFraudService],
  controllers: [GamesController],
  exports: [GamesService, GameSettlementService, AntiFraudService],
})
export class GamesModule {}
