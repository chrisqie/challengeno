import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  icon?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
          <div className="flex items-center space-x-1">
            {item.icon && (
              <span className="text-base">{item.icon}</span>
            )}
            {item.onClick ? (
              <button
                onClick={item.onClick}
                className={`${
                  index === items.length - 1
                    ? 'text-gray-900 font-medium cursor-default'
                    : 'text-gray-600 hover:text-gray-900 hover:underline'
                }`}
              >
                {item.label}
              </button>
            ) : (
              <span className={index === items.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-600'}>
                {item.label}
              </span>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
