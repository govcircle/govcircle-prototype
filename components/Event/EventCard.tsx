
import React from 'react';
import { OpinionEvent, EventStatus } from '../../types';
import { Twitter, Youtube, Facebook, Instagram, Monitor, MessageCircle, Ban, ExternalLink, CalendarX } from 'lucide-react';
import { RoleBadge } from '../RoleBadge/RoleBadge';

interface EventCardProps {
  event: OpinionEvent;
  onCancel?: (id: string) => void;
  hideAttendanceButton?: boolean;
}

const getStatusStyles = (status: EventStatus) => {
    switch (status) {
        case 'Finished': return { bg: 'bg-role-drep', border: 'border-role-drep', text: 'Finished', buttonLabel: 'Give feedback' };
        case 'Live Now': return { bg: 'bg-success', border: 'border-success', text: 'Live Now', buttonLabel: 'Attend Now' };
        case 'Waiting': return { bg: 'bg-secondary', border: 'border-secondary', text: 'Waiting', buttonLabel: 'Attend this event' };
        case 'Canceled': return { bg: 'bg-textSecondary', border: 'border-textSecondary', text: 'Canceled', buttonLabel: undefined };
        default: return { bg: 'bg-secondary', border: 'border-secondary', text: status, buttonLabel: '' };
    }
};

const getSocialIcon = (platform: string) => {
    switch (platform) {
        case 'x': return <Twitter size={14} />;
        case 'youtube': return <Youtube size={14} />;
        case 'facebook': return <Facebook size={14} />;
        case 'instagram': return <Instagram size={14} />;
        case 'discord': return <MessageCircle size={14} />;
        default: return <Monitor size={14} />;
    }
};

export const EventCard: React.FC<EventCardProps> = ({ event, onCancel, hideAttendanceButton = false }) => {
  const config = getStatusStyles(event.status);

  const getFooterContent = () => {
    if (event.status === 'Canceled') {
        return (
            <div className="text-textSecondary text-xs font-medium leading-snug flex items-center gap-2">
                <CalendarX size={14} className="text-error"/>
                <span>Event has been canceled by the host.</span>
            </div>
        );
    }

    let prefix = 'event will take place in:';
    if (event.status === 'Finished') prefix = 'event took place in:';
    if (event.status === 'Live Now') prefix = 'event is taking place in:';

    return (
        <div className="text-textSecondary text-xs font-medium flex items-center flex-wrap gap-1 leading-snug">
             <span>{prefix}</span>
             <span className="text-textPrimary capitalize font-bold cursor-pointer hover:text-primary hover:underline transition-all">
                {event.socialMedia}
             </span>
             <span className="text-textPrimary">{getSocialIcon(event.socialMedia)}</span>
             <span>at {event.startDate}</span>
             <span>for {event.duration}</span>
        </div>
    );
  };

  const showCancelButton = onCancel && event.status !== 'Canceled' && event.status !== 'Finished';
  const showAttendButton = !hideAttendanceButton && config.buttonLabel && !showCancelButton;

  const handleAttendClick = (e: React.MouseEvent) => {
    if (event.link) {
      window.open(event.link, '_blank');
    }
  };

  return (
    <div className={`w-full h-full bg-surface-primary rounded-xl overflow-hidden flex flex-col shadow-lg border-b-2 border-x-2 border-t-0 ${config.border}`}>
      {/* Header */}
      <div className={`${config.bg} py-1.5 px-4 text-center`}>
        <span className="text-white font-bold text-sm tracking-wide uppercase shadow-sm">
          {config.text}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Subject & Description */}
        <div>
          <h3 className="text-textPrimary text-lg font-bold leading-tight mb-2">
            {event.subject}
          </h3>
          <p className="text-textSecondary text-xs leading-relaxed line-clamp-3">
            {event.description}
          </p>
        </div>

        {/* Hosts List */}
        <div className="flex-1 min-h-[100px] max-h-[140px] overflow-y-auto custom-scrollbar pr-1 border-t border-b border-border py-3 space-y-3">
          {event.hosts.map((host, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <img 
                src={host.avatar} 
                alt={host.username} 
                className="w-10 h-10 rounded-full border border-border"
              />
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-textPrimary text-sm font-bold">{host.username}</span>
                    <span className="text-textSecondary text-xs font-medium capitalize rounded px-1 border-none">{host.duty}</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                    {host.roles.map((r, i) => (
                        <RoleBadge key={i} role={r} />
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {getFooterContent()}

        {/* Action Button */}
        {showCancelButton ? (
             <button 
                onClick={() => onCancel && onCancel(event.id)}
                className="w-full py-2.5 rounded-lg border border-error/30 bg-error/10 hover:bg-error/20 text-error font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
             >
                <Ban size={16} />
                Cancel Event
             </button>
        ) : showAttendButton ? (
            <button 
                onClick={handleAttendClick}
                disabled={!event.link}
                className={`
                    w-full py-2.5 rounded-lg border border-border font-semibold text-sm transition-all duration-200
                    hover:bg-surface-secondary hover:border-primary/50 flex items-center justify-center gap-2 text-textPrimary
                    ${!event.link ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                {config.buttonLabel}
                {event.link && <ExternalLink size={14} />}
            </button>
        ) : null}
      </div>
    </div>
  );
};
