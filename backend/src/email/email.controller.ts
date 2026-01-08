import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export class TestEmailDto {
  email: string;
  type: 'welcome' | 'friend_request' | 'game_invite' | 'game_status' | 'password_reset';
  data?: any;
}

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @UseGuards(JwtAuthGuard)
  @Post('test')
  async testEmail(@Body() testEmailDto: TestEmailDto) {
    const { email, type, data = {} } = testEmailDto;

    try {
      let result = false;

      switch (type) {
        case 'welcome':
          result = await this.emailService.sendWelcomeEmail(
            email,
            data.username || 'TestUser'
          );
          break;

        case 'friend_request':
          result = await this.emailService.sendFriendRequestEmail(
            email,
            data.recipientName || 'TestUser',
            data.senderName || 'TestSender'
          );
          break;

        case 'game_invite':
          result = await this.emailService.sendGameInviteEmail(
            email,
            data.recipientName || 'TestUser',
            data.senderName || 'TestSender',
            data.gameTitle || 'Test Challenge'
          );
          break;

        case 'game_status':
          result = await this.emailService.sendGameStatusEmail(
            email,
            data.recipientName || 'TestUser',
            data.gameTitle || 'Test Challenge',
            data.status || 'IN_PROGRESS'
          );
          break;

        case 'password_reset':
          result = await this.emailService.sendPasswordResetEmail(
            email,
            data.username || 'TestUser',
            data.resetToken || 'test-token-123'
          );
          break;

        default:
          return { success: false, message: 'Unknown email type' };
      }

      return {
        success: result,
        message: result ? 'Email sent successfully' : 'Failed to send email',
        type,
        recipient: email,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error sending email',
        error: error.message,
      };
    }
  }
}
