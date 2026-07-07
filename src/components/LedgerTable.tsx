// src/components/LedgerTable.tsx
import React, { useMemo } from 'react';
import { useMarketStore } from '../store/useMarketStore';
import { useUiStore } from '../store/useUIStore';
import { useVaultStore } from '../store/useVaultStore';
import { createColumnHelper } from '@tanstack/react-table';
import { ShieldAlert, TrendingUp, TrendingDown } from 'lucide-react';
import TanStackGridWidget from './TanStackGridWidget';

export default function LedgerTable() {
  const items = useMarketStore((state) => state.items);
  const executeUiLog = useUiStore((state) => state.executeCommand);
  const { buyAsset, sellAsset, items: vaultItems } = useVaultStore();

  const dataArray = useMemo(() => Object.values(items), [items]);

  const handleBuy = (item: any) => {
    const unitWeight = item.category === 'Arcane' ? 1.0 : item.category === 'Processed' ? 4.5 : 8.0;
    const res = buyAsset(item.id, item.name, item.currentPrice, unitWeight);
    if (!res.success) executeUiLog(`cmd_error: BUY_FAILED -> ${res.msg}`);
  };

  const handleSell = (item: any) => {
    const res = sellAsset(item.id, item.currentPrice);
    if (!res.success) executeUiLog(`cmd_error: SELL_FAILED -> ${res.msg}`);
  };

  // Define column shapes using the TanStack helper pipeline
  const columnHelper = createColumnHelper<any>();
  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Material_ID',
      cell: (info) => {
        const item = info.row.original;
        return (
          <div className="font-semibold flex flex-col gap-0.5">
            <span className="flex items-center gap-1.5 text-stone-200">
              {item.manaLeakRate > 0 && <ShieldAlert className="h-3 w-3 text-purple-400" />}
              {item.name.toUpperCase().replace(' ', '_')}
            </span>
            <span className="text-[9px] text-stone-500 uppercase tracking-widest">{item.category}</span>
          </div>
        );
      }
    }),
    columnHelper.accessor('currentPrice', {
      header: 'Market_Rate',
      cell: (info) => {
        const val = info.getValue() as number;
        const item = info.row.original;
        return (
          <div className="font-bold text-amber-500 font-mono flex items-center gap-1">
            {val.toFixed(2)}g
            {val >= item.basePrice ? <TrendingUp className="h-3 w-3 text-emerald-500" /> : <TrendingDown className="h-3 w-3 text-rose-500" />}
          </div>
        );
      }
    }),
    columnHelper.accessor((row) => vaultItems[row.id]?.quantity || 0, {
      id: 'vaultQty',
      header: 'In_Vault',
      cell: (info) => {
        const qty = info.getValue() as number;
        return qty > 0 ? (
          <span className="bg-stone-950 px-1.5 py-0.5 border border-stone-800 text-stone-300 rounded font-bold">
            {qty}
          </span>
        ) : (
          <span className="text-stone-600">—</span>
        );
      }
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Trade_Execution',
      cell: (info) => {
        const item = info.row.original;
        const storedQty = vaultItems[item.id]?.quantity || 0;
        return (
          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={() => handleBuy(item)}
              className="bg-emerald-950/20 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded font-bold uppercase transition-all tracking-wider cursor-pointer active:scale-95 text-[10px]"
            >
              + Buy
            </button>
            <button
              type="button"
              onClick={() => handleSell(item)}
              disabled={storedQty <= 0}
              className={`px-2 py-0.5 rounded font-bold uppercase border transition-all tracking-wider text-[10px] ${
                storedQty > 0
                  ? 'bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 border-rose-800/40 cursor-pointer active:scale-95'
                  : 'bg-stone-950 text-stone-700 border-stone-900 cursor-not-allowed opacity-30'
              }`}
            >
              - Sell
            </button>
          </div>
        );
      }
    })
  ], [vaultItems, items]);

  return <TanStackGridWidget data={dataArray} columns={columns} />;
}