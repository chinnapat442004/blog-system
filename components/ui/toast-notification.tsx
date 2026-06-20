'use client';

import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleCheckIcon, CircleAlertIcon, InfoIcon, TriangleAlertIcon, XIcon } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastNotificationProps {
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose: () => void;
}

const themeStyles = {
  success: {
    border: 'border-emerald-500/20 dark:border-emerald-500/30',
    icon: <CircleCheckIcon className="size-4 text-emerald-500" />,
    progressBar: 'bg-emerald-500',
    progressBg: 'bg-emerald-100/50 dark:bg-emerald-950/30',
    text: 'text-emerald-900 dark:text-emerald-100',
  },
  error: {
    border: 'border-destructive/20',
    icon: <CircleAlertIcon className="size-4 text-destructive" />,
    progressBar: 'bg-destructive',
    progressBg: 'bg-destructive/10 dark:bg-destructive/20',
    text: 'text-destructive/90',
  },
  warning: {
    border: 'border-amber-500/20 dark:border-amber-500/30',
    icon: <TriangleAlertIcon className="size-4 text-amber-500" />,
    progressBar: 'bg-amber-500',
    progressBg: 'bg-amber-100/50 dark:bg-amber-950/30',
    text: 'text-amber-900 dark:text-amber-100',
  },
  info: {
    border: 'border-blue-500/20 dark:border-blue-500/30',
    icon: <InfoIcon className="size-4 text-blue-500" />,
    progressBar: 'bg-blue-500',
    progressBg: 'bg-blue-100/50 dark:bg-blue-950/30',
    text: 'text-blue-900 dark:text-blue-100',
  },
};

export function ToastNotification({
  type = 'error',
  title = 'เกิดข้อผิดพลาด',
  message,
  duration = 5000,
  onClose,
}: ToastNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  const style = themeStyles[type];

  return (
    <div 
      className="fixed top-6 right-6 z-50 w-full max-w-sm animate-in fade-in slide-in-from-top-5 duration-300 group"
      style={{ '--duration': `${duration}ms` } as React.CSSProperties}
    >
      {/* Self-contained CSS injection for animation and hover pausing */}
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .toast-progress-bar {
          animation: shrink var(--duration) linear forwards;
        }
        .group:hover .toast-progress-bar {
          animation-play-state: paused;
        }
      `}</style>

      <Alert
        variant={type === 'error' ? 'destructive' : 'default'}
        className={`relative overflow-hidden shadow-lg bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md pr-10 border ${style.border}`}
      >
        <div className="flex gap-3 items-start">
          <div className="mt-0.5">{style.icon}</div>
          <div className="flex flex-col gap-0.5">
            <AlertTitle className="font-semibold text-sm">{title}</AlertTitle>
            <AlertDescription className={`text-xs font-medium ${style.text}`}>
              {message}
            </AlertDescription>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1.5 rounded-md transition-all duration-200 cursor-pointer"
          aria-label="Close notification"
        >
          <XIcon className="size-3.5" />
        </button>

        {/* Visual Timer Progress Bar */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 w-full overflow-hidden ${style.progressBg}`}>
          <div className={`h-full rounded-r-full toast-progress-bar ${style.progressBar}`} />
        </div>
      </Alert>
    </div>
  );
}

export function useToastNotification(errorMessage: string | undefined, isPending: boolean) {
  const [showError, setShowError] = useState(false);
  const [wasPending, setWasPending] = useState(false);

  if (isPending !== wasPending) {
    setWasPending(isPending);
    if (!isPending) {
      if (errorMessage) {
        setShowError(true);
      }
    } else {
      setShowError(false);
    }
  }

  return [showError, setShowError] as const;
}
