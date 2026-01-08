import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  Users,
  UserPlus,
  UserMinus,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Crown,
  Shield
} from 'lucide-react';
import { gamesAPI } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import { usePointsRefresh } from '../hooks/usePointsRefresh';
import { useTranslation } from 'react-i18next';

interface GameParticipationStatusProps {
  game: any;
  participants?: any[];
  className?: string;
}

const GameParticipationStatus: React.FC<GameParticipationStatusProps> = ({
  game,
  participants = [],
  className = ''
}) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [showJoinConfirm, setShowJoinConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  const { refreshPointsWithDelay } = usePointsRefresh();

  // 检查用户是否已参与
  const isParticipant = participants.some(p => p.userId === user?.id);
  const isCreator = game.creatorId === user?.id;
  // 更严格的时间窗口控制
  const now = new Date();
  const startDate = new Date(game.startDate);
  const isGameStarted = startDate <= now;

  const canJoin = game.status === 'OPEN' && !isParticipant && game.currentParticipants < game.maxParticipants && !isGameStarted;
  const canLeave = game.status === 'OPEN' && isParticipant && !isCreator && !isGameStarted;

  // 加入游戏
  const joinMutation = useMutation(
    () => gamesAPI.joinGame(game.id),
    {
      onSuccess: () => {
        toast.success(t('game.joinSuccess'), {
          duration: 3000,
          style: {
            background: '#10B981',
            color: 'white',
          }
        });
        queryClient.invalidateQueries(['game', game.id]);
        queryClient.invalidateQueries(['game-participants', game.id]);
        queryClient.invalidateQueries(['games']); // 刷新游戏列表
        setShowJoinConfirm(false);

        // 立即刷新积分数据
        refreshPointsWithDelay(1000); // 1秒后刷新积分
      },
      onError: (error: any) => {
        let message = '加入失败，请重试';

        if (error.response?.status === 400) {
          message = error.response.data?.message || '无法加入此挑战';
        } else if (error.response?.status === 403) {
          message = '权限不足或年龄限制';
        } else if (error.response?.status === 409) {
          message = '您已经参与了此挑战';
        }

        toast.error(message, {
          duration: 4000,
          style: {
            background: '#EF4444',
            color: 'white',
          }
        });
      },
    }
  );

  // 退出游戏
  const leaveMutation = useMutation(
    () => gamesAPI.leaveGame(game.id),
    {
      onSuccess: () => {
        toast.success(t('game.leaveSuccess'), {
          duration: 3000,
          style: {
            background: '#F59E0B',
            color: 'white',
          }
        });
        queryClient.invalidateQueries(['game', game.id]);
        queryClient.invalidateQueries(['game-participants', game.id]);
        queryClient.invalidateQueries(['games']); // 刷新游戏列表
        setShowLeaveConfirm(false);
      },
      onError: (error: any) => {
        let message = '退出失败，请重试';

        if (error.response?.status === 400) {
          message = error.response.data?.message || '无法退出此挑战';
        } else if (error.response?.status === 403) {
          message = '游戏创建者不能退出游戏';
        } else if (error.response?.status === 409) {
          message = '游戏已开始，无法退出';
        }

        toast.error(message, {
          duration: 4000,
          style: {
            background: '#EF4444',
            color: 'white',
          }
        });
      },
    }
  );

  // 获取状态信息
  const getStatusInfo = () => {
    switch (game.status) {
      case 'OPEN':
        return {
          icon: Clock,
          text: 'Open for Registration',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'IN_PROGRESS':
      case 'ACTIVE':
        return {
          icon: CheckCircle,
          text: 'In Progress',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'EVIDENCE_SUBMISSION':
        return {
          icon: AlertTriangle,
          text: 'Evidence Submission',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        };
      case 'PEER_REVIEW':
      case 'PEER_EVALUATION':
        return {
          icon: Users,
          text: 'Peer Evaluation',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        };
      case 'ARBITRATION':
      case 'DISPUTED':
        return {
          icon: AlertTriangle,
          text: 'Arbitration',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'COMPLETED':
        return {
          icon: CheckCircle,
          text: 'Completed',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
      case 'CANCELLED':
        return {
          icon: XCircle,
          text: 'Cancelled',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: AlertTriangle,
          text: `Status: ${game.status}`,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 游戏状态 */}
      <div className={`flex items-center gap-3 p-4 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
        <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
        <div className="flex-1">
          <div className={`font-medium ${statusInfo.color}`}>
            {statusInfo.text}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Participants: {game.currentParticipants}/{game.maxParticipants}
          </div>
        </div>
      </div>

      {/* 参与者列表预览 */}
      {participants.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-900">Participants</span>
          </div>
          <div className="space-y-2">
            {(showAllParticipants ? participants : participants.slice(0, 5)).map((participant) => (
              <div key={participant.id} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  {participant.userId === game.creatorId ? (
                    <Crown className="w-4 h-4 text-yellow-600" />
                  ) : (
                    <span className="text-xs font-medium text-gray-600">
                      {participant.user.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {participant.user.fullName || participant.user.username}
                    </span>
                    {participant.userId === game.creatorId && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Creator
                      </span>
                    )}
                    {participant.userId === user?.id && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Trust: {participant.user.trustPoints} points
                  </div>
                </div>
                {participant.evidenceSubmitted && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
              </div>
            ))}
            {participants.length > 5 && (
              <button
                onClick={() => setShowAllParticipants(!showAllParticipants)}
                className="w-full text-sm text-blue-600 hover:text-blue-700 text-center pt-2 transition-colors"
              >
                {showAllParticipants
                  ? 'Show less'
                  : `+${participants.length - 5} more participants`
                }
              </button>
            )}
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-3">
        {canJoin && (
          <button
            onClick={() => setShowJoinConfirm(true)}
            disabled={joinMutation.isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {joinMutation.isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            {t('game.joinChallenge')}
          </button>
        )}

        {canLeave && (
          <button
            onClick={() => setShowLeaveConfirm(true)}
            disabled={leaveMutation.isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {leaveMutation.isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <UserMinus className="w-4 h-4" />
            )}
            {t('game.leaveChallenge')}
          </button>
        )}

        {isParticipant && !canLeave && (
          <div className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-600 px-4 py-3 rounded-lg">
            <Shield className="w-4 h-4" />
            {isCreator ? t('game.youAreCreator') :
             isGameStarted ? t('game.challengeInProgress') : t('game.alreadyJoined')}
          </div>
        )}

        {!isParticipant && !canJoin && (
          <div className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-600 px-4 py-3 rounded-lg">
            <Shield className="w-4 h-4" />
            {isGameStarted ? '挑战已开始' :
             game.currentParticipants >= game.maxParticipants ? '人数已满' : '无法加入'}
          </div>
        )}
      </div>

      {/* 加入确认对话框 */}
      {showJoinConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Join Challenge
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to join "{game.title}"? You'll be committed to completing this challenge.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowJoinConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => joinMutation.mutate()}
                disabled={joinMutation.isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {joinMutation.isLoading ? 'Joining...' : 'Join'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 退出确认对话框 */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Leave Challenge
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to leave "{game.title}"? You won't be able to rejoin once the challenge starts.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => leaveMutation.mutate()}
                disabled={leaveMutation.isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {leaveMutation.isLoading ? 'Leaving...' : 'Leave'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameParticipationStatus;
