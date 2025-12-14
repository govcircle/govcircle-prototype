
import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar, Clock, Monitor, User, Plus, Trash2, Users, Link as LinkIcon } from 'lucide-react';
import { OpinionEvent, SocialPlatform, EventStatus, EventHost, EventDuty } from '../../types';
import { opinionData } from '../../data/opinions';
import { RoleBadge } from '../RoleBadge/RoleBadge';
import { useUser } from '../../contexts/UserContext';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: OpinionEvent) => void;
  initialData?: OpinionEvent;
}

const PLATFORMS: SocialPlatform[] = ['x', 'youtube', 'discord', 'facebook', 'instagram'];
const DUTIES: EventDuty[] = ['Co-Host', 'Speaker']; // 'Host' is reserved for current user

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const { user } = useUser();

  // 1. Fetch potential hosts from existing opinions (deduplicate by username)
  const availableUsers = useMemo(() => {
    const map = new Map();
    opinionData.forEach(op => {
      // Exclude current user from suggestions if they are already the host
      if (!map.has(op.owner.username) && op.owner.username !== user?.username) { 
        map.set(op.owner.username, op.owner);
      }
    });
    return Array.from(map.values());
  }, [user]);

  const [formData, setFormData] = useState<Partial<OpinionEvent>>({
    subject: '',
    description: '',
    startDate: '',
    duration: '',
    socialMedia: 'x',
    link: '',
    status: 'Waiting',
    hosts: []
  });

  // Host Selection State
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedDuty, setSelectedDuty] = useState<EventDuty>('Speaker');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
        // Use connected user as default host
        const defaultHost: EventHost = user ? {
            username: user.username,
            avatar: user.avatar,
            roles: user.roles,
            duty: "Host"
        } : {
            // Fallback (should typically be blocked by UI if not logged in)
            username: "Guest",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
            roles: [],
            duty: "Host"
        };

        setFormData({
            subject: '',
            description: '',
            startDate: '',
            duration: '',
            socialMedia: 'x',
            link: '',
            status: 'Waiting',
            hosts: [defaultHost]
        });
    }
  }, [initialData, isOpen, user]);

  const handleAddHost = () => {
    if (!selectedUserId) return;
    
    const potentialUser = availableUsers.find(u => u.username === selectedUserId);
    if (!potentialUser) return;

    const newHost: EventHost = {
        username: potentialUser.username,
        avatar: potentialUser.avatar,
        roles: potentialUser.roles,
        duty: selectedDuty
    };

    // Prevent duplicates
    if (formData.hosts?.some(h => h.username === newHost.username)) return;

    setFormData(prev => ({
        ...prev,
        hosts: [...(prev.hosts || []), newHost]
    }));
    setSelectedUserId(''); // Reset selection
  };

  const handleRemoveHost = (username: string) => {
    setFormData(prev => ({
        ...prev,
        hosts: prev.hosts?.filter(h => h.username !== username)
    }));
  };

  const handleSubmit = () => {
    if (!formData.subject || !formData.startDate) return;

    const newEvent: OpinionEvent = {
        id: initialData?.id || `evt-${Date.now()}`,
        subject: formData.subject || 'Untitled Event',
        description: formData.description || '',
        startDate: formData.startDate || '',
        duration: formData.duration || '1h',
        socialMedia: formData.socialMedia as SocialPlatform,
        link: formData.link,
        status: (formData.status as EventStatus) || 'Waiting',
        hosts: formData.hosts || []
    };
    onSave(newEvent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-surface-primary border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-primary rounded-t-2xl z-10">
          <h2 className="text-xl font-bold text-textPrimary">
            {initialData ? 'Edit Event' : 'Add New Event'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-textSecondary hover:text-textPrimary transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            
            {/* Main Info */}
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-textSecondary uppercase mb-1">Subject</label>
                    <input 
                        type="text"
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-surface-secondary border border-border rounded-lg p-3 text-sm text-textPrimary focus:border-primary focus:outline-none"
                        placeholder="e.g. Community AMA"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-textSecondary uppercase mb-1">Description</label>
                    <textarea 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-surface-secondary border border-border rounded-lg p-3 text-sm text-textPrimary focus:border-primary focus:outline-none min-h-[80px]"
                        placeholder="What is this event about?"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-textSecondary uppercase mb-1">Start Date</label>
                        <div className="relative">
                            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary"/>
                            <input 
                                type="text"
                                value={formData.startDate}
                                onChange={e => setFormData({...formData, startDate: e.target.value})}
                                className="w-full bg-surface-secondary border border-border rounded-lg pl-9 pr-3 py-3 text-sm text-textPrimary focus:border-primary focus:outline-none"
                                placeholder="12Dec 2025 | 18:00 UTC"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-textSecondary uppercase mb-1">Duration</label>
                        <div className="relative">
                            <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary"/>
                            <input 
                                type="text"
                                value={formData.duration}
                                onChange={e => setFormData({...formData, duration: e.target.value})}
                                className="w-full bg-surface-secondary border border-border rounded-lg pl-9 pr-3 py-3 text-sm text-textPrimary focus:border-primary focus:outline-none"
                                placeholder="2h 00m"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-textSecondary uppercase mb-1">Platform</label>
                    <div className="relative">
                        <Monitor size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary"/>
                        <select
                            value={formData.socialMedia}
                            onChange={e => setFormData({...formData, socialMedia: e.target.value as SocialPlatform})}
                            className="w-full bg-surface-secondary border border-border rounded-lg pl-9 pr-3 py-3 text-sm text-textPrimary focus:border-primary focus:outline-none appearance-none"
                        >
                            {PLATFORMS.map(p => (
                                <option key={p} value={p}>{p.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Event Link Field */}
                <div>
                    <label className="block text-xs font-bold text-textSecondary uppercase mb-1">Event Link</label>
                    <div className="relative">
                        <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary"/>
                        <input 
                            type="text"
                            value={formData.link || ''}
                            onChange={e => setFormData({...formData, link: e.target.value})}
                            className="w-full bg-surface-secondary border border-border rounded-lg pl-9 pr-3 py-3 text-sm text-textPrimary focus:border-primary focus:outline-none"
                            placeholder="https://zoom.us/j/..."
                        />
                    </div>
                </div>
            </div>

            {/* Hosts & Speakers Section */}
            <div className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                    <Users size={18} className="text-primary" />
                    <h3 className="text-sm font-bold text-textPrimary uppercase tracking-wider">Hosts & Speakers</h3>
                </div>

                {/* List of Current Hosts */}
                <div className="space-y-3 mb-4">
                    {formData.hosts?.map((host, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-surface-secondary border-none rounded-lg p-2 pr-3">
                            <div className="flex items-center gap-3">
                                <img src={host.avatar} className="w-8 h-8 rounded-full border border-border" />
                                <div>
                                    <div className="text-sm font-bold text-textPrimary leading-none mb-1">{host.username}</div>
                                    <div className="flex gap-1 flex-wrap">
                                        {host.roles.map((r, i) => (
                                            <RoleBadge key={i} role={r} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${host.duty === 'Host' ? 'text-primary bg-primary/10' : 'text-textSecondary'}`}>
                                    {host.duty}
                                </span>
                                {host.duty !== 'Host' && (
                                    <button 
                                        onClick={() => handleRemoveHost(host.username)}
                                        className="text-textSecondary hover:text-rose-400 p-1"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add New Host Controls */}
                <div className="bg-surface-primary border border-border rounded-lg p-3 flex flex-col sm:flex-row gap-3 items-end">
                     <div className="flex-1 w-full">
                        <label className="block text-[10px] font-bold text-textSecondary uppercase mb-1">Add Collaborator</label>
                        <select 
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full bg-surface-secondary border border-border rounded-md px-3 py-2 text-sm text-textPrimary focus:border-primary focus:outline-none h-[38px]"
                        >
                            <option value="">Select a user...</option>
                            {availableUsers.map(user => (
                                <option 
                                    key={user.username} 
                                    value={user.username}
                                    disabled={formData.hosts?.some(h => h.username === user.username)}
                                >
                                    {user.username} ({user.roles.map((r: any) => r.type).join(', ')})
                                </option>
                            ))}
                        </select>
                     </div>
                     <div className="w-full sm:w-32">
                        <label className="block text-[10px] font-bold text-textSecondary uppercase mb-1">Duty</label>
                        <select
                            value={selectedDuty}
                            onChange={(e) => setSelectedDuty(e.target.value as EventDuty)}
                            className="w-full bg-surface-secondary border border-border rounded-md px-3 py-2 text-sm text-textPrimary focus:border-primary focus:outline-none h-[38px]"
                        >
                            {DUTIES.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                     </div>
                     <button 
                        onClick={handleAddHost}
                        disabled={!selectedUserId}
                        className="w-full sm:w-auto h-[38px] w-[38px] bg-white/5 hover:bg-white/10 border border-border hover:border-white/30 rounded-md flex items-center justify-center text-textPrimary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                     >
                        <Plus size={18} />
                     </button>
                </div>
            </div>

        </div>

        <div className="p-6 border-t border-border flex justify-end gap-3 bg-surface-primary rounded-b-2xl">
            <button onClick={onClose} className="px-6 py-2 rounded-lg text-sm font-medium text-textSecondary hover:bg-white/5 transition-colors">
                Cancel
            </button>
            <button 
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-primary hover:bg-primary/90 shadow-lg"
            >
                Save Event
            </button>
        </div>
      </div>
    </div>
  );
};
