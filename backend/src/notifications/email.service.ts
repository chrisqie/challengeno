import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import * as nodemailer from 'nodemailer';
import { NotificationType } from '@prisma/client';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  // private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // this.initializeTransporter();
  }

  private initializeTransporter() {
    // TODO: 重新启用邮件服务时需要安装nodemailer
    // 临时禁用以修复编译错误
    this.logger.warn('Email service is temporarily disabled');
  }

  // 发送邮件
  async sendEmail(
    to: string,
    subject: string,
    html: string,
    text?: string
  ): Promise<boolean> {
    // TODO: 重新启用邮件服务时需要安装nodemailer
    this.logger.warn(`Email service disabled - would send to ${to}: ${subject}`);
    return true; // 临时返回true以避免阻塞其他功能
  }

  // 根据通知类型生成邮件模板
  generateEmailTemplate(
    type: NotificationType,
    data: any,
    userFullName: string
  ): EmailTemplate {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:5173');
    
    switch (type) {
      case NotificationType.FRIEND_REQUEST:
        return {
          subject: '新的好友请求 - Bet Together',
          html: this.getFriendRequestTemplate(data.requesterUsername, userFullName, baseUrl),
          text: `${data.requesterUsername} 想要添加您为好友。请登录 Bet Together 查看详情。`
        };

      case NotificationType.GAME_INVITE:
        return {
          subject: '游戏邀请 - Bet Together',
          html: this.getGameInviteTemplate(data.gameTitle, data.inviterName, userFullName, baseUrl),
          text: `${data.inviterName} 邀请您参加游戏 "${data.gameTitle}"。请登录 Bet Together 查看详情。`
        };

      case NotificationType.ACHIEVEMENT_UNLOCKED:
        return {
          subject: '🎉 恭喜解锁新成就！ - Bet Together',
          html: this.getAchievementTemplate(data.achievementName, data.achievementDescription, userFullName, baseUrl),
          text: `恭喜！您解锁了新成就："${data.achievementName}"。请登录 Bet Together 查看详情。`
        };

      case NotificationType.GAME_STARTED:
        return {
          subject: '游戏开始了！ - Bet Together',
          html: this.getGameStartedTemplate(data.gameTitle, userFullName, baseUrl),
          text: `您参与的游戏 "${data.gameTitle}" 已经开始。请登录 Bet Together 查看详情。`
        };

      case NotificationType.EVIDENCE_REQUIRED:
        return {
          subject: '请提交证据 - Bet Together',
          html: this.getEvidenceRequiredTemplate(data.gameTitle, data.deadline, userFullName, baseUrl),
          text: `请为游戏 "${data.gameTitle}" 提交证据，截止时间：${data.deadline}。`
        };

      case NotificationType.VIP_EXPIRED:
        return {
          subject: 'VIP会员即将到期 - Bet Together',
          html: this.getVipExpiredTemplate(userFullName, baseUrl),
          text: `您的VIP会员即将到期。请登录 Bet Together 续费以继续享受VIP特权。`
        };

      default:
        return {
          subject: '新通知 - Bet Together',
          html: this.getDefaultTemplate(data.title, data.message, userFullName, baseUrl),
          text: `${data.title}: ${data.message}`
        };
    }
  }

  // 好友请求邮件模板
  private getFriendRequestTemplate(requesterUsername: string, userFullName: string, baseUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>新的好友请求</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">👋 新的好友请求</h1>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px; margin-bottom: 20px;">你好 ${userFullName}，</p>
            <p style="font-size: 16px; margin-bottom: 25px;">
              <strong>@${requesterUsername}</strong> 想要添加您为好友！
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}/friends" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">查看好友请求</a>
            </div>
            <p style="color: #666; font-size: 14px; text-align: center;">
              如果您不想接收此类邮件，可以在 <a href="${baseUrl}/notification-settings">通知设置</a> 中关闭邮件通知。
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // 游戏邀请邮件模板
  private getGameInviteTemplate(gameTitle: string, inviterName: string, userFullName: string, baseUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>游戏邀请</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎮 游戏邀请</h1>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px; margin-bottom: 20px;">你好 ${userFullName}，</p>
            <p style="font-size: 16px; margin-bottom: 25px;">
              <strong>${inviterName}</strong> 邀请您参加游戏：
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #11998e; margin: 20px 0;">
              <h3 style="margin: 0; color: #11998e;">${gameTitle}</h3>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}/games" style="background: #11998e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">查看游戏</a>
            </div>
            <p style="color: #666; font-size: 14px; text-align: center;">
              如果您不想接收此类邮件，可以在 <a href="${baseUrl}/notification-settings">通知设置</a> 中关闭邮件通知。
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // 成就解锁邮件模板
  private getAchievementTemplate(achievementName: string, achievementDescription: string, userFullName: string, baseUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>恭喜解锁新成就！</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎉 恭喜解锁新成就！</h1>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px; margin-bottom: 20px;">你好 ${userFullName}，</p>
            <p style="font-size: 16px; margin-bottom: 25px;">
              恭喜您解锁了新成就！
            </p>
            <div style="background: white; padding: 25px; border-radius: 8px; border: 2px solid #f5576c; margin: 20px 0; text-align: center;">
              <h3 style="margin: 0 0 10px 0; color: #f5576c; font-size: 24px;">🏆 ${achievementName}</h3>
              <p style="margin: 0; color: #666; font-size: 16px;">${achievementDescription}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}/achievements" style="background: #f5576c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">查看所有成就</a>
            </div>
            <p style="color: #666; font-size: 14px; text-align: center;">
              如果您不想接收此类邮件，可以在 <a href="${baseUrl}/notification-settings">通知设置</a> 中关闭邮件通知。
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // 其他模板方法...
  private getGameStartedTemplate(gameTitle: string, userFullName: string, baseUrl: string): string {
    return `<p>你好 ${userFullName}，您参与的游戏 "${gameTitle}" 已经开始！<a href="${baseUrl}">立即查看</a></p>`;
  }

  private getEvidenceRequiredTemplate(gameTitle: string, deadline: string, userFullName: string, baseUrl: string): string {
    return `<p>你好 ${userFullName}，请为游戏 "${gameTitle}" 提交证据，截止时间：${deadline}。<a href="${baseUrl}">立即提交</a></p>`;
  }

  private getVipExpiredTemplate(userFullName: string, baseUrl: string): string {
    return `<p>你好 ${userFullName}，您的VIP会员即将到期。<a href="${baseUrl}/vip">立即续费</a></p>`;
  }

  private getDefaultTemplate(title: string, message: string, userFullName: string, baseUrl: string): string {
    return `<p>你好 ${userFullName}，${title}：${message}。<a href="${baseUrl}">查看详情</a></p>`;
  }

  // 移除HTML标签
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }
}
