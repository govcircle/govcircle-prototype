
import React, { useState, useEffect } from 'react';
import { ConstitutionContent, Rule } from '../../types';
import { Card } from '../Card/Card';
import { Button } from '../Button/Button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface RuleCardProps {
  content: ConstitutionContent;
  allRules: Rule[]; // We need full list to find children of this content
  level?: number;
  expandedIds?: string[];
  activeId?: string;
  forceCollapse?: boolean;
}

export const RuleCard: React.FC<RuleCardProps> = ({ 
  content, 
  allRules,
  level = 0, 
  expandedIds, 
  activeId, 
  forceCollapse = false 
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = content.children && content.children.length > 0;
  const contentIdStr = content.id.toString();

  // Find rules associated with this content block
  const associatedRules = allRules
    .filter(r => r.constitutionContentId === content.id)
    .sort((a, b) => a.order - b.order);

  // 1. Sync with global navigation expansion
  useEffect(() => {
    if (expandedIds?.includes(contentIdStr)) {
      setExpanded(true);
    }
  }, [expandedIds, contentIdStr]);

  // 2. Handle Recursive Collapse
  useEffect(() => {
    if (forceCollapse) {
      setExpanded(false);
    }
  }, [forceCollapse]);

  const toggleExpanded = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpanded(!expanded);
  };

  // Alternating Background Logic
  // Level 0 (Even): surface-secondary (User requested parent color is 2)
  // Level 1 (Odd): surface-primary
  // Cycles recursively
  const isEvenLevel = level % 2 === 0;
  
  // Note: Card component has default 'bg-surface-primary'. 
  // We override it here based on level to alternate.
  const bgClass = isEvenLevel 
    ? 'bg-surface-secondary shadow-inner' 
    : 'bg-surface-primary shadow-sm';

  const paddingClass = level === 0 ? '' : 'p-4';
  
  const isActive = activeId === contentIdStr;
  const activeBorderClass = isActive ? 'border-l-4 border-l-primary bg-primary/5' : '';

  // Always show rules if they exist for this block.
  // Children content blocks are collapsible.
  
  return (
    <div id={contentIdStr} className="scroll-mt-48 w-full">
      <Card 
        className={`
          relative group transition-all duration-300 w-full border-0
          ${bgClass} ${paddingClass} ${activeBorderClass}
          ${level > 0 ? 'mt-4' : 'mb-4'}
        `}
      >
        {/* Header Section */}
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className={`
               font-bold tracking-tight text-primary
               ${level === 0 ? 'text-xl' : 'text-lg'}
            `}>
              {content.title}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-textSecondary border border-border rounded px-1.5 py-0.5">
                {content.type}
            </span>
          </div>
        </div>

        {/* Render Associated Rules Text */}
        {associatedRules.length > 0 && (
          <div className="space-y-3 mb-4 mt-3">
            {associatedRules.map(rule => (
                <p key={rule.id} className="text-textPrimary leading-relaxed text-sm md:text-base pl-2 border-l-2 border-border/30">
                    {rule.content}
                </p>
            ))}
          </div>
        )}

        {/* Action / Expansion Section for CHILDREN CONTENT */}
        {hasChildren && (
          <div className="mt-2 w-full">
            <Button 
              variant="secondary" 
              onClick={toggleExpanded}
              className="text-xs px-3 py-1.5 h-8 bg-black/10 hover:bg-black/20 border-none"
              iconRight={expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            >
              {expanded ? 'Collapse' : 'Expand'}
            </Button>
            
            {/* Recursive Children Container */}
            <div 
              className={`
                mt-4 w-full
                transition-all duration-300 ease-in-out origin-top
                ${expanded ? 'opacity-100 max-h-[5000px] scale-100' : 'opacity-0 max-h-0 scale-95 overflow-hidden'}
              `}
            >
              {content.children?.map(child => (
                <RuleCard 
                  key={child.id} 
                  content={child}
                  allRules={allRules}
                  level={level + 1} 
                  expandedIds={expandedIds}
                  activeId={activeId}
                  forceCollapse={!expanded} 
                />
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
