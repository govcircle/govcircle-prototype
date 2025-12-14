
import React, { useState, useRef, useEffect } from 'react';
import { Opinion, OpinionStatus, Comment } from '../types';
import { EventCarousel } from '../components/Event/EventCarousel';
import { AmendmentSection } from '../components/Amendment/AmendmentSection';
import { RoleBadge } from '../components/RoleBadge/RoleBadge';
import { CommentsSection } from '../components/Comments/CommentsSection';
import { CircleChevronUp, MessageSquareText } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface OpinionDetailPageProps {
  opinion: Opinion;
  onNavigate?: (view: string, id: string) => void;
}

const STATUS_COLORS: Partial<Record<OpinionStatus, string>> = {
  Live: '#52EC83',
  Voting: '#F7C52E',
  Ratified: '#5CBBF1',
  Denied: '#FB3939',
  Closed: '#FA8C0E',
  // Draft is handled via classes to support theming
};

export const OpinionDetailPage: React.FC<OpinionDetailPageProps> = ({ opinion, onNavigate }) => {
  const { user, isConnected } = useUser();
  const hasEvents = opinion.events && opinion.events.length > 0;
  
  // Local state for comments to simulate updates and trigger re-renders
  const [localComments, setLocalComments] = useState<Comment[]>(opinion.comments || []);
  
  // Ref for comments section and state for FAB
  const commentsRef = useRef<HTMLDivElement>(null);
  const [isAtComments, setIsAtComments] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
        if (!commentsRef.current) return;
        const rect = commentsRef.current.getBoundingClientRect();
        // Check if user has reached the comments section
        // We use a threshold relative to window height to toggle the button state
        setIsAtComments(rect.top < window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    // Check initial position
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFloatingAction = () => {
      if (isAtComments) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
          commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
  };

  const updateAndPersistComments = (newComments: Comment[]) => {
      setLocalComments(newComments);
      // Persist to the main data object by mutation (for this client-side demo)
      // This ensures when navigating away and back, changes are kept.
      opinion.comments = newComments;
  };

  const handleAddComment = (newComment: Comment) => {
      const updated = [newComment, ...localComments];
      updateAndPersistComments(updated);
  };

  const handleInteraction = (commentId: number, action: 'like' | 'dislike' | 'favorite') => {
      if (!user) return; // Guard clause although UI should prevent this

      const userId = user.username; 

      const updatedComments = localComments.map(c => {
          if (c.id !== commentId) return c;

          const newC = { ...c };
          
          // Ensure arrays exist
          if (!newC.likes) newC.likes = [];
          if (!newC.dislikes) newC.dislikes = [];
          if (!newC.favorites) newC.favorites = [];

          if (action === 'like') {
              if (newC.likes.includes(userId)) {
                  // Remove like
                  newC.likes = newC.likes.filter(id => id !== userId);
              } else {
                  // Add like, remove dislike if present
                  newC.likes = [...newC.likes, userId];
                  newC.dislikes = newC.dislikes.filter(id => id !== userId);
              }
          } else if (action === 'dislike') {
              if (newC.dislikes.includes(userId)) {
                  // Remove dislike
                  newC.dislikes = newC.dislikes.filter(id => id !== userId);
              } else {
                  // Add dislike, remove like if present
                  newC.dislikes = [...newC.dislikes, userId];
                  newC.likes = newC.likes.filter(id => id !== userId);
              }
          } else if (action === 'favorite') {
              if (newC.favorites.includes(userId)) {
                  newC.favorites = newC.favorites.filter(id => id !== userId);
              } else {
                  newC.favorites = [...newC.favorites, userId];
              }
          }
          return newC;
      });

      updateAndPersistComments(updatedComments);
  };

  const amendmentCount = (opinion.ruleAmendments?.length || 0) + (opinion.constitutionContentAmendments?.length || 0);

  // Helper for status badge rendering
  const renderStatusBadge = (status: OpinionStatus) => {
      const color = STATUS_COLORS[status];
      
      const baseClasses = "inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider";
      
      if (color) {
          return (
            <span 
                className={baseClasses}
                style={{ 
                    color: color,
                    backgroundColor: `${color}20`,
                    border: `1px solid ${color}40`
                }}
            >
                {status}
            </span>
          );
      }
      
      // Fallback for Draft or undefined (Theme Aware)
      return (
        <span className={`${baseClasses} text-textSecondary bg-textSecondary/10 border border-textSecondary/20`}>
            {status}
        </span>
      );
  };

  return (
    <div className="w-full mx-auto p-5 space-y-8 relative">
      
      {/* HEADER CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* MAIN INFO COLUMN */}
        <div className={`flex flex-col gap-6 ${hasEvents ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
            
            <div className="bg-surface-primary rounded-xl p-6 lg:p-8 relative overflow-hidden flex flex-col h-full border-none">
                
                {/* Header: Title & Status */}
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-4 w-full">
                        <h1 className="text-2xl font-bold text-textPrimary">{opinion.owner.username}'s Opinion</h1>
                        <div className="flex-1 flex justify-end">
                            {renderStatusBadge(opinion.status)}
                        </div>
                    </div>
                </div>

                {/* Owner Section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 mb-8 pb-8 border-b border-border/10">
                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary shrink-0">
                        <img 
                            src={opinion.owner.avatar} 
                            alt={opinion.owner.username} 
                            className="w-full h-full rounded-full bg-slate-900 object-cover border-4 border-surface-primary"
                        />
                    </div>
                    
                    <div className="flex flex-col items-center sm:items-start pt-2">
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-2xl font-bold text-textPrimary">{opinion.owner.handle}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                            {opinion.owner.roles.map((role, idx) => (
                                <RoleBadge key={`${role.type}-${idx}`} role={role} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Intention Section */}
                <div className="flex-1">
                    <h2 className="text-xl font-serif font-medium text-textPrimary mb-4 tracking-wide">My Intention</h2>
                    <div className="p-6 bg-surface-secondary rounded-lg border-none">
                        <p className="text-lg text-textPrimary leading-relaxed font-light">
                            {opinion.intent}
                        </p>
                    </div>
                </div>
            </div>

        </div>

        {/* RIGHT COLUMN: Event Carousel */}
        {hasEvents && (
            <div className="lg:col-span-5 h-full min-h-[500px]">
                <div className="bg-surface-primary/50 rounded-xl p-4 h-full flex flex-col border-none">
                    <h3 className="text-sm font-bold text-textSecondary uppercase tracking-wider mb-4 px-2">Events</h3>
                    <div className="flex-1">
                        <EventCarousel events={opinion.events} />
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* AMENDMENTS CONTAINER */}
      <div>
         <AmendmentSection 
             ruleAmendments={opinion.ruleAmendments}
             contentAmendments={opinion.constitutionContentAmendments}
             readOnly={true}
         />
      </div>

      {/* COMMENTS CONTAINER */}
      <div ref={commentsRef}>
         <CommentsSection 
            comments={localComments}
            amendmentCount={amendmentCount}
            currentUser={user}
            onAddComment={handleAddComment}
            onNavigate={onNavigate || (() => {})}
            onInteraction={handleInteraction}
         />
      </div>

      {/* Floating Action Button */}
      <button
          onClick={handleFloatingAction}
          className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-2xl shadow-primary/30 flex items-center justify-center transition-all duration-270 active:scale-95 group"
          title={isAtComments ? "Back to Content" : "Go to Comments"}
      >
          <div className="relative flex items-center justify-center">
              <div 
                  className={`absolute transition-all duration-270 ease-spring ${
                      isAtComments ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
                  }`}
              >
                  <CircleChevronUp size={26} className="transition-transform duration-270 group-hover:scale-110 stroke-[2.5px]" />
              </div>
              <div 
                  className={`absolute transition-all duration-270 ease-spring ${
                      !isAtComments ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
                  }`}
              >
                  <MessageSquareText size={26} className="transition-transform duration-270 group-hover:scale-110 stroke-[2.5px]" />
              </div>
          </div>
      </button>

    </div>
  );
};
