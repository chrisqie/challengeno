import { templatesAPI } from './api';
import { HARDCODED_TEMPLATES, VIP_PLANS, GAME_CATEGORIES, GameTemplate } from '../config/gameTemplates';

class TemplateService {
  private fallbackMode = false;

  // 获取游戏模板 - 优先从数据库获取，失败时使用固化数据
  async getGameTemplates(): Promise<{ data: GameTemplate[], source: string }> {
    try {
      const response = await templatesAPI.getTemplates();

      // 如果数据库返回空数据或错误，使用固化数据
      if (!response.data || response.data.length === 0) {
        console.warn('数据库模板为空，使用固化模板');
        return { data: HARDCODED_TEMPLATES, source: 'hardcoded' };
      }

      this.fallbackMode = false;
      return { data: response.data, source: 'database' };
    } catch (error) {
      console.error('获取数据库模板失败，使用固化模板:', error);
      this.fallbackMode = true;
      return { data: HARDCODED_TEMPLATES, source: 'hardcoded' };
    }
  }

  // 获取VIP套餐 - 优先从数据库获取，失败时使用固化数据
  async getVipPlans() {
    try {
      // 假设有VIP API
      // const response = await vipAPI.getPlans();
      // return { data: response.data, source: 'database' };
      
      // 目前直接返回固化数据
      return { data: VIP_PLANS, source: 'hardcoded' };
    } catch (error) {
      console.error('获取VIP套餐失败，使用固化数据:', error);
      return { data: VIP_PLANS, source: 'hardcoded' };
    }
  }

  // 获取游戏分类
  getGameCategories() {
    return { data: GAME_CATEGORIES, source: 'hardcoded' };
  }

  // 检查是否在降级模式
  isFallbackMode() {
    return this.fallbackMode;
  }

  // 获取模板详情
  async getTemplateById(id: string): Promise<{ data: GameTemplate, source: string }> {
    try {
      const templates = await this.getGameTemplates();
      const template = templates.data.find((t: GameTemplate) => t.id === id || t.name === id);

      if (!template) {
        throw new Error('模板不存在');
      }

      return { data: template, source: templates.source };
    } catch (error) {
      console.error('获取模板详情失败:', error);
      throw error;
    }
  }

  // 搜索模板
  async searchTemplates(query: string): Promise<{ data: GameTemplate[], source: string }> {
    try {
      const templates = await this.getGameTemplates();
      const filteredTemplates = templates.data.filter((template: GameTemplate) =>
        template.title.toLowerCase().includes(query.toLowerCase()) ||
        template.description.toLowerCase().includes(query.toLowerCase()) ||
        template.category.toLowerCase().includes(query.toLowerCase())
      );

      return { data: filteredTemplates, source: templates.source };
    } catch (error) {
      console.error('搜索模板失败:', error);
      return { data: [], source: 'error' };
    }
  }

  // 按分类筛选模板
  async getTemplatesByCategory(category: string): Promise<{ data: GameTemplate[], source: string }> {
    try {
      const templates = await this.getGameTemplates();

      if (category === 'all') {
        return templates;
      }

      const filteredTemplates = templates.data.filter((template: GameTemplate) =>
        template.category === category
      );

      return { data: filteredTemplates, source: templates.source };
    } catch (error) {
      console.error('按分类获取模板失败:', error);
      return { data: [], source: 'error' };
    }
  }
}

export const templateService = new TemplateService();
