// src/store/useSettingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  matrixGridlines: boolean;
  audibleAlarms: boolean;
  radarRefreshRate: 'low' | 'high';
  lensFocalProfile: 'standard' | 'crisp';
  toggleMatrixGridlines: () => void;
  toggleAudibleAlarms: () => void;
  setRadarRefreshRate: (rate: 'low' | 'high') => void;
  setLensFocalProfile: (profile: 'standard' | 'crisp') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      matrixGridlines: true,
      audibleAlarms: true,
      radarRefreshRate: 'high',
      lensFocalProfile: 'standard',

      toggleMatrixGridlines: () => set((state) => ({ matrixGridlines: !state.matrixGridlines })),
      toggleAudibleAlarms: () => set((state) => ({ audibleAlarms: !state.audibleAlarms })),
      setRadarRefreshRate: (rate) => set({ radarRefreshRate: rate }),
      setLensFocalProfile: (profile) => set({ lensFocalProfile: profile }),
    }),
    { name: 'flux-freight-settings-save' }
  )
);
