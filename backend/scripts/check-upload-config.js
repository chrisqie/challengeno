/**
 * 检查文件上传配置
 * 用于诊断 DigitalOcean Spaces 配置问题
 */

require('dotenv').config();

console.log('\n========================================');
console.log('📋 文件上传配置检查');
console.log('========================================\n');

// 检查必需的环境变量
const requiredVars = [
  'SPACES_ENDPOINT',
  'SPACES_REGION',
  'SPACES_BUCKET',
  'SPACES_ACCESS_KEY_ID',
  'SPACES_SECRET_ACCESS_KEY'
];

const optionalVars = [
  'CDN_ENDPOINT'
];

let allConfigured = true;
let hasWarning = false;

console.log('✅ 必需配置:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // 隐藏敏感信息
    if (varName.includes('KEY') || varName.includes('SECRET')) {
      console.log(`  ✓ ${varName}: ${value.substring(0, 8)}...`);
    } else {
      console.log(`  ✓ ${varName}: ${value}`);
    }

    // 检查 SPACES_ENDPOINT 是否包含协议
    if (varName === 'SPACES_ENDPOINT' && (value.startsWith('http://') || value.startsWith('https://'))) {
      console.log(`  ⚠️  警告: SPACES_ENDPOINT 不应该包含 http:// 或 https:// 前缀`);
      console.log(`     当前值: ${value}`);
      console.log(`     应该改为: ${value.replace(/^https?:\/\//, '')}`);
      hasWarning = true;
      allConfigured = false;
    }
  } else {
    console.log(`  ✗ ${varName}: 未配置 ❌`);
    allConfigured = false;
  }
});

console.log('\n📌 可选配置:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✓ ${varName}: ${value}`);
  } else {
    console.log(`  - ${varName}: 未配置 (将使用默认值)`);
  }
});

console.log('\n========================================');
if (allConfigured) {
  console.log('✅ 配置完整！文件上传功能应该可以正常工作');
  console.log('\n📝 CDN URL 示例:');
  const cdnEndpoint = process.env.CDN_ENDPOINT || 
    `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.cdn.digitaloceanspaces.com`;
  console.log(`   ${cdnEndpoint}/avatars/example.jpg`);
} else {
  console.log('❌ 配置不完整！请检查 .env 文件');
  console.log('\n📝 配置步骤:');
  console.log('1. 登录 DigitalOcean 控制台');
  console.log('2. 进入 API -> Spaces Keys');
  console.log('3. 创建新的 Spaces Access Key');
  console.log('4. 将密钥信息填入 .env 文件');
  console.log('\n示例配置:');
  console.log('SPACES_ENDPOINT=nyc3.digitaloceanspaces.com');
  console.log('SPACES_REGION=nyc3');
  console.log('SPACES_BUCKET=your-bucket-name');
  console.log('SPACES_ACCESS_KEY_ID=DO00XXXXXXXXXXXX');
  console.log('SPACES_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  console.log('CDN_ENDPOINT=https://your-bucket-name.nyc3.cdn.digitaloceanspaces.com');
}
console.log('========================================\n');

process.exit(allConfigured ? 0 : 1);

