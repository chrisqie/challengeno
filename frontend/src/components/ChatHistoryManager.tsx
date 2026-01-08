import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { 
  Search, 
  Calendar, 
  Download, 
  Trash2, 
  Filter,
  MessageSquare,
  Clock,
  User,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { messagesAPI } from '../services/api';
import MessageStatusIndicator from './MessageStatusIndicator';

interface ChatHistoryManagerProps {
  friendId: string;
  friendName: string;
  onClose: () => void;
}

interface MessageGroup {
  date: string;
  messages: any[];
}

const ChatHistoryManager: React.FC<ChatHistoryManagerProps> = ({
  friendId,
  friendName,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // 获取聊天历史
  const { data: messages, isLoading } = useQuery(
    ['chat-history', friendId, searchQuery, dateFilter],
    () => messagesAPI.getConversation(friendId),
    {
      select: (response) => {
        let msgs = response.data || [];
        
        // 应用搜索过滤
        if (searchQuery) {
          msgs = msgs.filter((msg: any) => 
            msg.content.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        // 应用日期过滤
        const now = new Date();
        if (dateFilter !== 'all') {
          msgs = msgs.filter((msg: any) => {
            const msgDate = new Date(msg.createdAt);
            const diffTime = now.getTime() - msgDate.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            
            switch (dateFilter) {
              case 'today':
                return diffDays < 1;
              case 'week':
                return diffDays < 7;
              case 'month':
                return diffDays < 30;
              default:
                return true;
            }
          });
        }
        
        return msgs;
      },
    }
  );

  // 按日期分组消息
  const groupMessagesByDate = (messages: any[]): MessageGroup[] => {
    const groups: { [key: string]: any[] } = {};
    
    messages?.forEach((message) => {
      const date = new Date(message.createdAt).toLocaleDateString('zh-CN');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups)
      .map(([date, msgs]) => ({ date, messages: msgs }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const toggleGroupExpansion = (date: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedGroups(newExpanded);
  };

  const exportChatHistory = () => {
    if (!messages) return;
    
    const exportData = messages.map((msg: any) => ({
      时间: new Date(msg.createdAt).toLocaleString('zh-CN'),
      发送者: msg.senderId === friendId ? friendName : '我',
      内容: msg.content,
      类型: msg.type || 'text'
    }));
    
    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map((row: any) => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `chat_history_${friendName}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const messageGroups = groupMessagesByDate(messages || []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-5/6 flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">聊天记录</h2>
              <p className="text-sm text-gray-600">与 @{friendName} 的对话</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={exportChatHistory}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center"
            >
              <Download className="w-4 h-4 mr-1" />
              导出
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              关闭
            </button>
          </div>
        </div>

        {/* 搜索和过滤 */}
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索消息内容..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">全部时间</option>
              <option value="today">今天</option>
              <option value="week">最近一周</option>
              <option value="month">最近一月</option>
            </select>
          </div>
          
          {messages && (
            <div className="text-sm text-gray-600">
              找到 {messages.length} 条消息
            </div>
          )}
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : messageGroups.length > 0 ? (
            <div className="space-y-4">
              {messageGroups.map((group) => (
                <div key={group.date} className="border border-gray-200 rounded-lg">
                  {/* 日期头部 */}
                  <button
                    onClick={() => toggleGroupExpansion(group.date)}
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between rounded-t-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{group.date}</span>
                      <span className="text-sm text-gray-500">({group.messages.length} 条消息)</span>
                    </div>
                    {expandedGroups.has(group.date) ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  
                  {/* 消息列表 */}
                  {expandedGroups.has(group.date) && (
                    <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                      {group.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === friendId ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === friendId
                              ? 'bg-gray-100 text-gray-900'
                              : 'bg-blue-600 text-white'
                          }`}>
                            <div className="flex items-start space-x-2">
                              <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm">{message.content}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-xs opacity-75">
                                    {new Date(message.createdAt).toLocaleTimeString('zh-CN', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                  {message.senderId !== friendId && (
                                    <MessageStatusIndicator
                                      status={message.isRead ? 'read' : 'delivered'}
                                      size="sm"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>没有找到匹配的消息</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryManager;
