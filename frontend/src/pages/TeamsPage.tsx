import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Users, Plus, Crown, Search, UserPlus, Globe, Shield, Lock } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { teamsAPI } from '../services/api';
import CreateTeamModal from '../components/CreateTeamModal';
import toast from 'react-hot-toast';

const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'my-teams' | 'discover'>('my-teams');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [myTeams, setMyTeams] = useState<any[]>([]);
  const [discoverTeams, setDiscoverTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const isVip = user?.isVip && user?.vipExpiresAt && new Date(user.vipExpiresAt) > new Date();

  // 获取用户团队
  const fetchMyTeams = async () => {
    try {
      setLoading(true);
      const response = await teamsAPI.getUserTeams();
      setMyTeams(response.data);
    } catch (error: any) {
      toast.error(t('teams.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  // 获取发现团队
  const fetchDiscoverTeams = async () => {
    try {
      setLoading(true);
      const response = await teamsAPI.discoverTeams();
      setDiscoverTeams(response.data);
    } catch (error: any) {
      toast.error(t('teams.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-teams') {
      fetchMyTeams();
    } else {
      fetchDiscoverTeams();
    }
  }, [activeTab]);

  const handleCreateTeam = () => {
    setShowCreateModal(true);
  };

  const handleJoinTeam = async (teamId: string) => {
    try {
      await teamsAPI.joinTeam({ teamId });
      toast.success(t('teams.joinSuccess'));
      fetchDiscoverTeams(); // 刷新发现列表
      fetchMyTeams(); // 刷新我的团队列表
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('teams.joinFailed'));
    }
  };

  const handleCreateSuccess = () => {
    fetchMyTeams(); // 刷新我的团队列表
    setActiveTab('my-teams'); // 切换到我的团队标签
  };

  const getTeamTypeIcon = (teamType: string) => {
    switch (teamType) {
      case 'CASUAL':
        return <Globe className="w-4 h-4 text-green-600" />;
      case 'COMPETITIVE':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'PRIVATE':
        return <Lock className="w-4 h-4 text-purple-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTeamTypeLabel = (teamType: string) => {
    switch (teamType) {
      case 'CASUAL':
        return t('teams.types.casual');
      case 'COMPETITIVE':
        return t('teams.types.competitive');
      case 'PRIVATE':
        return t('teams.types.private');
      default:
        return t('teams.title');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  {t('teams.title')}
                </h1>
                <p className="text-sm text-gray-600">{t('teams.subtitle')}</p>
              </div>
            </div>
            <button
              onClick={handleCreateTeam}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                ${isVip
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <Plus className="w-4 h-4" />
              {t('teams.createTeam')}
              {!isVip && <Crown className="w-4 h-4 text-yellow-500" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* VIP提示 */}
        {!isVip && (
          <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">{t('teams.vipPrompt.title')}</span>
            </div>
            <p className="text-sm text-yellow-700 mb-3">
              {t('teams.vipPrompt.description')}
            </p>
            <button
              onClick={() => navigate('/vip')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t('teams.vipPrompt.upgradeNow')}
            </button>
          </div>
        )}

        {/* 标签页 */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('my-teams')}
                className={`
                  px-6 py-3 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === 'my-teams'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {t('teams.tabs.myTeams')}
              </button>
              <button
                onClick={() => setActiveTab('discover')}
                className={`
                  px-6 py-3 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === 'discover'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {t('teams.tabs.discover')}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-600 mt-2">{t('teams.loading')}</p>
              </div>
            ) : activeTab === 'my-teams' ? (
              <div className="space-y-4">
                {myTeams.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">{t('teams.emptyMyTeams')}</p>
                    <button
                      onClick={handleCreateTeam}
                      className="mt-4 text-blue-500 hover:text-blue-600 font-medium"
                    >
                      {t('teams.createFirstTeam')}
                    </button>
                  </div>
                ) : (
                  myTeams.map((team) => (
                    <div key={team.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          {team.name}
                          {team.userRole === 'LEADER' && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              {t('teams.leader')}
                            </span>
                          )}
                        </h3>
                        <div className="text-sm text-gray-500">
                          {t('teams.memberCount', { current: team.memberCount, max: team.maxMembers })}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{team.description || t('teams.noDescription')}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {getTeamTypeIcon(team.teamType)}
                          {getTeamTypeLabel(team.teamType)}
                        </div>
                        <button
                          onClick={() => navigate(`/teams/${team.id}`)}
                          className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                        >
                          {t('teams.viewDetails')}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* 搜索框 */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={t('teams.searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {discoverTeams.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">{t('teams.emptyDiscover')}</p>
                  </div>
                ) : (
                  discoverTeams.map((team) => (
                    <div key={team.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          {team.name}
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {team.creator?.username}
                          </span>
                        </h3>
                        <div className="text-sm text-gray-500">
                          {t('teams.memberCount', { current: team.memberCount, max: team.maxMembers })}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{team.description || t('teams.noDescription')}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {getTeamTypeIcon(team.teamType)}
                          {getTeamTypeLabel(team.teamType)}
                        </div>
                        <button
                          onClick={() => handleJoinTeam(team.id)}
                          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          {t('teams.applyToJoin')}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 创建团队模态框 */}
      <CreateTeamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default TeamsPage;
