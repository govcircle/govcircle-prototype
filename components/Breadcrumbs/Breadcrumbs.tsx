
import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  action?: () => void;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <div className="sticky top-16 z-30 w-full bg-background/95 backdrop-blur-sm border-b border-border px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="flex items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <span className="text-textSecondary/50">
                  <ChevronRight size={14} />
                </span>
              )}
              
              <button
                onClick={item.action}
                disabled={isLast || !item.action}
                className={`
                  font-medium transition-colors duration-270
                  ${isLast 
                    ? 'text-textPrimary cursor-default' 
                    : 'text-textSecondary hover:text-primary cursor-pointer'
                  }
                `}
              >
                {item.label}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
