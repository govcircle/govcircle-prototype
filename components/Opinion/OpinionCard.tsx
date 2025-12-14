
import React from 'react';
import { Opinion, OpinionStatus } from '../../types';
import { RoleBadge } from '../RoleBadge/RoleBadge';

interface OpinionCardProps {
  opinion: Opinion;
  onClick?: (opinion: Opinion) => void;
}

const getStatusClass = (status: OpinionStatus) => {
    switch (status) {
        case 'Live': return 'text-success bg-success/10 border-success/20';
        case 'Voting': return 'text-warning bg-warning/10 border-warning/20';
        case 'Ratified': return 'text-info bg-info/10 border-info/20';
        case 'Denied': return 'text-error bg-error/10 border-error/20';
        case 'Closed': return 'text-textSecondary bg-textSecondary/10 border-textSecondary/20';
        default: return 'text-textSecondary bg-textSecondary/10 border-textSecondary/20';
    }
}

export const OpinionCard: React.FC<OpinionCardProps> = ({ opinion, onClick }) => {
  
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
        return;
    }
    onClick?.(opinion);
  };

  return (
    <div 
        onClick={handleCardClick}
        className="bg-surface-primary rounded-xl p-0 hover:bg-black/10 dark:hover:bg-white/5 transition-all duration-270 group cursor-pointer"
    >
      <div className="flex flex-col md:flex-row items-stretch min-h-[100px]">
        
        {/* Owner Column */}
        <div className="md:w-[25%] py-4 flex flex-col justify-center">
           
           {/* Desktop Layout */}
           <div className="hidden md:flex w-full items-center -ml-5">
               <div className="flex-1 flex justify-end pr-3">
                   <img 
                     src={opinion.owner.avatar} 
                     alt={opinion.owner.username} 
                     className="w-12 h-12 rounded-full bg-surface-secondary object-cover border border-border shrink-0"
                   />
               </div>
               
               <div className="flex-1 flex flex-col items-start min-w-0 pl-0">
                   <div className="flex flex-col text-left w-full">
                        <span className="text-base font-bold text-textPrimary leading-tight truncate w-full" title={opinion.owner.username}>
                            {opinion.owner.username}
                        </span>
                        <span className="text-sm text-textSecondary truncate w-full" title={opinion.owner.handle}>
                            {opinion.owner.handle}
                        </span>
                   </div>
                   
                   <div className="flex flex-wrap justify-start gap-1 mt-1 w-full">
                        {opinion.owner.roles.map((role, idx) => (
                            <RoleBadge key={`${role.type}-${idx}`} role={role} />
                        ))}
                   </div>
               </div>
           </div>

           {/* Mobile Layout */}
           <div className="md:hidden flex flex-col items-center gap-3 px-4">
               <img 
                 src={opinion.owner.avatar} 
                 alt={opinion.owner.username} 
                 className="w-12 h-12 rounded-full bg-surface-secondary object-cover border border-border shrink-0"
               />
               <div className="flex flex-col items-center gap-1 min-w-0 w-full">
                 <div className="flex flex-col text-center w-full">
                    <span className="text-base font-bold text-textPrimary leading-tight truncate w-full">{opinion.owner.username}</span>
                    <span className="text-sm text-textSecondary truncate w-full">{opinion.owner.handle}</span>
                 </div>
                 
                 <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {opinion.owner.roles.map((role, idx) => (
                        <RoleBadge key={`${role.type}-${idx}`} role={role} />
                    ))}
                 </div>
               </div>
           </div>
        </div>

        {/* Intent Column */}
        <div className="md:w-[35%] p-4 flex flex-col justify-center items-center text-center">
            <p className="text-base text-textSecondary line-clamp-2 leading-relaxed px-2 font-medium">
                {opinion.intent}
            </p>
        </div>

        {/* Dates Container */}
        <div className="flex-1 flex flex-col md:flex-row">
            <div className="flex-1 p-4 flex flex-col justify-center items-center text-center">
                <span className="md:hidden text-xs text-textSecondary uppercase tracking-wider mb-1">Created</span>
                <span className="text-sm font-bold text-textPrimary whitespace-pre-line">{opinion.createdDate}</span>
            </div>
            <div className="flex-1 p-4 flex flex-col justify-center items-center text-center">
                <span className="md:hidden text-xs text-textSecondary uppercase tracking-wider mb-1">Last Update</span>
                <span className="text-sm font-bold text-textPrimary whitespace-pre-line">{opinion.updatedDate}</span>
            </div>
        </div>

        {/* Status */}
        <div className="md:w-[15%] p-4 flex items-center justify-center">
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusClass(opinion.status)}`}>
                {opinion.status}
            </div>
        </div>

      </div>
    </div>
  );
};
