import { type MarketItemDefinition } from '../../types';

export const PROCESSED_MARKET_FOLDER = {
  id: 'processed',
  labelKey: 'market.folder.processed',
  itemIds: ['dwarven_steel', 'skyglass_ingot', 'salted_spice']
} as const;

export const PROCESSED_MARKET_ITEMS: MarketItemDefinition[] = [
  {
    id: 'dwarven_steel',
    folder: 'processed',
    name: 'Dwarven Steel',
    nameKey: 'market.item.dwarven_steel.name',
    descriptionKey: 'market.item.dwarven_steel.description',
    folderKey: PROCESSED_MARKET_FOLDER.labelKey,
    category: 'Processed',
    basePrice: 80,
    volatility: 0.05,
    manaLeakRate: 0,
    productionModifiers: { Dwarf: 1.6, Human: 1.0, Orc: 1.0, Elf: 0.5 }
  },
  {
    id: 'skyglass_ingot',
    folder: 'processed',
    name: 'Skyglass Ingot',
    nameKey: 'market.item.skyglass_ingot.name',
    descriptionKey: 'market.item.skyglass_ingot.description',
    folderKey: PROCESSED_MARKET_FOLDER.labelKey,
    category: 'Processed',
    basePrice: 180,
    volatility: 0.08,
    manaLeakRate: 0,
    productionModifiers: { Dwarf: 1.0, Human: 1.2, Orc: 0.7, Elf: 1.4 }
  },
  {
    id: 'salted_spice',
    folder: 'processed',
    name: 'Salted Spice',
    nameKey: 'market.item.salted_spice.name',
    descriptionKey: 'market.item.salted_spice.description',
    folderKey: PROCESSED_MARKET_FOLDER.labelKey,
    category: 'Processed',
    basePrice: 40,
    volatility: 0.06,
    manaLeakRate: 0,
    productionModifiers: { Dwarf: 0.8, Human: 1.4, Orc: 1.1, Elf: 1.0 }
  }
];
