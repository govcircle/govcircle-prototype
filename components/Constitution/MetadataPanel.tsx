
import React, { useState } from 'react';
import { Card } from '../Card/Card';
import { Link, FileText, Lock, Hash } from 'lucide-react';
import { Constitution } from '../../types';
import { VotingBar } from '../Voting/VotingBar';

interface MetadataPanelProps {
  version: Constitution;
}

export const MetadataPanel: React.FC<MetadataPanelProps> = ({ version }) => {
  const meta = version.meta;
  const items = [
    { label: 'Anchor Link', value: meta.anchorLink, icon: <Link size={14} />, isLink: true },
    { label: 'Submission Tx', value: meta.submissionTx, icon: <FileText size={14} />, truncate: true },
    { label: 'Deposit', value: `${meta.deposit} ADA`, icon: <Lock size={14} /> },
    { label: 'Script Hash', value: meta.scriptHash, icon: <Hash size={14} />, truncate: true },
  ];

  return (
    <div className="p-6 bg-surface-primary rounded-xl">
      <div className="mb-6">
        <h3 className="text-lg font-light text-textPrimary mb-4">Metadata</h3>
        
        {/* Title and Epoch */}
        <div className="mb-6">
            <h2 className="text-xl font-bold text-primary mb-1">{meta.title}</h2>
            <p className="text-sm text-textSecondary">Enacted Epoch {meta.enactedEpoch}</p>
        </div>
      </div>
      
      <div className="space-y-6 mb-8">
        {items.map((item, idx) => (
          <div key={idx} className="group">
            <div className="flex items-center gap-2 text-textSecondary mb-1 text-xs uppercase tracking-wider font-semibold">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.isLink ? (
              <a href={item.value} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline truncate block w-full">
                {item.value}
              </a>
            ) : (
              <div 
                className={`text-sm text-textPrimary font-mono ${item.truncate ? 'truncate' : ''}`}
                title={item.value}
              >
                {item.value}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Voting Info at bottom */}
      <div className="space-y-3 pt-4 border-t border-border/50">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-textSecondary mb-2">Voting Results</h4>
          <VotingBar label="CC" stats={meta.votingResults.CC} />
          <VotingBar label="DRep" stats={meta.votingResults.DRep} />
      </div>
    </div>
  );
};
