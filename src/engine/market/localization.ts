const MARKET_LOCALIZATION: Record<string, string> = {
  'market.folder.raw': 'Raw Goods',
  'market.folder.processed': 'Processed Goods',
  'market.folder.arcane': 'Arcane Goods',
  'market.category.Raw': 'Raw',
  'market.category.Processed': 'Processed',
  'market.category.Arcane': 'Arcane',
  'market.item.dragon_scale.name': 'Dragon Scale',
  'market.item.dragon_scale.description': 'A heat-resistant scale prized by smiths and alchemists.',
  'market.item.dwarven_steel.name': 'Dwarven Steel',
  'market.item.dwarven_steel.description': 'Dense alloy forged for guild contracts and wargear.',
  'market.item.unstable_ether.name': 'Unstable Ether',
  'market.item.unstable_ether.description': 'Volatile ether condensate that leaks mana under pressure.',
};

export function tMarket(key: string, fallback?: string): string {
  return MARKET_LOCALIZATION[key] ?? fallback ?? key;
}

export function formatMarketItemLabel(nameKey: string, fallbackName: string, categoryKey?: string): string {
  const name = tMarket(nameKey, fallbackName);
  const category = categoryKey ? tMarket(categoryKey) : '';
  return category ? `${name}` : name;
}