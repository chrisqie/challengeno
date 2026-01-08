import { Module, forwardRef } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TeamPointsService } from './team-points.service';
import { TeamAchievementsService } from './team-achievements.service';
import { TeamGameService } from './team-game.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PointsModule } from '../points/points.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => PointsModule),
  ],
  controllers: [TeamsController],
  providers: [TeamsService, TeamPointsService, TeamAchievementsService, TeamGameService],
  exports: [TeamsService, TeamPointsService, TeamAchievementsService, TeamGameService],
})
export class TeamsModule {}
