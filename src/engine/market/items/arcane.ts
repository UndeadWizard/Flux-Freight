import { type MarketItemDefinition } from '../../types';

export const ARCANE_MARKET_FOLDER = {
  id: 'arcane',
  labelKey: 'market.folder.arcane',
  itemIds: ['unstable_ether', 'moon_ink', 'star_shard']
} as const;

export const ARCANE_MARKET_ITEMS: MarketItemDefinition[] = [
  {
    id: 'unstable_ether',
    folder: 'arcane',
    name: 'Unstable Ether',
    nameKey: 'market.item.unstable_ether.name',
    descriptionKey: 'market.item.unstable_ether.description',
    folderKey: ARCANE_MARKET_FOLDER.labelKey,
    category: 'Arcane',
    basePrice: 500,
    volatility: 0.35,
    manaLeakRate: 0.05,
    productionModifiers: { Elf: 1.5, Human: 1.0, Dwarf: 0.4, Orc: 0.2 }
  },
  {
    id: 'moon_ink',
    folder: 'arcane',
    name: 'Moon Ink',
    nameKey: 'market.item.moon_ink.name',
    descriptionKey: 'market.item.moon_ink.description',
    folderKey: ARCANE_MARKET_FOLDER.labelKey,
    category: 'Arcane',
    basePrice: 260,
    volatility: 0.22,
    manaLeakRate: 0.03,
    productionModifiers: { Elf: 1.4, Human: 1.0, Dwarf: 0.3, Orc: 0.1 }
  },
  {
    id: 'star_shard',
    folder: 'arcane',
    name: 'Star Shard',
    nameKey: 'market.item.star_shard.name',
    descriptionKey: 'market.item.star_shard.description',
    folderKey: ARCANE_MARKET_FOLDER.labelKey,
    category: 'Arcane',
    basePrice: 430,
    volatility: 0.31,
    manaLeakRate: 0.06,
    productionModifiers: { Elf: 1.6, Human: 1.0, Dwarf: 0.5, Orc: 0.2 }
  }
];
