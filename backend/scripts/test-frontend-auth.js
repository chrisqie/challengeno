const axios = require('axios');

async function testFrontendAuth() {
  try {
    console.log('🔍 测试前端认证状态...');

    const baseURL = 'http://142.171.117.89/api';

    // 1. 测试当前前端的认证状态
    console.log('\n1. 测试前端当前认证状态...');
    
    // 模拟前端可能使用的cookie或token
    try {
      const profileResponse = await axios.get(`${baseURL}/auth/profile`, {
        withCredentials: true,
        headers: {
          'Cookie': 'connect.sid=your-session-cookie' // 这里需要实际的cookie
        }
      });
      
      console.log('✅ 前端认证成功');
      console.log('当前用户:', profileResponse.data);
    } catch (error) {
      console.log('❌ 前端认证失败:', error.response?.status, error.response?.data?.message);
    }

    // 2. 检查admin登录
    console.log('\n2. 重新登录admin...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });

    const token = loginResponse.data.accessToken;
    const user = loginResponse.data.user;
    
    console.log('✅ Admin登录成功');
    console.log(`   - 用户: ${user.username}`);
    console.log(`   - VIP: ${user.isVip}`);
    console.log(`   - 管理员: ${user.isAdmin}`);

    // 3. 使用admin token测试模板API
    console.log('\n3. 使用admin token测试模板API...');
    const templatesResponse = await axios.get(`${baseURL}/templates`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const templates = templatesResponse.data;
    const vipTemplates = templates.filter(t => t.isVipOnly);
    
    console.log(`📊 Admin看到的模板:`);
    console.log(`   - 总数: ${templates.length}`);
    console.log(`   - VIP模板: ${vipTemplates.length}`);
    
    if (vipTemplates.length > 0) {
      console.log('\n👑 VIP模板列表:');
      vipTemplates.forEach((template, index) => {
        console.log(`${index + 1}. ${template.title} (${template.vipTier})`);
      });
    }

    // 4. 测试普通用户
    console.log('\n4. 测试普通用户...');
    try {
      const normalLoginResponse = await axios.post(`${baseURL}/auth/login`, {
        username: 'testuser2',
        password: 'testuser2123'
      });

      const normalToken = normalLoginResponse.data.accessToken;
      const normalUser = normalLoginResponse.data.user;
      
      console.log('✅ 普通用户登录成功');
      console.log(`   - 用户: ${normalUser.username}`);
      console.log(`   - VIP: ${normalUser.isVip}`);

      const normalTemplatesResponse = await axios.get(`${baseURL}/templates`, {
        headers: {
          'Authorization': `Bearer ${normalToken}`
        }
      });

      const normalTemplates = normalTemplatesResponse.data;
      const normalVipTemplates = normalTemplates.filter(t => t.isVipOnly);
      
      console.log(`📊 普通用户看到的模板:`);
      console.log(`   - 总数: ${normalTemplates.length}`);
      console.log(`   - VIP模板: ${normalVipTemplates.length}`);

    } catch (error) {
      console.log('❌ 普通用户测试失败:', error.response?.data?.message || error.message);
    }

    // 5. 检查前端是否正确传递认证信息
    console.log('\n5. 前端认证建议:');
    console.log('请确保前端:');
    console.log('- 使用admin账号登录');
    console.log('- 正确存储和传递JWT token');
    console.log('- API调用时包含Authorization头');
    console.log(`- Admin Token: ${token.substring(0, 50)}...`);

  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  testFrontendAuth();
}

module.exports = { testFrontendAuth };
