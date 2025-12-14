
import React, { useState } from 'react';
import { changelogData } from '../data/changelog';
import { versionHistoryData } from '../data/versionHistory';
import { AmendmentSection } from '../components/Amendment/AmendmentSection';
import { Button } from '../components/Button/Button';
import { ChevronLeft, ChevronRight, GitCommit } from 'lucide-react';

export const ChangelogPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentLog = changelogData[currentIndex];
  
  // Resolve Constitution metadata by Index to avoid ID duplication issues in data
  // The changelog generator runs linearly 0->1, 1->2. 
  // So currentIndex 0 corresponds to versionHistoryData[0] -> versionHistoryData[1]
  const originalVer = versionHistoryData[currentIndex];
  const revisedVer = versionHistoryData[currentIndex + 1];

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < changelogData.length - 1) setCurrentIndex(prev => prev + 1);
  };

  if (!currentLog) {
      return (
          <div className="p-10 text-center text-textSecondary bg-surface-primary border border-border rounded-xl m-5">
              <h2 className="text-xl font-bold mb-2 text-textPrimary">No Changes Found</h2>
              <p>There are no recorded differences between the available constitution versions.</p>
          </div>
      );
  }

  // Dot Navigation Logic
  const renderDots = () => {
      const total = changelogData.length;
      const MAX_DOTS = 5;
      
      let dots = [];
      
      if (total <= MAX_DOTS) {
          // Show all
          for (let i = 0; i < total; i++) {
              dots.push(i);
          }
      } else {
          // Logic for many items: Always show First, Last, and window around Current
          const leftBound = Math.max(0, currentIndex - 1);
          const rightBound = Math.min(total - 1, currentIndex + 1);
          
          if (leftBound > 0) {
              dots.push(0);
              if (leftBound > 1) dots.push('...'); 
          }
          
          for (let i = leftBound; i <= rightBound; i++) {
              dots.push(i);
          }
          
          if (rightBound < total - 1) {
              if (rightBound < total - 2) dots.push('...');
              dots.push(total - 1);
          }
      }

      return (
          <div className="flex items-center gap-2 px-2">
              {dots.map((d, idx) => {
                  if (d === '...') {
                      return <span key={`dots-${idx}`} className="text-textSecondary text-xs">...</span>;
                  }
                  const i = d as number;
                  const isActive = i === currentIndex;
                  return (
                      <button 
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`
                            h-2 rounded-full transition-all duration-300 
                            ${isActive ? 'w-8 bg-primary shadow-lg shadow-primary/25' : 'w-2 bg-border hover:bg-white/40'}
                        `}
                        aria-label={`Go to changelog ${i + 1}`}
                      />
                  );
              })}
          </div>
      );
  };

  return (
    <div className="w-full mx-auto p-5 space-y-8">
       {/* Page Title */}
       <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-textPrimary tracking-tight">Changelog</h1>
            <p className="text-textSecondary">Review amendments and structural changes between constitution versions.</p>
       </div>

       {/* Navigation Bar */}
       <div className="w-full bg-surface-primary rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-6 select-none shadow-sm relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start z-10">
                <Button 
                    variant="secondary" 
                    onClick={handlePrev} 
                    disabled={currentIndex === 0}
                    className="w-10 h-10 p-0 rounded-lg shrink-0"
                >
                    <ChevronLeft size={20} />
                </Button>
                
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <span className="text-[10px] font-bold text-textSecondary uppercase tracking-wider mb-1">Comparing Versions</span>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-textSecondary font-mono font-bold text-sm">v{originalVer?.meta.version}</span>
                            <span className="text-[10px] text-textSecondary/50 hidden sm:block">Original</span>
                        </div>
                        
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <GitCommit size={16} />
                        </div>
                        
                        <div className="flex flex-col items-start justify-center">
                            <span className="text-textPrimary font-mono font-bold text-lg">v{revisedVer?.meta.version}</span>
                            <span className="text-[10px] text-primary hidden sm:block">Revised</span>
                        </div>
                    </div>
                </div>
                
                <Button 
                    variant="secondary" 
                    onClick={handleNext} 
                    disabled={currentIndex === changelogData.length - 1}
                    className="w-10 h-10 p-0 rounded-lg shrink-0"
                >
                    <ChevronRight size={20} />
                </Button>
            </div>

            {/* Dots Indicator (Hidden on very small screens) */}
            <div className="hidden sm:block z-10">
                {renderDots()}
            </div>
       </div>

       {/* Comparison Content */}
       <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
          <AmendmentSection 
             ruleAmendments={currentLog.ruleAmendments}
             contentAmendments={currentLog.contentAmendments}
             readOnly={true}
             isChangelog={true}
          />
       </div>
    </div>
  );
};
