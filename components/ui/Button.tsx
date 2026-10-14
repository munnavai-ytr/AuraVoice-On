import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]';

    const variants = {
      primary:
        'bg-[var(--indigo)] hover:bg-[var(--indigo-dark)] text-white font-semibold shadow-sm shadow-indigo-500/20',
      secondary:
        'bg-[var(--bg-overlay)] hover:bg-[var(--border-hi)] text-[var(--text-1)] border border-[var(--border-base)]',
      outline:
        'bg-transparent hover:bg-[var(--bg-overlay)] text-[var(--text-1)] border border-[var(--border-base)] hover:border-[var(--border-hi)]',
      ghost:
        'bg-transparent hover:bg-[var(--bg-overlay)] text-[var(--text-2)] hover:text-[var(--text-1)]',
      danger:
        'bg-[var(--error)] hover:bg-red-600 text-white shadow-sm shadow-red-500/20',
    };

    const sizes = {
      sm: 'h-[32px] sm:h-[36px] min-h-[32px] sm:min-h-[36px] px-2.5 sm:px-3 text-xs rounded-[6px]',
      md: 'h-[38px] sm:h-[44px] min-h-[38px] sm:min-h-[44px] px-3.5 sm:px-4 text-xs sm:text-sm rounded-[8px] sm:rounded-[10px]',
      lg: 'h-[44px] sm:h-[48px] min-h-[44px] sm:min-h-[48px] px-4 sm:px-6 text-sm sm:text-base rounded-[8px] sm:rounded-[10px]',
      icon: 'h-[38px] w-[38px] sm:h-[44px] sm:w-[44px] min-h-[38px] min-w-[38px] sm:min-h-[44px] sm:min-w-[44px] p-0 rounded-[8px] sm:rounded-[10px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
