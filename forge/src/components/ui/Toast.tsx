import { create } from 'zustand';
import { useEffect } from 'react';

type ToastType = 'default' | 'success' | 'error';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>()((set) => ({
  toasts: [],
  addToast: (message, type = 'default') => {
    const id = crypto.randomUUID();
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }));
    }, 3500);
  },
  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}));

const typeStyles: Record<ToastType, string> = {
  default: 'bg-surface3 border-border',
  success: 'bg-surface3 border-success',
  error: 'bg-surface3 border-danger',
};

function ToastItem({ toast }: { toast: ToastItem }) {
  const remove = useToastStore(s => s.removeToast);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      className={`border rounded-lg px-4 py-3 text-sm text-[rgb(var(--color-text))] shadow-lg transition-all duration-300 ${typeStyles[toast.type]} ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      onClick={() => remove(toast.id)}
    >
      {toast.message}
    </div>
  );
}

import { useState } from 'react';

export default function ToastContainer() {
  const toasts = useToastStore(s => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
}
