
import React, { useState, MouseEvent } from 'react';
import { ComponentConfig } from '../../types';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  className?: string;
  config?: ComponentConfig;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
  title?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  iconLeft,
  iconRight,
  disabled = false,
  title,
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);

    if (onClick) onClick(e);
  };

  const baseStyles = "relative overflow-hidden font-medium rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-opacity-90 shadow-lg shadow-primary/20",
    secondary: "bg-surface-primary text-textPrimary border border-border hover:border-primary/50",
    ghost: "bg-transparent text-textSecondary hover:text-textPrimary hover:bg-white/5",
    outline: "bg-transparent border border-border text-textPrimary hover:border-primary",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className} px-4 py-2`}
      onClick={handleClick}
      disabled={disabled}
      title={title}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white opacity-20 animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </button>
  );
};