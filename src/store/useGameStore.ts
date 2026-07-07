// src/store/useGameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WidgetType = 'ledger' | 'vault' | 'logs';

interface GameState {
  gameTick: number;
  isPaused: boolean;
  commandHistory: string[];
  // Central assignments grid tracking matrix dictionary
  assignments: Record<string, WidgetType | null>;
  advanceTick: () => void;
  togglePause: () => void;
  mountWidgetInFirstOpenSlot: (type: WidgetType) => void;
  unmountWidgetFromSlot: (slotId: string) => void;
  swapWidgetSlots: (sourceSlotId: string, targetSlotId: string, widgetId: WidgetType) => void;
}

const SEED_ASSIGNMENTS: Record<string, WidgetType | null> = {
  SLOT_01: 'ledger',
  SLOT_02: 'vault',
  SLOT_03: 'logs',
  SLOT_04: null,
  SLOT_05: null,
  SLOT_06: null
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      gameTick: 0,
      isPaused: false,
      assignments: SEED_ASSIGNMENTS,
      commandHistory: ['APEX v1.35 Symmetrical Insertion Engine Online.'],

      togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

      advanceTick: () => set((state) => {
        if (state.isPaused) return {};
        return { gameTick: state.gameTick + 1 };
      }),

      mountWidgetInFirstOpenSlot: (type) => set((state) => {
        // Prevent opening duplicates anywhere across active cells
        const isAlreadyMounted = Object.values(state.assignments).includes(type);
        if (isAlreadyMounted) return {};

        // Track down the absolute first slot identifier that contains null
        const firstEmptySlotKey = Object.keys(state.assignments).find(
          (key) => state.assignments[key] === null
        );

        if (firstEmptySlotKey) {
          return {
            assignments: { ...state.assignments, [firstEmptySlotKey]: type },
            commandHistory: [`[SYS_LOG] Mounted module channel [${type.toUpperCase()}] inside [${firstEmptySlotKey}]`, ...state.commandHistory]
          };
        }

        return { commandHistory: ['[SYS_ERR] Matrix layout capacity saturated. Clear a square first.', ...state.commandHistory] };
      }),

      unmountWidgetFromSlot: (slotId) => set((state) => ({
        assignments: { ...state.assignments, [slotId]: null },
        commandHistory: [`[SYS_LOG] Detached window from channel node: ${slotId}`, ...state.commandHistory]
      })),

      swapWidgetSlots: (sourceSlotId, targetSlotId, widgetId) => set((state) => {
        const nextAssignments = { ...state.assignments };
        const displacedWidget = nextAssignments[targetSlotId];

        nextAssignments[sourceSlotId] = displacedWidget; // Drops displaced item or null back into origin
        nextAssignments[targetSlotId] = widgetId;        // Anchors source item onto new destination target
        
        return { assignments: nextAssignments };
      })
    }),
    { name: 'flux-freight-dnd-v2-save' }
  )
);
