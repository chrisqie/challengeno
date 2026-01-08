import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { templateService } from '../services/templateService';
import { GameTemplate } from '../config/gameTemplates';

const DebugVipPage: React.FC = () => {
  const { user, login } = useAuthStore();
  const [templates, setTemplates] = useState<GameTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const loadTemplates = async () => {
    try {
      setLoading(true);
      addDebugInfo('🔍 开始加载模板...');
      
      const result = await templateService.getGameTemplates();
      setTemplates(result.data);
      
      const vipTemplates = result.data.filter(t => t.isVipOnly);
      const usableVipTemplates = result.data.filter(t => t.isVipOnly && t.canUse);
      
      addDebugInfo(`📊 总模板: ${result.data.length}`);
      addDebugInfo(`👑 VIP模板: ${vipTemplates.length}`);
      addDebugInfo(`✅ 可用VIP模板: ${usableVipTemplates.length}`);
      addDebugInfo(`📦 数据源: ${result.source}`);
      
      // 详细VIP模板信息
      vipTemplates.forEach(t => {
        addDebugInfo(`- ${t.title}: canUse=${t.canUse}, vipTier=${t.vipTier}, requiresVip=${t.requiresVip}`);
      });
      
    } catch (error) {
      addDebugInfo(`❌ 加载失败: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async (username: string, password: string) => {
    try {
      addDebugInfo(`🔐 尝试登录: ${username}`);
      const success = await login(username, password);
      if (success) {
        addDebugInfo(`✅ 登录成功: ${username}`);
        setTimeout(loadTemplates, 500); // 等待状态更新
      } else {
        addDebugInfo(`❌ 登录失败: ${username}`);
      }
    } catch (error) {
      addDebugInfo(`❌ 登录错误: ${error}`);
    }
  };

  const clearDebug = () => {
    setDebugInfo([]);
  };

  useEffect(() => {
    if (user) {
      addDebugInfo(`👤 当前用户: ${user.username} (VIP: ${user.isVip ? '是' : '否'})`);
      loadTemplates();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🔧 VIP模板调试页面</h1>
        
        {/* 用户信息 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">👤 用户状态</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>用户名:</strong> {user.username}</p>
              <p><strong>VIP状态:</strong> {user.isVip ? '✅ VIP用户' : '❌ 普通用户'}</p>
              <p><strong>管理员:</strong> {user.isAdmin ? '✅ 是' : '❌ 否'}</p>
            </div>
          ) : (
            <p className="text-gray-500">未登录</p>
          )}
        </div>

        {/* 测试按钮 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🧪 测试登录</h2>
          <div className="space-x-4">
            <button
              onClick={() => testLogin('admin', 'admin123')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={loading}
            >
              Admin用户
            </button>
            <button
              onClick={() => testLogin('testuser2', 'testuser2123')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              普通用户
            </button>
            <button
              onClick={() => testLogin('vipbasic', 'password123')}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              disabled={loading}
            >
              VIP用户
            </button>
            <button
              onClick={loadTemplates}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={loading}
            >
              重新加载模板
            </button>
            <button
              onClick={clearDebug}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              清除日志
            </button>
          </div>
        </div>

        {/* 调试信息 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📋 调试日志</h2>
          <div className="bg-gray-100 p-4 rounded max-h-64 overflow-y-auto">
            {debugInfo.length > 0 ? (
              debugInfo.map((info, index) => (
                <div key={index} className="text-sm font-mono mb-1">
                  {info}
                </div>
              ))
            ) : (
              <p className="text-gray-500">暂无调试信息</p>
            )}
          </div>
        </div>

        {/* 模板列表 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📋 模板列表</h2>
          {loading ? (
            <p>加载中...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map(template => (
                <div
                  key={template.id}
                  className={`p-4 border rounded-lg ${
                    template.isVipOnly ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
                  } ${
                    template.canUse === false ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{template.title}</h3>
                    <div className="flex space-x-1">
                      {template.isVipOnly && (
                        <span className="text-yellow-500">👑</span>
                      )}
                      {template.vipTier && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          template.vipTier === 'BASIC' ? 'bg-blue-100 text-blue-800' :
                          template.vipTier === 'PREMIUM' ? 'bg-purple-100 text-purple-800' :
                          template.vipTier === 'ELITE' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {template.vipTier}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>分类: {template.category}</div>
                    <div>最多参与: {template.maxParticipants}人</div>
                    <div>可用: {template.canUse !== false ? '✅ 是' : '❌ 否'}</div>
                    {template.isVipOnly && (
                      <div>需要VIP: {template.requiresVip ? '是' : '否'}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugVipPage;
