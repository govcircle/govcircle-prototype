
import React, { useEffect, useState, useMemo } from 'react';
import { Constitution, ConstitutionContent } from '../types';
import { RuleCard } from '../components/Constitution/RuleCard';
import { QuickAccess } from '../components/Constitution/QuickAccess';
import { OpinionPanel } from '../components/Constitution/OpinionPanel';
import { MetadataPanel } from '../components/Constitution/MetadataPanel';
import { Card } from '../components/Card/Card';
import { versionHistoryData } from '../data/versionHistory';

// Helper to find path to node
const findPathToNode = (contents: ConstitutionContent[], targetId: string, currentPath: string[] = []): string[] | null => {
  for (const content of contents) {
    const idStr = content.id.toString();
    if (idStr === targetId) {
      return [...currentPath, idStr];
    }
    if (content.children) {
      const path = findPathToNode(content.children, targetId, [...currentPath, idStr]);
      if (path) return path;
    }
  }
  return null;
};

interface ConstitutionPageProps {
  customData?: Constitution;
  onOpinionClick?: (id: string) => void;
}

export const ConstitutionPage: React.FC<ConstitutionPageProps> = ({ customData, onOpinionClick }) => {
  const [data, setData] = useState<Constitution | null>(null);
  const [activeId, setActiveId] = useState<string>('');
  const [expandedContentIds, setExpandedContentIds] = useState<string[]>([]);

  useEffect(() => {
    if (customData) {
      setData(customData);
    }
  }, [customData]);

  const handleNavigate = (id: string) => {
    setActiveId(id);
    
    if (data) {
      if (id === 'preamble') {
        setExpandedContentIds([]); 
      } else {
        const fullPath = findPathToNode(data.constitutionContent, id);
        if (fullPath) {
          // Expand all ancestors
          const ancestors = fullPath.filter(nodeId => nodeId !== id);
          setExpandedContentIds(ancestors);
        }
      }
    }

    const performScroll = () => {
      const element = document.getElementById(id);
      if (element) {
        // Offset increased to account for Navbar + headers
        const headerOffset = 130; 
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    };

    setTimeout(performScroll, 50);
  };

  // Determine if this is the latest version by sorting all history by epoch
  const isLatest = useMemo(() => {
      if (!data) return false;
      const sorted = [...versionHistoryData].sort((a, b) => {
          const epochA = parseInt(a.meta.enactedEpoch, 10) || 0;
          const epochB = parseInt(b.meta.enactedEpoch, 10) || 0;
          return epochB - epochA;
      });
      return sorted.length > 0 && sorted[0].id === data.id;
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-textSecondary">
        No constitution data available.
      </div>
    );
  }

  // Only show opinion panel for the latest constitution version
  const showOpinion = isLatest;

  return (
    <div className="w-full mx-auto p-5">
      
      {/* 
        Grid Layout Adjustment: 
        Left: 25%
        Right: 23% (Approx 20px less than 25% on standard desktop)
        Center: Remaining space (52%)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-[25%_1fr_23%] gap-2 lg:gap-4 relative items-start">
        
        {/* Left Sidebar: Quick Access */}
        <aside className="lg:sticky lg:top-32 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar order-2 lg:order-1 mb-2 lg:mb-0">
          <Card className="p-6 border-none bg-surface-primary border border-border">
             <QuickAccess 
                items={data.constitutionContent} 
                onNavigate={handleNavigate}
                activeId={activeId}
             />
          </Card>
        </aside>

        {/* Center Content */}
        <main className="order-3 lg:order-2">
            <div className="bg-surface-primary rounded-xl p-6 shadow-sm">
              <div className="mb-8 border-b border-border/50 pb-6">
                  {/* Hardcoded Main Title per user request */}
                  <h1 className="text-3xl font-bold text-textPrimary mb-4">Cardano Constitution</h1>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-textSecondary items-center">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">Version {data.meta.version}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>Enacted: <span className="text-textPrimary font-medium">{data.meta.enactedEpoch}</span></span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      {/* NEW: Liveness Display */}
                      <span>Liveness: <span className="text-textPrimary font-medium">{data.meta.liveness}</span></span>
                  </div>
              </div>

             <section id="preamble" className="mb-12 scroll-mt-48">
                <Card className="bg-surface-secondary border-none shadow-inner">
                    <h2 className="text-xl font-bold text-primary mb-4">{data.preamble.title}</h2>
                    <p className="text-textPrimary leading-relaxed whitespace-pre-line">
                        {data.preamble.content}
                    </p>
                </Card>
             </section>

             <div className="space-y-6">
                {data.constitutionContent.map(content => (
                    <RuleCard 
                      key={content.id} 
                      content={content}
                      allRules={data.rules}
                      expandedIds={expandedContentIds}
                      activeId={activeId}
                      forceCollapse={false} 
                    />
                ))}
             </div>
           </div>
        </main>

        {/* Right Sidebar: Metadata & Opinion - Independent Scrolling Enabled */}
        <aside className="lg:sticky lg:top-32 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar order-1 lg:order-3 mb-2 lg:mb-0 space-y-4">
            {customData && (
                <MetadataPanel version={customData} />
            )}
            
            {showOpinion && (
                <Card className="p-6 border-none bg-surface-primary">
                  <OpinionPanel onOpinionClick={onOpinionClick} />
                </Card>
            )}
        </aside>
      </div>
    </div>
  );
};
