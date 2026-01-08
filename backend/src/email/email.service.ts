import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;
  private fromEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not found, email service disabled');
      return;
    }

    const domain = this.configService.get<string>('EMAIL_FROM_DOMAIN') || 'yesfreedom.news';
    const fromName = this.configService.get<string>('EMAIL_FROM_NAME') || 'BetTogether';
    this.fromEmail = `${fromName} <noreply@${domain}>`;

    this.resend = new Resend(apiKey);
    this.logger.log(`Email service initialized with Resend, from: ${this.fromEmail}`);
  }

  async sendEmail(template: EmailTemplate): Promise<boolean> {
    if (!this.resend) {
      this.logger.warn('Email service not initialized, skipping email send');
      return false;
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: template.to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        this.logger.error('Failed to send email:', error);
        return false;
      }

      this.logger.log(`Email sent successfully to ${template.to}, ID: ${data?.id}`);
      return true;
    } catch (error) {
      this.logger.error('Email sending error:', error);
      return false;
    }
  }

  // 发送欢迎邮件
  async sendWelcomeEmail(email: string, username: string): Promise<boolean> {
    const template: EmailTemplate = {
      to: email,
      subject: '欢迎加入 ChallengeNo！',
      html: this.getWelcomeEmailTemplate(username),
      text: `欢迎加入 ChallengeNo，${username}！开始你的挑战之旅吧！`,
    };

    return this.sendEmail(template);
  }

  // 发送好友申请邮件
  async sendFriendRequestEmail(
    recipientEmail: string,
    recipientName: string,
    senderName: string,
  ): Promise<boolean> {
    const template: EmailTemplate = {
      to: recipientEmail,
      subject: `${senderName} 想要添加你为好友`,
      html: this.getFriendRequestEmailTemplate(recipientName, senderName),
      text: `${recipientName}，${senderName} 想要添加你为好友。登录 ChallengeNo 查看详情。`,
    };

    return this.sendEmail(template);
  }

  // 发送游戏邀请邮件
  async sendGameInviteEmail(
    recipientEmail: string,
    recipientName: string,
    senderName: string,
    gameTitle: string,
  ): Promise<boolean> {
    const template: EmailTemplate = {
      to: recipientEmail,
      subject: `${senderName} 邀请你参加挑战：${gameTitle}`,
      html: this.getGameInviteEmailTemplate(recipientName, senderName, gameTitle),
      text: `${recipientName}，${senderName} 邀请你参加挑战"${gameTitle}"。登录 BetTogether 查看详情。`,
    };

    return this.sendEmail(template);
  }

  // 发送游戏状态变更邮件
  async sendGameStatusEmail(
    recipientEmail: string,
    recipientName: string,
    gameTitle: string,
    status: string,
  ): Promise<boolean> {
    const statusText = this.getStatusText(status);
    const template: EmailTemplate = {
      to: recipientEmail,
      subject: `挑战"${gameTitle}"状态更新`,
      html: this.getGameStatusEmailTemplate(recipientName, gameTitle, statusText),
      text: `${recipientName}，你参与的挑战"${gameTitle}"状态已更新为：${statusText}。`,
    };

    return this.sendEmail(template);
  }

  // 发送密码重置邮件
  async sendPasswordResetEmail(
    email: string,
    username: string,
    resetToken: string,
  ): Promise<boolean> {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    const template: EmailTemplate = {
      to: email,
      subject: 'ChallengeNo 密码重置',
      html: this.getPasswordResetEmailTemplate(username, resetUrl),
      text: `${username}，点击以下链接重置密码：${resetUrl}`,
    };

    return this.sendEmail(template);
  }

  // 获取状态文本
  private getStatusText(status: string): string {
    const statusMap = {
      OPEN: '开放报名',
      IN_PROGRESS: '进行中',
      EVIDENCE_SUBMISSION: '证据提交期',
      PEER_REVIEW: '互评期',
      COMPLETED: '已完成',
      CANCELLED: '已取消',
      DISPUTED: '争议中',
    };
    return statusMap[status] || status;
  }

  // 欢迎邮件模板
  private getWelcomeEmailTemplate(username: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 欢迎加入 ChallengeNo！</h1>
          </div>
          <div class="content">
            <h2>你好，${username}！</h2>
            <p>欢迎来到 ChallengeNo - 一个通过友好挑战帮助你建立健康习惯的社交平台！</p>

            <h3>🚀 开始你的挑战之旅：</h3>
            <ul>
              <li>📝 创建你的第一个挑战</li>
              <li>👥 邀请朋友一起参与</li>
              <li>🏆 完成挑战获得积分奖励</li>
              <li>📈 追踪你的成长进度</li>
            </ul>

            <p>准备好开始了吗？</p>
            <a href="${this.configService.get('FRONTEND_URL')}" class="button">立即开始挑战</a>

            <p>如果你有任何问题，随时联系我们的支持团队。</p>
            <p>祝你挑战愉快！</p>
            <p><strong>ChallengeNo 团队</strong></p>
          </div>
          <div class="footer">
            <p>这是一封自动发送的邮件，请勿回复。</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // 好友申请邮件模板
  private getFriendRequestEmailTemplate(recipientName: string, senderName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>👥 新的好友申请</h1>
          </div>
          <div class="content">
            <h2>你好，${recipientName}！</h2>
            <p><strong>${senderName}</strong> 想要添加你为好友！</p>
            
            <p>添加好友后，你们可以：</p>
            <ul>
              <li>🎯 互相邀请参加挑战</li>
              <li>💬 私信聊天交流</li>
              <li>📊 查看彼此的挑战进度</li>
              <li>🏆 一起完成团队挑战</li>
            </ul>
            
            <a href="${this.configService.get('FRONTEND_URL')}/friends" class="button">查看好友申请</a>
            
            <p>快去看看吧！</p>
            <p><strong>BetTogether 团队</strong></p>
          </div>
          <div class="footer">
            <p>这是一封自动发送的邮件，请勿回复。</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // 游戏邀请邮件模板
  private getGameInviteEmailTemplate(recipientName: string, senderName: string, gameTitle: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .game-title { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #2196f3; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 挑战邀请</h1>
          </div>
          <div class="content">
            <h2>你好，${recipientName}！</h2>
            <p><strong>${senderName}</strong> 邀请你参加一个新的挑战：</p>
            
            <div class="game-title">
              <h3>📋 ${gameTitle}</h3>
            </div>
            
            <p>这是一个很棒的机会来：</p>
            <ul>
              <li>🎯 挑战自己，建立新习惯</li>
              <li>👥 与朋友一起成长</li>
              <li>🏆 获得积分奖励</li>
              <li>📈 追踪进步过程</li>
            </ul>
            
            <a href="${this.configService.get('FRONTEND_URL')}/games" class="button">查看挑战详情</a>
            
            <p>不要错过这个精彩的挑战！</p>
            <p><strong>BetTogether 团队</strong></p>
          </div>
          <div class="footer">
            <p>这是一封自动发送的邮件，请勿回复。</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // 游戏状态邮件模板
  private getGameStatusEmailTemplate(recipientName: string, gameTitle: string, statusText: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .status-update { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #4caf50; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📢 挑战状态更新</h1>
          </div>
          <div class="content">
            <h2>你好，${recipientName}！</h2>
            <p>你参与的挑战有新的状态更新：</p>
            
            <h3>📋 ${gameTitle}</h3>
            
            <div class="status-update">
              <h4>🔄 状态更新：${statusText}</h4>
            </div>
            
            <p>请及时查看挑战详情，了解下一步需要做什么。</p>
            
            <a href="${this.configService.get('FRONTEND_URL')}/my-games" class="button">查看我的挑战</a>
            
            <p>继续加油！</p>
            <p><strong>BetTogether 团队</strong></p>
          </div>
          <div class="footer">
            <p>这是一封自动发送的邮件，请勿回复。</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // 密码重置邮件模板
  private getPasswordResetEmailTemplate(username: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #f44336; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107; }
          .user-info { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #2196f3; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 密码重置</h1>
          </div>
          <div class="content">
            <h2>你好，${username}！</h2>
            <p>我们收到了你的密码重置请求。</p>

            <div class="user-info">
              <p><strong>👤 用户ID：</strong>${username}</p>
              <p style="margin: 0;"><strong>📧 邮箱：</strong>已验证</p>
            </div>

            <div class="warning">
              <p><strong>⚠️ 安全提醒：</strong>如果这不是你的操作，请忽略此邮件。</p>
            </div>

            <p>点击下面的按钮重置你的密码：</p>

            <a href="${resetUrl}" class="button">重置密码</a>

            <p>此链接将在24小时后失效。</p>

            <p>如果按钮无法点击，请复制以下链接到浏览器：</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">${resetUrl}</p>

            <p><strong>ChallengeNo 团队</strong></p>
          </div>
          <div class="footer">
            <p>这是一封自动发送的邮件，请勿回复。</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
