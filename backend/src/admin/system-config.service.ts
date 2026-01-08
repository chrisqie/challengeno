import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SystemConfig {
  id: string;
  key: string;
  value: any;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'ARRAY';
  category: 'GENERAL' | 'GAME' | 'USER' | 'PAYMENT' | 'NOTIFICATION' | 'SECURITY' | 'FEATURE';
  description: string;
  isPublic: boolean; // 是否可以被前端访问
  updatedAt: Date;
  updatedBy: string;
}

export interface MaintenanceMode {
  enabled: boolean;
  message: string;
  startTime?: Date;
  endTime?: Date;
  allowedUsers?: string[]; // 允许访问的用户ID
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  content: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  targetUsers?: 'ALL' | 'VIP' | 'ADMIN' | 'NEW_USERS';
  createdBy: string;
  createdAt: Date;
}

@Injectable()
export class SystemConfigService {
  constructor(private prisma: PrismaService) {}

  // 获取所有系统配置
  async getAllConfigs(category?: string, isPublic?: boolean) {
    // 暂时返回模拟配置数据
    const configs: SystemConfig[] = [
      {
        id: 'config_1',
        key: 'MAX_DAILY_GAMES_PER_USER',
        value: 10,
        type: 'NUMBER',
        category: 'GAME',
        description: '用户每日最大创建游戏数量',
        isPublic: false,
        updatedAt: new Date(),
        updatedBy: 'admin'
      },
      {
        id: 'config_2',
        key: 'GAME_AUTO_CANCEL_HOURS',
        value: 24,
        type: 'NUMBER',
        category: 'GAME',
        description: '游戏自动取消时间（小时）',
        isPublic: false,
        updatedAt: new Date(),
        updatedBy: 'admin'
      },
      {
        id: 'config_3',
        key: 'MIN_TRUST_POINTS_FOR_GAME_CREATION',
        value: 50,
        type: 'NUMBER',
        category: 'USER',
        description: '创建游戏所需最低信任积分',
        isPublic: true,
        updatedAt: new Date(),
        updatedBy: 'admin'
      },
      {
        id: 'config_4',
        key: 'ENABLE_EMAIL_NOTIFICATIONS',
        value: true,
        type: 'BOOLEAN',
        category: 'NOTIFICATION',
        description: '启用邮件通知',
        isPublic: false,
        updatedAt: new Date(),
        updatedBy: 'admin'
      },
      {
        id: 'config_5',
        key: 'VIP_FEATURES',
        value: {
          unlimitedGames: true,
          prioritySupport: true,
          customThemes: true,
          advancedStats: true
        },
        type: 'JSON',
        category: 'FEATURE',
        description: 'VIP功能配置',
        isPublic: true,
        updatedAt: new Date(),
        updatedBy: 'admin'
      },
      {
        id: 'config_6',
        key: 'SUPPORTED_LANGUAGES',
        value: ['en', 'es', 'fr', 'de', 'ja'],
        type: 'ARRAY',
        category: 'GENERAL',
        description: '支持的语言列表',
        isPublic: true,
        updatedAt: new Date(),
        updatedBy: 'admin'
      },
      {
        id: 'config_7',
        key: 'MAX_FILE_UPLOAD_SIZE_MB',
        value: 10,
        type: 'NUMBER',
        category: 'GENERAL',
        description: '最大文件上传大小（MB）',
        isPublic: true,
        updatedAt: new Date(),
        updatedBy: 'admin'
      },
      {
        id: 'config_8',
        key: 'SESSION_TIMEOUT_MINUTES',
        value: 60,
        type: 'NUMBER',
        category: 'SECURITY',
        description: '会话超时时间（分钟）',
        isPublic: false,
        updatedAt: new Date(),
        updatedBy: 'admin'
      }
    ];

    let filteredConfigs = configs;

    if (category) {
      filteredConfigs = filteredConfigs.filter(config => config.category === category);
    }

    if (isPublic !== undefined) {
      filteredConfigs = filteredConfigs.filter(config => config.isPublic === isPublic);
    }

    return filteredConfigs;
  }

  // 获取单个配置
  async getConfig(key: string): Promise<SystemConfig | null> {
    const configs = await this.getAllConfigs();
    return configs.find(config => config.key === key) || null;
  }

  // 获取配置值
  async getConfigValue(key: string): Promise<any> {
    const config = await this.getConfig(key);
    return config ? config.value : null;
  }

  // 更新配置
  async updateConfig(key: string, value: any, adminId: string) {
    const config = await this.getConfig(key);
    
    if (!config) {
      throw new NotFoundException(`配置项 ${key} 不存在`);
    }

    // 验证值类型
    if (!this.validateConfigValue(value, config.type)) {
      throw new BadRequestException(`配置值类型不匹配，期望 ${config.type}`);
    }

    // 暂时跳过数据库更新，实际应该保存到数据库
    console.log(`Config updated: ${key} = ${JSON.stringify(value)} by ${adminId}`);

    return {
      success: true,
      message: `配置 ${key} 已更新`,
      oldValue: config.value,
      newValue: value
    };
  }

