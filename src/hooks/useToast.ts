import { useState, useCallback } from "react";

export interface Toast {
  id: string;
  message: string;
}

export interface UseToastReturn {
  toasts: Toast[];
  showToast: (message: string) => void;
  removeToast: (id: string) => void;
}

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, message }]);
      setTimeout(() => removeToast(id), 3000);
    },
    [removeToast],
  );

  return { toasts, showToast, removeToast };
};
