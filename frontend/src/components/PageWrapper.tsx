import React, { useEffect, useState } from 'react';
import { cn } from '../utils/cn';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  loadingMessage?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ 
  children, 
  className,
  loading = false,
  loadingMessage = '加载中...'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 延迟显示内容，确保页面过渡效果
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'page-transition min-h-screen',
        isVisible ? 'page-enter-active' : 'page-enter',
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
