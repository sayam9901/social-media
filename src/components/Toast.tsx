'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const config = {
    success: {
      bg: 'bg-white border-emerald-200 shadow-lg shadow-emerald-950/5',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
      accent: 'bg-emerald-600',
    },
    error: {
      bg: 'bg-white border-rose-200 shadow-lg shadow-rose-950/5',
      icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
      accent: 'bg-rose-600',
    },
    info: {
      bg: 'bg-white border-blue-200 shadow-lg shadow-blue-950/5',
      icon: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
      accent: 'bg-blue-600',
    },
  }[toast.type];

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 animate-in slide-in-from-bottom-2 ${config.bg}`}
    >
      {config.icon}
      <div className="flex-1 text-sm">
        <p className="font-semibold text-slate-900 text-xs tracking-tight">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed break-words">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
