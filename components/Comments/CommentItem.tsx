
import React, { useState } from 'react';
import { Comment, RoleIdentity } from '../../types';
import { RoleBadge } from '../RoleBadge/RoleBadge';
import { RichTextRenderer } from './CommentParser';
import { ThumbsUp, ThumbsDown, Star, MessageSquare } from 'lucide-react';
import { CommentEditor } from './CommentEditor';

interface UserIdentity {
    username: string;
    handle: string;
    avatar: string;
    roles: RoleIdentity[];
}

interface CommentItemProps {
    comment: Comment;
    allComments: Comment[]; // Needed to find replies
    depth: number;
    amendmentCount: number;
    currentUser: UserIdentity | null;
    onReply: (text: string, replyToId: number) => void;
    onNavigate: (view: string, id: string) => void;
    onInteraction: (id: number, action: 'like' | 'dislike' | 'favorite') => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ 
    comment, 
    allComments, 
    depth, 
    amendmentCount,
    currentUser,
    onReply,
    onNavigate,
    onInteraction
}) => {
    const [isReplying, setIsReplying] = useState(false);

    // Find children
    const replies = allComments.filter(c => c.replyTo === comment.id);

    // Safe checks if user is not logged in
    const isLiked = currentUser ? comment.likes.includes(currentUser.username) : false;
    const isDisliked = currentUser ? comment.dislikes.includes(currentUser.username) : false;
    const isFavorited = currentUser ? comment.favorites.includes(currentUser.username) : false;

    return (
        <div id={`comment-${comment.id}`} className="flex flex-col w-full">
            <div className={`flex gap-3 relative ${depth > 0 ? 'mt-4' : ''}`}>
                {/* Connecting Line for Replies */}
                {depth > 0 && (
                    <div className="absolute -left-4 top-0 bottom-0 w-px bg-border hidden md:block" />
                )}
                
                {/* Avatar */}
                <div className="shrink-0 relative z-10">
                    <img 
                        src={comment.owner.avatar} 
                        alt={comment.owner.username} 
                        className="w-8 h-8 rounded-full border border-border bg-surface-primary"
                    />
                </div>

                {/* Content Box */}
                <div className="flex-1 flex flex-col gap-2">
                    {/* Header */}
                    <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-sm font-bold text-textPrimary">{comment.owner.username}</span>
                        <span className="text-xs text-textSecondary">{comment.owner.handle}</span>
                        <div className="flex gap-1">
                            {comment.owner.roles.map((r, i) => (
                                <div key={i} className="scale-75 origin-left">
                                    <RoleBadge role={r} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Text Body */}
                    <div className="text-sm text-textPrimary leading-relaxed">
                        <RichTextRenderer text={comment.text} onNavigate={onNavigate} />
                    </div>

                    {/* Actions - Only interactive if logged in (except maybe showing counts) */}
                    <div className="flex items-center gap-4 mt-1">
                        <button 
                            onClick={() => currentUser && onInteraction(comment.id, 'like')}
                            className={`flex items-center gap-1.5 transition-colors text-xs group ${isLiked ? 'text-emerald-400' : 'text-textSecondary hover:text-emerald-400'} ${!currentUser ? 'cursor-default hover:text-textSecondary' : ''}`}
                        >
                            <ThumbsUp size={14} className={`group-hover:scale-110 transition-transform ${isLiked ? 'fill-current' : ''}`}/>
                            <span>{comment.likes.length}</span>
                        </button>
                        <button 
                            onClick={() => currentUser && onInteraction(comment.id, 'dislike')}
                            className={`flex items-center gap-1.5 transition-colors text-xs group ${isDisliked ? 'text-rose-400' : 'text-textSecondary hover:text-rose-400'} ${!currentUser ? 'cursor-default hover:text-textSecondary' : ''}`}
                        >
                            <ThumbsDown size={14} className={`group-hover:scale-110 transition-transform ${isDisliked ? 'fill-current' : ''}`}/>
                            <span>{comment.dislikes.length}</span>
                        </button>
                        <button 
                             onClick={() => currentUser && onInteraction(comment.id, 'favorite')}
                             className={`flex items-center gap-1.5 transition-colors text-xs group ${isFavorited ? 'text-yellow-400' : 'text-textSecondary hover:text-yellow-400'} ${!currentUser ? 'cursor-default hover:text-textSecondary' : ''}`}
                        >
                            <Star size={14} className={`group-hover:scale-110 transition-transform ${isFavorited ? 'fill-current' : ''}`}/>
                            <span>{comment.favorites.length}</span>
                        </button>
                        
                        {/* Reply Button - HIDDEN if not connected */}
                        {currentUser && (
                            <button 
                                onClick={() => setIsReplying(!isReplying)}
                                className={`flex items-center gap-1.5 transition-colors text-xs font-bold uppercase tracking-wide ${isReplying ? 'text-primary' : 'text-textSecondary hover:text-primary'}`}
                            >
                                <MessageSquare size={14} />
                                Reply
                            </button>
                        )}
                    </div>

                    {/* Reply Editor */}
                    {isReplying && currentUser && (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                             <CommentEditor 
                                amendmentCount={amendmentCount}
                                onCancel={() => setIsReplying(false)}
                                onSubmit={(text) => {
                                    onReply(text, comment.id);
                                    setIsReplying(false);
                                }}
                                placeholder={`Replying to ${comment.owner.username}...`}
                             />
                        </div>
                    )}
                </div>
            </div>

            {/* Nested Replies */}
            {replies.length > 0 && (
                <div className="pl-4 md:pl-10 border-l-2 border-border/30 ml-4 md:ml-0 mt-2 space-y-4">
                    {replies.map(reply => (
                        <CommentItem 
                            key={reply.id}
                            comment={reply}
                            allComments={allComments}
                            depth={depth + 1}
                            amendmentCount={amendmentCount}
                            currentUser={currentUser}
                            onReply={onReply}
                            onNavigate={onNavigate}
                            onInteraction={onInteraction}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
