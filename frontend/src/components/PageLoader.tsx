import React from 'react';
import { cn } from '../utils/cn';

interface PageLoaderProps {
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = '加载中...', 
  className,
  fullScreen = false 
}) => {
  const containerClass = fullScreen 
    ? 'fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50' 
    : 'w-full h-64';

  return (
    <div className={cn(
      'flex flex-col items-center justify-center',
      containerClass,
      className
    )}>
      {/* 主加载动画 */}
      <div className="relative">
        {/* 外圈 */}
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
        </div>
        
        {/* 内圈 */}
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-gray-100 rounded-full animate-spin animation-delay-150">
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-primary-400 rounded-full animate-spin animation-delay-150"></div>
        </div>
        
        {/* 中心点 */}
        <div className="absolute top-6 left-6 w-4 h-4 bg-primary-500 rounded-full animate-pulse"></div>
      </div>
      
      {/* 加载文字 */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 font-medium">{message}</p>
        <div className="flex justify-center mt-2 space-x-1">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce animation-delay-100"></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce animation-delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
