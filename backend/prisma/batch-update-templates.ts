/**
 * 批量更新模板脚本
 * 将指定的模板标记为快捷模板 (isQuickStart: true)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 需要标记为快捷模板的模板名称列表
const quickTemplateNames = [
  // 健康类
  'health_sleep_early',           // 早睡早起挑战
  'health_diet_water',             // 每日饮水2升 (已是快捷模板)
  'quick_no_junk_food',            // 戒零食挑战 (已是快捷模板)
  'health_mental_meditation',      // 每日冥想15分钟
  'quick_morning_routine',         // 晨间仪式养成 (已是快捷模板)
  'health_mental_digital_detox',   // 压力管理挑战/数字排毒
  
  // 健身类
  'fitness_cardio_running',        // 每日跑步5公里
  'fitness_cardio_steps',          // 每日万步挑战
  'quick_stairs_climbing',         // 爬楼梯挑战 (已是快捷模板)
  'fitness_strength_pushups',      // 俯卧撑挑战
  'quick_plank_challenge',         // 平板支撑挑战 (已是快捷模板)
  'advanced_muscle_building',      // 增肌训练计划
  'fitness_flexibility_yoga',      // 瑜伽练习挑战
  
  // 学习类
  'learning_language_english',     // 英语学习打卡
  'quick_vocabulary',              // 每日背单词50个 (已是快捷模板)
  'advanced_language_fluency',     // 语言流利度提升
  'quick_podcast_learning',        // 每日播客学习 (已是快捷模板)
  'learning_skill_programming',    // 编程技能提升
  'learning_reading_daily',        // 每日阅读30分钟
  'advanced_book_club',            // 读书会挑战
  
  // 个人成长类
  'personal_productivity_pomodoro', // 番茄工作法挑战
  'quick_no_phone_morning',        // 早晨不看手机 (已是快捷模板)
  'personal_productivity_todo',    // 每日任务清单
  'advanced_creative_project',     // 创意项目完成
  'quick_compliment',              // 每日赞美他人 (已是快捷模板)
  'personal_growth_learning',      // 每日学习新知识
  
  // 生活方式类
  'lifestyle_home_cooking',        // 每日健康烹饪
  'quick_bed_making',              // 每日整理床铺 (已是快捷模板)
  'advanced_minimalism',           // 极简生活挑战
  'advanced_sustainable_living',   // 可持续生活方式
  'lifestyle_home_cleaning',       // 生活方式改善/每日整理收纳
  'quick_family_time',             // 每日家庭时光 (已是快捷模板)
  'lifestyle_social_connection',   // 每日社交联系
  'lifestyle_social_volunteer',    // 志愿服务挑战
  'lifestyle_hobby_movie',         // 电影观赏计划
  'lifestyle_hobby_photography',   // 每日摄影练习
  
  // 职业发展类
  'advanced_side_hustle',          // 副业启动计划
  'advanced_leadership_development', // 领导力提升计划
];

async function main() {
  console.log('🚀 开始批量更新模板...\n');

  // 先检查当前状态
  const totalCount = await prisma.gameTemplate.count();
  const currentQuickCount = await prisma.gameTemplate.count({ where: { isQuickStart: true } });
  console.log(`📊 当前状态:`);
  console.log(`   总模板数: ${totalCount}`);
  console.log(`   快捷模板数: ${currentQuickCount}\n`);

  let successCount = 0;
  let notFoundCount = 0;
  let alreadyQuickCount = 0;
  let errorCount = 0;

  console.log('📝 开始更新模板...\n');

  for (const templateName of quickTemplateNames) {
    try {
      // 先查询模板是否存在
      const template = await prisma.gameTemplate.findUnique({
        where: { name: templateName },
        select: { name: true, title: true, isQuickStart: true }
      });

      if (!template) {
        console.log(`⚠️  ${templateName} - 未找到该模板`);
        notFoundCount++;
        continue;
      }

      if (template.isQuickStart) {
        console.log(`✓  ${templateName} - ${template.title} (已经是快捷模板)`);
        alreadyQuickCount++;
        continue;
      }

      // 更新为快捷模板
      await prisma.gameTemplate.update({
        where: { name: templateName },
        data: { isQuickStart: true }
      });

      console.log(`✅ ${templateName} - ${template.title} (已更新为快捷模板)`);
      successCount++;

    } catch (error: any) {
      console.error(`❌ ${templateName} - 更新失败:`, error.message);
      errorCount++;
    }
  }

  // 检查更新后的状态
  const newQuickCount = await prisma.gameTemplate.count({ where: { isQuickStart: true } });

  console.log(`\n📊 更新完成！`);
  console.log(`   新更新: ${successCount}`);
  console.log(`   已是快捷模板: ${alreadyQuickCount}`);
  console.log(`   未找到: ${notFoundCount}`);
  console.log(`   失败: ${errorCount}`);
  console.log(`\n   更新前快捷模板数: ${currentQuickCount}`);
  console.log(`   更新后快捷模板数: ${newQuickCount}`);
  console.log(`   增加: ${newQuickCount - currentQuickCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

