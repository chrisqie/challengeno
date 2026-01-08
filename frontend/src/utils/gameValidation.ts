/**
 * 游戏创建表单验证工具
 */

import { validateText } from './textValidationSimplified';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class GameValidation {
  /**
   * 验证游戏标题
   */
  static validateTitle(title: string): ValidationResult {
    return validateText(title, 'title');
  }

  /**
   * 验证游戏描述
   */
  static validateDescription(description: string): ValidationResult {
    return validateText(description, 'description');
  }

  /**
   * 验证参与人数
   */
  static validateMaxParticipants(maxParticipants: number, isVip: boolean = false): ValidationResult {
    const errors: string[] = [];
    const maxAllowed = isVip ? 50 : 20;

    if (!maxParticipants || maxParticipants < 2) {
      errors.push('At least 2 participants required');
    } else if (maxParticipants > maxAllowed) {
      errors.push(isVip ? 'Maximum 50 participants' : 'Maximum 20 participants, upgrade to VIP for larger games');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 验证"仅好友可见"游戏权限
   */
  static validateFriendsOnlyPermission(
    visibility: string,
    isVip: boolean = false,
    participationPoints: number = 0,
    currentMonthFriendsOnlyCount: number = 0
  ): ValidationResult {
    const errors: string[] = [];

    if (visibility === 'FRIENDS_ONLY') {
      if (isVip) {
        // VIP用户无限制
        return { isValid: true, errors: [] };
      }

      // 基于积分的分层限制
      let monthlyLimit = 0;
      if (participationPoints >= 1000) {
        monthlyLimit = 10; // 高级用户
      } else if (participationPoints >= 500) {
        monthlyLimit = 5;  // 中级用户
      } else if (participationPoints >= 100) {
        monthlyLimit = 3;  // 初级用户
      } else {
        monthlyLimit = 1;  // 新用户
      }

      if (currentMonthFriendsOnlyCount >= monthlyLimit) {
        errors.push(`Friends-only games limit reached (${monthlyLimit}/month). Earn more points or upgrade to VIP for unlimited access.`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 验证开始时间
   */
  static validateStartTime(startTime: string): ValidationResult {
    const errors: string[] = [];
    
    if (!startTime) {
      errors.push('请选择开始时间');
      return { isValid: false, errors };
    }
    
    const startDate = new Date(startTime);
    const now = new Date();
    const minStart = new Date(now.getTime() + 30 * 60 * 1000); // 至少30分钟后
    
    if (isNaN(startDate.getTime())) {
      errors.push('开始时间格式不正确');
    } else if (startDate <= now) {
      errors.push('开始时间必须是未来时间');
    } else if (startDate < minStart) {
      errors.push('开始时间至少需要在30分钟后');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 验证结束时间
   */
  static validateEndTime(endTime: string, startTime: string): ValidationResult {
    const errors: string[] = [];
    
    if (!endTime) {
      errors.push('请选择结束时间');
      return { isValid: false, errors };
    }
    
    if (!startTime) {
      errors.push('请先选择开始时间');
      return { isValid: false, errors };
    }
    
    const endDate = new Date(endTime);
    const startDate = new Date(startTime);
    
    if (isNaN(endDate.getTime())) {
      errors.push('结束时间格式不正确');
      return { isValid: false, errors };
    }
    
    if (isNaN(startDate.getTime())) {
      errors.push('开始时间格式不正确');
      return { isValid: false, errors };
    }
    
    const minDuration = 60 * 60 * 1000; // 至少1小时
    const maxDuration = 30 * 24 * 60 * 60 * 1000; // 最多30天
    const duration = endDate.getTime() - startDate.getTime();
    
    if (endDate <= startDate) {
      errors.push('结束时间必须晚于开始时间');
    } else if (duration < minDuration) {
      errors.push('游戏持续时间至少需要1小时');
    } else if (duration > maxDuration) {
      errors.push('游戏持续时间不能超过30天');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 验证证据截止时间
   */
  static validateEvidenceDeadline(evidenceDeadline: string, endTime: string): ValidationResult {
    const errors: string[] = [];
    
    if (!evidenceDeadline) {
      errors.push('请选择证据提交截止时间');
      return { isValid: false, errors };
    }
    
    if (!endTime) {
      errors.push('请先选择结束时间');
      return { isValid: false, errors };
    }
    
    const deadlineDate = new Date(evidenceDeadline);
    const endDate = new Date(endTime);
    
    if (isNaN(deadlineDate.getTime())) {
      errors.push('证据截止时间格式不正确');
      return { isValid: false, errors };
    }
    
    if (isNaN(endDate.getTime())) {
      errors.push('结束时间格式不正确');
      return { isValid: false, errors };
    }
    
    const minGap = 60 * 60 * 1000; // 至少1小时后
    const maxGap = 7 * 24 * 60 * 60 * 1000; // 最多7天后
    const gap = deadlineDate.getTime() - endDate.getTime();
    
    if (deadlineDate <= endDate) {
      errors.push('证据截止时间必须晚于游戏结束时间');
    } else if (gap < minGap) {
      errors.push('证据截止时间至少需要在游戏结束1小时后');
    } else if (gap > maxGap) {
      errors.push('证据截止时间不能超过游戏结束后7天');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 验证证据要求
   */
  static validateEvidenceInstructions(instructions: string): ValidationResult {
    return validateText(instructions, 'evidenceInstructions');
  }

  /**
   * 验证赌注描述
   */
  static validateStakeDescription(stakeDescription: string): ValidationResult {
    return validateText(stakeDescription, 'stakeDescription', true); // true表示可选
  }

  /**
   * 综合验证整个表单
   */
  static validateGameForm(formData: any, isVip: boolean = false): ValidationResult {
    const allErrors: string[] = [];
    
    // 验证各个字段
    const titleResult = this.validateTitle(formData.title);
    const descResult = this.validateDescription(formData.description);
    const participantsResult = this.validateMaxParticipants(formData.maxParticipants, isVip);
    const startTimeResult = this.validateStartTime(formData.startDate);
    const endTimeResult = this.validateEndTime(formData.endDate, formData.startDate);
    const evidenceDeadlineResult = this.validateEvidenceDeadline(formData.evidenceDeadline, formData.endDate);
    const evidenceInstructionsResult = this.validateEvidenceInstructions(formData.evidenceInstructions);
    
    // 收集所有错误
    allErrors.push(...titleResult.errors);
    allErrors.push(...descResult.errors);
    allErrors.push(...participantsResult.errors);
    allErrors.push(...startTimeResult.errors);
    allErrors.push(...endTimeResult.errors);
    allErrors.push(...evidenceDeadlineResult.errors);
    allErrors.push(...evidenceInstructionsResult.errors);
    
    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }
}

/**
 * 获取友好的错误提示
 */
export const getValidationTips = {
  title: '标题应该简洁明了，能够吸引参与者的注意',
  description: '详细描述挑战内容、规则和要求，帮助参与者理解',
  maxParticipants: '根据挑战难度和管理能力设置合适的人数',
  startDate: '建议至少提前30分钟设置，给参与者准备时间',
  endDate: '游戏时长建议1小时-30天，给参与者充足时间完成挑战',
  evidenceDeadline: '建议设置在游戏结束后1-2天，给参与者充足时间提交证据',
  evidenceInstructions: '明确说明需要什么样的证据，越具体越好'
};
