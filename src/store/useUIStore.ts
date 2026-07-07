// src/store/useUiStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WindowModule {
  i: string;
  title: string;
  x: number; 
  y: number; 
  w: number; 
  h: number;
}

interface UiState {
  openWindows: WindowModule[];
  commandHistory: string[];
  executeCommand: (cmdString: string) => void;
  closeWindow: (id: string) => void;
  updateLayout: (newLayout: any[]) => void;
}

const MODULE_TEMPLATES: Record<string, Omit<WindowModule, 'x' | 'y'>> = {
  ledger: { i: 'ledger', title: 'REGIONAL COMMODITY LEDGER', w: 8, h: 5 },
  logs: { i: 'logs', title: 'GUILD TICKER FEED', w: 4, h: 4 },
  caravan: { i: 'caravan', title: 'CARAVAN FLEET MANAGEMENT', w: 4, h: 3 },
  vault: { i: 'vault', title: 'GUILD BANK VAULT', w: 6, h: 4 },
};

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      openWindows: [
        { i: 'ledger', title: 'REGIONAL COMMODITY LEDGER', x: 0, y: 0, w: 8, h: 5 },
        { i: 'logs', title: 'GUILD TICKER FEED', x: 8, y: 0, w: 4, h: 4 }
      ],
      commandHistory: ['APEX v1.26 Initialized. Type CMD <name> to spawn windows (ledger, logs, caravan, vault).'],

      updateLayout: (newLayout) => set((state) => {
        const nextWindows = newLayout.map((gridItem) => {
          const matchingOldWin = state.openWindows.find(w => w.i === gridItem.i);
          return {
            i: gridItem.i,
            title: matchingOldWin ? matchingOldWin.title : 'OPERATIONS PORTAL',
            x: gridItem.x,
            y: gridItem.y,
            w: gridItem.w,
            h: gridItem.h
          };
        });
        return { openWindows: nextWindows };
      }),

      executeCommand: (cmdString) => set((state) => {
        const cleanCmd = cmdString.trim().toLowerCase();
        const parts = cleanCmd.split(' ');
        
        if (parts[0] === 'cmd' && parts[1]) {
          const target = parts[1];
          
          if (MODULE_TEMPLATES[target]) {
            if (state.openWindows.some(w => w.i === target)) {
              return { 
                commandHistory: [`Window [${target.toUpperCase()}] is already open.`, ...state.commandHistory] 
              };
            }
            
            const newWin = {
              ...MODULE_TEMPLATES[target],
              x: (state.openWindows.length * 2) % 12,
              y: Infinity
            } as WindowModule;

            return {
              openWindows: [...state.openWindows, newWin],
              commandHistory: [`Executing: Open window [${target.toUpperCase()}]`, ...state.commandHistory]
            };
          }
        }
        
        return { 
          commandHistory: [`Unknown command: "${cmdString}". Use "cmd ledger", "cmd logs", "cmd caravan", or "cmd vault".`, ...state.commandHistory] 
        };
      }),

      closeWindow: (id) => set((state) => ({
        openWindows: state.openWindows.filter(w => w.i !== id)
      }))
    }),
    { 
      name: 'flux-freight-ui-save' 
    }
  )
);
