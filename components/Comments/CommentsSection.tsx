
import React from 'react';
import { Comment, RoleIdentity } from '../../types';
import { CommentEditor } from './CommentEditor';
import { CommentItem } from './CommentItem';
import { MessageSquare, Lock } from 'lucide-react';

interface UserIdentity {
    username: string;
    handle: string;
    avatar: string;
    roles: RoleIdentity[];
}

interface CommentsSectionProps {
    comments: Comment[];
    amendmentCount: number;
    currentUser: UserIdentity | null;
    onAddComment: (comment: Comment) => void;
    onNavigate: (view: string, id: string) => void;
    onInteraction: (id: number, action: 'like' | 'dislike' | 'favorite') => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ 
    comments, 
    amendmentCount, 
    currentUser, 
    onAddComment,
    onNavigate,
    onInteraction
}) => {
    // We only render top-level comments here (where replyTo is null)
    // The CommentItem component handles recursion
    const rootComments = comments.filter(c => c.replyTo === null);

    const handleNewComment = (text: string, replyToId: number | null) => {
        if (!currentUser) return;
        
        const newComment: Comment = {
            id: Math.floor(Math.random() * 100000) + 100, // Mock ID
            owner: currentUser,
            text: text,
            likes: [],
            dislikes: [],
            favorites: [],
            replyTo: replyToId
        };
        onAddComment(newComment);
    };

    return (
        <div className="w-full bg-surface-primary rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xl font-bold text-textPrimary flex items-center gap-2">
                    <MessageSquare size={20} className="text-primary"/>
                    Comments ({comments.length})
                 </h3>
            </div>

            {/* Main Editor or Login Prompt */}
            <div className="mb-10">
                {currentUser ? (
                    <CommentEditor 
                        amendmentCount={amendmentCount}
                        onSubmit={(text) => handleNewComment(text, null)}
                    />
                ) : (
                    <div className="w-full p-6 bg-surface-secondary/50 border border-border border-dashed rounded-xl flex flex-col items-center justify-center text-center gap-2 text-textSecondary">
                        <Lock size={24} className="opacity-50" />
                        <p className="text-sm font-medium">Please connect your wallet to participate in the discussion.</p>
                    </div>
                )}
            </div>

            {/* Comments Tree */}
            <div className="space-y-8">
                {rootComments.length === 0 ? (
                    <div className="text-center text-textSecondary py-8 italic">
                        No comments yet. Be the first to start the discussion!
                    </div>
                ) : (
                    rootComments.map(comment => (
                        <CommentItem 
                            key={comment.id}
                            comment={comment}
                            allComments={comments}
                            depth={0}
                            amendmentCount={amendmentCount}
                            currentUser={currentUser}
                            onReply={(text, parentId) => handleNewComment(text, parentId)}
                            onNavigate={onNavigate}
                            onInteraction={onInteraction}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
