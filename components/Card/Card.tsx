import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div
      className={`
        bg-surface-primary border border-border rounded-xl p-6
        transition-all duration-270 ease-in-out
        ${hoverEffect ? 'hover:border-b-4 hover:border-b-primary hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};