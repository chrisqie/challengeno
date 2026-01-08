/**
 * Resend API Key 测试脚本
 * 
 * 使用方法：
 * 1. 在 .env 文件中设置 RESEND_API_KEY
 * 2. 运行: node scripts/test-resend.js
 */

const { Resend } = require('resend');
require('dotenv').config();

async function testResendAPIKey() {
  console.log('🔍 开始测试 Resend API Key...\n');

  // 检查环境变量
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ 错误: 未找到 RESEND_API_KEY 环境变量');
    console.log('请在 .env 文件中添加: RESEND_API_KEY=your_api_key_here');
    process.exit(1);
  }

  console.log(`✅ API Key 已找到: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
  console.log(`   长度: ${apiKey.length} 字符\n`);

  // 初始化 Resend
  const resend = new Resend(apiKey);

  // 测试邮件配置
  const fromDomain = process.env.EMAIL_FROM_DOMAIN || 'yesfreedom.news';
  const fromName = process.env.EMAIL_FROM_NAME || 'BetTogether';
  const fromEmail = `${fromName} <noreply@${fromDomain}>`;
  
  console.log(`📧 发件人配置: ${fromEmail}\n`);

  // 发送测试邮件
  console.log('📤 正在发送测试邮件...');
  
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: ['delivered@resend.dev'], // Resend 提供的测试邮箱
      subject: 'Resend API Key 测试邮件',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success { color: #10b981; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Resend API 测试成功！</h1>
            </div>
            <div class="content">
              <p>恭喜！你的 Resend API Key 配置正确。</p>
              <p class="success">✅ 邮件服务已就绪</p>
              <p>测试时间: ${new Date().toLocaleString('zh-CN')}</p>
              <p>API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}</p>
              <p>发件人: ${fromEmail}</p>
              <hr>
              <p><strong>BetTogether 团队</strong></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Resend API Key 测试成功！测试时间: ${new Date().toLocaleString('zh-CN')}`,
    });

    if (error) {
      console.error('\n❌ 发送失败:', error);
      console.log('\n可能的原因:');
      console.log('1. API Key 无效或已过期');
      console.log('2. 发件域名未验证（需要在 Resend 控制台验证域名）');
      console.log('3. API Key 权限不足');
      console.log('\n请访问 https://resend.com/domains 验证你的域名');
      process.exit(1);
    }

    console.log('\n✅ 测试邮件发送成功！');
    console.log(`   邮件 ID: ${data?.id}`);
    console.log('\n📬 测试邮件已发送到: delivered@resend.dev');
    console.log('   这是 Resend 提供的测试邮箱，不会真实投递');
    console.log('\n🎉 Resend API Key 配置正确，可以正常使用！');
    console.log('\n下一步:');
    console.log('1. 在 Resend 控制台验证你的域名: https://resend.com/domains');
    console.log('2. 验证后即可向真实邮箱发送邮件');
    console.log('3. 开始开发密码找回功能');

  } catch (error) {
    console.error('\n❌ 发送过程出错:', error.message);
    console.log('\n错误详情:', error);
    process.exit(1);
  }
}

// 运行测试
testResendAPIKey().catch(error => {
  console.error('❌ 测试失败:', error);
  process.exit(1);
});

