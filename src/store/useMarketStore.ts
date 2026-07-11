// src/store/useMarketStore.ts
import { create } from 'zustand';
import { type MarketItemMap, type MarketState } from '../engine/types.ts';
import { MARKET_ITEM_CATALOG, createInitialMarketItems, getMarketItemDefinition } from '../engine/market/items';

const INITIAL_ITEMS: MarketItemMap = createInitialMarketItems();

function withClampedPrice(items: MarketItemMap, id: string, nextPrice: number): MarketItemMap {
  const item = items[id];
  if (!item) return items;

  const clampedPrice = Math.max(item.basePrice * 0.3, Math.min(item.basePrice * 3, nextPrice));

  return {
    ...items,
    [id]: {
      ...item,
      currentPrice: Math.round(clampedPrice * 100) / 100,
    },
  };
}

export const useMarketStore = create<MarketState>((set) => ({
  items: INITIAL_ITEMS,
  // Folder and definition data stay separate from runtime state so new item packs can be
  // added by appending modules under src/engine/market/items.
  // The UI can still consume only items unless it needs catalog metadata.
  // (The catalog is intentionally not stored in the mutable slice.)
  gameTick: 0,
  logs: ['Market terminal initialized. Welcome to Flux & Freight.'],
  isPaused: false,

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
    let updatedItems = { ...state.items };
    let newLog = `Tick ${nextTick}: Market supply shifts.`;

    // Simulate simple supply/demand market noise
    Object.keys(updatedItems).forEach((id) => {
      const item = updatedItems[id];
      if (!item) return;

      const randomChange = (Math.random() - 0.5) * 2 * item.volatility;
      
      // Calculate new price but clamp it so items don't become free
      let newPrice = item.currentPrice * (1 + randomChange);
      newPrice = Math.max(item.basePrice * 0.3, Math.min(item.basePrice * 3, newPrice));

      updatedItems = withClampedPrice(updatedItems, id, newPrice);
    });

    // Random Macro-Economic Fantasy Events
    const roll = Math.random();
    if (roll < 0.2) {
      const unstableEther = updatedItems.unstable_ether;
      if (unstableEther) {
        updatedItems = withClampedPrice(updatedItems, 'unstable_ether', unstableEther.currentPrice * 1.4);
      }
      newLog = `Tick ${nextTick}: ⚠️ Mana Flare detected! Arcane item prices surge.`;
    } else if (roll > 0.8) {
      const dwarvenSteel = updatedItems.dwarven_steel;
      if (dwarvenSteel) {
        updatedItems = withClampedPrice(updatedItems, 'dwarven_steel', dwarvenSteel.currentPrice * 0.85);
      }
      newLog = `Tick ${nextTick}: ⚒️ Dwarven deep mines report massive surplus. Steel prices drop.`;
    }

    return {
      gameTick: nextTick,
      items: updatedItems,
      logs: [newLog, ...state.logs.slice(0, 14)] // Keep last 15 logs
    };
  }),

  getItemDefinition: (id: string) => getMarketItemDefinition(id),
  itemCatalog: MARKET_ITEM_CATALOG,
}));
