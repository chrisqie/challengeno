/**
 * 检查快捷模板的脚本
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 检查快捷模板状态...\n');
  
  // 1. 统计所有模板
  const totalCount = await prisma.gameTemplate.count();
  console.log(`📊 总模板数: ${totalCount}`);
  
  // 2. 统计快捷模板
  const quickCount = await prisma.gameTemplate.count({
    where: { isQuickStart: true }
  });
  console.log(`⚡ 快捷模板数: ${quickCount}`);
  
  // 3. 统计精细模板
  const customCount = await prisma.gameTemplate.count({
    where: { isQuickStart: false }
  });
  console.log(`🔧 精细模板数: ${customCount}`);
  
  // 4. 列出所有快捷模板
  console.log('\n📋 快捷模板列表 (isQuickStart=true):');
  const quickTemplates = await prisma.gameTemplate.findMany({
    where: { isQuickStart: true },
    select: {
      name: true,
      title: true,
      category: true,
      subcategory: true
    },
    orderBy: { name: 'asc' }
  });
  
  quickTemplates.forEach((t, index) => {
    console.log(`${index + 1}. ${t.name} - ${t.title} (${t.category}/${t.subcategory})`);
  });
  
  // 5. 检查特定模板
  console.log('\n🔍 检查特定模板的 isQuickStart 状态:');
  const checkTemplates = [
    'health_sleep_early',
    'health_diet_water',
    'health_mental_meditation',
    'fitness_cardio_running',
    'fitness_cardio_steps',
    'learning_language_english',
    'learning_reading_daily',
  ];
  
  for (const name of checkTemplates) {
    const template = await prisma.gameTemplate.findUnique({
      where: { name },
      select: { name: true, title: true, isQuickStart: true }
    });
    
    if (template) {
      console.log(`  ${template.name}: isQuickStart=${template.isQuickStart} - ${template.title}`);
    } else {
      console.log(`  ${name}: ❌ 未找到`);
    }
  }
  
  console.log('\n✅ 检查完成！');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

