import React, { useState } from 'react';
import { X, Users, Lock, Shield, Globe } from 'lucide-react';
import { teamsAPI } from '../services/api';
import { toast } from 'react-hot-toast';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxMembers: 10,
    teamType: 'CASUAL' as 'CASUAL' | 'COMPETITIVE' | 'PRIVATE',
  });
  const [loading, setLoading] = useState(false);

  const teamTypes = [
    {
      value: 'CASUAL',
      label: '休闲团队',
      description: '任何人都可以直接加入',
      icon: Globe,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      value: 'COMPETITIVE',
      label: '竞技团队',
      description: '需要审核才能加入',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      value: 'PRIVATE',
      label: '私密团队',
      description: '仅限邀请制',
      icon: Lock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('请输入团队名称');
      return;
    }

    if (formData.maxMembers < 2 || formData.maxMembers > 50) {
      toast.error('团队成员数量应在2-50之间');
      return;
    }

    setLoading(true);
    try {
      await teamsAPI.createTeam(formData);
      toast.success('团队创建成功！');
      onSuccess();
      onClose();
      setFormData({
        name: '',
        description: '',
        maxMembers: 10,
        teamType: 'CASUAL',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || '创建团队失败');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            创建团队
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 团队名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              团队名称 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入团队名称"
              maxLength={50}
            />
          </div>

          {/* 团队描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              团队描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="简单介绍一下你的团队..."
              rows={3}
              maxLength={200}
            />
          </div>

          {/* 最大成员数 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              最大成员数
            </label>
            <input
              type="number"
              value={formData.maxMembers}
              onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) || 10 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={2}
              max={50}
            />
          </div>

          {/* 团队类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              团队类型
            </label>
            <div className="space-y-3">
              {teamTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <label
                    key={type.value}
                    className={`
                      flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors
                      ${formData.teamType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="teamType"
                      value={type.value}
                      checked={formData.teamType === type.value}
                      onChange={(e) => setFormData({ ...formData, teamType: e.target.value as any })}
                      className="mt-1"
                    />
                    <div className={`p-2 rounded-lg ${type.bgColor}`}>
                      <Icon className={`w-4 h-4 ${type.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  </label>
                );
              })}
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
              {loading ? '创建中...' : '创建团队'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;
