
import React, { useEffect, useState } from 'react';
import { X, ChevronRight, ChevronDown, FileText, Database, Users, PieChart, Wallet } from 'lucide-react';
import { NavItem } from '../../types';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: any) => void;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'constitution',
    label: 'Constitution',
    children: [
      { id: 'opinion', label: 'Opinion' },
      { id: 'version-history', label: 'Version History' },
      { id: 'changelog', label: 'Changelog' },
      { id: 'advanced-report', label: 'Advanced Report' },
    ]
  },
  {
    id: 'circle',
    label: 'Circle',
    children: [{ id: 'temp-1', label: 'Temp' }]
  },
  {
    id: 'proposals',
    label: 'Proposals',
    children: [{ id: 'temp-2', label: 'Temp' }]
  },
  {
    id: 'actors',
    label: 'Actors',
    children: [{ id: 'temp-3', label: 'Temp' }]
  },
  {
    id: 'treasury',
    label: 'Treasury',
    children: [{ id: 'temp-4', label: 'Temp' }]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    children: [{ id: 'temp-5', label: 'Temp' }]
  }
];

const getIcon = (id: string) => {
    switch(id) {
        case 'constitution': return <FileText size={18} />;
        case 'circle': return <Users size={18} />;
        case 'proposals': return <FileText size={18} />;
        case 'actors': return <Users size={18} />;
        case 'treasury': return <Wallet size={18} />;
        case 'analytics': return <PieChart size={18} />;
        default: return <Database size={18} />;
    }
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const [expandedId, setExpandedId] = useState<string | null>('constitution');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleItemClick = (id: string) => {
    if (id === 'version-history') {
      onNavigate?.('version-history');
    } else if (id === 'opinion') {
      onNavigate?.('opinion');
    } else if (id === 'changelog') {
      onNavigate?.('changelog');
    } else if (id === 'constitution') {
      onNavigate?.('version-history'); // Redirect root constitution click to version history
    }
  };

  return (
    <>
      <div 
        className={`
          fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-270 ease-in-out
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      <div
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-[320px] bg-background border-r border-border shadow-2xl
          transform transition-transform duration-270 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-textPrimary">Navigation</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-primary rounded-full transition-colors text-textSecondary hover:text-textPrimary">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isExpanded = expandedId === item.id;
            const Icon = getIcon(item.id);

            return (
              <div key={item.id} className="mb-1">
                <button
                  onClick={() => toggleExpand(item.id)}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200
                    ${isExpanded ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:bg-surface-primary hover:text-textPrimary'}
                  `}
                >
                  <div className="flex items-center gap-3 font-medium">
                    {Icon}
                    {item.label}
                  </div>
                  {item.children && (
                    <span className={`transform transition-transform duration-270 ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown size={16} />
                    </span>
                  )}
                </button>

                <div 
                  className={`
                    overflow-hidden transition-all duration-270 ease-in-out
                    ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                  `}
                >
                  <div className="pl-10 pr-2 py-1 space-y-1">
                    {item.children?.map(child => (
                      <button
                        key={child.id}
                        onClick={() => handleItemClick(child.id)}
                        className="w-full text-left py-2 px-3 rounded text-sm text-textSecondary hover:text-textPrimary hover:bg-surface-primary/50 transition-colors flex items-center gap-2"
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
