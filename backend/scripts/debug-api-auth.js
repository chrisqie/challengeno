const axios = require('axios');
const jwt = require('jsonwebtoken');

async function debugAPIAuth() {
  try {
    console.log('🔍 调试API认证和模板查询...');

    const baseURL = 'http://142.171.117.89/api';
    console.log('使用API地址:', baseURL);

    // 1. 登录获取token
    console.log('\n1. 登录admin用户...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });

    const token = loginResponse.data.accessToken;
    const user = loginResponse.data.user;
    
    console.log('✅ 登录成功');
    console.log(`   - 用户ID: ${user.id}`);
    console.log(`   - 用户名: ${user.username}`);
    console.log(`   - VIP状态: ${user.isVip}`);
    console.log(`   - 管理员: ${user.isAdmin}`);
    console.log(`   - Token: ${token.substring(0, 50)}...`);

    // 2. 解析JWT token
    console.log('\n2. 解析JWT token...');
    try {
      const decoded = jwt.decode(token);
      console.log('Token内容:', JSON.stringify(decoded, null, 2));
    } catch (error) {
      console.log('Token解析失败:', error.message);
    }

    // 3. 测试认证profile接口
    console.log('\n3. 测试认证profile接口...');
    try {
      const profileResponse = await axios.get(`${baseURL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Profile接口调用成功');
      console.log('Profile数据:', JSON.stringify(profileResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Profile接口调用失败:', error.response?.data || error.message);
    }

    // 4. 直接调用模板API并记录详细信息
    console.log('\n4. 调用模板API（带详细日志）...');
    
    const config = {
      method: 'GET',
      url: `${baseURL}/templates`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    console.log('请求配置:', JSON.stringify(config, null, 2));

    const templatesResponse = await axios(config);
    
    console.log('✅ 模板API调用成功');
    console.log(`响应状态: ${templatesResponse.status}`);
    console.log(`响应头: ${JSON.stringify(templatesResponse.headers, null, 2)}`);
    
    const templates = templatesResponse.data;
    console.log(`返回模板数量: ${templates.length}`);

    // 5. 分析返回的模板
    const freeTemplates = templates.filter(t => !t.isVipOnly);
    const vipTemplates = templates.filter(t => t.isVipOnly);

    console.log(`   - 免费模板: ${freeTemplates.length} 个`);
    console.log(`   - VIP模板: ${vipTemplates.length} 个`);

    if (vipTemplates.length > 0) {
      console.log('\n👑 VIP模板列表:');
      vipTemplates.forEach((template, index) => {
        console.log(`${index + 1}. ${template.title} (${template.vipTier})`);
      });
    } else {
      console.log('\n❌ 没有返回VIP模板！');
      
      // 6. 如果没有VIP模板，检查请求是否被正确处理
      console.log('\n🔍 检查请求处理...');
      
      // 尝试不带认证的请求
      try {
        const noAuthResponse = await axios.get(`${baseURL}/templates`);
        console.log(`无认证请求返回模板数量: ${noAuthResponse.data.length}`);
        
        if (noAuthResponse.data.length === templates.length) {
          console.log('⚠️  认证可能没有生效，返回结果相同');
        }
      } catch (error) {
        console.log('无认证请求失败（这是正常的）:', error.response?.status);
      }
    }

    // 7. 检查模板的完整数据结构
    console.log('\n📋 第一个模板的完整数据结构:');
    if (templates.length > 0) {
      console.log(JSON.stringify(templates[0], null, 2));
    }

  } catch (error) {
    console.error('❌ 调试失败:', error.response?.data || error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应头:', error.response.headers);
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  debugAPIAuth();
}

module.exports = { debugAPIAuth };
