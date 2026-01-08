import React from 'react';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';

interface MessageStatusIndicatorProps {
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  timestamp?: string;
  showTimestamp?: boolean;
  size?: 'sm' | 'md';
}

const MessageStatusIndicator: React.FC<MessageStatusIndicatorProps> = ({
  status,
  timestamp,
  showTimestamp = false,
  size = 'sm'
}) => {
  const getStatusIcon = () => {
    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
    
    switch (status) {
      case 'sending':
        return <Clock className={`${iconSize} text-gray-400 animate-pulse`} />;
      case 'sent':
        return <Check className={`${iconSize} text-gray-400`} />;
      case 'delivered':
        return <CheckCheck className={`${iconSize} text-gray-400`} />;
      case 'read':
        return <CheckCheck className={`${iconSize} text-blue-500`} />;
      case 'failed':
        return <AlertCircle className={`${iconSize} text-red-500`} />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'sending':
        return '发送中...';
      case 'sent':
        return '已发送';
      case 'delivered':
        return '已送达';
      case 'read':
        return '已读';
      case 'failed':
        return '发送失败';
      default:
        return '';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return '刚刚';
    if (diffMinutes < 60) return `${diffMinutes}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex items-center space-x-1">
      {getStatusIcon()}
      {showTimestamp && timestamp && (
        <span className={`text-gray-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {formatTimestamp(timestamp)}
        </span>
      )}
      {status === 'failed' && (
        <span className={`text-red-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {getStatusText()}
        </span>
      )}
    </div>
  );
};

export default MessageStatusIndicator;
