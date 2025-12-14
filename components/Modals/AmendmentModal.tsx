
import React, { useState, useMemo, useEffect } from 'react';
import { X, ChevronRight, Plus, Trash2, Edit2, AlertTriangle, FileText, Scale } from 'lucide-react';
import { 
  ConstitutionContent, 
  Rule, 
  ActionType, 
  RuleAmendment, 
  ConstitutionContentAmendment,
  ConstitutionContentType
} from '../../types';
import { versionHistoryData } from '../../data/versionHistory';

// --- TYPES ---

type AmendmentTarget = 'Rule' | 'Content';

interface AmendmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (amendment: RuleAmendment | ConstitutionContentAmendment, type: AmendmentTarget) => void;
}

// --- HELPER COMPONENTS ---

interface SelectionTreeListProps {
  items: ConstitutionContent[];
  allRules: Rule[];
  mode: AmendmentTarget;
  selectedId: number | null;
  selectedType: AmendmentTarget | null;
  onSelect: (id: number | null, type: AmendmentTarget, item: any) => void;
  depth: number;
}

const SelectionTreeList: React.FC<SelectionTreeListProps> = ({ 
  items, 
  allRules, 
  mode, 
  selectedId, 
  selectedType, 
  onSelect, 
  depth 
}) => {
  // Single open item ID for this level -> Enforces one branch open at a time
  const [openItemId, setOpenItemId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenItemId(prev => prev === id ? null : id);
  };

  return (
    <div>
      {items.map(item => (
        <SelectionTreeItem
          key={item.id}
          content={item}
          allRules={allRules}
          mode={mode}
          selectedId={selectedId}
          selectedType={selectedType}
          onSelect={onSelect}
          depth={depth}
          isOpen={openItemId === item.id}
          onToggle={() => handleToggle(item.id)}
        />
      ))}
    </div>
  );
};

