import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaceholderCardProps {
  icon: LucideIcon;
  badge?: string;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  className?: string;
}

export function PlaceholderCard({
  icon: Icon,
  badge,
  title,
  subtitle,
  action,
  className,
}: PlaceholderCardProps) {
  return (
    <div
      className={cn(
        'w-full min-h-[320px] sm:min-h-[440px] flex flex-col items-center justify-center text-center p-5 sm:p-8 md:p-12 rounded-xl sm:rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-base)] shadow-sm relative overflow-hidden',
        className
      )}
    >
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[340px] h-[260px] sm:h-[340px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Icon */}
      <div className="relative z-10 w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-[var(--indigo-glow)] border border-indigo-500/25 flex items-center justify-center mb-4 sm:mb-6 shadow-md shadow-indigo-500/10">
        <Icon className="w-8 h-8 sm:w-12 sm:h-12 text-[var(--indigo)]" />
      </div>

      {badge && (
        <span className="relative z-10 inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[var(--bg-overlay)] border border-[var(--border-hi)] text-[var(--text-2)] mb-2.5 sm:mb-3 uppercase tracking-wider">
          {badge}
        </span>
      )}

      {/* Title */}
      <h2 className="relative z-10 text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-1)] mb-2 sm:mb-3">
        {title}
      </h2>

      {/* Subtitle */}
      <p className="relative z-10 text-xs sm:text-sm md:text-base text-[var(--text-2)] max-w-md mb-6 sm:mb-8 leading-relaxed">
        {subtitle}
      </p>

      {/* Action if provided */}
      {action && <div className="relative z-10">{action}</div>}
    </div>
  );
}
