
import React from 'react';
import { VotingStats } from '../../types';

interface VotingBarProps {
  label: string;
  stats: VotingStats;
}

export const VotingBar: React.FC<VotingBarProps> = ({ label, stats }) => {
  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-sm font-medium text-textSecondary w-10">{label}</span>
      
      <div className="flex-1 h-3 flex rounded-full overflow-hidden bg-surface-secondary">
        {/* Yes */}
        <div 
            className="h-full bg-vote-yes" 
            style={{ width: `${stats.yes}%` }} 
        />
        {/* No */}
        <div 
            className="h-full bg-vote-no" 
            style={{ width: `${stats.no}%` }} 
        />
        {/* Abstain */}
        <div 
            className="h-full bg-vote-abstain" 
            style={{ width: `${stats.abstain}%` }} 
        />
      </div>

      <span className="text-sm font-medium text-textPrimary w-12 text-right">
        {stats.yes}%
      </span>
    </div>
  );
};
