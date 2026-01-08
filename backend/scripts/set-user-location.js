// 手动设置特定用户的位置信息
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setUserLocation() {
  try {
    console.log('🔧 手动设置用户位置信息...\n');
    
    // 你可以修改这里的用户名和位置信息
    const targetUsername = 'test456'; // 修改为你的用户名
    const locationText = '日本东京';   // 修改为你想要的位置
    
    console.log(`目标用户: ${targetUsername}`);
    console.log(`设置位置: ${locationText}\n`);
    
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { username: targetUsername },
      select: {
        id: true,
        username: true,
        location: true,
        country: true,
        countryCode: true,
        city: true
      }
    });

    if (!user) {
      console.log(`❌ 用户 ${targetUsername} 不存在`);
      return;
    }

    console.log('当前用户信息:');
    console.log(`  location: "${user.location || '未设置'}"`);
    console.log(`  country: "${user.country || '未设置'}"`);
    console.log(`  city: "${user.city || '未设置'}"`);
    console.log('');

    // 位置解析函数
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

    // 解析位置
    const parsedLocation = parseLocation(locationText);
    console.log('解析结果:');
    console.log(`  country: "${parsedLocation.country}"`);
    console.log(`  countryCode: "${parsedLocation.countryCode}"`);
    console.log(`  city: "${parsedLocation.city}"`);
    console.log('');

    // 更新用户信息
    console.log('正在更新用户信息...');
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        location: locationText,
        country: parsedLocation.country,
        countryCode: parsedLocation.countryCode,
        city: parsedLocation.city
      },
      select: {
        username: true,
        location: true,
        country: true,
        countryCode: true,
        city: true
      }
    });

    console.log('✅ 更新完成！');
    console.log('更新后的用户信息:');
    console.log(`  location: "${updatedUser.location}"`);
    console.log(`  country: "${updatedUser.country}"`);
    console.log(`  city: "${updatedUser.city}"`);
    console.log(`  显示格式: 📍 ${updatedUser.city} ${updatedUser.country}`);

  } catch (error) {
    console.error('❌ 设置用户位置信息失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setUserLocation();
