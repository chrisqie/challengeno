import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Crown,
  Settings,
  UserPlus,
  UserMinus,
  Copy,
  Globe,
  Shield,
  Lock,
  Calendar,
  Trophy,
  Gamepad2,
  Plus
} from 'lucide-react';
import { teamsAPI } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import CreateTeamGameModal from '../components/CreateTeamGameModal';
import toast from 'react-hot-toast';

const TeamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);
  const [teamGames, setTeamGames] = useState<any[]>([]);
  const [availableGames, setAvailableGames] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'games' | 'available'>('info');

  useEffect(() => {
    if (id) {
      fetchTeamDetail();
      fetchTeamGames();
      fetchAvailableGames();
    }
  }, [id]);

  useEffect(() => {
    if (activeTab === 'games') {
      fetchTeamGames();
    } else if (activeTab === 'available') {
      fetchAvailableGames();
    }
  }, [activeTab]);

  const fetchTeamDetail = async () => {
    try {
      setLoading(true);
      const response = await teamsAPI.getTeamById(id!);
      setTeam(response.data);
    } catch (error: any) {
      toast.error('获取团队详情失败');
      navigate('/teams');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamGames = async () => {
    try {
      const response = await teamsAPI.getTeamGames(id!);
      setTeamGames(response.data);
    } catch (error: any) {
      console.error('获取团队游戏失败:', error);
    }
  };

  const fetchAvailableGames = async () => {
    try {
      const response = await teamsAPI.getAvailableTeamGames(id!);
      setAvailableGames(response.data);
    } catch (error: any) {
      console.error('获取可用游戏失败:', error);
    }
  };

  const handleLeaveTeam = async () => {
    if (!confirm('确定要离开这个团队吗？')) return;
    
    try {
      await teamsAPI.leaveTeam(id!);
      toast.success('已离开团队');
      navigate('/teams');
    } catch (error: any) {
      toast.error(error.response?.data?.message || '离开团队失败');
    }
  };

  const handleKickMember = async (userId: string, username: string) => {
    if (!confirm(`确定要踢出成员 ${username} 吗？`)) return;
    
    try {
      await teamsAPI.kickMember({ teamId: id!, userId });
      toast.success('成功踢出成员');
      fetchTeamDetail(); // 刷新团队详情
    } catch (error: any) {
      toast.error(error.response?.data?.message || '踢出成员失败');
    }
  };

  const copyInviteCode = () => {
    if (team?.inviteCode) {
      navigator.clipboard.writeText(team.inviteCode);
      toast.success('邀请码已复制到剪贴板');
    }
  };

  const handleJoinGame = async (gameId: string) => {
    try {
      await teamsAPI.joinTeamGame(id!, gameId);
      toast.success('团队已成功参与游戏！');
      fetchTeamGames();
      fetchAvailableGames();
    } catch (error: any) {
      toast.error(error.response?.data?.message || '参与游戏失败');
    }
  };

  const handleLeaveGame = async (gameId: string) => {
    if (!confirm('确定要退出这个游戏吗？')) return;

    try {
      await teamsAPI.leaveTeamGame(id!, gameId);
      toast.success('团队已退出游戏');
      fetchTeamGames();
      fetchAvailableGames();
    } catch (error: any) {
      toast.error(error.response?.data?.message || '退出游戏失败');
    }
  };

  const handleCreateGameSuccess = (gameId: string) => {
    fetchTeamGames();
    fetchAvailableGames();
    navigate(`/game/${gameId}`);
  };

  const getTeamTypeIcon = (teamType: string) => {
    switch (teamType) {
      case 'CASUAL':
        return <Globe className="w-5 h-5 text-green-600" />;
      case 'COMPETITIVE':
        return <Shield className="w-5 h-5 text-blue-600" />;
      case 'PRIVATE':
        return <Lock className="w-5 h-5 text-purple-600" />;
      default:
        return <Users className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTeamTypeLabel = (teamType: string) => {
    switch (teamType) {
      case 'CASUAL':
        return '休闲团队';
      case 'COMPETITIVE':
        return '竞技团队';
      case 'PRIVATE':
        return '私密团队';
      default:
        return '团队';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">团队不存在</h2>
          <button
            onClick={() => navigate('/teams')}
            className="text-blue-500 hover:text-blue-600"
          >
            返回团队列表
          </button>
        </div>
      </div>
    );
  }

  const isLeader = team.userRole === 'LEADER';
  const isMember = team.userRole === 'MEMBER' || team.userRole === 'LEADER';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 头部 */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/teams')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">团队详情</h1>
        </div>

        {/* 团队信息卡片 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {getTeamTypeIcon(team.teamType)}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{team.name}</h2>
                <p className="text-gray-600">{getTeamTypeLabel(team.teamType)}</p>
              </div>
            </div>
            {isLeader && (
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            )}
          </div>

          {team.description && (
            <p className="text-gray-700 mb-4">{team.description}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{team.memberCount}</div>
              <div className="text-sm text-gray-600">成员数量</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{team.maxMembers}</div>
              <div className="text-sm text-gray-600">最大成员</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{team.recentGames?.length || 0}</div>
              <div className="text-sm text-gray-600">最近游戏</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {new Date(team.createdAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">创建时间</div>
            </div>
          </div>

          {/* 邀请码 */}
          {isLeader && team.inviteCode && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">团队邀请码</h3>
                  <p className="text-sm text-gray-600">分享此邀请码让其他人加入团队</p>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-white px-3 py-2 rounded border text-sm font-mono">
                    {team.inviteCode}
                  </code>
                  <button
                    onClick={copyInviteCode}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-3">
            {isMember && !isLeader && (
              <button
                onClick={handleLeaveTeam}
                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
              >
                <UserMinus className="w-4 h-4" />
                离开团队
              </button>
            )}
            {isLeader && (
              <>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  <UserPlus className="w-4 h-4" />
                  邀请成员
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  团队设置
                </button>
              </>
            )}
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'info'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                团队信息
              </button>
              <button
                onClick={() => setActiveTab('games')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'games'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Trophy className="w-4 h-4 inline mr-2" />
                团队游戏
              </button>
              <button
                onClick={() => setActiveTab('available')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'available'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Gamepad2 className="w-4 h-4 inline mr-2" />
                可参与游戏
              </button>
            </nav>
          </div>

          {/* 标签页内容 */}
          <div className="p-6">
            {activeTab === 'info' && (
              <div>
                {/* 成员列表 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">团队成员</h3>
                  <div className="space-y-3">
            {team.members?.map((member: any) => (
              <div key={member.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      {member.user.fullName || member.user.username}
                      {member.role === 'LEADER' && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          队长
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      加入时间: {new Date(member.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {isLeader && member.role !== 'LEADER' && (
                  <button
                    onClick={() => handleKickMember(member.userId, member.user.username)}
                    className="text-red-500 hover:text-red-600 text-sm"
                  >
                    踢出
                  </button>
                )}
              </div>
            ))}
                  </div>
                </div>

                {/* 最近游戏 */}
                {team.recentGames && team.recentGames.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      最近游戏
                    </h3>
                    <div className="space-y-3">
                      {team.recentGames.map((game: any) => (
                        <div key={game.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{game.title}</div>
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(game.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <span className={`
                            px-2 py-1 rounded text-xs font-medium
                            ${game.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              game.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'}
                          `}>
                            {game.status === 'COMPLETED' ? '已完成' :
                             game.status === 'IN_PROGRESS' ? '进行中' : '待开始'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 团队游戏标签页 */}
            {activeTab === 'games' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">团队游戏</h3>
                  {isLeader && (
                    <button
                      onClick={() => setShowCreateGameModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      创建团队游戏
                    </button>
                  )}
                </div>

                {teamGames.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Gamepad2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>团队还没有参与任何游戏</p>
                    {isLeader && (
                      <button
                        onClick={() => setShowCreateGameModal(true)}
                        className="mt-3 text-blue-500 hover:text-blue-600"
                      >
                        创建第一个团队游戏
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {teamGames.map((game: any) => (
                      <div key={game.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{game.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{game.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>模式: {game.teamMode === 'TEAM_VS_TEAM' ? '团队对抗' :
                                           game.teamMode === 'COLLABORATIVE' ? '协作模式' : '团队挑战'}</span>
                              <span>开始: {new Date(game.startDate).toLocaleDateString()}</span>
                              <span>结束: {new Date(game.endDate).toLocaleDateString()}</span>
                            </div>
                            {game.teamScore !== null && (
                              <div className="mt-2 flex items-center gap-2">
                                <span className="text-sm font-medium text-blue-600">
                                  团队得分: {game.teamScore}
                                </span>
                                {game.isWinner && (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                    🏆 获胜
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`
                              px-2 py-1 rounded text-xs font-medium
                              ${game.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                game.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'}
                            `}>
                              {game.status === 'COMPLETED' ? '已完成' :
                               game.status === 'IN_PROGRESS' ? '进行中' : '待开始'}
                            </span>
                            {isLeader && game.participationStatus === 'ACTIVE' && (
                              <button
                                onClick={() => handleLeaveGame(game.id)}
                                className="text-red-500 hover:text-red-700 text-xs"
                              >
                                退出
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 可参与游戏标签页 */}
            {activeTab === 'available' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">可参与的团队游戏</h3>

                {availableGames.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>暂时没有可参与的团队游戏</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availableGames.map((game: any) => (
                      <div key={game.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{game.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{game.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                              <span>创建者: {game.creator.username}</span>
                              <span>模式: {game.teamMode === 'TEAM_VS_TEAM' ? '团队对抗' :
                                           game.teamMode === 'COLLABORATIVE' ? '协作模式' : '团队挑战'}</span>
                              <span>团队数: {game.currentTeams}/{game.maxTeams || '∞'}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>团队规模: {game.minTeamSize || 1}-{game.maxTeamSize || '∞'}人</span>
                              <span>开始: {new Date(game.startDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {game.canJoin ? (
                              isLeader ? (
                                <button
                                  onClick={() => handleJoinGame(game.id)}
                                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
                                >
                                  参与游戏
                                </button>
                              ) : (
                                <span className="text-xs text-gray-500">仅队长可操作</span>
                              )
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                已满员
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 创建团队游戏模态框 */}
      <CreateTeamGameModal
        isOpen={showCreateGameModal}
        onClose={() => setShowCreateGameModal(false)}
        onSuccess={handleCreateGameSuccess}
      />
    </div>
  );
};

export default TeamDetailPage;
