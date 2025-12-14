
import React from 'react';
import { Edit2, Plus, Trash2, Scale, FileText, ArrowRight } from 'lucide-react';
import { RuleAmendment, ConstitutionContentAmendment, ActionType, ConstitutionContent } from '../../types';
import { versionHistoryData } from '../../data/versionHistory';

interface AmendmentCardProps {
  amendment: RuleAmendment | ConstitutionContentAmendment;
  type: 'Rule' | 'Content';
  onDelete?: () => void;
  forceMobileLayout?: boolean;
  hideReason?: boolean;
  hideLabel?: boolean;
  index?: number;
}

const ACTION_CONFIG: Record<ActionType, { color: string; bg: string; border: string; icon: React.ReactNode; label: string }> = {
  'Edit': { color: 'text-info', bg: 'bg-info/10', border: 'border-info/20', icon: <Edit2 size={14} />, label: 'Modification' },
  'Add': { color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', icon: <Plus size={14} />, label: 'Addition' },
  'Remove': { color: 'text-error', bg: 'bg-error/10', border: 'border-error/20', icon: <Trash2 size={14} />, label: 'Removal' },
};

interface DiffPart {
    type: 'eq' | 'ins' | 'del';
    value: string;
}

const calculateDiff = (oldText: string, newText: string): DiffPart[] => {
    if (!oldText) oldText = "";
    if (!newText) newText = "";
    const oWords = oldText.split(/(\s+)/);
    const nWords = newText.split(/(\s+)/);
    const matrix: number[][] = [];
    for (let i = 0; i <= oWords.length; i++) {
        matrix[i] = new Array(nWords.length + 1).fill(0);
    }
    for (let i = 1; i <= oWords.length; i++) {
        for (let j = 1; j <= nWords.length; j++) {
            if (oWords[i - 1] === nWords[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1] + 1;
            } else {
                matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
            }
        }
    }
    const changes: DiffPart[] = [];
    let i = oWords.length;
    let j = nWords.length;
    while (i > 0 && j > 0) {
        if (oWords[i - 1] === nWords[j - 1]) {
            changes.unshift({ type: 'eq', value: oWords[i - 1] });
            i--;
            j--;
        } else if (matrix[i - 1][j] > matrix[i][j - 1]) {
            changes.unshift({ type: 'del', value: oWords[i - 1] });
            i--;
        } else {
            changes.unshift({ type: 'ins', value: nWords[j - 1] });
            j--;
        }
    }
    while (i > 0) {
        changes.unshift({ type: 'del', value: oWords[i - 1] });
        i--;
    }
    while (j > 0) {
        changes.unshift({ type: 'ins', value: nWords[j - 1] });
        j--;
    }
    const merged: DiffPart[] = [];
    for (const change of changes) {
        if (merged.length > 0 && merged[merged.length - 1].type === change.type) {
            merged[merged.length - 1].value += change.value;
        } else {
            merged.push(change);
        }
    }
    return merged;
};

const getConstitutionPath = (id: number, contents: ConstitutionContent[], path: string[] = []): string | null => {
    for (const item of contents) {
        const segment = item.title.split(':')[0].trim();
        if (item.id === id) {
            return [...path, segment].join(' > ');
        }
        if (item.children && item.children.length > 0) {
            const found = getConstitutionPath(id, item.children, [...path, segment]);
            if (found) return found;
        }
    }
    return null;
}

export const AmendmentCard: React.FC<AmendmentCardProps> = ({ 
    amendment, 
    type, 
    onDelete, 
    forceMobileLayout = false,
    hideReason = false,
    hideLabel = false,
    index
}) => {
  const config = ACTION_CONFIG[amendment.actionType];
  const referenceData = versionHistoryData[0].constitutionContent;

  const getBreadcrumbs = () => {
      if (type === 'Rule') {
         const r = amendment as RuleAmendment;
         if (r.path) return r.path;
         const rule = r.baseRule || r.revisedRule;
         if (!rule) return 'Unknown Rule';
         const path = getConstitutionPath(rule.constitutionContentId, referenceData);
         return path ? `${path} > Rule #${rule.order}` : `Rule #${rule.order}`;
      } else {
         const c = amendment as ConstitutionContentAmendment;
         if (c.path) return c.path;
         if (c.parentId !== undefined) {
             const parentPath = getConstitutionPath(c.parentId, referenceData);
             const currentTitle = c.revisedContent?.title || c.baseContent?.title || 'New Item';
             return parentPath ? `${parentPath} > ${currentTitle}` : `${currentTitle}`;
         } else if (c.parentId === undefined && c.actionType !== 'Edit' && c.actionType !== 'Remove') {
             return c.revisedContent?.title || 'New Root Item';
         }
         const content = c.baseContent || c.revisedContent;
         if (!content) return 'Unknown Content';
         const path = getConstitutionPath(content.id, referenceData);
         return path || (amendment.actionType === 'Add' ? 'New Content Location' : content.title);
      }
  };

  const renderDiffContent = (diffs: DiffPart[], isOriginal: boolean) => {
      return (
          <span>
              {diffs.map((part, i) => {
                  if (part.type === 'eq') {
                      return <span key={i} className="text-textPrimary">{part.value}</span>;
                  }
                  if (isOriginal && part.type === 'del') {
                      return (
                          <span key={i} className="bg-warning/30 text-textPrimary rounded-[4px] px-0 py-0.5 mx-0 decoration-clone box-decoration-clone shadow-sm">
                              {part.value}
                          </span>
                      );
                  }
                  if (!isOriginal && part.type === 'ins') {
                      return (
                          <span key={i} className="bg-info/30 text-textPrimary rounded-[4px] px-0 py-0.5 mx-0 decoration-clone box-decoration-clone shadow-sm">
                              {part.value}
                          </span>
                      );
                  }
                  return null;
              })}
          </span>
      );
  };

  const renderItemBox = (
      content: string | undefined, 
      diffs: DiffPart[] | null,
      label: string, 
      styleVariant: 'orange' | 'red' | 'blue' | 'green' | 'placeholder',
      order?: number,
      prevOrder?: number,
      contentType?: string,
      prevContentType?: string
    ) => {
      
      if (styleVariant === 'placeholder') {
          return (
             <div className="hidden md:block flex-1 bg-surface-secondary/30 rounded-lg p-4 min-h-[120px] opacity-30 flex items-center justify-center border-none">
                <span className="text-xs text-textSecondary uppercase font-bold tracking-wider">Empty</span>
             </div>
          );
      }

      let styleClass = "";
      if (styleVariant === 'orange') styleClass = "bg-warning/10";
      if (styleVariant === 'red') styleClass = "bg-error/10";
      if (styleVariant === 'blue') styleClass = "bg-info/10";
      if (styleVariant === 'green') styleClass = "bg-success/10";

      let labelColor = "";
      if (styleVariant === 'orange') labelColor = "text-warning";
      if (styleVariant === 'red') labelColor = "text-error";
      if (styleVariant === 'blue') labelColor = "text-info";
      if (styleVariant === 'green') labelColor = "text-success";

      const orderChanged = prevOrder !== undefined && order !== undefined && prevOrder !== order;
      const typeChanged = prevContentType !== undefined && contentType !== undefined && prevContentType !== contentType;
      const isOriginal = styleVariant === 'orange' || styleVariant === 'red';

      return (
         <div className={`relative p-4 pt-7 rounded-lg ${styleClass} flex-1 w-full min-h-[120px] border-none`}>
             <div className={`absolute top-2 right-2 text-[10px] uppercase font-bold ${labelColor}`}>
                 {label}
             </div>
             
             {contentType && (
                 <div className="mb-2">
                     <span className={`text-[10px] font-mono border-none px-1.5 py-0.5 rounded bg-surface-primary/50 ${typeChanged ? 'text-warning' : 'text-textSecondary'}`}>
                        {contentType}
                     </span>
                 </div>
             )}

             <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                 {diffs ? renderDiffContent(diffs, isOriginal) : <span className="text-textPrimary">{content}</span>}
             </div>
             
             {order !== undefined && (
                 <div className={`text-xs mt-3 font-mono opacity-70 border-t border-border pt-2 ${orderChanged ? 'text-warning font-bold' : 'text-textSecondary'}`}>
                    Order: {order}
                 </div>
             )}
         </div>
      );
  };

  const renderComparison = () => {
      let baseText: string | undefined;
      let revisedText: string | undefined;
      let baseOrder: number | undefined;
      let revisedOrder: number | undefined;
      let baseType: string | undefined;
      let revisedType: string | undefined;

      if (type === 'Rule') {
          const r = amendment as RuleAmendment;
          baseText = r.baseRule?.content;
          revisedText = r.revisedRule?.content;
          baseOrder = r.baseRule?.order;
          revisedOrder = r.revisedRule?.order;
      } else {
          const c = amendment as ConstitutionContentAmendment;
          baseText = c.baseContent?.title;
          revisedText = c.revisedContent?.title;
          baseOrder = c.baseContent?.order;
          revisedOrder = c.revisedContent?.order;
          baseType = c.baseContent?.type;
          revisedType = c.revisedContent?.type;
      }

      const isEdit = amendment.actionType === 'Edit';
      const isAdd = amendment.actionType === 'Add';
      const isRemove = amendment.actionType === 'Remove';

      const diffs = (isEdit && baseText && revisedText) ? calculateDiff(baseText, revisedText) : null;

      return (
          <div className={`flex gap-4 items-stretch ${forceMobileLayout ? 'flex-col' : 'flex-col md:flex-row'}`}>
              {(isEdit || isRemove) ? (
                 renderItemBox(
                     baseText,
                     diffs, 
                     isRemove ? 'REMOVED' : 'ORIGINAL', 
                     isRemove ? 'red' : 'orange',
                     baseOrder,
                     undefined,
                     baseType,
                     undefined
                 )
              ) : (
                 !forceMobileLayout && renderItemBox(undefined, null, '', 'placeholder')
              )}

              {!forceMobileLayout && (
                  <div className="hidden md:flex items-center justify-center text-textSecondary opacity-50 px-2">
                      <ArrowRight size={24} strokeWidth={1.5} />
                  </div>
              )}

              {(isEdit || isAdd) ? (
                  renderItemBox(
                      revisedText,
                      diffs,
                      isAdd ? 'ADDED' : 'REVISED',
                      isAdd ? 'green' : 'blue',
                      revisedOrder,
                      isEdit ? baseOrder : undefined,
                      revisedType,
                      isEdit ? baseType : undefined
                  )
              ) : (
                 !forceMobileLayout && renderItemBox(undefined, null, '', 'placeholder')
              )}
          </div>
      );
  };

  return (
    <div 
        id={index !== undefined ? `amendment-${index + 1}` : undefined} 
        className={`group bg-surface-primary border ${config.border} rounded-xl p-5 transition-all duration-200 hover:shadow-lg relative overflow-hidden`}
    >
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.bg.replace('/10', '')}`} />

        <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                     <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${config.bg} ${config.color}`}>
                             {type === 'Rule' ? <Scale size={14} /> : <FileText size={14} />}
                        </div>
                        <span className="text-textPrimary font-bold text-sm leading-tight">
                            {getBreadcrumbs()}
                        </span>
                     </div>
                </div>
                
                <div className="flex items-center gap-3">
                    {index !== undefined && (
                        <span className="text-[10px] px-2 py-1 rounded-lg uppercase font-bold tracking-wider border border-border bg-surface-secondary text-textSecondary select-none">
                            #{index + 1}
                        </span>
                    )}
                    
                    {onDelete && (
                        <button 
                            onClick={onDelete}
                            className="p-2 rounded-lg hover:bg-error/10 text-textSecondary hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove Amendment"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="w-full">
                {renderComparison()}
            </div>

            {!hideReason && (
                <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-sm text-textPrimary/90 italic leading-relaxed pl-3 border-l-2 border-primary/30">
                        {amendment.reason}
                    </p>
                </div>
            )}
        </div>
    </div>
  );
};
