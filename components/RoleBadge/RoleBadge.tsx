
import React, { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { RoleIdentity, RoleType } from '../../types';

interface RoleBadgeProps {
  role: RoleIdentity;
}

const getRoleClass = (type: RoleType) => {
  switch (type) {
    case 'SPO': return 'bg-role-spo border-role-spo';
    case 'CC': return 'bg-role-cc border-role-cc';
    case 'DRep': return 'bg-role-drep border-role-drep';
    default: return 'bg-textSecondary border-textSecondary';
  }
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const [isActive, setIsActive] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (isActive && buttonRef.current && tooltipRef.current && arrowRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        
        const margin = 10;
        const viewportWidth = window.innerWidth;
        const gap = 12; // Space between button and tooltip

        // Calculate horizontal position (Center aligned initially)
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        let left = buttonCenterX - tooltipRect.width / 2;

        // Clamp to screen edges with margin
        if (left < margin) {
            left = margin;
        } else if (left + tooltipRect.width > viewportWidth - margin) {
            left = viewportWidth - tooltipRect.width - margin;
        }

        // Calculate vertical position (above button)
        const top = buttonRect.top - tooltipRect.height - gap;

        // Apply positions
        tooltipRef.current.style.left = `${left}px`;
        tooltipRef.current.style.top = `${top}px`;
        
        // Arrow positioning
        // The arrow should point to the button center. 
        // Its position is relative to the tooltip.
        const arrowLeft = buttonCenterX - left;
        
        // Constrain arrow to keep it within the tooltip (accounting for border radius)
        const arrowMin = 12; 
        const arrowMax = tooltipRect.width - 12;
        const constrainedArrowLeft = Math.min(Math.max(arrowLeft, arrowMin), arrowMax);

        arrowRef.current.style.left = `${constrainedArrowLeft}px`;
    }
  }, [isActive]);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsActive(true);
  };

  const handleEnd = () => {
    setIsActive(false);
  };

  const badgeClass = getRoleClass(role.type);

  return (
    <>
      <button
        ref={buttonRef}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm cursor-default select-none transition-transform active:scale-95 ${badgeClass}`}
      >
        {role.type}
      </button>

      {isActive && createPortal(
        <div 
            ref={tooltipRef}
            className={`fixed rounded-lg px-3 py-2 text-white font-mono text-sm shadow-xl border font-bold whitespace-nowrap pointer-events-none z-[9999] ${badgeClass}`}
            style={{ 
                left: 0, 
                top: 0, 
            }}
        >
          {role.id}
          <div 
            ref={arrowRef}
            className={`absolute bottom-0 w-3 h-3 rotate-45 border-b border-r ${badgeClass} translate-y-1/2 -translate-x-1/2`}
            style={{ left: '50%' }}
          />
        </div>,
        document.body
      )}
    </>
  );
};
