import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'violet' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}, ref) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90 focus:ring-primary',
    secondary: 'bg-secondary text-secondary-foreground hover:opacity-90 focus:ring-secondary',
    accent: 'bg-accent text-accent-foreground hover:opacity-90 focus:ring-accent',
    violet: 'bg-violet text-violet-foreground hover:opacity-90 focus:ring-violet',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground focus:ring-primary',
    ghost: 'text-foreground hover:bg-muted focus:ring-muted',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});
