// src/engine/types.ts

export type RaceType = 'Dwarf' | 'Elf' | 'Human' | 'Orc';

export type MarketItemFolder = 'raw' | 'processed' | 'arcane' | (string & {});

export type MarketCategory = 'Raw' | 'Processed' | 'Arcane';

export interface MarketItemDefinition {
  id: string;
  folder: MarketItemFolder;
  name: string;
  nameKey: string;
  descriptionKey?: string;
  folderKey?: string;
  category: MarketCategory;
  basePrice: number;
  volatility: number; // Higher values = more dramatic price swings
  manaLeakRate: number; // Percentage lost per game tick if not contained
  
  // How efficient a race is at harvesting/producing this item
  productionModifiers: Record<RaceType, number>;
}

export interface MarketItemState extends MarketItemDefinition {
  currentPrice: number;
}

export type MarketItem = MarketItemState;

export type MarketItemMap = Record<string, MarketItemState>;

export interface MarketItemFolderDefinition {
  id: MarketItemFolder;
  labelKey: string;
  itemIds: readonly string[];
}

export interface MarketItemCatalog {
  folders: MarketItemFolderDefinition[];
  definitions: MarketItemDefinition[];
  items: MarketItemMap;
}

export interface MarketState {
  items: MarketItemMap;
  itemCatalog: MarketItemCatalog;
  getItemDefinition: (id: string) => MarketItemDefinition | undefined;
  gameTick: number;
  logs: string[];
  isPaused: boolean;
  togglePause: () => void;
  advanceTick: () => void;
}
