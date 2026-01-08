const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedSimpleVipTemplates() {
  console.log('🌱 开始添加简化VIP模板数据...');

  const vipTemplates = [
    {
      name: 'vip-team-challenge',
      title: '团队挑战 (VIP)',
      description: '创建团队，与朋友一起完成挑战目标',
      category: 'PERSONAL',
      evidenceType: 'PHOTO',
      isAgeRestricted: false,
      defaultDurationHours: 168, // 7天
      maxParticipants: 20, // VIP用户可以创建更大的游戏
      instructions: '邀请朋友组成团队，一起完成挑战。VIP用户可以创建更大规模的团队游戏。',
      exampleEvidence: '团队活动照片、进度截图等',
      isVipOnly: true,
      vipTier: 'BASIC',
      uiTheme: {
        background: 'gradient-blue',
        cardStyle: 'premium'
      },
      features: {
        teamMode: true,
        moreParticipants: true
      }
    },
    {
      name: 'vip-private-room',
      title: '私密房间 (VIP)',
      description: '创建私密游戏房间，只有受邀朋友可以参与',
      category: 'PERSONAL',
      evidenceType: 'PHOTO',
      isAgeRestricted: false,
      defaultDurationHours: 168, // 7天
      maxParticipants: 15, // VIP用户可以邀请更多朋友
      instructions: '创建私密游戏，邀请特定朋友参与。VIP用户享有更多隐私控制选项。',
      exampleEvidence: '活动照片、进度截图等',
      isVipOnly: true,
      vipTier: 'BASIC',
      uiTheme: {
        background: 'gradient-purple',
        cardStyle: 'elegant'
      },
      features: {
        privateRoom: true,
        inviteOnly: true
      }
    }
  ];

  for (const template of vipTemplates) {
    try {
      const existingTemplate = await prisma.gameTemplate.findUnique({
        where: { name: template.name }
      });

      if (existingTemplate) {
        console.log(`⚠️  模板已存在，跳过: ${template.title}`);
        continue;
      }

      await prisma.gameTemplate.create({
        data: template
      });
      console.log(`✅ 添加VIP模板: ${template.title}`);
    } catch (error) {
      console.error(`❌ 添加模板失败 ${template.title}:`, error.message);
    }
  }

  console.log('🎉 VIP模板种子数据添加完成');
}

async function main() {
  try {
    await seedSimpleVipTemplates();
  } catch (error) {
    console.error('❌ 种子数据添加失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
