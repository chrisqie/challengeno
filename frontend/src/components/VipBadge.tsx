import { Crown } from 'lucide-react';

interface VipBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const VipBadge = ({ size = 'md', showText = false, className = '' }: VipBadgeProps) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <Crown className={`${sizeClasses[size]} text-yellow-500`} />
      {showText && (
        <span className={`ml-1 text-yellow-600 font-medium ${textSizeClasses[size]}`}>
          VIP
        </span>
      )}
    </div>
  );
};

export default VipBadge;
