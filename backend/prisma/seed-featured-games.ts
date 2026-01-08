import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 计算游戏热度分数
function calculateHotScore(game: any): number {
  const now = new Date();
  const createdAt = new Date(game.createdAt);
  const daysSinceCreated = Math.max(1, (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

  // 基础分数计算
  const viewScore = game.viewCount * 1.0; // 浏览量权重
  const participantScore = game.currentParticipants * 5.0; // 参与人数权重（更重要）
  const maxParticipantScore = (game.currentParticipants / game.maxParticipants) * 3.0; // 参与率权重

  // 时间衰减因子（新游戏有加成）
  const timeDecay = Math.max(0.1, 1 / Math.sqrt(daysSinceCreated));

  // 状态加成
  let statusBonus = 1.0;
  if (game.status === 'OPEN') statusBonus = 1.5; // 开放中的游戏有加成
  else if (game.status === 'IN_PROGRESS') statusBonus = 1.2; // 进行中的游戏有小加成

  // 总分计算
  const totalScore = (viewScore + participantScore + maxParticipantScore) * timeDecay * statusBonus;

  return Math.round(totalScore * 100) / 100; // 保留两位小数
}

async function seedFeaturedGames() {
  try {
    console.log('🌱 开始智能设置热门游戏...');

    // 获取所有活跃游戏
    const games = await prisma.betGame.findMany({
      where: {
        status: {
          in: ['OPEN', 'IN_PROGRESS', 'EVIDENCE_SUBMISSION', 'PEER_REVIEW']
        }
      },
      select: {
        id: true,
        title: true,
        status: true,
        viewCount: true,
        currentParticipants: true,
        maxParticipants: true,
        createdAt: true,
      }
    });

    if (games.length === 0) {
      console.log('❌ 没有找到活跃游戏，请先创建一些游戏');
      return;
    }

    // 计算每个游戏的热度分数
    const gamesWithScore = games.map(game => ({
      ...game,
      hotScore: calculateHotScore(game)
    }));

    // 按热度分数排序
    gamesWithScore.sort((a, b) => b.hotScore - a.hotScore);

    // 确定热门游戏数量（最多5个，至少1个）
    const featuredCount = Math.min(5, Math.max(1, Math.ceil(games.length * 0.2)));
    const featuredGameIds = gamesWithScore.slice(0, featuredCount).map(g => g.id);

    // 先清除所有热门状态
    await prisma.betGame.updateMany({
      data: { isFeatured: false }
    });

    // 设置新的热门游戏
    if (featuredGameIds.length > 0) {
      await prisma.betGame.updateMany({
        where: { id: { in: featuredGameIds } },
        data: { isFeatured: true }
      });
    }

    console.log(`🎉 智能设置了 ${featuredCount} 个热门游戏！`);

    // 输出热门游戏信息
    const topGames = gamesWithScore.slice(0, featuredCount);
    console.log('\n📊 热门游戏排行:');
    topGames.forEach((game, index) => {
      console.log(`${index + 1}. ${game.title}`);
      console.log(`   热度分数: ${game.hotScore}`);
      console.log(`   浏览量: ${game.viewCount}, 参与人数: ${game.currentParticipants}/${game.maxParticipants}`);
      console.log(`   状态: ${game.status}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ 智能设置热门游戏失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  seedFeaturedGames();
}

export { seedFeaturedGames };
