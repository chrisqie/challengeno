const axios = require('axios');

async function testTemplatesAPI() {
  try {
    console.log('🔍 测试模板API...');

    // 检测服务器地址
    const baseURL = process.env.NODE_ENV === 'production'
      ? 'http://142.171.117.89/api'
      : 'http://localhost:3000/api';

    console.log('使用API地址:', baseURL);

    // 1. 先登录获取token
    console.log('1. 登录admin用户...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });

    const token = loginResponse.data.accessToken; // 注意这里是accessToken不是access_token
    console.log('✅ 登录成功，获取到token');

    // 2. 测试模板API
    console.log('2. 调用模板API...');
    const templatesResponse = await axios.get(`${baseURL}/templates`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const templates = templatesResponse.data;
    console.log(`📊 API返回模板数量: ${templates.length}`);

    // 3. 分析模板数据
    const freeTemplates = templates.filter(t => !t.isVipOnly);
    const vipTemplates = templates.filter(t => t.isVipOnly);

    console.log(`   - 免费模板: ${freeTemplates.length} 个`);
    console.log(`   - VIP模板: ${vipTemplates.length} 个`);

    console.log('\n📋 所有模板列表:');
    templates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.title}`);
      console.log(`   - ID: ${template.id}`);
      console.log(`   - name: ${template.name}`);
      console.log(`   - isVipOnly: ${template.isVipOnly}`);
      console.log(`   - vipTier: ${template.vipTier}`);
      console.log(`   - isActive: ${template.isActive}`);
      console.log('');
    });

    if (vipTemplates.length > 0) {
      console.log('👑 VIP模板详情:');
      vipTemplates.forEach((template, index) => {
        console.log(`${index + 1}. ${template.title} (${template.vipTier})`);
        console.log(`   - 描述: ${template.description.substring(0, 50)}...`);
      });
    } else {
      console.log('❌ 没有找到VIP模板！');
    }

  } catch (error) {
    console.error('❌ API测试失败:', error.response?.data || error.message);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  testTemplatesAPI();
}

module.exports = { testTemplatesAPI };
