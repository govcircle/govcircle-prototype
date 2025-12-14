
import React, { useState } from 'react';
import { ConstitutionContent } from '../../types';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface QuickAccessProps {
  items: ConstitutionContent[];
  onNavigate: (id: string) => void;
  activeId?: string;
}

interface QuickAccessListProps {
  items: ConstitutionContent[];
  depth: number;
  activeId?: string;
  onNavigate: (id: string) => void;
}

const QuickAccessList: React.FC<QuickAccessListProps> = ({ items, depth, activeId, onNavigate }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className={`transition-all duration-270 ease-in-out`}>
      {items.map(item => {
        const hasChildren = item.children && item.children.length > 0;
        const itemIdStr = item.id.toString();
        const isExpanded = expandedId === itemIdStr;
        const isActive = activeId === itemIdStr;

        return (
          <div key={item.id} className="select-none">
             <div 
                className={`
                  group flex items-center justify-between py-1.5 px-2 rounded-md cursor-pointer transition-colors duration-200
                  ${isActive ? 'bg-primary/20 text-primary' : 'text-textSecondary hover:text-primary hover:bg-surface-primary'}
                `}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                onClick={() => onNavigate(itemIdStr)}
              >
                <span className="text-sm truncate font-medium flex-1 mr-2">{item.title}</span>
                {hasChildren && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(itemIdStr);
                    }}
                    className={`
                      p-0.5 rounded hover:bg-white/10 text-textSecondary transition-transform duration-270
                    `}
                  >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                )}
              </div>

              {/* Recursive List */}
              <div 
                className={`
                  overflow-hidden transition-all duration-270 ease-in-out 
                  ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                {hasChildren && (
                  <QuickAccessList 
                    items={item.children} 
                    depth={depth + 1} 
                    activeId={activeId}
                    onNavigate={onNavigate}
                  />
                )}
              </div>
          </div>
        );
      })}
    </div>
  );
};

export const QuickAccess: React.FC<QuickAccessProps> = ({ items, onNavigate, activeId }) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-light text-textPrimary mb-4 px-2 tracking-wide">Contents</h3>
      
      <div className="pl-3">
        {/* Preamble Link */}
        <div 
          className="text-sm font-medium text-textSecondary hover:text-primary hover:bg-surface-primary py-1.5 px-2 rounded-md cursor-pointer mb-2"
          onClick={() => onNavigate('preamble')}
        >
          Preamble
        </div>

        <div className="space-y-1">
          <QuickAccessList 
            items={items} 
            depth={0} 
            activeId={activeId}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
};
