/**
 * 清理重复的互评通知
 * 
 * 问题：每次提交互评时都会发送通知，导致通知数量过多
 * 解决：删除重复的 PEER_EVALUATION_STARTED 通知，每个游戏每个用户只保留一条
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 开始清理重复的互评通知...\n');
  
  // 1. 统计当前通知数量
  const totalNotifications = await prisma.notification.count();
  const unreadNotifications = await prisma.notification.count({
    where: { isRead: false }
  });
  const peerEvalNotifications = await prisma.notification.count({
    where: { type: 'PEER_EVALUATION_STARTED' }
  });
  
  console.log('📊 当前状态:');
  console.log(`   总通知数: ${totalNotifications}`);
  console.log(`   未读通知数: ${unreadNotifications}`);
  console.log(`   互评通知数: ${peerEvalNotifications}\n`);
  
  // 2. 查找所有互评通知
  const allPeerEvalNotifications = await prisma.notification.findMany({
    where: { type: 'PEER_EVALUATION_STARTED' },
    orderBy: { createdAt: 'asc' }
  });
  
  console.log(`📋 找到 ${allPeerEvalNotifications.length} 条互评通知\n`);
  
  // 3. 按用户和游戏分组
  const notificationsByUserAndGame = new Map<string, any[]>();
  
  for (const notification of allPeerEvalNotifications) {
    const data = notification.data as any;
    const gameId = data?.gameId;
    
    if (!gameId) {
      console.log(`⚠️  通知 ${notification.id} 没有 gameId，跳过`);
      continue;
    }
    
    const key = `${notification.userId}-${gameId}`;
    
    if (!notificationsByUserAndGame.has(key)) {
      notificationsByUserAndGame.set(key, []);
    }
    
    notificationsByUserAndGame.get(key)!.push(notification);
  }
  
  console.log(`📊 分组结果: ${notificationsByUserAndGame.size} 个用户-游戏组合\n`);
  
  // 4. 删除重复通知（每个用户-游戏组合只保留最早的一条）
  let deletedCount = 0;
  let keptCount = 0;
  
  for (const [key, notifications] of notificationsByUserAndGame.entries()) {
    if (notifications.length > 1) {
      // 保留最早的一条（已读的优先保留，如果有的话）
      const readNotification = notifications.find(n => n.isRead);
      const toKeep = readNotification || notifications[0];
      
      // 删除其他的
      const toDelete = notifications.filter(n => n.id !== toKeep.id);
      
      for (const notification of toDelete) {
        await prisma.notification.delete({
          where: { id: notification.id }
        });
        deletedCount++;
      }
      
      keptCount++;
      console.log(`✅ ${key}: 保留 1 条，删除 ${toDelete.length} 条`);
    } else {
      keptCount++;
    }
  }
  
  console.log(`\n📊 清理完成！`);
  console.log(`   保留: ${keptCount} 条`);
  console.log(`   删除: ${deletedCount} 条\n`);
  
  // 5. 检查清理后的状态
  const newTotalNotifications = await prisma.notification.count();
  const newUnreadNotifications = await prisma.notification.count({
    where: { isRead: false }
  });
  const newPeerEvalNotifications = await prisma.notification.count({
    where: { type: 'PEER_EVALUATION_STARTED' }
  });
  
  console.log('📊 清理后状态:');
  console.log(`   总通知数: ${newTotalNotifications} (减少 ${totalNotifications - newTotalNotifications})`);
  console.log(`   未读通知数: ${newUnreadNotifications} (减少 ${unreadNotifications - newUnreadNotifications})`);
  console.log(`   互评通知数: ${newPeerEvalNotifications} (减少 ${peerEvalNotifications - newPeerEvalNotifications})`);
  
  console.log('\n✅ 清理完成！');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

