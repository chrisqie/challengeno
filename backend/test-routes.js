// 测试路由是否正确注册
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testRoutes() {
  console.log('🧪 开始测试路由...\n');

  // 测试1: 检查管理员状态
  try {
    const response = await axios.get(`${BASE_URL}/admin/check`);
    console.log('✅ GET /admin/check - 成功');
  } catch (error) {
    console.log('❌ GET /admin/check - 失败:', error.response?.status || error.message);
  }

  // 测试2: 检查最近活动路由
  try {
    const response = await axios.get(`${BASE_URL}/admin/stats/recent-activities?limit=10`);
    console.log('✅ GET /admin/stats/recent-activities - 成功');
  } catch (error) {
    console.log('❌ GET /admin/stats/recent-activities - 失败:', error.response?.status || error.message);
  }

  // 测试3: 检查封禁用户路由（需要token，这里只测试路由是否存在）
  try {
    const response = await axios.put(`${BASE_URL}/admin/users/test-id/ban`, {
      reason: '测试'
    });
    console.log('✅ PUT /admin/users/:id/ban - 路由存在');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ PUT /admin/users/:id/ban - 路由存在（需要认证）');
    } else if (error.response?.status === 404) {
      console.log('❌ PUT /admin/users/:id/ban - 路由不存在（404）');
    } else {
      console.log('⚠️  PUT /admin/users/:id/ban - 其他错误:', error.response?.status || error.message);
    }
  }

  console.log('\n✨ 测试完成');
}

testRoutes();

