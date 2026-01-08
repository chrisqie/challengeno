/**
 * 数据库清理脚本 - 清除 base64 文件数据
 * 
 * 功能：
 * 1. 清除所有证据的 base64 文件数据
 * 2. 清除所有用户的 base64 头像数据
 * 3. 重置证据提交状态
 * 4. 保留用户和游戏的结构数据
 * 
 * 使用方法：
 * npx ts-node backend/scripts/clean-base64-data.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanBase64Data() {
  console.log('🚀 开始清理 base64 数据...\n');

  try {
    // 1. 统计当前数据
    console.log('📊 统计当前数据...');
    const totalUsers = await prisma.user.count();
    const totalGames = await prisma.betGame.count();
    const totalParticipants = await prisma.betParticipant.count();
    const participantsWithEvidence = await prisma.betParticipant.count({
      where: { evidenceSubmitted: true }
    });
    const usersWithAvatar = await prisma.user.count({
      where: { avatar: { not: null } }
    });

    console.log(`  - 总用户数: ${totalUsers}`);
    console.log(`  - 总游戏数: ${totalGames}`);
    console.log(`  - 总参与记录: ${totalParticipants}`);
    console.log(`  - 已提交证据: ${participantsWithEvidence}`);
    console.log(`  - 有头像用户: ${usersWithAvatar}\n`);

    // 2. 清除证据数据
    console.log('🧹 清除证据数据...');
    const evidenceResult = await prisma.betParticipant.updateMany({
      where: {
        evidenceSubmitted: true,
      },
      data: {
        evidenceSubmitted: false,
        evidenceType: null,
        evidenceContent: null,
        evidenceSubmittedAt: null,
        selfReportedSuccess: null,
        peerEvaluationsReceived: 0,
        peerEvaluationsGiven: 0,
        finalResult: 'PENDING',
      },
    });
    console.log(`  ✅ 已清除 ${evidenceResult.count} 条证据记录\n`);

    // 3. 清除用户头像
    console.log('🧹 清除用户头像...');
    const avatarResult = await prisma.user.updateMany({
      where: {
        avatar: { not: null },
      },
      data: {
        avatar: null,
      },
    });
    console.log(`  ✅ 已清除 ${avatarResult.count} 个用户头像\n`);

    // 4. 重置游戏状态（可选）
    console.log('🔄 重置游戏状态...');
    
    // 将所有 EVIDENCE_SUBMISSION、PEER_REVIEW、COMPLETED 状态的游戏重置为 IN_PROGRESS
    const gameResetResult = await prisma.betGame.updateMany({
      where: {
        status: {
          in: ['EVIDENCE_SUBMISSION', 'PEER_REVIEW', 'COMPLETED']
        }
      },
      data: {
        status: 'IN_PROGRESS',
      },
    });
    console.log(`  ✅ 已重置 ${gameResetResult.count} 个游戏状态\n`);

    // 5. 统计清理后的数据
    console.log('📊 清理后统计...');
    const remainingEvidence = await prisma.betParticipant.count({
      where: { evidenceSubmitted: true }
    });
    const remainingAvatars = await prisma.user.count({
      where: { avatar: { not: null } }
    });

    console.log(`  - 剩余证据记录: ${remainingEvidence}`);
    console.log(`  - 剩余头像: ${remainingAvatars}\n`);

    // 6. 显示数据库大小估算
    console.log('💾 数据库优化建议:');
    console.log('  - 清理完成后，建议运行 VACUUM 命令优化数据库');
    console.log('  - PostgreSQL: VACUUM FULL;');
    console.log('  - 预计可节省 70-90% 的存储空间\n');

    console.log('✅ 清理完成！\n');
    console.log('📝 清理摘要:');
    console.log(`  - 清除证据: ${evidenceResult.count} 条`);
    console.log(`  - 清除头像: ${avatarResult.count} 个`);
    console.log(`  - 重置游戏: ${gameResetResult.count} 个`);
    console.log(`  - 保留用户: ${totalUsers} 个`);
    console.log(`  - 保留游戏: ${totalGames} 个\n`);

  } catch (error) {
    console.error('❌ 清理失败:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 执行清理
cleanBase64Data()
  .then(() => {
    console.log('🎉 脚本执行成功！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 脚本执行失败:', error);
    process.exit(1);
  });

