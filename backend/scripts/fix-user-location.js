// 修复用户位置信息的脚本
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 位置解析函数（与后端API中的逻辑相同）
function parseLocation(location) {
  if (!location || typeof location !== 'string') {
    return { country: null, countryCode: null, city: null };
  }

  const locationStr = location.trim();
  
  const locationMap = {
    '韩国': { country: '韩国', countryCode: 'KR' },
    '中国': { country: '中国', countryCode: 'CN' },
    '美国': { country: '美国', countryCode: 'US' },
    '日本': { country: '日本', countryCode: 'JP' },
    '英国': { country: '英国', countryCode: 'GB' },
    '法国': { country: '法国', countryCode: 'FR' },
    '德国': { country: '德国', countryCode: 'DE' },
  };

  for (const [countryName, info] of Object.entries(locationMap)) {
    if (locationStr.includes(countryName)) {
      const city = locationStr.replace(countryName, '').trim();
      return {
        country: info.country,
        countryCode: info.countryCode,
        city: city || null
      };
    }
  }

  // 如果无法解析，将整个字符串作为城市
  return {
    country: null,
    countryCode: null,
    city: locationStr
  };
}

async function fixUserLocations() {
  try {
    console.log('🔧 开始修复用户位置信息...\n');
    
    // 获取所有有location字段的用户
    const users = await prisma.user.findMany({
      where: {
        location: {
          not: null
        }
      },
      select: {
        id: true,
        username: true,
        location: true,
        country: true,
        countryCode: true,
        city: true
      }
    });

    console.log(`找到 ${users.length} 个有位置信息的用户\n`);

    let updatedCount = 0;

    for (const user of users) {
      console.log(`处理用户: ${user.username}`);
      console.log(`  当前 location: "${user.location}"`);
      console.log(`  当前结构化位置: country="${user.country}", city="${user.city}"`);
      
      // 解析location字段
      const parsedLocation = parseLocation(user.location);
      console.log(`  解析结果: country="${parsedLocation.country}", countryCode="${parsedLocation.countryCode}", city="${parsedLocation.city}"`);
      
      // 检查是否需要更新
      const needsUpdate = 
        user.country !== parsedLocation.country ||
        user.countryCode !== parsedLocation.countryCode ||
        user.city !== parsedLocation.city;

      if (needsUpdate) {
        console.log(`  ✅ 需要更新，正在更新...`);
        
        await prisma.user.update({
          where: { id: user.id },
          data: {
            country: parsedLocation.country,
            countryCode: parsedLocation.countryCode,
            city: parsedLocation.city
          }
        });
        
        updatedCount++;
        console.log(`  ✅ 更新完成`);
      } else {
        console.log(`  ⏭️  无需更新`);
      }
      
      console.log('  ---');
    }

    console.log(`\n🎉 修复完成！共更新了 ${updatedCount} 个用户的位置信息`);

    // 验证结果
    console.log('\n🔍 验证修复结果...');
    const updatedUsers = await prisma.user.findMany({
      where: {
        location: {
          not: null
        }
      },
      select: {
        username: true,
        location: true,
        country: true,
        city: true
      }
    });

    updatedUsers.forEach(user => {
      console.log(`${user.username}: "${user.location}" → 📍 ${user.city} ${user.country}`);
    });

  } catch (error) {
    console.error('❌ 修复用户位置信息失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserLocations();
