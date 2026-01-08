import { Controller, Post, UseGuards } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('trigger')
  @UseGuards(JwtAuthGuard)
  async triggerStatusUpdate() {
    await this.schedulerService.triggerStatusUpdate();
    return { message: '游戏状态更新已触发' };
  }
}

