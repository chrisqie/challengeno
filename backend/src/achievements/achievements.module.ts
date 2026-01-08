import { Module, forwardRef } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { PointsModule } from '../points/points.module';

@Module({
  imports: [forwardRef(() => PointsModule)],
  providers: [AchievementsService],
  controllers: [AchievementsController],
  exports: [AchievementsService],
})
export class AchievementsModule {}
