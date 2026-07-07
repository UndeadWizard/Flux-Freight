// src/engine/types.ts

export type RaceType = 'Dwarf' | 'Elf' | 'Human' | 'Orc';

export interface MarketItem {
  id: string;
  name: string;
  category: 'Raw' | 'Processed' | 'Arcane';
  currentPrice: number;
  basePrice: number;
  volatility: number; // Higher values = more dramatic price swings
  manaLeakRate: number; // Percentage lost per game tick if not contained
  
  // How efficient a race is at harvesting/producing this item
  productionModifiers: Record<RaceType, number>;
}

export interface MarketState {
  items: Record<string, MarketItem>;
  gameTick: number;
  logs: string[];
  isPaused: boolean;
  togglePause: () => void;
  advanceTick: () => void;
}
