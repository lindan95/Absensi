import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none no-print">
      {toasts.map((t) => {
        const bg =
          t.type === 'success'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : t.type === 'warning'
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : t.type === 'error'
            ? 'bg-rose-50 border-rose-300 text-rose-900'
            : 'bg-blue-50 border-blue-300 text-blue-900';

        const Icon =
          t.type === 'success'
            ? CheckCircle2
            : t.type === 'warning'
            ? AlertTriangle
            : t.type === 'error'
            ? XCircle
            : Info;

        const iconColor =
          t.type === 'success'
            ? 'text-emerald-600'
            : t.type === 'warning'
            ? 'text-amber-600'
            : t.type === 'error'
            ? 'text-rose-600'
            : 'text-blue-600';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-lg flex items-start gap-3 transition-all transform translate-y-0 ${bg}`}
          >
            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm leading-tight">{t.title}</div>
              <div className="text-xs mt-0.5 opacity-90 leading-normal">{t.message}</div>
            </div>
            <button
              onClick={() => onDismiss(t.id)}
              className="p-1 rounded-lg hover:bg-black/5 opacity-60 hover:opacity-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
