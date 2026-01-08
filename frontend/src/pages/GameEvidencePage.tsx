import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { gamesAPI, disputesAPI } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { 
  ArrowLeft, 
  FileText, 
  Image, 
  Video, 
  File, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Users,
  Trophy,
  AlertTriangle,
  MessageSquare,
  Send,
  UserX
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

interface Participant {
  id: string;
  userId: string;
  user: {
    username: string;
    trustPoints: number;
  };
  evidenceSubmitted: boolean;
  evidenceType?: 'PHOTO' | 'VIDEO' | 'TEXT' | 'DOCUMENT';
  evidenceContent?: string;
  evidenceDescription?: string;
  selfReportedSuccess?: boolean;
  evidenceSubmittedAt?: string;
  peerEvaluationScore?: number;
  finalResult?: 'SUCCESS' | 'FAILURE' | 'DISPUTED';
}

interface GameData {
  id: string;
  title: string;
  description: string;
  status: string;
  creator: {
    id: string;
    username: string;
  };
  participants: Participant[];
  userParticipation?: Participant;
}

interface DisputeStats {
  totalParticipants: number;
  disputeCount: number;
  disputeThreshold: number;
  canDispute: boolean;
  hasDisputed: boolean;
  canRequestArbitration: boolean;
  arbitrationStatus?: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'RESOLVED';
}

const GameEvidencePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedEvidence, setSelectedEvidence] = useState<Participant | null>(null);
  const [showDisputeConfirm, setShowDisputeConfirm] = useState(false);
  const [showArbitrationForm, setShowArbitrationForm] = useState(false);
  const [arbitrationReason, setArbitrationReason] = useState('');

  // 获取游戏详情和参与者证据
  const { data: game, isLoading, error } = useQuery<GameData>(
    ['game-evidence', id],
    () => gamesAPI.getGame(id!).then(response => response.data),
    {
      enabled: !!id,
      refetchInterval: 30000, // 30秒刷新一次
    }
  );

  // 获取质疑统计信息
  const { data: disputeStats } = useQuery<DisputeStats>(
    ['game-dispute-stats', id],
    () => disputesAPI.getDisputes({ gameId: id }).then(response => response.data),
    {
      enabled: !!id && game?.status === 'COMPLETED',
      refetchInterval: 10000, // 10秒刷新一次
    }
  );

  // 提交质疑
  const disputeMutation = useMutation(
    () => disputesAPI.createDispute({ gameId: id, reason: 'Evidence dispute' }),
    {
      onSuccess: () => {
        toast.success('质疑已提交');
        queryClient.invalidateQueries(['game-dispute-stats', id]);
        setShowDisputeConfirm(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '提交质疑失败');
      },
    }
  );

  // 提交仲裁申请
  const arbitrationMutation = useMutation(
    (data: { reason: string }) => disputesAPI.createDispute({ gameId: id, reason: data.reason }),
    {
      onSuccess: () => {
        toast.success('仲裁申请已提交，等待管理员处理');
        queryClient.invalidateQueries(['game-dispute-stats', id]);
        setShowArbitrationForm(false);
        setArbitrationReason('');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '提交仲裁申请失败');
      },
    }
  );

  const getEvidenceIcon = (type?: string) => {
    switch (type) {
      case 'PHOTO': return <Image className="w-4 h-4 text-blue-600" />;
      case 'VIDEO': return <Video className="w-4 h-4 text-purple-600" />;
      case 'TEXT': return <FileText className="w-4 h-4 text-green-600" />;
      case 'DOCUMENT': return <File className="w-4 h-4 text-orange-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getResultBadge = (participant: Participant) => {
    if (!participant.evidenceSubmitted) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <XCircle className="w-3 h-3 mr-1" />
          未提交
        </span>
      );
    }

    if (participant.finalResult) {
      switch (participant.finalResult) {
        case 'SUCCESS':
          return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              成功
            </span>
          );
        case 'FAILURE':
          return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <XCircle className="w-3 h-3 mr-1" />
              失败
            </span>
          );
        case 'DISPUTED':
          return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <AlertTriangle className="w-3 h-3 mr-1" />
              争议中
            </span>
          );
      }
    }

    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <Clock className="w-3 h-3 mr-1" />
        评估中
      </span>
    );
  };

  const canViewEvidence = (participant: Participant) => {
    if (!user || !game) return false;

    // 发起人可以查看所有证据
    if (game.creator.id === user.id) return true;

    // 参与者可以查看自己的证据
    if (participant.userId === user.id) return true;

    // 互评阶段和游戏完成后，参与者可以查看其他人的证据
    if (['PEER_REVIEW', 'COMPLETED'].includes(game.status) && game.userParticipation) {
      return true;
    }

    return false;
  };

  const renderEvidencePreview = (participant: Participant) => {
    if (!participant.evidenceSubmitted || !participant.evidenceContent) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>该用户未提交证据</p>
        </div>
      );
    }

    switch (participant.evidenceType) {
      case 'PHOTO':
        return (
          <img
            src={participant.evidenceContent}
            alt="证据图片"
            className="max-w-full max-h-64 rounded-lg mx-auto"
          />
        );
      case 'VIDEO':
        return (
          <video
            src={participant.evidenceContent}
            controls
            className="max-w-full max-h-64 rounded-lg mx-auto"
          />
        );
      case 'TEXT':
        return (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800 whitespace-pre-wrap">{participant.evidenceContent}</p>
          </div>
        );
      case 'DOCUMENT':
        return (
          <div className="text-center py-8">
            <File className="w-16 h-16 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">文档类型证据</p>
            <a
              href={participant.evidenceContent}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              查看文档
            </a>
          </div>
        );
      default:
        return <p className="text-gray-500">未知证据类型</p>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">加载失败，请重试</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          返回
        </button>
      </div>
    );
  }

  // 检查用户是否有权限查看此页面
  const hasPermission = game.userParticipation || game.creator.id === user?.id;
  if (!hasPermission) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">无权限访问</h3>
        <p className="text-gray-500 mb-4">只有游戏参与者才能查看证据汇总</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          返回
        </button>
      </div>
    );
  }

  const submittedCount = game.participants.filter(p => p.evidenceSubmitted).length;
  const totalCount = game.participants.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{game.title}</h1>
                <p className="text-sm text-gray-500">证据汇总</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {submittedCount}/{totalCount} 已提交
                </p>
                <p className="text-xs text-gray-500">证据提交率</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 游戏状态提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                游戏状态: {game.status === 'EVIDENCE_SUBMISSION' ? '证据提交中' : 
                         game.status === 'PEER_REVIEW' ? '互评进行中' : 
                         game.status === 'COMPLETED' ? '已完成' : '进行中'}
              </p>
              <p className="text-xs text-blue-700">
                {game.status === 'EVIDENCE_SUBMISSION' && '参与者正在提交证据'}
                {game.status === 'PEER_REVIEW' && '参与者正在互相评价证据'}
                {game.status === 'COMPLETED' && '游戏已完成，可查看最终结果'}
              </p>
            </div>
          </div>
        </div>

        {/* 质疑和仲裁区域 */}
        {game.status === 'COMPLETED' && disputeStats && game.userParticipation && (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">结果质疑</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{disputeStats.disputeCount}</span> / {disputeStats.totalParticipants} 人提出质疑
                  </div>
                  <div className="text-xs text-gray-500">
                    需要 {disputeStats.disputeThreshold} 人质疑才能提交仲裁
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {!disputeStats.hasDisputed ? (
                    <button
                      onClick={() => setShowDisputeConfirm(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                      disabled={disputeMutation.isLoading}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>我有质疑</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2 text-yellow-600">
                      <UserX className="w-4 h-4" />
                      <span className="text-sm">您已提出质疑</span>
                    </div>
                  )}

                  {disputeStats.canRequestArbitration && !disputeStats.arbitrationStatus && (
                    <button
                      onClick={() => setShowArbitrationForm(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>提交管理员</span>
                    </button>
                  )}

                  {disputeStats.arbitrationStatus && (
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        disputeStats.arbitrationStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        disputeStats.arbitrationStatus === 'IN_REVIEW' ? 'bg-blue-100 text-blue-800' :
                        disputeStats.arbitrationStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        disputeStats.arbitrationStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {disputeStats.arbitrationStatus === 'PENDING' && '仲裁待处理'}
                        {disputeStats.arbitrationStatus === 'IN_REVIEW' && '仲裁审核中'}
                        {disputeStats.arbitrationStatus === 'APPROVED' && '仲裁已批准'}
                        {disputeStats.arbitrationStatus === 'REJECTED' && '仲裁已拒绝'}
                        {disputeStats.arbitrationStatus === 'RESOLVED' && '仲裁已解决'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 质疑进度条 */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((disputeStats.disputeCount / disputeStats.disputeThreshold) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{disputeStats.disputeThreshold} (仲裁阈值)</span>
              </div>
            </div>
          </div>
        )}

        {/* 参与者证据列表 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                参与者证据 ({submittedCount}/{totalCount})
              </h2>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {game.participants.map((participant) => (
              <div key={participant.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {participant.user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        @{participant.user.username}
                        {participant.userId === game.creator.id && (
                          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            发起人
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">
                        信任度: {participant.user.trustPoints}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {participant.evidenceSubmitted && (
                      <div className="flex items-center space-x-2">
                        {getEvidenceIcon(participant.evidenceType)}
                        <span className="text-sm text-gray-600">
                          {participant.evidenceType}
                        </span>
                      </div>
                    )}
                    {getResultBadge(participant)}
                  </div>
                </div>

                {/* 证据信息 */}
                {participant.evidenceSubmitted && (
                  <div className="mt-4 pl-14">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">
                            自评结果:
                          </span>
                          <span className={`text-sm ${
                            participant.selfReportedSuccess ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {participant.selfReportedSuccess ? '成功' : '失败'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {participant.evidenceSubmittedAt && 
                            new Date(participant.evidenceSubmittedAt).toLocaleString()}
                        </span>
                      </div>

                      {participant.evidenceDescription && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">
                            {participant.evidenceDescription}
                          </p>
                        </div>
                      )}

                      {canViewEvidence(participant) && (
                        <button
                          onClick={() => setSelectedEvidence(participant)}
                          className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="w-4 h-4" />
                          <span>查看证据</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 证据查看模态框 */}
      {selectedEvidence && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                @{selectedEvidence.user.username} 的证据
              </h3>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* 证据信息 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">证据类型:</span>
                    <span className="ml-2">{selectedEvidence.evidenceType}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">自评结果:</span>
                    <span className={`ml-2 ${
                      selectedEvidence.selfReportedSuccess ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedEvidence.selfReportedSuccess ? '成功' : '失败'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">提交时间:</span>
                    <span className="ml-2">
                      {selectedEvidence.evidenceSubmittedAt && 
                        new Date(selectedEvidence.evidenceSubmittedAt).toLocaleString()}
                    </span>
                  </div>
                  {selectedEvidence.peerEvaluationScore && (
                    <div>
                      <span className="font-medium text-gray-700">互评分数:</span>
                      <span className="ml-2">{selectedEvidence.peerEvaluationScore}/100</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 证据描述 */}
              {selectedEvidence.evidenceDescription && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">证据描述</h4>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    {selectedEvidence.evidenceDescription}
                  </div>
                </div>
              )}

              {/* 证据内容 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">证据内容</h4>
                <div className="border border-gray-200 rounded-lg p-4">
                  {renderEvidencePreview(selectedEvidence)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 质疑确认模态框 */}
      {showDisputeConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">确认质疑</h3>
              <button
                onClick={() => setShowDisputeConfirm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                您确定要对此游戏的结果提出质疑吗？
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>注意：</strong>质疑一旦提交无法撤销。当质疑人数达到 {disputeStats?.disputeThreshold} 人时，
                  可以向管理员申请仲裁。
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDisputeConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={disputeMutation.isLoading}
              >
                取消
              </button>
              <button
                onClick={() => disputeMutation.mutate()}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                disabled={disputeMutation.isLoading}
              >
                {disputeMutation.isLoading ? '提交中...' : '确认质疑'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 仲裁申请模态框 */}
      {showArbitrationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">申请仲裁</h3>
              <button
                onClick={() => setShowArbitrationForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                请简要说明申请仲裁的理由：
              </p>
              <input
                type="text"
                value={arbitrationReason}
                onChange={(e) => setArbitrationReason(e.target.value)}
                placeholder="请输入仲裁理由..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                maxLength={200}
              />
              <div className="text-xs text-gray-500 mt-1">
                {arbitrationReason.length}/200
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowArbitrationForm(false);
                  setArbitrationReason('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={arbitrationMutation.isLoading}
              >
                取消
              </button>
              <button
                onClick={() => arbitrationMutation.mutate({ reason: arbitrationReason })}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={arbitrationMutation.isLoading || !arbitrationReason.trim()}
              >
                {arbitrationMutation.isLoading ? '提交中...' : '提交'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameEvidencePage;
