const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function debugAuth() {
  console.log('🔍 调试认证问题...\n');

  try {
    // 1. 测试登录
    console.log('1. 测试admin登录...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('✅ 登录成功');
    const token = loginResponse.data.token;
    if (token) {
      console.log('Token:', token.substring(0, 50) + '...');
    } else {
      console.log('❌ 没有收到token');
      return;
    }
    console.log('User:', loginResponse.data.user);
    

    
    // 2. 测试token格式
    console.log('\n2. 测试token格式...');
    const tokenParts = token.split('.');
    console.log('Token parts:', tokenParts.length);
    
    if (tokenParts.length === 3) {
      try {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        console.log('Token payload:', payload);
      } catch (e) {
        console.log('❌ Token解析失败:', e.message);
      }
    }
    
    // 3. 测试认证头格式
    console.log('\n3. 测试不同的认证头格式...');
    
    // 测试1: Bearer token
    try {
      console.log('测试 Bearer token...');
      const response1 = await axios.get(`${API_BASE}/templates`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Bearer token 成功');
      console.log('Templates count:', response1.data.length);
    } catch (error) {
      console.log('❌ Bearer token 失败:', error.response?.status, error.response?.data);
    }
    
    // 测试2: 直接token
    try {
      console.log('测试直接 token...');
      const response2 = await axios.get(`${API_BASE}/templates`, {
        headers: { 
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ 直接token 成功');
      console.log('Templates count:', response2.data.length);
    } catch (error) {
      console.log('❌ 直接token 失败:', error.response?.status, error.response?.data);
    }
    
    // 4. 测试其他API端点
    console.log('\n4. 测试其他认证端点...');
    
    try {
      console.log('测试用户信息API...');
      const userResponse = await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ 用户信息API成功');
      console.log('User info:', userResponse.data);
    } catch (error) {
      console.log('❌ 用户信息API失败:', error.response?.status, error.response?.data);
    }
    
    // 5. 检查服务器日志
    console.log('\n5. 请检查服务器日志 (pm2 logs bet-together)');
    
  } catch (error) {
    console.error('❌ 调试失败:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
  }
}

debugAuth();
