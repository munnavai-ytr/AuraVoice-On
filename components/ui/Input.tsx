import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, rightElement, id, ...props }, ref) => {
    const fallbackId = React.useId();
    const inputId = id || fallbackId;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-[var(--text-2)] transition-colors select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              'w-full h-[42px] sm:h-[48px] px-3 sm:px-3.5 bg-[var(--bg-elevated)] border rounded-[8px] sm:rounded-[10px] text-[var(--text-1)] placeholder-[var(--text-3)] text-xs sm:text-sm transition-all duration-200 outline-none',
              error
                ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-4 focus:ring-red-500/10'
                : 'border-[var(--border-base)] focus:border-[var(--indigo)] focus:ring-4 focus:ring-[var(--indigo-glow)]',
              rightElement ? 'pr-10 sm:pr-11' : '',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-[var(--error)] mt-0.5 animate-fadeIn font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
