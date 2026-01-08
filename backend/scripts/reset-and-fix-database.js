const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetAndFixDatabase() {
  console.log('🔧 开始重置和修复数据库...\n');

  try {
    // 1. 检查当前数据状态
    console.log('1. 检查当前数据状态...');
    const userCount = await prisma.user.count();
    const gameCount = await prisma.betGame.count();
    const templateCount = await prisma.gameTemplate.count();
    
    console.log(`当前状态: 用户=${userCount}, 游戏=${gameCount}, 模板=${templateCount}`);

    // 2. 如果没有模板数据，添加基础模板
    if (templateCount === 0) {
      console.log('\n2. 添加基础游戏模板...');
      const basicTemplates = [
        {
          name: 'daily_exercise',
          title: '每日运动',
          description: '承诺每天运动至少30分钟',
          category: 'FITNESS',
          evidenceType: 'PHOTO',
          isAgeRestricted: false,
          defaultDurationHours: 168, // 7天
          maxParticipants: 10,
          instructions: '每天拍摄运动照片或运动app截图',
          exampleEvidence: '跑步、健身房、瑜伽等运动照片',
          isActive: true,
        },
        {
          name: 'reading_habit',
          title: '每日阅读',
          description: '承诺每天阅读至少30分钟',
          category: 'LEARNING',
          evidenceType: 'PHOTO',
          isAgeRestricted: false,
          defaultDurationHours: 336, // 14天
          maxParticipants: 10,
          instructions: '每天拍摄阅读照片，包括书籍和阅读时长记录',
          exampleEvidence: '正在阅读的书籍照片，配上阅读笔记',
          isActive: true,
        },
        {
          name: 'water_intake',
          title: '每日饮水',
          description: '承诺每天喝足8杯水',
          category: 'HEALTH',
          evidenceType: 'PHOTO',
          isAgeRestricted: false,
          defaultDurationHours: 168,
          maxParticipants: 12,
          instructions: '每天记录饮水量，拍摄水杯或饮水app截图',
          exampleEvidence: '显示当日饮水量的app截图',
          isActive: true,
        }
      ];

      for (const template of basicTemplates) {
        try {
          await prisma.gameTemplate.create({ data: template });
          console.log(`✅ 添加模板: ${template.title}`);
        } catch (error) {
          console.log(`❌ 添加模板失败 ${template.title}: ${error.message}`);
        }
      }
    } else {
      console.log('\n2. 游戏模板已存在，跳过添加');
    }

    // 3. 创建测试用户（如果不存在）
    console.log('\n3. 检查测试用户...');
    let testUser = await prisma.user.findUnique({
      where: { username: 'testuser' }
    });

    if (!testUser) {
      console.log('创建测试用户...');
      const bcrypt = require('bcrypt');
      const passwordHash = await bcrypt.hash('testpassword123', 12);
      
      testUser = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@example.com',
          fullName: '测试用户',
          dateOfBirth: new Date('1990-01-01'),
          passwordHash,
          dailyGameLimit: 10,
        }
      });
      console.log('✅ 测试用户创建成功');
    } else {
      console.log('✅ 测试用户已存在');
    }

    // 4. 创建测试游戏（如果没有游戏）
    if (gameCount === 0) {
      console.log('\n4. 创建测试游戏...');
      
      const template = await prisma.gameTemplate.findFirst({
        where: { isActive: true }
      });

      if (template && testUser) {
        const testGame = {
          title: '测试游戏 - 每日运动挑战',
          description: '这是一个测试游戏，用于验证系统功能',
          creatorId: testUser.id,
          templateId: template.id,
          category: 'FITNESS',
          stakeType: 'FAVOR',
          evidenceType: 'PHOTO',
          evidenceInstructions: '请上传每日运动照片',
          maxParticipants: 5,
          startDate: new Date(Date.now() + 60 * 60 * 1000), // 1小时后开始
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后结束
          evidenceDeadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8天后截止
          visibility: 'PUBLIC',
          currentParticipants: 1,
        };

        try {
          const game = await prisma.betGame.create({
            data: testGame,
            include: {
              creator: {
                select: { username: true }
              }
            }
          });

          // 创建者自动参与
          await prisma.betParticipant.create({
            data: {
              gameId: game.id,
              userId: testUser.id,
            }
          });

          console.log('✅ 测试游戏创建成功');
          console.log(`   游戏ID: ${game.id}`);
          console.log(`   游戏标题: ${game.title}`);
          console.log(`   创建者: ${game.creator.username}`);

          // 立即测试能否查询到这个游戏
          console.log('\n5. 验证游戏查询...');
          const foundGame = await prisma.betGame.findUnique({
            where: { id: game.id },
            include: {
              creator: { select: { username: true } }
            }
          });

          if (foundGame) {
            console.log('✅ 游戏查询验证成功');
            console.log(`   确认标题: ${foundGame.title}`);
          } else {
            console.log('❌ 游戏查询验证失败 - 刚创建的游戏无法查询到！');
          }

        } catch (error) {
          console.log('❌ 测试游戏创建失败:', error.message);
        }
      } else {
        console.log('❌ 无法创建测试游戏：缺少模板或用户');
      }
    } else {
      console.log('\n4. 游戏数据已存在，跳过创建测试游戏');
    }

    // 6. 数据完整性检查
    console.log('\n6. 数据完整性检查...');
    
    // 检查孤立的参与者记录
    const orphanParticipants = await prisma.$queryRaw`
      SELECT bp.id, bp.game_id, bp.user_id 
      FROM bet_participants bp 
      LEFT JOIN bet_games bg ON bp.game_id = bg.id 
      WHERE bg.id IS NULL
    `;
    
    if (orphanParticipants.length > 0) {
      console.log(`⚠️ 发现 ${orphanParticipants.length} 个孤立的参与者记录`);
      console.log('清理孤立记录...');
      await prisma.$executeRaw`
        DELETE FROM bet_participants 
        WHERE game_id NOT IN (SELECT id FROM bet_games)
      `;
      console.log('✅ 孤立记录已清理');
    } else {
      console.log('✅ 没有孤立的参与者记录');
    }

    // 7. 最终状态检查
    console.log('\n7. 最终状态检查...');
    const finalUserCount = await prisma.user.count();
    const finalGameCount = await prisma.betGame.count();
    const finalTemplateCount = await prisma.gameTemplate.count();
    const finalParticipantCount = await prisma.betParticipant.count();
    
    console.log('最终状态:');
    console.log(`  用户: ${finalUserCount}`);
    console.log(`  游戏: ${finalGameCount}`);
    console.log(`  模板: ${finalTemplateCount}`);
    console.log(`  参与者: ${finalParticipantCount}`);

    console.log('\n🎉 数据库重置和修复完成！');

    if (finalGameCount > 0) {
      console.log('\n📋 测试建议:');
      console.log('1. 重启后端服务');
      console.log('2. 测试游戏列表API: GET /api/games');
      console.log('3. 测试游戏详情API: GET /api/games/{gameId}');
      console.log('4. 测试创建新游戏');
    }

  } catch (error) {
    console.error('❌ 重置和修复过程中出现错误:', error);
    console.error('错误详情:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行重置和修复
resetAndFixDatabase().catch(console.error);
