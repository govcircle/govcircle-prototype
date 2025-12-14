
import React, { useState, useMemo } from 'react';
import { versionHistoryData } from '../data/versionHistory';
import { ConstitutionVersionCard } from '../components/Constitution/ConstitutionVersionCard';
import { Constitution } from '../types';
import { Search } from 'lucide-react';

interface VersionHistoryPageProps {
  onSelectVersion: (version: Constitution) => void;
}

export const VersionHistoryPage: React.FC<VersionHistoryPageProps> = ({ onSelectVersion }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sort data by enactedEpoch descending to ensure biggest epoch is first
  const sortedData = useMemo(() => {
      return [...versionHistoryData].sort((a, b) => {
          const epochA = parseInt(a.meta.enactedEpoch, 10) || 0;
          const epochB = parseInt(b.meta.enactedEpoch, 10) || 0;
          return epochB - epochA;
      });
  }, []);

  // Identify the latest version (biggest epoch) for highlighting.
  // We use object reference comparison to be safe against duplicate IDs.
  const latestVersion = sortedData[0];

  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;

    const lowerTerm = searchTerm.toLowerCase();
    
    return sortedData.filter(v => {
        const m = v.meta;
        return (
            m.title.toLowerCase().includes(lowerTerm) ||
            m.version.toString().includes(lowerTerm) ||
            m.enactedEpoch.toLowerCase().includes(lowerTerm) ||
            m.liveness.toLowerCase().includes(lowerTerm) ||
            m.deposit.toString().includes(lowerTerm) ||
            m.submissionTx.toLowerCase().includes(lowerTerm)
        );
    });
  }, [searchTerm, sortedData]);

  return (
    <div className="w-full mx-auto p-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-textPrimary mb-2">Version History</h1>
            <p className="text-textSecondary">View and compare historical versions of the constitution.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={18} />
            <input 
                type="text" 
                placeholder="Search versions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface-primary border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-textPrimary focus:outline-none focus:border-primary transition-all duration-270"
            />
        </div>
      </div>

      {/* Grid Header - Hidden on small screens */}
      <div className="hidden md:flex items-center p-0 mb-2 text-xs font-bold uppercase tracking-wider text-textSecondary bg-surface-primary rounded-lg">
         <div className="w-[20%] px-6 py-4 text-center">Title</div>
         <div className="flex-1 flex">
            <div className="flex-1 px-4 py-4 text-center">Enacted</div>
            <div className="flex-1 px-4 py-4 text-center">Liveness</div>
            <div className="flex-1 px-4 py-4 text-center">Deposit</div>
         </div>
         <div className="w-[20%] px-6 py-4 text-center">Voting Info</div>
      </div>

      <div className="space-y-4">
        {filteredData.map(version => (
          <div key={version.id} className="transition-all duration-270 ease-in-out">
            <ConstitutionVersionCard 
                version={version} 
                onClick={onSelectVersion}
                // Highlight if this object matches the latest version from the sorted list
                isLargestEpoch={version === latestVersion}
            />
          </div>
        ))}
        {filteredData.length === 0 && (
            <div className="text-center py-10 text-textSecondary">
                No versions found matching your search.
            </div>
        )}
      </div>
    </div>
  );
};
