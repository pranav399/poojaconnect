import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastCtx {
  toast: (t: Omit<Toast, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

const Ctx = createContext<ToastCtx | undefined>(undefined);

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles: Record<ToastType, string> = {
  success: 'border-emerald-200 bg-white text-emerald-700 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-emerald-400',
  error: 'border-rose-200 bg-white text-rose-700 dark:border-rose-900/60 dark:bg-slate-900 dark:text-rose-400',
  info: 'border-saffron-200 bg-white text-saffron-700 dark:border-saffron-900/60 dark:bg-slate-900 dark:text-saffron-300',
  warning: 'border-amber-200 bg-white text-amber-700 dark:border-amber-900/60 dark:bg-slate-900 dark:text-amber-400',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { ...t, id }]);
      setTimeout(() => remove(id), 4200);
    },
    [remove]
  );

  const api: ToastCtx = {
    toast,
    success: (title, description) => toast({ type: 'success', title, description }),
    error: (title, description) => toast({ type: 'error', title, description }),
    info: (title, description) => toast({ type: 'info', title, description }),
    warning: (title, description) => toast({ type: 'warning', title, description }),
  };

  return (
    <Ctx.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-pop animate-slide-in',
                styles[t.type]
              )}
              role="status"
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => remove(t.id)}
                className="shrink-0 rounded p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
