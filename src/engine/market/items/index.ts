import {
  type MarketItemDefinition,
  type MarketItemFolderDefinition,
  type MarketItemMap,
  type MarketItemState,
  type MarketItemCatalog,
} from '../../types';
import { ARCANE_MARKET_FOLDER, ARCANE_MARKET_ITEMS } from './arcane';
import { PROCESSED_MARKET_FOLDER, PROCESSED_MARKET_ITEMS } from './processed';
import { RAW_MARKET_FOLDER, RAW_MARKET_ITEMS } from './raw';

export const MARKET_ITEM_FOLDERS: MarketItemFolderDefinition[] = [
  RAW_MARKET_FOLDER,
  PROCESSED_MARKET_FOLDER,
  ARCANE_MARKET_FOLDER,
];

export const MARKET_ITEM_DEFINITIONS: MarketItemDefinition[] = [
  ...RAW_MARKET_ITEMS,
  ...PROCESSED_MARKET_ITEMS,
  ...ARCANE_MARKET_ITEMS,
];

export function createInitialMarketItems(): MarketItemMap {
  return MARKET_ITEM_DEFINITIONS.reduce<MarketItemMap>((items, definition) => {
    items[definition.id] = createMarketItemState(definition);
    return items;
  }, {});
}

export function createMarketItemState(definition: MarketItemDefinition): MarketItemState {
  return {
    ...definition,
    currentPrice: definition.basePrice,
  };
}

export function getMarketItemDefinition(id: string): MarketItemDefinition | undefined {
  return MARKET_ITEM_DEFINITIONS.find((definition) => definition.id === id);
}

export function getMarketItemsByFolder(folderId: string): MarketItemDefinition[] {
  return MARKET_ITEM_DEFINITIONS.filter((definition) => definition.folder === folderId);
}

export const MARKET_ITEM_CATALOG: MarketItemCatalog = {
  folders: MARKET_ITEM_FOLDERS,
  definitions: MARKET_ITEM_DEFINITIONS,
  items: createInitialMarketItems(),
};
