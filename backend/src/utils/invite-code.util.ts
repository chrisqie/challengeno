import { randomBytes } from 'crypto';

/**
 * 生成团队邀请码
 * 格式：TEAM-XXXX-XXXX (8位随机字符)
 */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TEAM-';
  
  // 生成两组4位字符
  for (let i = 0; i < 2; i++) {
    if (i > 0) result += '-';
    for (let j = 0; j < 4; j++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  
  return result;
}

/**
 * 验证邀请码格式
 */
export function validateInviteCode(code: string): boolean {
  const pattern = /^TEAM-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return pattern.test(code);
}

/**
 * 生成游戏邀请码
 * 格式：GAME-XXXX-XXXX (8位随机字符)
 */
export function generateGameInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'GAME-';
  
  // 生成两组4位字符
  for (let i = 0; i < 2; i++) {
    if (i > 0) result += '-';
    for (let j = 0; j < 4; j++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  
  return result;
}

/**
 * 生成短邀请码（6位）
 * 用于简单分享
 */
export function generateShortInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}
