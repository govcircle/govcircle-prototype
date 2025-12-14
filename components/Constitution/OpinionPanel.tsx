
import React from 'react';
import { Button } from '../Button/Button';
import { MessageSquare } from 'lucide-react';
import { opinionData } from '../../data/opinions';
import { RoleBadge } from '../RoleBadge/RoleBadge';
import { OpinionStatus } from '../../types';

interface OpinionPanelProps {
  onOpinionClick?: (id: string) => void;
}

export const OpinionPanel: React.FC<OpinionPanelProps> = ({ onOpinionClick }) => {
  const topOpinions = opinionData.slice(0, 3);

  const getStatusStyle = (status: OpinionStatus) => {
      switch (status) {
          case 'Live': return 'text-success bg-success/10 border-success/20';
          case 'Voting': return 'text-warning bg-warning/10 border-warning/20';
          case 'Ratified': return 'text-info bg-info/10 border-info/20';
          case 'Denied': return 'text-error bg-error/10 border-error/20';
          case 'Closed': return 'text-textSecondary bg-textSecondary/10 border-textSecondary/20';
          default: return 'text-textSecondary bg-textSecondary/10 border-textSecondary/20';
      }
  };

  return (
    <div className="space-y-6">
      {/* Opinion Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-primary" />
            <h3 className="text-lg font-bold text-textPrimary">Opinion</h3>
        </div>
        <Button variant="ghost" className="h-6 w-6 p-0 rounded-full bg-surface-primary">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </Button>
      </div>

      {/* Opinion List */}
      <div className="space-y-4">
        <div className="space-y-1">
            {topOpinions.map((op) => (
                <div 
                    key={op.id} 
                    onClick={() => onOpinionClick?.(op.id)}
                    className="flex items-start gap-3 group cursor-pointer hover:bg-surface-secondary/50 p-2 -mx-2 rounded-xl transition-colors border border-transparent hover:border-border/50"
                >
                    {/* Avatar */}
                    <img 
                        src={op.owner.avatar} 
                        alt={op.owner.username}
                        className="w-10 h-10 rounded-full object-cover border border-border bg-surface-secondary shrink-0" 
                    />
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-sm font-bold text-textPrimary truncate" title={op.owner.username}>
                                {op.owner.username}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${getStatusStyle(op.status)}`}>
                                {op.status}
                            </span>
                        </div>
                        
                        <div className="text-xs text-textSecondary truncate mb-1">
                            {op.owner.handle}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
