// src/components/VaultView.tsx
import { useMemo } from 'react';
import { useVaultStore } from '../store/useVaultStore';
import { createColumnHelper } from '@tanstack/react-table';
import TanStackGridWidget from './TanStackGridWidget';

export default function VaultView() {
  const items = useVaultStore((state) => state.items);
  const dataArray = useMemo(() => Object.values(items), [items]);

  const columnHelper = createColumnHelper<any>();
  const columns = useMemo(() => [
    columnHelper.accessor('id', {
      header: 'Asset_Code',
      cell: (info) => <span className="font-semibold text-stone-300 uppercase tracking-wide">{info.getValue().replace('_', ' ')}</span>
    }),
    columnHelper.accessor('quantity', {
      header: 'Balance',
      cell: (info) => <span className="text-amber-500 font-bold font-mono">{info.getValue()}</span>
    }),
    columnHelper.accessor('weightPerUnit', {
      header: 'Unit_Weight',
      cell: (info) => <span className="text-stone-500 font-mono">{info.getValue().toFixed(1)} kg</span>
    }),
    columnHelper.accessor((row) => row.quantity * row.weightPerUnit, {
      id: 'totalWeight',
      header: 'Total_Mass',
      cell: (info) => <span className="text-stone-400 font-bold font-mono">{info.getValue().toFixed(1)} kg</span>
    })
  ], []);

  if (dataArray.length === 0) {
    return <div className="text-center text-stone-600 py-6 italic">Vault reserves depleted. Space clear.</div>;
  }

  return <TanStackGridWidget data={dataArray} columns={columns} />;
}