const axios = require('axios');

// 配置API基础URL
const API_BASE_URL = 'http://localhost:3000/api';

async function testAPIEndpoints() {
  console.log('🔍 开始测试API端点...\n');

  try {
    // 1. 测试健康检查端点
    console.log('1. 测试健康检查端点...');
    try {
      const healthResponse = await axios.get(`${API_BASE_URL}/health`);
      console.log('✅ 健康检查通过');
      console.log('   状态:', healthResponse.data.status);
      console.log('   数据库:', healthResponse.data.database);
      console.log('   运行时间:', Math.floor(healthResponse.data.uptime), '秒');
    } catch (error) {
      console.log('❌ 健康检查失败:', error.message);
      if (error.code === 'ECONNREFUSED') {
        console.log('   后端服务可能没有运行');
        return;
      }
    }
    console.log('');

    // 2. 测试游戏模板端点
    console.log('2. 测试游戏模板端点...');
    try {
      const templatesResponse = await axios.get(`${API_BASE_URL}/templates`);
      console.log('✅ 游戏模板端点正常');
      console.log('   模板数量:', templatesResponse.data.length);
      if (templatesResponse.data.length > 0) {
        console.log('   示例模板:', templatesResponse.data[0].title);
      }
    } catch (error) {
      console.log('❌ 游戏模板端点失败:', error.response?.status, error.message);
    }
    console.log('');

    // 3. 测试用户注册（创建测试用户）
    console.log('3. 测试用户认证...');

    let authToken = null;

    // 首先尝试登录已存在的测试用户
    const existingUsers = [
      { username: 'testuser', password: 'testpassword123' },
      { username: 'test789', password: 'testpassword123' },
      { username: 'admin', password: 'admin123' }
    ];

    for (const user of existingUsers) {
      try {
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
          username: user.username,
          password: user.password
        });
        authToken = loginResponse.data.access_token;
        console.log(`✅ 使用用户 ${user.username} 登录成功`);
        break;
      } catch (loginError) {
        console.log(`❌ 用户 ${user.username} 登录失败:`, loginError.response?.status);
      }
    }

    // 如果所有已存在用户都登录失败，尝试注册新用户
    if (!authToken) {
      console.log('尝试注册新用户...');
      const testUser = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'testpassword123',
        fullName: '测试用户',
        dateOfBirth: '1990-01-01'
      };

      try {
        const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
        console.log('✅ 用户注册成功');
        authToken = registerResponse.data.access_token;
        console.log('   用户名:', registerResponse.data.user.username);
        console.log('   Token获取成功');
      } catch (error) {
        console.log('❌ 用户注册失败:', error.response?.status, error.response?.data?.message || error.message);
      }
    }
    console.log('');

    if (!authToken) {
      console.log('❌ 无法获取认证token，跳过需要认证的测试');
      return;
    }

    // 4. 测试游戏列表端点
    console.log('4. 测试游戏列表端点...');
    try {
      const gamesResponse = await axios.get(`${API_BASE_URL}/games`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ 游戏列表端点正常');
      console.log('   游戏数量:', gamesResponse.data.games?.length || 0);
      console.log('   总数:', gamesResponse.data.total || 0);
      
      if (gamesResponse.data.games && gamesResponse.data.games.length > 0) {
        const firstGame = gamesResponse.data.games[0];
        console.log('   第一个游戏:', firstGame.title);
        console.log('   游戏ID:', firstGame.id);
        console.log('   状态:', firstGame.status);
        
        // 5. 测试单个游戏详情端点
        console.log('\n5. 测试游戏详情端点...');
        try {
          const gameDetailResponse = await axios.get(`${API_BASE_URL}/games/${firstGame.id}`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          console.log('✅ 游戏详情端点正常');
          console.log('   游戏标题:', gameDetailResponse.data.title);
          console.log('   创建者:', gameDetailResponse.data.creator.username);
          console.log('   参与者数量:', gameDetailResponse.data.participants?.length || 0);
        } catch (error) {
          console.log('❌ 游戏详情端点失败:', error.response?.status, error.response?.data?.message || error.message);
        }
      } else {
        console.log('   没有游戏数据，跳过游戏详情测试');
      }
    } catch (error) {
      console.log('❌ 游戏列表端点失败:', error.response?.status, error.response?.data?.message || error.message);
    }
    console.log('');

    // 6. 测试创建游戏端点
    console.log('6. 测试创建游戏端点...');
    const testGame = {
      title: `测试游戏_${Date.now()}`,
      description: '这是一个测试游戏',
      category: 'HEALTH',
      stakeType: 'FAVOR',
      evidenceType: 'PHOTO',
      evidenceInstructions: '请上传相关照片',
      maxParticipants: 5,
      startDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1小时后开始
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天后结束
      evidenceDeadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // 8天后截止
      visibility: 'PUBLIC'
    };

    try {
      const createGameResponse = await axios.post(`${API_BASE_URL}/games`, testGame, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ 游戏创建成功');
      console.log('   游戏ID:', createGameResponse.data.id);
      console.log('   游戏标题:', createGameResponse.data.title);
      console.log('   状态:', createGameResponse.data.status);
      
      // 立即测试能否获取刚创建的游戏
      const newGameId = createGameResponse.data.id;
      console.log('\n7. 测试刚创建游戏的访问...');
      try {
        const newGameResponse = await axios.get(`${API_BASE_URL}/games/${newGameId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ 刚创建的游戏可以正常访问');
        console.log('   确认标题:', newGameResponse.data.title);
      } catch (error) {
        console.log('❌ 刚创建的游戏无法访问 - 这就是404问题！');
        console.log('   错误状态:', error.response?.status);
        console.log('   错误信息:', error.response?.data?.message || error.message);
      }
      
    } catch (error) {
      console.log('❌ 游戏创建失败:', error.response?.status, error.response?.data?.message || error.message);
      if (error.response?.data) {
        console.log('   详细错误:', JSON.stringify(error.response.data, null, 2));
      }
    }

    console.log('\n🎉 API端点测试完成！');

  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error.message);
  }
}

// 运行测试
testAPIEndpoints().catch(console.error);
