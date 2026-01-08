import { Module } from '@nestjs/common';
import { PointsShopController } from './points-shop.controller';
import { PointsShopService } from './points-shop.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PointsShopController],
  providers: [PointsShopService],
  exports: [PointsShopService],
})
export class PointsShopModule {}
