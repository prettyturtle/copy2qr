import { useCallback } from "react";
import type { HistoryEntry, HistoryType } from "../types";

const STORAGE_KEY = "copy2qr:history";
const MAX_ENTRIES = 50;

const readEntries = (): HistoryEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
};

const writeEntries = (entries: HistoryEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage 쓰기 실패 (5MB 한도 초과 등) — 무시
  }
};

export interface UseHistoryReturn {
  addEntry: (entry: Omit<HistoryEntry, "id" | "createdAt">) => void;
  getEntries: (filter?: HistoryType) => HistoryEntry[];
  removeEntry: (id: string) => void;
  clearAll: () => void;
}

export const useHistory = (): UseHistoryReturn => {
  const addEntry = useCallback(
    (entry: Omit<HistoryEntry, "id" | "createdAt">) => {
      const entries = readEntries();

      // 중복 방지: shareUrl이 같은 항목이 이미 있으면 추가하지 않음
      if (entry.shareUrl && entries.some((e) => e.shareUrl === entry.shareUrl)) {
        return;
      }

      const newEntry: HistoryEntry = {
        ...entry,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };

      const updated = [newEntry, ...entries].slice(0, MAX_ENTRIES);
      writeEntries(updated);
    },
    [],
  );

  const getEntries = useCallback((filter?: HistoryType): HistoryEntry[] => {
    const entries = readEntries();
    if (!filter) return entries;
    return entries.filter((e) => e.historyType === filter);
  }, []);

  const removeEntry = useCallback((id: string): void => {
    const entries = readEntries();
    writeEntries(entries.filter((e) => e.id !== id));
  }, []);

  const clearAll = useCallback((): void => {
    writeEntries([]);
  }, []);

  return { addEntry, getEntries, removeEntry, clearAll };
};
