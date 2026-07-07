// src/components/TanStackGridWidget.tsx
import React, { useState } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender, type SortingState } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

interface GridWidgetProps {
  data: any[];
  columns: any[];
}

export default function TanStackGridWidget({ data, columns }: GridWidgetProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    /* Scoped cleanly inside our new SCSS spreadsheet container template rules */
    <div className="apex-data-grid-container w-full overflow-auto max-h-full font-mono text-[11px]">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="sticky top-0 z-10">
              {headerGroup.headers.map(header => (
                <th key={header.id} className="select-none">
                  {header.isPlaceholder ? null : (
                    <div 
                      onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                      className={`flex items-center gap-1.5 ${header.column.getCanSort() ? 'cursor-pointer hover:text-amber-500' : ''}`}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && <ArrowUpDown className="h-3 w-3 opacity-50" />}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}