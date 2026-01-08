import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ArrowLeft, Send, Smile, MoreVertical, History, Phone, Video } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { messagesAPI, friendsAPI } from '../services/api';
import { COMMON_EMOJIS } from '../types/chat';
import LoadingSpinner from '../components/LoadingSpinner';
import MessageStatusIndicator from '../components/MessageStatusIndicator';
import EnhancedEmojiPicker from '../components/EnhancedEmojiPicker';
import ChatHistoryManager from '../components/ChatHistoryManager';
import toast from 'react-hot-toast';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { friendId } = useParams<{ friendId: string }>();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showHistoryManager, setShowHistoryManager] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 获取好友信息
  const { data: friendsData } = useQuery(
    'friends',
    () => friendsAPI.getFriends(),
    {
      select: (response) => response.data,
    }
  );

  const friend = friendsData?.find((f: any) =>
    f.friend.id === friendId || f.requester?.id === friendId || f.addressee?.id === friendId
  );

  const friendInfo = friend?.friend || friend?.requester || friend?.addressee;

  // 获取聊天记录
  const { data: messages, isLoading } = useQuery(
    ['messages', friendId],
    () => messagesAPI.getConversation(friendId!),
    {
      enabled: !!friendId,
      select: (response) => response.data,
      // 移除自动刷新，改为手动刷新或WebSocket
      refetchOnWindowFocus: true,
    }
  );

  // 发送消息
  const sendMessageMutation = useMutation(
    (data: { receiverId: string; content: string; type?: string }) =>
      messagesAPI.sendMessage(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['messages', friendId]);
        queryClient.invalidateQueries('conversations'); // 刷新聊天列表
        queryClient.invalidateQueries('unreadMessagesCount'); // 刷新未读数
        setMessage('');
        setShowEmojiPicker(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '发送失败');
      },
    }
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 进入聊天页面时刷新未读数
  useEffect(() => {
    if (friendId) {
      // 延迟刷新，确保消息已标记为已读
      const timer = setTimeout(() => {
        queryClient.invalidateQueries('conversations');
        queryClient.invalidateQueries('unreadMessagesCount');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [friendId, queryClient]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !friendId) return;

    const isEmoji = /^[\p{Emoji}\s]+$/u.test(message.trim());

    sendMessageMutation.mutate({
      receiverId: friendId,
      content: message.trim(),
      type: isEmoji ? 'EMOJI' : 'TEXT',
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!friendInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-600 mb-4">好友不存在</p>
        <button
          onClick={() => navigate('/friends')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          返回好友列表
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                {friendInfo.username?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">
                  {friendInfo.fullName || `@${friendInfo.username}`}
                </h1>
                <p className="text-sm text-gray-500">
                  {friendInfo.fullName ? `@${friendInfo.username}` : '在线'}
                </p>
              </div>
            </div>
          </div>

          {/* 功能按钮 */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowHistoryManager(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="聊天记录"
            >
              <History className="w-5 h-5 text-gray-600" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      // TODO: 实现语音通话
                      toast('语音通话功能开发中', { icon: '📞' });
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Phone className="w-4 h-4 mr-3" />
                    语音通话
                  </button>
                  <button
                    onClick={() => {
                      // TODO: 实现视频通话
                      toast('视频通话功能开发中', { icon: '📹' });
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Video className="w-4 h-4 mr-3" />
                    视频通话
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {messages && messages.length > 0 ? (
          messages.map((msg: any) => {
            const isOwn = msg.senderId === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-xs lg:max-w-md px-4 py-2 rounded-lg
                    ${isOwn
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                    }
                  `}
                >
                  <p className={msg.type === 'EMOJI' ? 'text-2xl' : ''}>{msg.content}</p>
                  <div className={`flex items-center justify-between mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                    <span className="text-xs">
                      {formatTime(msg.createdAt)}
                    </span>
                    {isOwn && (
                      <MessageStatusIndicator
                        status={msg.isRead ? 'read' : 'delivered'}
                        size="sm"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 mt-8">
            <p>还没有消息，开始聊天吧！</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
        <div className="relative">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !sendMessageMutation.isLoading && handleSendMessage()}
                placeholder="输入消息..."
                disabled={sendMessageMutation.isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || sendMessageMutation.isLoading}
                className={`
                  p-2 rounded-full transition-colors
                  ${message.trim() && !sendMessageMutation.isLoading
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 增强表情包选择器 */}
          <EnhancedEmojiPicker
            isOpen={showEmojiPicker}
            onEmojiSelect={(emoji) => {
              handleEmojiSelect(emoji);
              setShowEmojiPicker(false);
            }}
            onClose={() => setShowEmojiPicker(false)}
          />
        </div>
      </div>

      {/* 聊天历史管理器 */}
      {showHistoryManager && (
        <ChatHistoryManager
          friendId={friendId!}
          friendName={friendInfo.username}
          onClose={() => setShowHistoryManager(false)}
        />
      )}

      {/* 点击外部关闭更多菜单 */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMoreMenu(false)}
        />
      )}
    </div>
  );
};

export default ChatPage;
