
import React, { useState } from 'react';
import { Constitution } from '../../types';
import { VotingBar } from '../Voting/VotingBar';

interface ConstitutionVersionCardProps {
  version: Constitution;
  onClick: (version: Constitution) => void;
  isLargestEpoch?: boolean;
}

export const ConstitutionVersionCard: React.FC<ConstitutionVersionCardProps> = ({ version, onClick, isLargestEpoch = false }) => {
  
  // Truncate logic for Tx Hash: c882f19468...15961e
  const formatTxHash = (hash: string) => {
    if (!hash || hash.length < 16) return hash;
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 6)}`;
  };

  return (
    <div 
        className={`
            bg-surface-primary rounded-xl p-0 overflow-hidden transition-all duration-270 group
            hover:bg-black/10 dark:hover:bg-white/5
            ${isLargestEpoch ? 'border-l-2 border-l-primary' : ''}
        `}
    >
        <div className="flex flex-col md:flex-row items-stretch">
            
            {/* Column 1: Title (20% on desktop) */}
            <div className="md:w-[20%] p-6 flex flex-col justify-center items-center text-center gap-3">
                <div className="flex items-center gap-3 justify-center">
                     <span 
                        className="text-lg font-bold text-textPrimary hover:text-primary transition-colors cursor-pointer text-center" 
                        onClick={() => onClick(version)}
                     >
                        {version.meta.title}
                     </span>
                </div>
                
                <div className="space-y-1 w-full">
                     {/* Transaction Hash - Truncated, no border/bg */}
                     <div className="font-mono text-secondary text-sm text-center">
                        {formatTxHash(version.meta.submissionTx)}
                     </div>
                     {/* Version Text */}
                     <div className="text-xs text-textSecondary text-center">
                        v{version.meta.version}
                     </div>
                </div>
            </div>

            {/* Middle Section: Flex items distributed equally */}
            <div className="flex-1 flex flex-col md:flex-row">
                
                {/* Enacted Epoch */}
                <div className="flex-1 p-4 flex flex-col justify-center items-center md:items-center text-center">
                    <span className="md:hidden text-xs text-textSecondary uppercase tracking-wider mb-1">Enacted</span>
                    <span className="text-sm font-medium text-textPrimary">Epoch {version.meta.enactedEpoch}</span>
                </div>

                {/* Liveness */}
                <div className="flex-1 p-4 flex flex-col justify-center items-center md:items-center text-center">
                    <span className="md:hidden text-xs text-textSecondary uppercase tracking-wider mb-1">Liveness</span>
                    <span className="text-sm font-medium text-textPrimary">{version.meta.liveness}</span>
                </div>

                 {/* Deposit */}
                 <div className="flex-1 p-4 flex flex-col justify-center items-center md:items-center text-center">
                    <span className="md:hidden text-xs text-textSecondary uppercase tracking-wider mb-1">Deposit</span>
                    <span className="text-sm font-medium text-textPrimary">{version.meta.deposit} ADA</span>
                </div>
            </div>

            {/* Column: Voting Info (20% on desktop) */}
            <div className="md:w-[20%] p-6 flex flex-col justify-center gap-2 min-w-[200px]">
                <VotingBar label="CC" stats={version.meta.votingResults.CC} />
                <VotingBar label="DRep" stats={version.meta.votingResults.DRep} />
            </div>
        </div>
    </div>
  );
};
