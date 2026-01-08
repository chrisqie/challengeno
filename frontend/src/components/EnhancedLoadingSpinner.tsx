import React from 'react';
import { Loader2, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface EnhancedLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  progress?: number;
  status?: 'loading' | 'success' | 'error' | 'warning';
  showProgress?: boolean;
  className?: string;
}

const EnhancedLoadingSpinner: React.FC<EnhancedLoadingSpinnerProps> = ({
  size = 'md',
  message,
  progress,
  status = 'loading',
  showProgress = false,
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          spinner: 'w-4 h-4',
          container: 'p-2',
          text: 'text-sm'
        };
      case 'md':
        return {
          spinner: 'w-6 h-6',
          container: 'p-4',
          text: 'text-base'
        };
      case 'lg':
        return {
          spinner: 'w-8 h-8',
          container: 'p-6',
          text: 'text-lg'
        };
      case 'xl':
        return {
          spinner: 'w-12 h-12',
          container: 'p-8',
          text: 'text-xl'
        };
    }
  };

  const getStatusInfo = () => {
    switch (status) {
      case 'loading':
        return {
          icon: Loader2,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          animate: true
        };
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          animate: false
        };
      case 'error':
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          animate: false
        };
      case 'warning':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          animate: false
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className={`flex flex-col items-center justify-center ${sizeClasses.container} ${className}`}>
      {/* 状态图标 */}
      <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2 rounded-full p-4 mb-4`}>
        <StatusIcon 
          className={`${sizeClasses.spinner} ${statusInfo.color} ${
            statusInfo.animate ? 'animate-spin' : ''
          }`} 
        />
      </div>

      {/* 消息文本 */}
      {message && (
        <p className={`${sizeClasses.text} ${statusInfo.color} font-medium text-center mb-4`}>
          {message}
        </p>
      )}

      {/* 进度条 */}
      {showProgress && progress !== undefined && (
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>进度</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                status === 'loading' ? 'bg-blue-500' :
                status === 'success' ? 'bg-green-500' :
                status === 'error' ? 'bg-red-500' :
                'bg-yellow-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// 页面级加载组件
interface PageLoadingProps {
  message?: string;
  showLogo?: boolean;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  message = '加载中...',
  showLogo = true
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {showLogo && (
        <div className="mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">BT</span>
          </div>
        </div>
      )}
      <EnhancedLoadingSpinner size="lg" message={message} />
    </div>
  );
};

// 按钮加载状态
interface ButtonLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  isLoading,
  children,
  loadingText,
  className = '',
  disabled = false,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`flex items-center justify-center space-x-2 ${className} ${
        isLoading || disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>{isLoading && loadingText ? loadingText : children}</span>
    </button>
  );
};

// 内容加载骨架屏
export const ContentSkeleton: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = ''
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="flex space-x-4">
            <div className="rounded-full bg-gray-300 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedLoadingSpinner;
