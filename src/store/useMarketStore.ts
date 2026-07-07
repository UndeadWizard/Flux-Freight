// src/store/useMarketStore.ts
import { create } from 'zustand';
import { type MarketState, type MarketItem } from '../engine/types.ts';

const INITIAL_ITEMS: Record<string, MarketItem> = {
  dragon_scale: {
    id: 'dragon_scale',
    name: 'Dragon Scale',
    category: 'Raw',
    basePrice: 150,
    currentPrice: 150,
    volatility: 0.12,
    manaLeakRate: 0,
    productionModifiers: { Orc: 1.4, Dwarf: 1.0, Human: 0.9, Elf: 0.6 }
  },
  unstable_ether: {
    id: 'unstable_ether',
    name: 'Unstable Ether',
    category: 'Arcane',
    basePrice: 500,
    currentPrice: 500,
    volatility: 0.35, // High price swings due to magic flux
    manaLeakRate: 0.05, // Degrades by 5% per tick in storage
    productionModifiers: { Elf: 1.5, Human: 1.0, Dwarf: 0.4, Orc: 0.2 }
  },
  dwarven_steel: {
    id: 'dwarven_steel',
    name: 'Dwarven Steel',
    category: 'Processed',
    basePrice: 80,
    currentPrice: 80,
    volatility: 0.05, // Extremely stable commodity
    manaLeakRate: 0,
    productionModifiers: { Dwarf: 1.6, Human: 1.0, Orc: 1.0, Elf: 0.5 }
  }
};

export const useMarketStore = create<MarketState>((set) => ({
  items: INITIAL_ITEMS,
  gameTick: 0,
  logs: ['Market terminal initialized. Welcome to Flux & Freight.'],
  isPaused: false, // <-- Game runs by default

  togglePause: () => set((state) => {
    const nextPaused = !state.isPaused;
    const pauseLog = nextPaused 
      ? `⚙️ [SYSTEM] Time dilation matrix activated. Ticks PAUSED.` 
      : `⚙️ [SYSTEM] Time dilation matrix collapsed. Ticks RESUMED.`;
    return {
      isPaused: nextPaused,
      logs: [pauseLog, ...state.logs.slice(0, 14)]
    };
  }),
  
  advanceTick: () => set((state) => {

    if (state.isPaused) return {}; 

    const nextTick = state.gameTick + 1;
    const updatedItems = { ...state.items };
    let newLog = `Tick ${nextTick}: Market supply shifts.`;

    // Simulate simple supply/demand market noise
    Object.keys(updatedItems).forEach((id) => {
      const item = updatedItems[id];
      const randomChange = (Math.random() - 0.5) * 2 * item.volatility;
      
      // Calculate new price but clamp it so items don't become free
      let newPrice = item.currentPrice * (1 + randomChange);
      newPrice = Math.max(item.basePrice * 0.3, Math.min(item.basePrice * 3, newPrice));
      
      updatedItems[id] = {
        ...item,
        currentPrice: Math.round(newPrice * 100) / 100
      };
    });

    // Random Macro-Economic Fantasy Events
    const roll = Math.random();
    if (roll < 0.2) {
      updatedItems['unstable_ether'].currentPrice *= 1.4;
      newLog = `Tick ${nextTick}: ⚠️ Mana Flare detected! Arcane item prices surge.`;
    } else if (roll > 0.8) {
      updatedItems['dwarven_steel'].currentPrice *= 0.85;
      newLog = `Tick ${nextTick}: ⚒️ Dwarven deep mines report massive surplus. Steel prices drop.`;
    }

    return {
      gameTick: nextTick,
      items: updatedItems,
      logs: [newLog, ...state.logs.slice(0, 14)] // Keep last 15 logs
    };
  })
}));
