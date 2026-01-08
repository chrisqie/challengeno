// 简单的互评功能测试脚本
const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testPeerEvaluation() {
  try {
    // 测试数据
    const testData = {
      evaluatedUserId: 'test-user-id',
      evaluation: 'RECOGNIZE',
      reasoning: '测试评价理由'
    };

    console.log('测试互评API...');
    console.log('请求数据:', testData);

    // 这里需要实际的游戏ID和认证token
    const gameId = 'test-game-id';
    const token = 'test-token';

    const response = await axios.post(
      `${BASE_URL}/games/${gameId}/evaluate`,
      testData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('响应状态:', response.status);
    console.log('响应数据:', response.data);

  } catch (error) {
    console.error('测试失败:');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('错误信息:', error.response.data);
    } else {
      console.error('网络错误:', error.message);
    }
  }
}

// 验证DTO结构
function validatePeerEvaluationDto(data) {
  const errors = [];

  if (!data.evaluatedUserId) {
    errors.push('evaluatedUserId is required');
  }

  if (!data.evaluation) {
    errors.push('evaluation is required');
  } else if (!['RECOGNIZE', 'NOT_RECOGNIZE'].includes(data.evaluation)) {
    errors.push('evaluation must be RECOGNIZE or NOT_RECOGNIZE');
  }

  if (data.reasoning && typeof data.reasoning !== 'string') {
    errors.push('reasoning must be a string');
  }

  return errors;
}

// 测试DTO验证
console.log('测试DTO验证...');
const testCases = [
  { evaluatedUserId: 'user1', evaluation: 'RECOGNIZE', reasoning: '完成得很好' },
  { evaluatedUserId: 'user2', evaluation: 'NOT_RECOGNIZE' },
  { evaluatedUserId: '', evaluation: 'RECOGNIZE' }, // 应该失败
  { evaluatedUserId: 'user3', evaluation: 'INVALID' }, // 应该失败
];

testCases.forEach((testCase, index) => {
  const errors = validatePeerEvaluationDto(testCase);
  console.log(`测试用例 ${index + 1}:`, testCase);
  console.log('验证结果:', errors.length === 0 ? '通过' : errors);
  console.log('---');
});

// 如果需要实际测试，取消注释下面这行
// testPeerEvaluation();
