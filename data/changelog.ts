

import { ConstitutionContent, Rule, ChangelogEntry, RuleAmendment, ConstitutionContentAmendment } from '../types';
import { versionHistoryData } from './versionHistory';

// --- UTILITIES ---

// Dice Coefficient for similarity
const calculateSimilarity = (str1: string, str2: string): number => {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;
  
  const clean1 = str1.toLowerCase().replace(/[^\w\s]/g, '');
  const clean2 = str2.toLowerCase().replace(/[^\w\s]/g, '');
  
  const words1 = clean1.split(/\s+/);
  const words2 = clean2.split(/\s+/);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = [...set1].filter(x => set2.has(x)).length;
  const union = new Set([...words1, ...words2]).size;
  
  return intersection / union;
};

const THRESHOLD = 0.1;

const getRulesByParent = (rules: Rule[]) => {
    const map = new Map<number, Rule[]>();
    rules.forEach(r => {
        if (!map.has(r.constitutionContentId)) map.set(r.constitutionContentId, []);
        map.get(r.constitutionContentId)?.push(r);
    });
    return map;
}

const flattenContents = (contents: ConstitutionContent[], parentId?: number): { node: ConstitutionContent, parentId?: number }[] => {
    let flat: { node: ConstitutionContent, parentId?: number }[] = [];
    contents.forEach(c => {
        flat.push({ node: c, parentId });
        if (c.children) {
            flat = flat.concat(flattenContents(c.children, c.id));
        }
    });
    return flat;
};

// Helper to find path in constitution tree
const getPath = (id: number, contents: ConstitutionContent[], path: string[] = []): string | null => {
    for (const item of contents) {
        // Use clean title (split by : for "Article 1: Title" -> "Article 1")
        const segment = item.title.split(':')[0].trim();
        if (item.id === id) {
            return [...path, segment].join(' > ');
        }
        if (item.children) {
            const found = getPath(id, item.children, [...path, segment]);
            if (found) return found;
        }
    }
    return null;
}

// --- GENERATOR ---

