import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'neutral' | 'indigo' | 'success' | 'warning' | 'error';
  dot?: boolean;
}

export function Badge({
  className,
  variant = 'neutral',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    neutral:
      'bg-[var(--bg-overlay)] text-[var(--text-2)] border-[var(--border-base)]',
    indigo:
      'bg-[var(--indigo-glow)] text-[var(--indigo)] border-indigo-500/30',
    success:
      'bg-emerald-500/10 text-[var(--success)] border-emerald-500/20',
    warning:
      'bg-amber-500/10 text-[var(--warning)] border-amber-500/20',
    error:
      'bg-red-500/10 text-[var(--error)] border-red-500/20',
  };

  const dotColors = {
    neutral: 'bg-[var(--text-3)]',
    indigo: 'bg-[var(--indigo)]',
    success: 'bg-[var(--success)]',
    warning: 'bg-[var(--warning)]',
    error: 'bg-[var(--error)]',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-2 h-2 rounded-full shrink-0 animate-pulse', dotColors[variant])}
        />
      )}
      <span>{children}</span>
    </div>
  );
}
