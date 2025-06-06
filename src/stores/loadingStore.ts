"use client"
import { create } from 'zustand';

interface LoadingState {
  count: number;
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  count: 0,
  isLoading: false,
  startLoading: () => {
    const newCount = get().count + 1;
    set({ count: newCount, isLoading: true });
  },
  stopLoading: () => {
    const newCount = Math.max(get().count - 1, 0);
    set({ count: newCount, isLoading: newCount > 0 });
  },
}));