const generateChangelogs = (): ChangelogEntry[] => {
    // We iterate through the version history (assuming chronological order in array)
    // and generate diffs between v[i] and v[i+1].
    const logs: ChangelogEntry[] = [];
    const versions = versionHistoryData; 
    
    for (let i = 0; i < versions.length - 1; i++) {
        const oldVer = versions[i];
        const newVer = versions[i+1];
        
        const contentAmendments: ConstitutionContentAmendment[] = [];
        const ruleAmendments: RuleAmendment[] = [];
        
        // 1. Content Amendments
        const oldContents = flattenContents(oldVer.constitutionContent);
        const newContents = flattenContents(newVer.constitutionContent);
        
        const oldContentMap = new Map(oldContents.map(i => [i.node.id, i]));
        const newContentMap = new Map(newContents.map(i => [i.node.id, i]));
        
        // Compare Old against New
        oldContentMap.forEach((oldItem, id) => {
            const newItem = newContentMap.get(id);
            if (newItem) {
                // Item exists in both versions (Matched by ID)
                const sim = calculateSimilarity(oldItem.node.title, newItem.node.title);
                const hasChanged = oldItem.node.title !== newItem.node.title || 
                                   oldItem.node.type !== newItem.node.type ||
                                   oldItem.node.order !== newItem.node.order;

                if (hasChanged) {
                    let path = getPath(oldItem.parentId || 0, oldVer.constitutionContent);
                    const title = oldItem.node.title.split(':')[0].trim();
                    const fullPath = path ? `${path} > ${title}` : title;

                    // Check similarity threshold
                    if (sim >= THRESHOLD) {
                         contentAmendments.push({
                             actionType: 'Edit',
                             reason: 'Content modified',
                             baseContent: oldItem.node,
                             revisedContent: newItem.node,
                             parentId: oldItem.parentId,
                             path: fullPath
                         });
                    } else {
                        // Dissimilar: Remove + Add
                        contentAmendments.push({
                            actionType: 'Remove',
                            reason: 'Content replaced',
                            baseContent: oldItem.node,
                            revisedContent: undefined,
                            parentId: oldItem.parentId,
                            path: fullPath
                        });
                        
                        let newPath = getPath(newItem.parentId || 0, newVer.constitutionContent);
                        const newTitle = newItem.node.title.split(':')[0].trim();
                        const newFullPath = newPath ? `${newPath} > ${newTitle}` : newTitle;
                        
                        contentAmendments.push({
                            actionType: 'Add',
                            reason: 'Content replaced',
                            baseContent: undefined,
                            revisedContent: newItem.node,
                            parentId: newItem.parentId,
                            path: newFullPath
                        });
                    }
                }
            } else {
                // Item removed in new version
                let path = getPath(oldItem.parentId || 0, oldVer.constitutionContent);
                const title = oldItem.node.title.split(':')[0].trim();
                const fullPath = path ? `${path} > ${title}` : title;

                contentAmendments.push({
                    actionType: 'Remove',
                    reason: 'Content removed',
                    baseContent: oldItem.node,
                    revisedContent: undefined,
                    parentId: oldItem.parentId,
                    path: fullPath
                });
            }
        });
        
        // Check New for items that didn't exist in Old
        newContentMap.forEach((newItem, id) => {
            if (!oldContentMap.has(id)) {
                let path = getPath(newItem.parentId || 0, newVer.constitutionContent);
                const title = newItem.node.title.split(':')[0].trim();
                const fullPath = path ? `${path} > ${title}` : title;

                contentAmendments.push({
                    actionType: 'Add',
                    reason: 'Content added',
                    baseContent: undefined,
                    revisedContent: newItem.node,
                    parentId: newItem.parentId,
                    path: fullPath
                });
            }
        });
        
        // 2. Rule Amendments
        const oldRulesMap = getRulesByParent(oldVer.rules);
        const newRulesMap = getRulesByParent(newVer.rules);
        
        const allParentIds = new Set([...oldRulesMap.keys(), ...newRulesMap.keys()]);
        
        allParentIds.forEach(pid => {
            const oldGrp = oldRulesMap.get(pid) || [];
            const newGrp = newRulesMap.get(pid) || [];
            
            const oldRMap = new Map(oldGrp.map(r => [r.id, r]));
            const newRMap = new Map(newGrp.map(r => [r.id, r]));
            
            // Old Rules
            oldRMap.forEach((oldR, rid) => {
                const newR = newRMap.get(rid);
                if (newR) {
                    const sim = calculateSimilarity(oldR.content, newR.content);
                    const changed = oldR.content !== newR.content || oldR.order !== newR.order;
                    
                    if (changed) {
                        const parentPath = getPath(oldR.constitutionContentId, oldVer.constitutionContent);
                        const fullPath = parentPath ? `${parentPath} > Rule #${oldR.order}` : `Rule #${oldR.order}`;

                        if (sim >= THRESHOLD) {
                            ruleAmendments.push({
                                actionType: 'Edit',
                                reason: 'Rule modified',
                                baseRule: oldR,
                                revisedRule: newR,
                                path: fullPath
                            });
                        } else {
                            ruleAmendments.push({
                                actionType: 'Remove',
                                reason: 'Rule replaced',
                                baseRule: oldR,
                                revisedRule: undefined,
                                path: fullPath
                            });
                            
                            // For the 'added' replacement, use the NEW rule context
                            const newParentPath = getPath(newR.constitutionContentId, newVer.constitutionContent);
                            const newFullPath = newParentPath ? `${newParentPath} > Rule #${newR.order}` : `Rule #${newR.order}`;

                            ruleAmendments.push({
                                actionType: 'Add',
                                reason: 'Rule replaced',
                                baseRule: undefined,
                                revisedRule: newR,
                                path: newFullPath
                            });
                        }
                    }
                } else {
                    const parentPath = getPath(oldR.constitutionContentId, oldVer.constitutionContent);
                    const fullPath = parentPath ? `${parentPath} > Rule #${oldR.order}` : `Rule #${oldR.order}`;

                    ruleAmendments.push({
                        actionType: 'Remove',
                        reason: 'Rule removed',
                        baseRule: oldR,
                        revisedRule: undefined,
                        path: fullPath
                    });
                }
            });
            
            // New Rules
            newRMap.forEach((newR, rid) => {
                if (!oldRMap.has(rid)) {
                     // Look up path in NEW version
                     const parentPath = getPath(newR.constitutionContentId, newVer.constitutionContent);
                     const fullPath = parentPath ? `${parentPath} > Rule #${newR.order}` : `Rule #${newR.order}`;

                     ruleAmendments.push({
                        actionType: 'Add',
                        reason: 'Rule added',
                        baseRule: undefined,
                        revisedRule: newR,
                        path: fullPath
                     });
                }
            });
        });

        logs.push({
            originalConstitutionId: oldVer.id,
            revisedConstitutionId: newVer.id,
            contentAmendments,
            ruleAmendments
        });
    }
    
    return logs;
};

export const changelogData: ChangelogEntry[] = generateChangelogs();