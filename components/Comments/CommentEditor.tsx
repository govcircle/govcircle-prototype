
import React, { useState, useRef, useEffect } from 'react';
import { Send, Hash, User, FileText } from 'lucide-react';
import { versionHistoryData } from '../../data/versionHistory';
import { opinionData } from '../../data/opinions';

interface CommentEditorProps {
    onSubmit: (text: string) => void;
    onCancel?: () => void;
    amendmentCount: number;
    placeholder?: string;
}

type SuggestionType = 'User' | 'Version' | 'Amendment' | null;

interface SuggestionItem {
    id: string;
    label: string;
    subLabel?: string;
    value: string; // Text to insert
}

export const CommentEditor: React.FC<CommentEditorProps> = ({ onSubmit, onCancel, amendmentCount, placeholder = "Write a comment..." }) => {
    const [text, setText] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestionType, setSuggestionType] = useState<SuggestionType>(null);
    const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // --- DATA SOURCES ---
    const users = React.useMemo(() => {
        const uniqueUsers = new Map();
        opinionData.forEach(op => {
             // Add Owner
             uniqueUsers.set(op.owner.username, op.owner);
             // Add Commenters (mock)
             if(op.comments) {
                 op.comments.forEach(c => uniqueUsers.set(c.owner.username, c.owner));
             }
        });
        return Array.from(uniqueUsers.values());
    }, []);

    const versions = versionHistoryData;

    // --- LOGIC ---

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newVal = e.target.value;
        setText(newVal);

        const cursorPosition = e.target.selectionStart;
        const textBeforeCursor = newVal.substring(0, cursorPosition);
        
        // Match regex at the end of the string
        // Matches: (space or start) + (\u or \c or \a) + (optional space) + (query chars)
        const match = textBeforeCursor.match(/(?:^|\s)(\\[uca])(?:\s+)?([^\s]*)$/);

        if (match) {
            const trigger = match[1]; // \u, \c, \a
            const query = match[2].toLowerCase(); // e.g. "o"
            
            if (trigger === '\\u') {
                setSuggestionType('User');
                const matches = users
                    .filter(u => u.username.toLowerCase().startsWith(query))
                    .slice(0, 3)
                    .map(u => ({
                        id: u.username,
                        label: u.username,
                        subLabel: u.handle,
                        value: `\\u ${u.username}`
                    }));
                setSuggestions(matches);
                setShowSuggestions(matches.length > 0);
            } else if (trigger === '\\c') {
                setSuggestionType('Version');
                const matches = versions
                    .filter(v => v.meta.version.toString().includes(query))
                    .slice(0, 3)
                    .map(v => ({
                        id: v.id,
                        label: `v${v.meta.version}`,
                        subLabel: v.meta.title,
                        value: `\\c ${v.meta.version}`
                    }));
                 setSuggestions(matches);
                 setShowSuggestions(matches.length > 0);
            } else if (trigger === '\\a') {
                setSuggestionType('Amendment');
                // Query might be a number
                let matches: SuggestionItem[] = [];
                if (!query) {
                    matches = Array.from({length: Math.min(3, amendmentCount)}, (_, i) => ({
                        id: (i+1).toString(),
                        label: `Amendment #${i+1}`,
                        value: `\\a ${i+1}`
                    }));
                } else {
                     const num = parseInt(query);
                     if (!isNaN(num) && num <= amendmentCount) {
                         matches = [{
                             id: num.toString(),
                             label: `Amendment #${num}`,
                             value: `\\a ${num}`
                         }];
                     }
                }
                setSuggestions(matches);
                setShowSuggestions(matches.length > 0);
            }
        } else {
            setShowSuggestions(false);
        }
    };

    const applySuggestion = (item: SuggestionItem) => {
        const cursorPosition = textareaRef.current?.selectionStart || 0;
        const textBeforeCursor = text.substring(0, cursorPosition);
        const textAfterCursor = text.substring(cursorPosition);
        
        // Re-run regex to find the range to replace
        const match = textBeforeCursor.match(/(?:^|\s)(\\[uca])(?:\s+)?([^\s]*)$/);
        
        if (match) {
             const fullMatch = match[0]; // e.g. " \u o" or "\u o"
             const matchIndex = match.index!; 
             // Note: match[0] includes the leading space if matched (?:^|\s).
             // We want to keep the leading space if it was there as a separator.
             
             let replaceStart = matchIndex;
             
             // If matches a space at start, preserve it
             if (fullMatch.match(/^\s/)) {
                 replaceStart += 1;
             }
             
             // The part to replace is from replaceStart to cursorPosition
             const newTextBefore = text.substring(0, replaceStart) + item.value + ' ';
             
             const newText = newTextBefore + textAfterCursor;
             setText(newText);
             setShowSuggestions(false);
             
             setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    textareaRef.current.setSelectionRange(newTextBefore.length, newTextBefore.length);
                }
            }, 10);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (showSuggestions) {
            if (e.key === 'Tab' || e.key === 'Enter') {
                e.preventDefault();
                if (suggestions.length > 0) applySuggestion(suggestions[0]);
            }
            if (e.key === 'Escape') {
                setShowSuggestions(false);
            }
        }
    };

    return (
        <div className="w-full relative">
            <div className="relative bg-surface-secondary border border-border rounded-xl overflow-hidden focus-within:border-primary/50 transition-colors">
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full h-24 p-4 bg-transparent text-sm text-textPrimary placeholder-textSecondary resize-none focus:outline-none"
                />
                
                {/* Formatting / Helper Bar */}
                <div className="bg-surface-primary/50 border-t border-white/5 p-2 flex items-center justify-end">
                    <div className="flex items-center gap-2">
                        {onCancel && (
                             <button 
                                onClick={onCancel}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-textSecondary hover:text-textPrimary hover:bg-white/10 transition-colors"
                             >
                                Cancel
                             </button>
                        )}
                        <button 
                            onClick={() => {
                                if(text.trim()) {
                                    onSubmit(text);
                                    setText('');
                                }
                            }}
                            disabled={!text.trim()}
                            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
                        >
                            <Send size={12} className="transition-transform duration-300 group-hover:scale-105" />
                            Comment
                        </button>
                    </div>
                </div>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-surface-primary border border-border rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 bg-surface-secondary border-b border-border text-[10px] uppercase font-bold text-textSecondary">
                        Suggested {suggestionType}s
                    </div>
                    {suggestions.map((item, idx) => (
                        <button
                            key={item.id}
                            onClick={() => applySuggestion(item)}
                            className="w-full text-left px-3 py-2 hover:bg-white/10 flex items-center gap-3 transition-colors group"
                        >
                            <div className="w-6 h-6 rounded bg-surface-secondary flex items-center justify-center text-textSecondary group-hover:text-textPrimary">
                                {suggestionType === 'User' && <User size={12} />}
                                {suggestionType === 'Version' && <FileText size={12} />}
                                {suggestionType === 'Amendment' && <Hash size={12} />}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-textPrimary">{item.label}</span>
                                {item.subLabel && <span className="text-[10px] text-textSecondary truncate max-w-[150px]">{item.subLabel}</span>}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
