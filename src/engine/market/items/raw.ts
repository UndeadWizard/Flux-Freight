import { type MarketItemDefinition } from '../../types';

export const RAW_MARKET_FOLDER = {
  id: 'raw',
  labelKey: 'market.folder.raw',
  itemIds: ['dragon_scale', 'wyrm_hide', 'ironwood_resin']
} as const;

export const RAW_MARKET_ITEMS: MarketItemDefinition[] = [
  {
    id: 'dragon_scale',
    folder: 'raw',
    name: 'Dragon Scale',
    nameKey: 'market.item.dragon_scale.name',
    descriptionKey: 'market.item.dragon_scale.description',
    folderKey: RAW_MARKET_FOLDER.labelKey,
    category: 'Raw',
    basePrice: 150,
    volatility: 0.12,
    manaLeakRate: 0,
    productionModifiers: { Orc: 1.4, Dwarf: 1.0, Human: 0.9, Elf: 0.6 }
  },
  {
    id: 'wyrm_hide',
    folder: 'raw',
    name: 'Wyrm Hide',
    nameKey: 'market.item.wyrm_hide.name',
    descriptionKey: 'market.item.wyrm_hide.description',
    folderKey: RAW_MARKET_FOLDER.labelKey,
    category: 'Raw',
    basePrice: 95,
    volatility: 0.09,
    manaLeakRate: 0,
    productionModifiers: { Orc: 1.2, Dwarf: 0.9, Human: 1.0, Elf: 0.8 }
  },
  {
    id: 'ironwood_resin',
    folder: 'raw',
    name: 'Ironwood Resin',
    nameKey: 'market.item.ironwood_resin.name',
    descriptionKey: 'market.item.ironwood_resin.description',
    folderKey: RAW_MARKET_FOLDER.labelKey,
    category: 'Raw',
    basePrice: 60,
    volatility: 0.07,
    manaLeakRate: 0,
    productionModifiers: { Orc: 0.9, Dwarf: 1.1, Human: 1.2, Elf: 1.3 }
  }
];
