// 检查用户位置信息的脚本
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserLocations() {
  try {
    console.log('🔍 检查所有用户的位置信息...\n');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        location: true,
        country: true,
        countryCode: true,
        city: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    console.log(`找到 ${users.length} 个用户:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. 用户: ${user.username}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   个人资料位置 (location): "${user.location || '未设置'}"`);
      console.log(`   结构化位置:`);
      console.log(`     - 国家 (country): "${user.country || '未设置'}"`);
      console.log(`     - 国家代码 (countryCode): "${user.countryCode || '未设置'}"`);
      console.log(`     - 城市 (city): "${user.city || '未设置'}"`);
      console.log(`   最后更新: ${user.updatedAt}`);
      console.log('   ---');
    });

    // 检查是否有位置不匹配的用户
    const mismatchedUsers = users.filter(user => {
      if (!user.location) return false;
      
      // 简单检查：如果location包含"韩国"但country不是"韩国"
      if (user.location.includes('韩国') && user.country !== '韩国') {
        return true;
      }
      if (user.location.includes('中国') && user.country !== '中国') {
        return true;
      }
      return false;
    });

    if (mismatchedUsers.length > 0) {
      console.log('\n⚠️  发现位置信息不匹配的用户:');
      mismatchedUsers.forEach(user => {
        console.log(`- ${user.username}: location="${user.location}" vs country="${user.country}", city="${user.city}"`);
      });
    } else {
      console.log('\n✅ 所有用户的位置信息都匹配');
    }

  } catch (error) {
    console.error('❌ 检查用户位置信息失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserLocations();
