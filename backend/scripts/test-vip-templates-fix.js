const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testVipTemplatesFix() {
  console.log('🔧 测试VIP模板修复...\n');

  try {
    // 1. 测试admin用户
    console.log('1. 测试admin用户...');
    const adminLogin = await axios.post(`${API_BASE}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    const adminToken = adminLogin.data.accessToken;
    console.log('✅ Admin登录成功');
    console.log('Admin token:', adminToken ? adminToken.substring(0, 20) + '...' : 'undefined');

    const adminTemplates = await axios.get(`${API_BASE}/templates`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    console.log(`📊 Admin看到的模板:`);
    console.log(`   - 总数: ${adminTemplates.data.length}`);
    console.log(`   - VIP模板: ${adminTemplates.data.filter(t => t.isVipOnly).length}`);
    console.log(`   - 可用模板: ${adminTemplates.data.filter(t => t.canUse).length}`);
    
    console.log('\n👑 VIP模板详情:');
    adminTemplates.data
      .filter(t => t.isVipOnly)
      .forEach(t => {
        console.log(`   • ${t.title} (${t.vipTier || 'ALL'}) - 可用: ${t.canUse ? '✅' : '❌'}`);
      });

    // 2. 测试普通用户
    console.log('\n2. 测试普通用户...');
    const userLogin = await axios.post(`${API_BASE}/auth/login`, {
      username: 'testuser2',
      password: 'testuser2123'
    });
    
    const userToken = userLogin.data.accessToken;
    console.log('✅ 普通用户登录成功');

    const userTemplates = await axios.get(`${API_BASE}/templates`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });

    console.log(`📊 普通用户看到的模板:`);
    console.log(`   - 总数: ${userTemplates.data.length}`);
    console.log(`   - VIP模板: ${userTemplates.data.filter(t => t.isVipOnly).length}`);
    console.log(`   - 可用模板: ${userTemplates.data.filter(t => t.canUse).length}`);
    
    console.log('\n👑 VIP模板详情:');
    userTemplates.data
      .filter(t => t.isVipOnly)
      .forEach(t => {
        console.log(`   • ${t.title} (${t.vipTier || 'ALL'}) - 可用: ${t.canUse ? '✅' : '❌'}`);
      });

    // 3. 创建和测试不同等级VIP用户
    console.log('\n3. 创建和测试不同等级VIP用户...');

    const vipUsers = [
      { username: 'vipbasic', tier: 'BASIC', email: 'vipbasic@test.com' },
      { username: 'vippremium', tier: 'PREMIUM', email: 'vippremium@test.com' },
      { username: 'vipelite', tier: 'ELITE', email: 'vipelite@test.com' }
    ];

    for (const vipUser of vipUsers) {
      console.log(`\n--- 测试 ${vipUser.tier} VIP用户 ---`);

      // 创建用户
      try {
        await axios.post(`${API_BASE}/auth/register`, {
          username: vipUser.username,
          email: vipUser.email,
          password: 'password123',
          fullName: `VIP ${vipUser.tier} User`,
          dateOfBirth: '1990-01-01'
        });
        console.log(`✅ ${vipUser.tier} VIP用户创建成功`);
      } catch (error) {
        if (error.response?.status === 409) {
          console.log(`ℹ️ ${vipUser.tier} VIP用户已存在`);
        } else {
          throw error;
        }
      }

      // 升级为对应等级VIP
      await axios.post(`${API_BASE}/vip/upgrade`, {
        username: vipUser.username,
        tier: vipUser.tier,
        duration: 30
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      // 登录VIP用户
      const vipLogin = await axios.post(`${API_BASE}/auth/login`, {
        username: vipUser.username,
        password: 'password123'
      });

      const vipToken = vipLogin.data.accessToken;
      console.log(`✅ ${vipUser.tier} VIP用户登录成功`);

      const vipTemplates = await axios.get(`${API_BASE}/templates`, {
        headers: { Authorization: `Bearer ${vipToken}` }
      });

      console.log(`📊 ${vipUser.tier} VIP用户看到的模板:`);
      console.log(`   - 总数: ${vipTemplates.data.length}`);
      console.log(`   - VIP模板: ${vipTemplates.data.filter(t => t.isVipOnly).length}`);
      console.log(`   - 可用模板: ${vipTemplates.data.filter(t => t.canUse).length}`);

      console.log('\n👑 VIP模板详情:');
      vipTemplates.data
        .filter(t => t.isVipOnly)
        .forEach(t => {
          console.log(`   • ${t.title} (${t.vipTier || 'ALL'}) - 可用: ${t.canUse ? '✅' : '❌'}`);
        });
    }

    // 4. 验证修复结果
    console.log('\n🎯 修复验证结果:');

    const adminVipCount = adminTemplates.data.filter(t => t.isVipOnly && t.canUse).length;
    const userVipVisible = userTemplates.data.filter(t => t.isVipOnly).length;
    const userVipUsable = userTemplates.data.filter(t => t.isVipOnly && t.canUse).length;

    console.log(`✅ Admin可用VIP模板: ${adminVipCount} (应该是4)`);
    console.log(`✅ 普通用户可见VIP模板: ${userVipVisible} (应该是4)`);
    console.log(`✅ 普通用户可用VIP模板: ${userVipUsable} (应该是0)`);

    // 验证不同等级VIP用户的权限
    console.log('\n📊 VIP等级权限验证:');
    console.log('- BASIC VIP应该能使用: 2个BASIC模板');
    console.log('- PREMIUM VIP应该能使用: 2个BASIC + 1个PREMIUM模板 = 3个');
    console.log('- ELITE VIP应该能使用: 2个BASIC + 1个PREMIUM + 1个ELITE模板 = 4个');

    if (adminVipCount === 4 && userVipVisible === 4 && userVipUsable === 0) {
      console.log('\n🎉 基础权限验证通过！');
      console.log('请检查上面的VIP等级权限是否正确。');
    } else {
      console.log('\n⚠️ 部分修复可能还有问题，请检查');
    }

  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
  }
}

testVipTemplatesFix();
