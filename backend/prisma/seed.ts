import { PrismaClient, GameCategory, EvidenceType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始初始化数据...');

  // 清理现有模板数据
  await prisma.gameTemplate.deleteMany();

  // 创建游戏模板（使用原始bengkui的优秀模板）
  const templates = [
    {
      name: 'daily_exercise',
      title: '每日运动挑战',
      description: '承诺每天进行至少30分钟的运动',
      category: GameCategory.FITNESS,
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168, // 7天
      maxParticipants: 6,
      instructions: '每天拍摄运动照片或视频作为证据，包括运动类型和时长',
      exampleEvidence: '跑步30分钟的照片，显示运动app记录',
      isActive: true,
    },
    {
      name: 'early_wake_up',
      title: '早起挑战',
      description: '承诺每天早上6点前起床',
      category: GameCategory.HEALTH,
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 8,
      instructions: '每天早上6点前拍摄起床照片，显示时间',
      exampleEvidence: '显示时间的起床自拍照',
      isActive: true,
    },
    {
      name: 'reading_habit',
      title: '每日阅读',
      description: '承诺每天阅读至少30分钟',
      category: GameCategory.LEARNING,
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 336, // 14天
      maxParticipants: 10,
      instructions: '每天拍摄阅读照片，包括书籍和阅读时长记录',
      exampleEvidence: '正在阅读的书籍照片，配上阅读笔记',
      isActive: true,
    },
    {
      name: 'water_intake',
      title: '每日饮水',
      description: '承诺每天喝足8杯水',
      category: GameCategory.HEALTH,
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 12,
      instructions: '每天记录饮水量，拍摄水杯或饮水app截图',
      exampleEvidence: '显示当日饮水量的app截图',
      isActive: true,
    },
    {
      name: 'meditation',
      title: '冥想练习',
      description: '承诺每天进行15分钟冥想',
      category: GameCategory.HEALTH,
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 336,
      maxParticipants: 8,
      instructions: '每天拍摄冥想环境或冥想app记录',
      exampleEvidence: '冥想app显示完成15分钟冥想的截图',
      isActive: true,
    },
    {
      name: 'no_social_media',
      title: '戒断社交媒体',
      description: '承诺一周内不使用社交媒体',
      category: GameCategory.PERSONAL,
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: true,
      defaultDurationHours: 168,
      maxParticipants: 6,
      instructions: '每天截图手机使用时间，证明未使用社交媒体',
      exampleEvidence: '手机屏幕使用时间截图，显示社交媒体使用时间为0',
      isActive: true,
    },
    {
      name: 'weather_prediction',
      title: '天气预测挑战',
      description: '预测未来一周的天气情况',
      category: GameCategory.WEATHER,
      evidenceType: EvidenceType.TEXT,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 20,
      instructions: '每天提交对次日天气的预测，包括温度和天气状况',
      exampleEvidence: '明天最高温度25°C，多云转晴',
      isActive: true,
    },
    {
      name: 'language_learning',
      title: '语言学习打卡',
      description: '承诺每天学习外语30分钟',
      category: GameCategory.LEARNING,
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 336,
      maxParticipants: 15,
      instructions: '每天拍摄学习进度截图或学习笔记',
      exampleEvidence: '语言学习app显示今日完成30分钟学习的截图',
      isActive: true,
    },
  ];

  for (const template of templates) {
    await prisma.gameTemplate.create({
      data: template,
    });
  }

  console.log('模板数据初始化完成！');

  // 创建管理员用户
  const bcrypt = require('bcrypt');
  const adminPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@bet-together.com',
      fullName: 'System Administrator',
      dateOfBirth: new Date('1990-01-01'),
      passwordHash: adminPassword,
      isAdmin: true,
      adminRole: 'SUPER_ADMIN',
      adminCreatedAt: new Date(),
    },
  });

  console.log('Admin user created! Username: admin, Password: admin123');
  console.log('数据初始化完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
