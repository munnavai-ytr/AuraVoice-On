'use client';

import * as React from 'react';
import { Check, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const showToast = React.useCallback((message: string, type: ToastType = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2.5 max-w-[340px] w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const [progress, setProgress] = React.useState(100);

  React.useEffect(() => {
    const duration = 4000;
    const intervalTime = 40;
    const step = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(interval);
          onDismiss();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onDismiss]);

  const borderLeftMap: Record<ToastType, string> = {
    success: 'border-l-[3px] border-l-[#10B981]',
    error: 'border-l-[3px] border-l-[#EF4444]',
    info: 'border-l-[3px] border-l-[#6366F1]',
    warning: 'border-l-[3px] border-l-[#F59E0B]',
  };

  const progressColorMap: Record<ToastType, string> = {
    success: 'bg-[#10B981]',
    error: 'bg-[#EF4444]',
    info: 'bg-[#6366F1]',
    warning: 'bg-[#F59E0B]',
  };

  const IconComponent = {
    success: <Check className="w-4 h-4 text-[#10B981] shrink-0 stroke-[2.5]" />,
    error: <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />,
    info: <Info className="w-4 h-4 text-[#6366F1] shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />,
  }[toast.type];

  return (
    <div
      className={cn(
        'pointer-events-auto relative overflow-hidden rounded-[12px] bg-[#0D1117] border border-[#1E293B] shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-[14px_16px] flex items-center justify-between gap-3 text-sm text-[#F0F4FF] animate-in slide-in-from-bottom-4 fade-in duration-200 select-none',
        borderLeftMap[toast.type]
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {IconComponent}
        <span className="leading-snug text-[13px] font-medium break-words">{toast.message}</span>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="p-1 rounded-md text-[#8899B4] hover:text-[#F0F4FF] hover:bg-[#1A2235] transition-colors cursor-pointer shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Auto-dismiss progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1A2235]">
        <div
          className={cn('h-full transition-all duration-75 ease-linear', progressColorMap[toast.type])}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