const SelectionTreeItem: React.FC<{
  content: ConstitutionContent;
  allRules: Rule[];
  mode: AmendmentTarget;
  selectedId: number | null;
  selectedType: AmendmentTarget | null;
  onSelect: (id: number | null, type: AmendmentTarget, item: any) => void;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ content, allRules, mode, selectedId, selectedType, onSelect, depth, isOpen, onToggle }) => {
  
  // Find rules belonging to this content
  const contentRules = useMemo(() => 
    allRules.filter(r => r.constitutionContentId === content.id).sort((a,b) => a.order - b.order),
  [allRules, content.id]);

  const hasChildren = content.children.length > 0 || (mode === 'Rule' && contentRules.length > 0);
  const isSelected = selectedId === content.id && selectedType === 'Content';

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  const handleItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (mode === 'Rule') {
       // In Rule mode, we cannot select content as Base.
       // However, for better UX, clicking the row should toggle expansion like the arrow.
       if (hasChildren) onToggle();
       return;
    }
    
    // Content Mode: Select and Expand
    onSelect(content.id, 'Content', content);
    if (!isOpen && hasChildren) onToggle();
  };

  return (
    <div className="select-none text-sm">
      <div 
        className={`
          flex items-center justify-between py-2 px-3 rounded-md transition-colors border border-transparent
          ${isSelected ? 'bg-primary/20 border-primary/30 text-primary' : 'hover:bg-surface-secondary text-textSecondary hover:text-textPrimary'}
          cursor-pointer
        `}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
        onClick={handleItemClick}
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1">
            <span className={`truncate font-medium ${mode === 'Rule' ? 'opacity-90' : ''}`}>
                {content.title}
            </span>
        </div>
        
        {hasChildren && (
            <div 
              onClick={handleExpand}
              className={`p-1 rounded hover:bg-surface-secondary cursor-pointer text-textSecondary hover:text-textPrimary transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            >
             <ChevronRight size={14} />
            </div>
        )}
      </div>

      {isOpen && (
        <div className="border-l border-border/20 ml-3">
          {/* Rules List (Only if mode is Rule) */}
          {mode === 'Rule' && contentRules.map(rule => {
             const isRuleSelected = selectedId === rule.id && selectedType === 'Rule';
             return (
               <div 
                 key={`r-${rule.id}`}
                 className={`
                    flex items-start gap-2 py-2 px-2 rounded-md cursor-pointer transition-colors border border-transparent ml-2 mb-1
                    ${isRuleSelected ? 'bg-secondary/20 border-secondary/30 text-textPrimary' : 'hover:bg-surface-secondary text-textSecondary hover:text-textPrimary'}
                 `}
                 style={{ paddingLeft: `${(depth + 1) * 12 + 12}px` }}
                 onClick={(e) => {
                   e.stopPropagation();
                   onSelect(rule.id, 'Rule', rule);
                 }}
               >
                 <Scale size={14} className="mt-0.5 shrink-0 opacity-50" />
                 <span className="text-xs leading-snug line-clamp-2">{rule.content}</span>
               </div>
             );
          })}

          {/* Recursive Children */}
          <SelectionTreeList 
            items={content.children}
            allRules={allRules}
            mode={mode}
            selectedId={selectedId}
            selectedType={selectedType}
            onSelect={onSelect}
            depth={depth + 1}
          />
        </div>
      )}
    </div>
  );
};


// --- MAIN MODAL ---

export const AmendmentModal: React.FC<AmendmentModalProps> = ({ isOpen, onClose, onSave }) => {
  // Config State
  const [targetType, setTargetType] = useState<AmendmentTarget>('Rule');
  const [actionType, setActionType] = useState<ActionType>('Edit');
  
  // Selection State
  const [selectedItem, setSelectedItem] = useState<any>(null); // The raw object (Rule or Content)
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<AmendmentTarget | null>(null);
  const [isRootSelected, setIsRootSelected] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    order: 0,
    type: 'Section' as ConstitutionContentType,
    reason: ''
  });

  // Data Source
  const constitution = versionHistoryData[0];

  // Helper to find parent node in the tree
  const findParent = (items: ConstitutionContent[], childId: number): ConstitutionContent | null => {
    for (const item of items) {
      if (item.children?.some(c => c.id === childId)) {
        return item;
      }
      if (item.children) {
        const found = findParent(item.children, childId);
        if (found) return found;
      }
    }
    return null;
  };

  // Reset form when selection changes or action changes
  useEffect(() => {
    if (selectedItem && actionType === 'Edit') {
      setFormData(prev => ({
        ...prev,
        title: selectedItem.title || '',
        content: selectedItem.content || '',
        order: selectedItem.order || 1,
        type: selectedItem.type || 'Section',
      }));
    } else if (actionType === 'Add') {
      // If adding to a parent content (selectedItem), we default order to potentially next available
      setFormData(prev => ({
        ...prev,
        title: '',
        content: '',
        order: (selectedItem?.children?.length || 0) + 1, 
        type: 'Section',
      }));
    }
  }, [selectedItem, actionType, isRootSelected]);

  const handleTreeSelect = (id: number | null, type: AmendmentTarget, item: any) => {
    if (id === 0 && item === null) {
      // Root Selection
      setIsRootSelected(true);
      setSelectedId(null);
      setSelectedType('Content'); // Root is only valid for content parent
      setSelectedItem(null);
    } else {
      setIsRootSelected(false);
      setSelectedId(id);
      setSelectedType(type);
      setSelectedItem(item);
    }
  };

  const handleSave = () => {
    // Basic validation
    if (!selectedItem && !isRootSelected && actionType !== 'Add') return;
    if (actionType === 'Add' && !selectedItem && !isRootSelected) return;

    if (targetType === 'Rule') {
      let payload: RuleAmendment;
      
      if (actionType === 'Edit') {
        payload = {
          actionType: 'Edit',
          reason: formData.reason,
          baseRule: selectedItem,
          revisedRule: { ...selectedItem, content: formData.content, order: Number(formData.order) }
        };
      } else if (actionType === 'Remove') {
        payload = {
          actionType: 'Remove',
          reason: formData.reason,
          baseRule: selectedItem,
          revisedRule: undefined
        };
      } else {
        // Add Rule
        // When adding a rule, the selected item is the PARENT CONTENT (due to treeMode='Content')
        // So we use selectedItem.id as the constitutionContentId
        const parentId = selectedItem.id;
        
        payload = {
          actionType: 'Add',
          reason: formData.reason,
          baseRule: undefined,
          revisedRule: {
            id: Math.floor(Math.random() * 100000),
            constitutionContentId: parentId,
            content: formData.content,
            order: Number(formData.order)
          }
        };
      }
      onSave(payload, 'Rule');
    } else {
      let payload: ConstitutionContentAmendment;

      if (actionType === 'Edit') {
        // Find Parent for Edit (existing item)
        const parentNode = findParent(constitution.constitutionContent, selectedItem.id);
        payload = {
          actionType: 'Edit',
          reason: formData.reason,
          baseContent: selectedItem,
          revisedContent: { 
            ...selectedItem, 
            title: formData.title, 
            type: formData.type, 
            order: Number(formData.order) 
          },
          parentId: parentNode ? parentNode.id : undefined
        };
      } else if (actionType === 'Remove') {
        // Find Parent for Remove (existing item)
        const parentNode = findParent(constitution.constitutionContent, selectedItem.id);
        payload = {
          actionType: 'Remove',
          reason: formData.reason,
          baseContent: selectedItem,
          revisedContent: undefined,
          parentId: parentNode ? parentNode.id : undefined
        };
      } else {
        // Add Content
        // Parent is either the selected item (Content) OR undefined if root is selected
        const parentId = isRootSelected ? undefined : selectedItem.id;
        
        payload = {
          actionType: 'Add',
          reason: formData.reason,
          baseContent: undefined,
          revisedContent: {
            id: Math.floor(Math.random() * 100000),
            title: formData.title,
            type: formData.type,
            order: Number(formData.order),
            children: []
          },
          parentId: parentId
        };
      }
      onSave(payload, 'Content');
    }
    onClose();
  };

  const isFormValid = () => {
    if (!formData.reason || formData.reason.length < 10) return false;
    
    // Validate selection
    if (!selectedItem && !isRootSelected) return false;
    if (actionType === 'Edit' || actionType === 'Remove') {
       if (isRootSelected) return false; // Cannot edit/remove abstract root
    }

    if (actionType === 'Add' || actionType === 'Edit') {
      if (targetType === 'Rule' && !formData.content) return false;
      if (targetType === 'Content' && !formData.title) return false;
    }
    return true;
  };

  if (!isOpen) return null;

  // Determine effective Tree Mode
  // If we are Adding, we always want to select a Parent Content, so force mode='Content'
  const treeMode = (actionType === 'Add') ? 'Content' : targetType;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl h-[90vh] bg-surface-primary border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-primary">
          <div>
            <h2 className="text-xl font-bold text-textPrimary">Create Amendment</h2>
            <p className="text-textSecondary text-sm">Draft a change to the Governance Constitution (v{constitution.meta.version})</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-textSecondary hover:text-textPrimary transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body - Split View */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT: Tree Selector (No Header) */}
          <div className="w-1/3 border-r border-border bg-surface-secondary flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
               {/* Root Selector for Content Add */}
               {targetType === 'Content' && actionType === 'Add' && (
                 <div 
                   onClick={() => handleTreeSelect(0, 'Content', null)}
                   className={`
                      flex items-center gap-2 py-2 px-3 rounded-md cursor-pointer mb-2 transition-colors border border-transparent
                      ${isRootSelected ? 'bg-primary/20 border-primary/30 text-primary' : 'hover:bg-surface-primary text-textSecondary hover:text-textPrimary'}
                   `}
                 >
                    <div className="p-1 rounded bg-white/10"><FileText size={14}/></div>
                    <span className="font-bold uppercase text-xs">Constitution Root</span>
                 </div>
               )}

               <SelectionTreeList
                 items={constitution.constitutionContent}
                 allRules={constitution.rules}
                 mode={treeMode}
                 selectedId={selectedId}
                 selectedType={selectedType}
                 onSelect={handleTreeSelect}
                 depth={0}
               />
            </div>
          </div>

          {/* RIGHT: Configuration */}
          <div className="w-2/3 flex flex-col bg-surface-primary/50">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
               
               {/* Step 1: Configuration */}
               <div className="mb-6">
                  
                  <div className="flex flex-col gap-4 mb-6">
                    {/* Row 1: Amendment Type */}
                    <div className="flex items-center">
                        <label className="w-32 text-xs font-bold text-textSecondary uppercase">Amendment Type:</label>
                        <div className="bg-surface-secondary p-1 rounded-lg flex border border-border">
                            <button 
                              onClick={() => { setTargetType('Rule'); setSelectedItem(null); setIsRootSelected(false); }}
                              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${targetType === 'Rule' ? 'bg-primary text-white shadow-lg' : 'text-textSecondary hover:text-textPrimary'}`}
                            >
                              <div className="flex items-center gap-2"><Scale size={16}/> Rule</div>
                            </button>
                            <button 
                              onClick={() => { setTargetType('Content'); setSelectedItem(null); setIsRootSelected(false); }}
                              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${targetType === 'Content' ? 'bg-primary text-white shadow-lg' : 'text-textSecondary hover:text-textPrimary'}`}
                            >
                              <div className="flex items-center gap-2"><FileText size={16}/> Content</div>
                            </button>
                        </div>
                    </div>

                    {/* Row 2: Action Type */}
                    <div className="flex items-center">
                        <label className="w-32 text-xs font-bold text-textSecondary uppercase">Action Type:</label>
                        <div className="bg-surface-secondary p-1 rounded-lg flex border border-border">
                            <button 
                              onClick={() => { setActionType('Edit'); setIsRootSelected(false); setSelectedItem(null); }}
                              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${actionType === 'Edit' ? 'bg-blue-600 text-white' : 'text-textSecondary hover:text-textPrimary'}`}
                            >
                              <div className="flex items-center gap-2"><Edit2 size={16}/> Edit</div>
                            </button>
                            <button 
                              onClick={() => { setActionType('Add'); setSelectedItem(null); setIsRootSelected(false); }}
                              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${actionType === 'Add' ? 'bg-emerald-600 text-white' : 'text-textSecondary hover:text-textPrimary'}`}
                            >
                              <div className="flex items-center gap-2"><Plus size={16}/> Add</div>
                            </button>
                            <button 
                              onClick={() => { setActionType('Remove'); setIsRootSelected(false); setSelectedItem(null); }}
                              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${actionType === 'Remove' ? 'bg-rose-600 text-white' : 'text-textSecondary hover:text-textPrimary'}`}
                            >
                              <div className="flex items-center gap-2"><Trash2 size={16}/> Remove</div>
                            </button>
                        </div>
                    </div>
                  </div>
               </div>

               {/* Step 2: Context & Form */}
               <div>
                  {/* Context Card */}
                  <div className={`p-4 rounded-lg mb-6 ${selectedItem || isRootSelected ? 'bg-primary/10' : 'bg-orange-500/10'}`}>
                      {!selectedItem && !isRootSelected ? (
                        <div className="flex items-center gap-2 text-orange-400">
                           <AlertTriangle size={18} />
                           <span className="text-sm font-medium">Please select a {actionType === 'Add' ? 'Parent Content' : targetType} from the Explorer on the left.</span>
                        </div>
                      ) : (
                        <div>
                           <div className="text-xs text-primary font-bold uppercase mb-1">
                             {actionType === 'Add' ? `Adding to Parent ${isRootSelected ? 'Root' : selectedType}` : `Base ${selectedType}`}
                           </div>
                           <div className="text-textPrimary font-medium line-clamp-2">
                             {isRootSelected ? 'Constitution Root' : (selectedType === 'Content' ? selectedItem.title : selectedItem.content)}
                           </div>
                           {!isRootSelected && selectedItem.order && <div className="text-xs text-textSecondary mt-1 font-mono">Order: {selectedItem.order}</div>}
                        </div>
                      )}
                  </div>
                  
                  {/* DYNAMIC FORM FIELDS */}
                  <div className={`space-y-4 transition-opacity duration-200 ${(!selectedItem && !isRootSelected) ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                      
                      {/* Reason Field */}
                      <div>
                        <label className="block text-xs font-bold text-textSecondary uppercase mb-1">Reason for Change (Required)</label>
                        <textarea 
                          value={formData.reason}
                          onChange={(e) => setFormData({...formData, reason: e.target.value})}
                          placeholder="Describe why this amendment is necessary (10-70 chars)..."
                          className="w-full bg-surface-secondary border border-border rounded-lg p-3 text-sm text-textPrimary focus:border-primary focus:outline-none min-h-[80px]"
                          maxLength={70}
                        />
                        <div className="text-right text-[10px] text-textSecondary mt-1">{formData.reason.length}/70</div>
                      </div>

                      {/* Fields for EDIT and ADD */}
                      {actionType !== 'Remove' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            
                           {/* Content Specific: Title, Type & Order */}
                           {targetType === 'Content' && (
                              <>
                                <div>
                                  <label className="block text-xs font-bold text-textSecondary uppercase mb-1">Title</label>
                                  <input 
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full bg-surface-secondary border border-border rounded-lg p-3 text-sm text-textPrimary focus:border-primary focus:outline-none"
                                  />
                                </div>
                                {/* Merged Row for Type and Order */}
                                <div className="flex gap-4">
                                  <div className="flex-1">
                                    <label className="block text-xs font-bold text-textSecondary uppercase mb-1">Type</label>
                                    <select 
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value as ConstitutionContentType})}
                                        className="w-full bg-surface-secondary border border-border rounded-lg p-3 text-sm text-textPrimary focus:border-primary focus:outline-none"
                                    >
                                        <option value="Article">Article</option>
                                        <option value="Section">Section</option>
                                        <option value="Tenet">Tenet</option>
                                        <option value="appendix">Appendix</option>
                                        <option value="GuardRail">GuardRail</option>
                                    </select>
                                  </div>
                                  <div className="flex-1">
                                    <label className="block text-xs font-bold text-textSecondary uppercase mb-1">Priority Order</label>
                                    <input 
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                                        className="w-full bg-surface-secondary border border-border rounded-lg p-3 text-sm text-textPrimary focus:border-primary focus:outline-none"
                                    />
                                  </div>
                                </div>
                              </>
                           )}

                           {/* Rule Specific: Content & Order */}
                           {targetType === 'Rule' && (
                              <>
                                <div>
                                    <label className="block text-xs font-bold text-textSecondary uppercase mb-1">Rule Content</label>
                                    <textarea 
                                        value={formData.content}
                                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                                        className="w-full bg-surface-secondary border border-border rounded-lg p-3 text-sm text-textPrimary focus:border-primary focus:outline-none min-h-[100px]"
                                    />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-textSecondary uppercase mb-1">Priority Order</label>
                                  <input 
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                                    className="w-full bg-surface-secondary border border-border rounded-lg p-3 text-sm text-textPrimary focus:border-primary focus:outline-none"
                                  />
                                </div>
                              </>
                           )}
                        </div>
                      )}

                      {/* Remove Warning */}
                      {actionType === 'Remove' && (
                         <div className="p-4 bg-red-500/10 rounded-lg text-red-400 text-sm flex items-start gap-2">
                             <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                            <div>
                                <strong className="font-bold">Warning:</strong> You are about to remove this {targetType}. 
                                {targetType === 'Content' && " Ensure all child rules and contents have been removed first, otherwise this amendment may be invalid."}
                            </div>
                         </div>
                      )}
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-surface-primary flex justify-end gap-3">
              <button 
                onClick={onClose} 
                className="px-6 py-2 rounded-lg text-sm font-medium bg-surface-secondary text-textPrimary hover:bg-surface-secondary/80 shadow-sm border border-transparent hover:border-border transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={!isFormValid()}
                className={`
                   px-6 py-2 rounded-lg text-sm font-bold shadow-lg transition-all
                   ${isFormValid() 
                        ? 'bg-primary text-white hover:bg-primary/90' 
                        : 'bg-surface-secondary text-textSecondary cursor-not-allowed shadow-none'
                   }
                `}
              >
                Save Amendment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
