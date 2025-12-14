
import React, { useState } from 'react';
import { Search, Plus, FileText, Scale, Save } from 'lucide-react';
import { RuleAmendment, ConstitutionContentAmendment } from '../../types';
import { Button } from '../Button/Button';
import { AmendmentCard } from './AmendmentCard';

interface AmendmentSectionProps {
  ruleAmendments: RuleAmendment[];
  contentAmendments: ConstitutionContentAmendment[];
  onAdd?: () => void;
  onDeleteRule?: (index: number) => void;
  onDeleteContent?: (index: number) => void;
  readOnly?: boolean;
  isChangelog?: boolean;
}

export const AmendmentSection: React.FC<AmendmentSectionProps> = ({ 
  ruleAmendments, 
  contentAmendments, 
  onAdd, 
  onDeleteRule, 
  onDeleteContent,
  readOnly = true,
  isChangelog = false
}) => {
  const [amendmentSearch, setAmendmentSearch] = useState('');

  const hasAmendments = ruleAmendments.length > 0 || contentAmendments.length > 0;

  // Dynamic base classes based on mode
  const containerClasses = isChangelog 
    ? 'w-full bg-transparent border-none p-0 flex flex-col' 
    : 'w-full bg-surface-primary rounded-xl p-6 flex flex-col';

  return (
    <div className={containerClasses}>
        
        {/* Header */}
        {!isChangelog && (
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <h3 className="text-xl font-bold text-textPrimary">Proposed Amendments</h3>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={14} />
                        <input 
                            type="text" 
                            placeholder="Filter amendments..." 
                            value={amendmentSearch}
                            onChange={(e) => setAmendmentSearch(e.target.value)}
                            className="w-full bg-black/20 border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-textPrimary focus:outline-none focus:border-primary"
                        />
                    </div>
                    {!readOnly && onAdd && (
                        <Button 
                            onClick={onAdd} 
                            iconLeft={<Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />} 
                            className="text-xs px-3 whitespace-nowrap group"
                        >
                            Add Amendment
                        </Button>
                    )}
                </div>
            </div>
        )}

        {/* Summary Component */}
        {!isChangelog && (
            <div className="w-full bg-primary/5 rounded-lg p-3 mb-6 flex flex-wrap items-center justify-between gap-4">
                 <div className="flex items-center gap-2">
                    <div className="bg-primary/20 p-1.5 rounded-full text-primary"><FileText size={16} /></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-textSecondary">Content Changes</span>
                        <span className="text-sm font-bold text-textPrimary">{contentAmendments.length}</span>
                    </div>
                 </div>
                 <div className="hidden sm:block w-px h-8 bg-border"></div>
                 <div className="flex items-center gap-2">
                    <div className="bg-secondary/20 p-1.5 rounded-full text-secondary"><Scale size={16} /></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-textSecondary">Rule Changes</span>
                        <span className="text-sm font-bold text-textPrimary">{ruleAmendments.length}</span>
                    </div>
                 </div>
                 <div className="hidden sm:block w-px h-8 bg-border"></div>
                 <div className="flex items-center gap-2">
                    <div className="bg-emerald-500/20 p-1.5 rounded-full text-emerald-400"><Save size={16} /></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-textSecondary">Total</span>
                        <span className="text-sm font-bold text-textPrimary">{ruleAmendments.length + contentAmendments.length}</span>
                    </div>
                 </div>
            </div>
        )}

        {/* List Container */}
        <div className="w-full space-y-10">
            {/* Empty State */}
            {!hasAmendments && !isChangelog && (
                <div className="h-64 flex flex-col items-center justify-center text-textSecondary border-2 border-dashed border-border/50 rounded-xl m-0 bg-black/10">
                    <div className="bg-surface-primary p-4 rounded-full mb-4">
                        <Scale size={32} className="opacity-50" />
                    </div>
                    <p className="font-medium mb-1">No amendments proposed</p>
                    {!readOnly && <p className="text-sm opacity-60">Click "Add Amendment" to modify the constitution.</p>}
                </div>
            )}
            
            {!hasAmendments && isChangelog && (
                <div className="p-8 text-center border border-dashed border-border/50 rounded-xl text-textSecondary">
                    No structural or rule changes detected in this version.
                </div>
            )}

            {/* Content Amendments List */}
            {contentAmendments.length > 0 && (
                <div className="w-full">
                    <h4 className="font-bold text-textPrimary mb-4 text-xl tracking-tight">
                        Constitution Structure Changes
                    </h4>
                    <div className="space-y-4 w-full">
                        {contentAmendments.map((amendment, idx) => {
                             if (!amendment.reason.toLowerCase().includes(amendmentSearch.toLowerCase())) return null;
                             return (
                                <AmendmentCard 
                                    key={`c-${idx}`} 
                                    amendment={amendment} 
                                    type="Content" 
                                    onDelete={!readOnly && onDeleteContent ? () => onDeleteContent(idx) : undefined} 
                                    hideReason={isChangelog}
                                    hideLabel={isChangelog}
                                    index={idx} // 0-based index for this array, usually content comes first
                                />
                             );
                        })}
                    </div>
                </div>
            )}

            {/* Rule Amendments List */}
            {ruleAmendments.length > 0 && (
                <div className="w-full">
                    <h4 className="font-bold text-textPrimary mb-4 text-xl tracking-tight">
                         Rule Changes
                    </h4>
                    <div className="space-y-4 w-full">
                        {ruleAmendments.map((amendment, idx) => {
                            if (!amendment.reason.toLowerCase().includes(amendmentSearch.toLowerCase())) return null;
                            // Offset index by contentAmendments length if displayed in same sequence for IDs
                            const globalIndex = contentAmendments.length + idx;
                            return (
                                <AmendmentCard 
                                    key={`r-${idx}`} 
                                    amendment={amendment} 
                                    type="Rule" 
                                    onDelete={!readOnly && onDeleteRule ? () => onDeleteRule(idx) : undefined} 
                                    hideReason={isChangelog}
                                    hideLabel={isChangelog}
                                    index={globalIndex}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
