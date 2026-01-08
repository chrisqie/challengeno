import React from 'react';

interface UserDisplayProps {
  username: string;
  isDeleted?: boolean;
  className?: string;
  showDeletedLabel?: boolean;
}

/**
 * 用户名显示组件
 * 如果用户已被删除，显示为灰色并带删除线
 */
export const UserDisplay: React.FC<UserDisplayProps> = ({ 
  username, 
  isDeleted = false,
  className = '',
  showDeletedLabel = true
}) => {
  if (isDeleted) {
    return (
      <span className={`text-gray-400 ${className}`}>
        <span className="line-through">{username}</span>
        {showDeletedLabel && (
          <span className="ml-1 text-xs">(已删除)</span>
        )}
      </span>
    );
  }

  return <span className={className}>{username}</span>;
};

export default UserDisplay;