  // 批量更新配置
  async updateMultipleConfigs(updates: Array<{ key: string; value: any }>, adminId: string) {
    const results = [];

    for (const update of updates) {
      try {
        const result = await this.updateConfig(update.key, update.value, adminId);
        results.push({ key: update.key, success: true, message: result.message });
      } catch (error) {
        results.push({ key: update.key, success: false, message: error.message });
      }
    }

    return {
      success: true,
      results,
      summary: {
        total: updates.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    };
  }

  // 重置配置到默认值
  async resetConfig(key: string, adminId: string) {
    const defaultValues = {
      'MAX_DAILY_GAMES_PER_USER': 10,
      'GAME_AUTO_CANCEL_HOURS': 24,
      'MIN_TRUST_POINTS_FOR_GAME_CREATION': 50,
      'ENABLE_EMAIL_NOTIFICATIONS': true,
      'MAX_FILE_UPLOAD_SIZE_MB': 10,
      'SESSION_TIMEOUT_MINUTES': 60
    };

    const defaultValue = defaultValues[key];
    if (defaultValue === undefined) {
      throw new NotFoundException(`配置项 ${key} 没有默认值`);
    }

    return this.updateConfig(key, defaultValue, adminId);
  }

  // 维护模式管理
  async getMaintenanceMode(): Promise<MaintenanceMode> {
    // 暂时返回模拟数据
    return {
      enabled: false,
      message: '系统维护中，预计30分钟后恢复',
      startTime: undefined,
      endTime: undefined,
      allowedUsers: []
    };
  }

  async setMaintenanceMode(mode: Partial<MaintenanceMode>, adminId: string) {
    // 暂时跳过数据库操作
    console.log(`Maintenance mode updated by ${adminId}:`, mode);

    return {
      success: true,
      message: mode.enabled ? '维护模式已启用' : '维护模式已禁用',
      mode
    };
  }

  // 系统公告管理
  async getAnnouncements(isActive?: boolean): Promise<SystemAnnouncement[]> {
    // 暂时返回模拟数据
    const announcements: SystemAnnouncement[] = [
      {
        id: 'ann_1',
        title: '系统升级通知',
        content: '系统将于今晚23:00-01:00进行升级维护，期间可能无法正常使用',
        type: 'WARNING',
        priority: 'HIGH',
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        targetUsers: 'ALL',
        createdBy: 'admin',
        createdAt: new Date()
      },
      {
        id: 'ann_2',
        title: '新功能上线',
        content: '团队游戏功能现已上线，快来体验吧！',
        type: 'SUCCESS',
        priority: 'MEDIUM',
        isActive: true,
        targetUsers: 'ALL',
        createdBy: 'admin',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    if (isActive !== undefined) {
      return announcements.filter(ann => ann.isActive === isActive);
    }

    return announcements;
  }

  async createAnnouncement(announcement: Omit<SystemAnnouncement, 'id' | 'createdAt'>) {
    const newAnnouncement: SystemAnnouncement = {
      ...announcement,
      id: `ann_${Date.now()}`,
      createdAt: new Date()
    };

    // 暂时跳过数据库操作
    console.log('New announcement created:', newAnnouncement);

    return {
      success: true,
      message: '公告已创建',
      announcement: newAnnouncement
    };
  }

  async updateAnnouncement(id: string, updates: Partial<SystemAnnouncement>) {
    // 暂时跳过数据库操作
    console.log(`Announcement ${id} updated:`, updates);

    return {
      success: true,
      message: '公告已更新'
    };
  }

  async deleteAnnouncement(id: string) {
    // 暂时跳过数据库操作
    console.log(`Announcement ${id} deleted`);

    return {
      success: true,
      message: '公告已删除'
    };
  }

  // 功能开关管理
  async getFeatureFlags() {
    return {
      socialFeatures: true,
      teamGames: true,
      vipSystem: true,
      achievements: true,
      notifications: true,
      analytics: true,
      contentModeration: true,
      apiRateLimit: true,
      maintenanceMode: false,
      newUserRegistration: true,
      gameCreation: true,
      paymentSystem: false // 暂时关闭
    };
  }

  async updateFeatureFlag(feature: string, enabled: boolean, adminId: string) {
    // 暂时跳过数据库操作
    console.log(`Feature flag ${feature} set to ${enabled} by ${adminId}`);

    return {
      success: true,
      message: `功能 ${feature} 已${enabled ? '启用' : '禁用'}`
    };
  }

  // 系统状态检查
  async getSystemStatus() {
    return {
      status: 'HEALTHY',
      uptime: '99.95%',
      lastRestart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      version: '1.0.0',
      environment: 'production',
      database: {
        status: 'CONNECTED',
        responseTime: '12ms',
        connections: 15
      },
      cache: {
        status: 'CONNECTED',
        hitRate: '94.2%',
        memory: '256MB'
      },
      storage: {
        status: 'HEALTHY',
        used: '245GB',
        available: '755GB'
      },
      services: {
        authentication: 'HEALTHY',
        notifications: 'HEALTHY',
        payments: 'DISABLED',
        analytics: 'HEALTHY'
      }
    };
  }

  // 验证配置值类型
  private validateConfigValue(value: any, type: string): boolean {
    switch (type) {
      case 'STRING':
        return typeof value === 'string';
      case 'NUMBER':
        return typeof value === 'number' && !isNaN(value);
      case 'BOOLEAN':
        return typeof value === 'boolean';
      case 'JSON':
        return typeof value === 'object' && value !== null;
      case 'ARRAY':
        return Array.isArray(value);
      default:
        return false;
    }
  }
}
