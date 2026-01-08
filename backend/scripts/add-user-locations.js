// 使用相对路径导入 PrismaClient
const path = require('path');
const { PrismaClient } = require(path.join(__dirname, '../src/prisma/prisma.service.js'));

const prisma = new PrismaClient();

// 示例位置数据
const sampleLocations = [
  {
    country: '中国',
    countryCode: 'CN',
    city: '北京'
  },
  {
    country: '中国',
    countryCode: 'CN',
    city: '上海'
  },
  {
    country: '中国',
    countryCode: 'CN',
    city: '深圳'
  },
  {
    country: '中国',
    countryCode: 'CN',
    city: '广州'
  },
  {
    country: '韩国',
    countryCode: 'KR',
    city: '首尔'
  },
  {
    country: '日本',
    countryCode: 'JP',
    city: '东京'
  },
  {
    country: '美国',
    countryCode: 'US',
    city: '纽约'
  },
  {
    country: '英国',
    countryCode: 'GB',
    city: '伦敦'
  }
];

async function addUserLocations() {
  try {
    console.log('🌍 开始为用户添加位置信息...');

    // 获取所有没有位置信息的用户
    const usersWithoutLocation = await prisma.user.findMany({
      where: {
        OR: [
          { country: null },
          { city: null }
        ]
      },
      select: {
        id: true,
        username: true,
        country: true,
        city: true
      }
    });

    console.log(`找到 ${usersWithoutLocation.length} 个没有位置信息的用户`);

    if (usersWithoutLocation.length === 0) {
      console.log('✅ 所有用户都已有位置信息');
      return;
    }

    // 为每个用户随机分配一个位置
    for (let i = 0; i < usersWithoutLocation.length; i++) {
      const user = usersWithoutLocation[i];
      const randomLocation = sampleLocations[i % sampleLocations.length];

      await prisma.user.update({
        where: { id: user.id },
        data: {
          country: randomLocation.country,
          countryCode: randomLocation.countryCode,
          city: randomLocation.city
        }
      });

      console.log(`✅ 已为用户 ${user.username} 设置位置: ${randomLocation.city}, ${randomLocation.country}`);
    }

    console.log('🎉 位置信息添加完成！');

    // 验证结果
    const updatedUsers = await prisma.user.findMany({
      where: {
        id: { in: usersWithoutLocation.map(u => u.id) }
      },
      select: {
        username: true,
        country: true,
        countryCode: true,
        city: true
      }
    });

    console.log('\n📍 更新后的用户位置信息:');
    updatedUsers.forEach(user => {
      console.log(`  ${user.username}: ${user.city}, ${user.country} (${user.countryCode})`);
    });

  } catch (error) {
    console.error('❌ 添加位置信息失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行脚本
addUserLocations();
