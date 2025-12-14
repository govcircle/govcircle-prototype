
import React, { useState, useEffect } from 'react';
import { OpinionEvent } from '../../types';
import { EventCard } from './EventCard';
import { ChevronLeft, ChevronRight, CalendarOff, Trash2 } from 'lucide-react';
import { Button } from '../Button/Button';

interface EventCarouselProps {
  events: OpinionEvent[];
  onDelete?: (id: string) => void;
  onCancel?: (id: string) => void;
  hideAttendanceButton?: boolean;
}

export const EventCarousel: React.FC<EventCarouselProps> = ({ events, onDelete, onCancel, hideAttendanceButton }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index if it goes out of bounds
  useEffect(() => {
    if (currentIndex >= events.length && events.length > 0) {
      setCurrentIndex(events.length - 1);
    }
  }, [events.length, currentIndex]);

  if (!events || events.length === 0) {
    return (
        <div className="w-full h-full min-h-[300px] bg-surface-primary/30 border border-border border-dashed rounded-xl flex flex-col items-center justify-center gap-3 text-textSecondary">
            <CalendarOff size={48} className="opacity-50" />
            <span className="text-sm font-medium">No events scheduled</span>
        </div>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const currentEvent = events[currentIndex];

  return (
    <div className="w-full h-full flex flex-col relative group min-h-[300px]">
      {/* Slider Viewport */}
      <div className="w-full h-full overflow-hidden rounded-xl relative flex-1">
         <div className="w-full h-full">
            {currentEvent && (
                <EventCard 
                    event={currentEvent} 
                    onCancel={onCancel}
                    hideAttendanceButton={hideAttendanceButton}
                />
            )}
         </div>

         {/* Delete Overlay */}
         {onDelete && currentEvent && (
             <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                    variant="secondary"
                    className="h-8 w-8 p-0 rounded-full bg-black/60 hover:bg-rose-500 border-none text-white shadow-md"
                    onClick={() => onDelete(currentEvent.id)}
                >
                    <Trash2 size={14} />
                </Button>
             </div>
         )}
      </div>

      {/* Navigation Controls */}
      {events.length > 1 && (
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
           <Button 
                variant="secondary" 
                className="w-8 h-8 rounded-full p-0 flex items-center justify-center shadow-lg pointer-events-auto bg-surface-primary/90 backdrop-blur text-textPrimary hover:bg-surface-secondary"
                onClick={handlePrev}
            >
                <ChevronLeft size={16} />
           </Button>
           <Button 
                variant="secondary" 
                className="w-8 h-8 rounded-full p-0 flex items-center justify-center shadow-lg pointer-events-auto bg-surface-primary/90 backdrop-blur text-textPrimary hover:bg-surface-secondary"
                onClick={handleNext}
            >
                <ChevronRight size={16} />
           </Button>
        </div>
      )}

      {/* Dots Indicator */}
      {events.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
            {events.map((_, idx) => (
                <div 
                    key={idx}
                    className={`
                        w-1.5 h-1.5 rounded-full transition-all duration-300
                        ${idx === currentIndex ? 'bg-primary w-3' : 'bg-textSecondary/30'}
                    `}
                />
            ))}
        </div>
      )}
    </div>
  );
};
