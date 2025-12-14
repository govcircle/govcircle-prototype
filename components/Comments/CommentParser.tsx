
import React from 'react';

interface CommentParserProps {
  text: string;
  onNavigate?: (view: string, id: string) => void;
}

export const CommentParser: React.FC<CommentParserProps> = ({ text, onNavigate }) => {
  if (!text) return null;

  // Split text by spaces to check tokens
  const tokens = text.split(/(\s+)/);

  return (
    <span className="whitespace-pre-wrap leading-relaxed">
      {tokens.map((token, index) => {
        // Handle User Tag: \u [Username] [Optional: Index]
        // This parser is simple and looks for the pattern inline. 
        // A robust parser would need lookahead, but for this constraint we check if token STARTS with a tag.
        
        // Actually, the prompt says format is "\u username".
        // To properly render clickable links from space-separated tokens, we need to handle the specific syntax logic.
        // But since we are iterating tokens, we need to check previous tokens or just parse regex matches.

        // Regex approach is safer for capturing the full command which might span tokens (e.g. "\u User 1")
        // However, mixing Regex split with React rendering is tricky.
        
        // Let's iterate and detect.
        
        // Simple Token Check for display purposes as per "green" requirement
        
        // Check for User Tag: \u
        if (token.startsWith('\\u')) {
           return <span key={index} className="text-green-400 font-bold">{token}</span>;
        }
        
        // Check for Constitution Tag: \c
        if (token.startsWith('\\c')) {
            return (
                <span 
                    key={index} 
                    className="text-green-400 font-bold cursor-pointer hover:underline decoration-green-400 underline-offset-2"
                    onClick={() => {
                        // Extract version number
                        // Assuming format \c 2.3 or similar
                        // Just a basic routing hook for now
                        // Real implementation would look up ID from version number
                        if(onNavigate) {
                            // Mock lookup: if 2.3 -> v-1b
                             const ver = token.replace('\\c', '').trim();
                             // Hardcoded mock mapping for demo
                             const id = ver === '2.3' ? 'v-1b' : 'v-1';
                             onNavigate('version-detail', id);
                        }
                    }}
                >
                    {token}
                </span>
            );
        }

        // Check for Amendment Tag: \a
        if (token.startsWith('\\a')) {
             return (
                <span 
                    key={index} 
                    className="text-green-400 font-bold cursor-pointer hover:underline decoration-green-400 underline-offset-2"
                    onClick={() => {
                        const num = parseInt(token.replace('\\a', '').trim());
                        if (!isNaN(num)) {
                            const el = document.getElementById(`amendment-${num}`);
                            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }}
                >
                    {token}
                </span>
            );
        }

        return <span key={index}>{token}</span>;
      })}
    </span>
  );
};

// Advanced Parser for Saved Content that groups multi-word tags if needed
// For this specific requirement, assuming user types "\u Ktorz" as separate tokens or "\uKtorz"
// The prompt examples show spaces: "\u Ktorz 2".
// So we need a regex that matches the whole group.

export const RichTextRenderer: React.FC<CommentParserProps> = ({ text, onNavigate }) => {
    // Regex for the three patterns
    // \u: \\u\s+([^\s]+)(?:\s+(\d+))?
    // \c: \\c\s+([^\s]+)
    // \a: \\a\s+(\d+)
    
    const parts = text.split(/(\\u\s+[^\s]+(?:\s+\d+)?|\\c\s+[^\s]+|\\a\s+\d+)/g);

    return (
        <span className="whitespace-pre-wrap leading-relaxed text-sm text-textPrimary">
            {parts.map((part, i) => {
                if (part.startsWith('\\u')) {
                     const [_, name, num] = part.match(/\\u\s+([^\s]+)(?:\s+(\d+))?/) || [];
                     const targetId = num ? `comment-${num}` : null;
                     
                     return (
                        <span 
                            key={i} 
                            className={`text-green-400 font-medium ${targetId ? 'cursor-pointer hover:underline' : ''}`}
                            onClick={targetId ? () => {
                                const el = document.getElementById(targetId);
                                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            } : undefined}
                        >
                            {/* Display Name */}
                            {part.replace('\\u', '').trim()}
                        </span>
                     );
                }
                if (part.startsWith('\\c')) {
                    const ver = part.replace('\\c', '').trim();
                    return (
                        <span 
                            key={i} 
                            className="text-green-400 font-medium cursor-pointer hover:underline"
                            onClick={() => {
                                // Mock mapping for demo purposes
                                const id = ver.includes('2.3') ? 'v-1b' : 'v-1';
                                onNavigate?.('version-detail', id);
                            }}
                        >
                            Constitution {ver}
                        </span>
                    );
                }
                if (part.startsWith('\\a')) {
                    const num = parseInt(part.replace('\\a', '').trim());
                    return (
                        <span 
                            key={i} 
                            className="text-green-400 font-medium cursor-pointer hover:underline"
                            onClick={() => {
                                const el = document.getElementById(`amendment-${num}`);
                                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }}
                        >
                            Amendment {num}
                        </span>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
}
