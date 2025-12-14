
import React, { useState, useEffect } from 'react';
import { Plus, Upload } from 'lucide-react';
import { AmendmentModal } from '../components/Modals/AmendmentModal';
import { EventModal } from '../components/Modals/EventModal';
import { RuleAmendment, ConstitutionContentAmendment, OpinionEvent, EventStatus, OpinionStatus } from '../types';
import { Button } from '../components/Button/Button';
import { EventCarousel } from '../components/Event/EventCarousel';
import { AmendmentSection } from '../components/Amendment/AmendmentSection';
import { draftOpinion } from '../data/draftOpinion';
import { opinionData } from '../data/opinions';
import { useUser } from '../contexts/UserContext';

interface NewOpinionPageProps {
  onPublish?: () => void;
}

export const NewOpinionPage: React.FC<NewOpinionPageProps> = ({ onPublish }) => {
  const { user } = useUser();
  
  // Init state from draftOpinion (persisted object)
  const [intent, setIntent] = useState(draftOpinion.intent || '');
  const [ruleAmendments, setRuleAmendments] = useState<RuleAmendment[]>(draftOpinion.ruleAmendments || []);
  const [contentAmendments, setContentAmendments] = useState<ConstitutionContentAmendment[]>(draftOpinion.constitutionContentAmendments || []);
  const [events, setEvents] = useState<OpinionEvent[]>(draftOpinion.events || []);

  // UI State
  const [isAmendmentModalOpen, setIsAmendmentModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Update draft owner if user is logged in
  useEffect(() => {
    if (user) {
        draftOpinion.owner = user;
    }
  }, [user]);

  // Handlers
  const handleSaveAmendment = (payload: any, type: 'Rule' | 'Content') => {
      if (type === 'Rule') {
          setRuleAmendments([...ruleAmendments, payload]);
      } else {
          setContentAmendments([...contentAmendments, payload]);
      }
  };

  const handleSaveEvent = (event: OpinionEvent) => {
      setEvents([...events, event]);
  };

  const handleDeleteRuleAmendment = (index: number) => {
      setRuleAmendments(ruleAmendments.filter((_, i) => i !== index));
  };

  const handleDeleteContentAmendment = (index: number) => {
      setContentAmendments(contentAmendments.filter((_, i) => i !== index));
  };

  const handleDeleteEvent = (id: string) => {
      setEvents(events.filter(e => e.id !== id));
  };

  // Handle Cancel Event
  const handleCancelEvent = (id: string) => {
    setEvents(events.map(e => 
        e.id === id ? { ...e, status: 'Canceled' as EventStatus } : e
    ));
  };

  // Only saves to the draft object in memory/file, does not publish
  const handleSaveDraft = () => {
      draftOpinion.intent = intent;
      draftOpinion.ruleAmendments = ruleAmendments;
      draftOpinion.constitutionContentAmendments = contentAmendments;
      draftOpinion.events = events;
      draftOpinion.status = "Draft";
      if (user) draftOpinion.owner = user;

      alert("Draft saved successfully!");
  };

  // Publishes to global state, clears draft, and redirects
  const handlePublishOpinion = () => {
      if (!user) {
          alert("You must be connected to publish.");
          return;
      }

      // Construct the final opinion object from current state
      const newOpinion = {
          ...draftOpinion,
          intent, 
          ruleAmendments,
          constitutionContentAmendments: contentAmendments,
          events,
          owner: user, // Ensure current user is owner
          // Assign dynamic/final fields
          id: `op-${Date.now()}`,
          createdDate: new Date().toLocaleDateString(),
          createdTimestamp: Date.now(),
          updatedDate: new Date().toLocaleDateString(),
          updatedTimestamp: Date.now(),
          status: 'Live' as OpinionStatus
      };
      
      // Save to main data
      opinionData.unshift(newOpinion as any); 
      
      // RESET DRAFT TO EMPTY
      draftOpinion.intent = "";
      draftOpinion.ruleAmendments = [];
      draftOpinion.constitutionContentAmendments = [];
      draftOpinion.events = [];
      draftOpinion.status = "Draft";

      // Reset Local UI State
      setIntent("");
      setRuleAmendments([]);
      setContentAmendments([]);
      setEvents([]);

      if (onPublish) {
          onPublish();
      } else {
          alert("Opinion Published Successfully!");
      }
  };

  const displayOwner = user || draftOpinion.owner;

  return (
    <div className="w-full mx-auto p-5 min-h-screen flex flex-col">
      <AmendmentModal 
        isOpen={isAmendmentModalOpen} 
        onClose={() => setIsAmendmentModalOpen(false)}
        onSave={handleSaveAmendment}
      />

      <EventModal 
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-textPrimary mb-2 tracking-tight">Create New Opinion</h1>
            <p className="text-textSecondary text-sm max-w-2xl">
                Draft a new proposal. Link amendments to the current constitution to suggest changes.
            </p>
        </div>
        {displayOwner && (
            <div className="flex items-center gap-3 bg-surface-primary border border-border rounded-full px-4 py-2">
                <img src={displayOwner.avatar} className="w-8 h-8 rounded-full bg-slate-800" />
                <div className="text-sm">
                    <span className="text-textSecondary block text-[10px] uppercase font-bold">Posting as</span>
                    <span className="text-textPrimary font-bold">{displayOwner.username}</span>
                </div>
            </div>
        )}
      </div>

      {/* TOP ROW: Intent & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* LEFT COLUMN: Intent (Col Span 7) */}
        <div className="lg:col-span-7">
            <div className="bg-surface-primary rounded-xl p-6 h-full border-none">
                <h3 className="text-lg font-bold text-textPrimary mb-4">1. Define Your Intent</h3>
                <div>
                    <label className="block text-xs font-bold text-textSecondary uppercase mb-2">Opinion Intent</label>
                    <textarea 
                        value={intent}
                        onChange={(e) => setIntent(e.target.value)}
                        placeholder="Explain the philosophy and reasoning behind your proposed changes..."
                        className="w-full h-80 bg-surface-secondary border-none rounded-lg p-4 text-sm text-textPrimary focus:outline-none resize-none leading-relaxed"
                    />
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: Events (Col Span 5) */}
        <div className="lg:col-span-5">
            <div className="bg-surface-primary rounded-xl p-6 h-full flex flex-col border-none">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                    <h3 className="text-lg font-bold text-textPrimary">2. Events</h3>
                    <Button 
                        onClick={() => setIsEventModalOpen(true)} 
                        iconLeft={<Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />} 
                        className="text-xs px-3 group"
                    >
                        Add Event
                    </Button>
                </div>
                
                {/* Carousel */}
                <div className="flex-1 w-full min-h-[320px]">
                    <EventCarousel 
                        events={events} 
                        onDelete={handleDeleteEvent}
                        onCancel={handleCancelEvent}
                        hideAttendanceButton={true}
                    />
                </div>
            </div>
        </div>
      </div>

      {/* BOTTOM ROW: Amendments */}
      <div className="flex-1 mb-8">
          <AmendmentSection 
             ruleAmendments={ruleAmendments}
             contentAmendments={contentAmendments}
             readOnly={false}
             onAdd={() => setIsAmendmentModalOpen(true)}
             onDeleteRule={handleDeleteRuleAmendment}
             onDeleteContent={handleDeleteContentAmendment}
          />
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-border flex items-center justify-between">
           <div className="text-sm text-textSecondary">
               Drafting as <span className="text-textPrimary font-bold">{displayOwner?.username}</span>
           </div>
           
           <div className="flex items-center gap-3">
               <Button onClick={handleSaveDraft} variant="secondary" className="px-6 py-3 text-base border-none bg-surface-primary hover:bg-surface-secondary">
                   Save Opinion
               </Button>
               <Button 
                   onClick={handlePublishOpinion} 
                   className="px-8 py-3 text-base shadow-xl shadow-primary/20 group"
                   iconLeft={<Upload size={18} className="transition-transform duration-300 group-hover:scale-105" />}
               >
                   Publish Opinion
               </Button>
           </div>
      </div>
    </div>
  );
};
