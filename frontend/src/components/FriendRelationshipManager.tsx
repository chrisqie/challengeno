import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  MoreVertical,
  MessageCircle,
  UserMinus,
  Ban,
  Flag,
  Eye,
  Calendar,
  Trophy,
  Star,
  Users,
  GamepadIcon
} from 'lucide-react';
import { friendsAPI, messagesAPI } from '../services/api';
import { UserDisplay } from './UserDisplay';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface FriendRelationshipManagerProps {
  friend: {
    id: string;
    username: string;
    fullName?: string;
    trustPoints: number;
    isVip: boolean;
    isDeleted?: boolean;
    totalGamesCreated: number;
    totalGamesJoined: number;
    createdAt: string;
    mutualFriends?: number;
  };
  onUpdate?: () => void;
}

const FriendRelationshipManager: React.FC<FriendRelationshipManagerProps> = ({
  friend,
  onUpdate
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null);

  // 删除好友
  const removeFriendMutation = useMutation(
    () => friendsAPI.removeFriend(friend.id),
    {
      onSuccess: () => {
        toast.success('已删除好友');
        queryClient.invalidateQueries('friends');
        onUpdate?.();
        setShowConfirmDialog(null);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '删除失败');
      },
    }
  );

  // 屏蔽用户
  const blockUserMutation = useMutation(
    () => friendsAPI.blockUser(friend.username),
    {
      onSuccess: () => {
        toast.success('已屏蔽用户');
        queryClient.invalidateQueries('friends');
        onUpdate?.();
        setShowConfirmDialog(null);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '屏蔽失败');
      },
    }
  );

  // 发送消息
  const startChat = () => {
    navigate(`/chat/${friend.id}`);
    setShowMenu(false);
  };

  // 查看资料
  const viewProfile = () => {
    navigate(`/profile/${friend.username}`);
    setShowMenu(false);
  };

  const getTrustBadgeColor = (trustPoints: number) => {
    if (trustPoints >= 150) return 'bg-purple-100 text-purple-800';
    if (trustPoints >= 100) return 'bg-green-100 text-green-800';
    if (trustPoints >= 70) return 'bg-blue-100 text-blue-800';
    if (trustPoints >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getTrustLabel = (trustPoints: number) => {
    if (trustPoints >= 150) return '钻石';
    if (trustPoints >= 100) return '黄金';
    if (trustPoints >= 70) return '白银';
    if (trustPoints >= 50) return '青铜';
    return '新手';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}周前`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)}个月前`;
    return `${Math.ceil(diffDays / 365)}年前`;
  };

  return (
    <div className="relative">
      {/* 好友卡片 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {/* 头像 */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
              {friend.username.charAt(0).toUpperCase()}
            </div>
            
            {/* 用户信息 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  @<UserDisplay username={friend.username} isDeleted={friend.isDeleted} showDeletedLabel={false} />
                </h3>
                {friend.isVip && (
                  <Star className="w-4 h-4 text-yellow-500" />
                )}
              </div>
              
              {friend.fullName && (
                <p className="text-sm text-gray-600 truncate">{friend.fullName}</p>
              )}
              
              {/* 统计信息 */}
              <div className="flex items-center space-x-3 mt-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTrustBadgeColor(friend.trustPoints)}`}>
                  <Trophy className="w-3 h-3 mr-1" />
                  {getTrustLabel(friend.trustPoints)} {friend.trustPoints}
                </span>
                
                {friend.mutualFriends && friend.mutualFriends > 0 && (
                  <span className="text-xs text-gray-500 flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {friend.mutualFriends} 共同好友
                  </span>
                )}
                
                <span className="text-xs text-gray-500 flex items-center">
                  <GamepadIcon className="w-3 h-3 mr-1" />
                  {(friend.totalGamesCreated || 0) + (friend.totalGamesJoined || 0)} 场游戏
                </span>
              </div>
              
              {/* 成为好友时间 */}
              <div className="flex items-center mt-1">
                <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                <span className="text-xs text-gray-500">
                  {formatDate(friend.createdAt)} 成为好友
                </span>
              </div>
            </div>
          </div>

          {/* 操作菜单 */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={startChat}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <MessageCircle className="w-4 h-4 mr-3" />
                  发送消息
                </button>
                
                <button
                  onClick={viewProfile}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Eye className="w-4 h-4 mr-3" />
                  查看资料
                </button>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                  onClick={() => {
                    setShowConfirmDialog('remove');
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <UserMinus className="w-4 h-4 mr-3" />
                  删除好友
                </button>
                
                <button
                  onClick={() => {
                    setShowConfirmDialog('block');
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <Ban className="w-4 h-4 mr-3" />
                  屏蔽用户
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 确认对话框 */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {showConfirmDialog === 'remove' ? '删除好友' : '屏蔽用户'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {showConfirmDialog === 'remove' 
                ? `确定要删除好友 @${friend.username} 吗？删除后你们将不再是好友关系。`
                : `确定要屏蔽用户 @${friend.username} 吗？屏蔽后对方将无法向你发送消息或好友请求。`
              }
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmDialog(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (showConfirmDialog === 'remove') {
                    removeFriendMutation.mutate();
                  } else {
                    blockUserMutation.mutate();
                  }
                }}
                disabled={removeFriendMutation.isLoading || blockUserMutation.isLoading}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {(removeFriendMutation.isLoading || blockUserMutation.isLoading) ? '处理中...' : '确定'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 点击外部关闭菜单 */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default FriendRelationshipManager;
