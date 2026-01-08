import React, { useState, useEffect } from 'react';
import { X, Users, Trophy, Target, Heart } from 'lucide-react';
import { gamesAPI } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

interface CreateTeamGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (gameId: string) => void;
}

const CreateTeamGameModal: React.FC<CreateTeamGameModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    teamMode: 'TEAM_VS_TEAM' as 'TEAM_VS_TEAM' | 'COLLABORATIVE' | 'TEAM_CHALLENGE',
    maxTeams: 4,
    minTeamSize: 3,
    maxTeamSize: 8,
    maxParticipants: 32, // 总参与人数上限
    category: 'SOCIAL' as any,
    evidenceType: 'PHOTO' as any,
    evidenceInstructions: '',
    stakeType: 'NONE' as any,
    startDate: '',
    endDate: '',
    evidenceDeadline: '',
    visibility: 'PUBLIC' as any,
  });
  const [loading, setLoading] = useState(false);

  const teamModes = [
    {
      value: 'TEAM_VS_TEAM',
      label: '团队对抗',
      description: '团队之间竞争，争夺胜利',
      icon: Trophy,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      value: 'COLLABORATIVE',
      label: '协作模式',
      description: '所有团队共同完成目标',
      icon: Heart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      value: 'TEAM_CHALLENGE',
      label: '团队挑战',
      description: '团队内部协作完成挑战',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  useEffect(() => {
    if (isOpen) {
      // 设置默认时间
      const now = new Date();
      const startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 明天
      const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 一周后
      const evidenceDeadline = new Date(endDate.getTime() + 24 * 60 * 60 * 1000); // 结束后一天

      setFormData(prev => ({
        ...prev,
        startDate: startDate.toISOString().slice(0, 16),
        endDate: endDate.toISOString().slice(0, 16),
        evidenceDeadline: evidenceDeadline.toISOString().slice(0, 16),
      }));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('请输入游戏标题');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('请输入游戏描述');
      return;
    }

    if (!formData.evidenceInstructions.trim()) {
      toast.error('请输入证据要求');
      return;
    }

    setLoading(true);
    try {
      const gameData = {
        ...formData,
        isTeamGame: true,
        // 计算总参与人数限制
        maxParticipants: formData.maxTeams * formData.maxTeamSize,
      };

      const response = await gamesAPI.createGame(gameData);
      toast.success('团队游戏创建成功！');
      onSuccess(response.data.id);
      onClose();
      
      // 重置表单
      setFormData({
        title: '',
        description: '',
        teamMode: 'TEAM_VS_TEAM',
        maxTeams: 4,
        minTeamSize: 3,
        maxTeamSize: 8,
        maxParticipants: 32,
        category: 'SOCIAL',
        evidenceType: 'PHOTO',
        evidenceInstructions: '',
        stakeType: 'NONE',
        startDate: '',
        endDate: '',
        evidenceDeadline: '',
        visibility: 'PUBLIC',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || '创建团队游戏失败');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isVip = user?.isVip && user?.vipExpiresAt && new Date(user.vipExpiresAt) > new Date();

  if (!isVip) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">需要VIP会员</h2>
            <p className="text-gray-600 mb-4">创建团队游戏需要VIP会员权限</p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onClose();
                  // 这里可以跳转到VIP页面
                }}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                升级VIP
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            创建团队游戏
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                游戏标题 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入团队游戏标题"
                maxLength={100}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                游戏描述 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="详细描述团队游戏规则和目标..."
                rows={3}
                maxLength={500}
              />
            </div>
          </div>

          {/* 团队游戏模式 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              游戏模式
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {teamModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <label
                    key={mode.value}
                    className={`
                      flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors
                      ${formData.teamMode === mode.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="teamMode"
                      value={mode.value}
                      checked={formData.teamMode === mode.value}
                      onChange={(e) => setFormData({ ...formData, teamMode: e.target.value as any })}
                      className="sr-only"
                    />
                    <div className={`p-3 rounded-lg ${mode.bgColor}`}>
                      <Icon className={`w-6 h-6 ${mode.color}`} />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{mode.label}</div>
                      <div className="text-xs text-gray-600">{mode.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 团队设置 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最大团队数
              </label>
              <input
                type="number"
                value={formData.maxTeams}
                onChange={(e) => setFormData({ ...formData, maxTeams: parseInt(e.target.value) || 2 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={2}
                max={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最小团队规模
              </label>
              <input
                type="number"
                value={formData.minTeamSize}
                onChange={(e) => setFormData({ ...formData, minTeamSize: parseInt(e.target.value) || 2 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={2}
                max={20}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最大团队规模
              </label>
              <input
                type="number"
                value={formData.maxTeamSize}
                onChange={(e) => setFormData({ ...formData, maxTeamSize: parseInt(e.target.value) || 5 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={formData.minTeamSize}
                max={50}
              />
            </div>
          </div>

          {/* 证据要求 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              证据要求 *
            </label>
            <textarea
              value={formData.evidenceInstructions}
              onChange={(e) => setFormData({ ...formData, evidenceInstructions: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="描述团队需要提交什么样的证据..."
              rows={2}
              maxLength={300}
            />
          </div>

          {/* 时间设置 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                开始时间
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                结束时间
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                证据截止时间
              </label>
              <input
                type="datetime-local"
                value={formData.evidenceDeadline}
                onChange={(e) => setFormData({ ...formData, evidenceDeadline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '创建中...' : '创建团队游戏'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamGameModal;
