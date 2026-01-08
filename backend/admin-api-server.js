const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://your-domain.com'],
  credentials: true
}));
app.use(express.json());

// JWT验证中间件
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// 管理员权限验证中间件
const verifyAdmin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.sub },
      select: { isAdmin: true, adminRole: true }
    });
    
    if (!user?.isAdmin) {
      return res.status(403).json({ error: '需要管理员权限' });
    }
    
    req.adminUser = user;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Database error' });
  }
};

// 管理员检查API
app.get('/api/admin/check', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.sub },
      select: { 
        id: true,
        username: true,
        isAdmin: true, 
        adminRole: true 
      },
    });

    res.json({
      isAdmin: user?.isAdmin || false,
      adminRole: user?.adminRole || null,
      message: user?.isAdmin ? '管理员验证成功' : '非管理员用户'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 管理员统计API
app.get('/api/admin/stats/overview', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalGames = await prisma.betGame.count();
    const totalAdmins = await prisma.user.count({
      where: { isAdmin: true }
    });

    res.json({
      totalUsers,
      totalGames,
      totalAdmins,
      activeUsers: totalUsers,
      pendingReports: 0,
      message: '统计数据获取成功'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 用户列表API
app.get('/api/admin/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        isAdmin: true,
        adminRole: true,
        createdAt: true,
        participationPoints: true,
        trustPoints: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({
      users,
      total: users.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 修复profile API
app.get('/api/auth/profile', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.sub }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      dateOfBirth: user.dateOfBirth,
      participationPoints: user.participationPoints,
      trustPoints: user.trustPoints,
      laborPoints: user.laborPoints,
      totalGamesCreated: user.totalGamesCreated,
      totalGamesJoined: user.totalGamesJoined,
      gamesCompleted: user.gamesCompleted,
      privacyMode: user.privacyMode,
      dailyGameLimit: user.dailyGameLimit,
      preferredLanguage: user.preferredLanguage,
      isVip: user.isVip,
      vipExpiresAt: user.vipExpiresAt,
      isAdmin: user.isAdmin,
      adminRole: user.adminRole,
      adminCreatedAt: user.adminCreatedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🚀 Admin API Server running on port ${PORT}`);
});
