"use client";

import {
  type Layout,
  noCompactor, // 1. Imported the compactor here
  useContainerWidth,
  useGridContainer,
  useGridItem,
  useGridPlaceholder,
  useGridResizeHandle,
} from "@snapgridjs/react";
import { type ReactNode } from "react";
import LedgerTable from "./LedgerTable";
import TickerLogs from "./TickerLogs";
import VaultView from "./VaultView";
import TransitMap from "./TransitMap"

// Unified grid layout configuration
export const GRID_CONFIG = { cols: 20, rowHeight: 65 };

export type TileId = "ledger" | "vault" | "logs" | "map";

type TileTheme = {
  title: string;
  accentClass: string;
  render: () => ReactNode;
};

export const TILE_DEFS: Record<TileId, TileTheme> = {
  ledger: { title: "Commodity Ledger", accentClass: "snapgrid-tile--ledger", render: () => <LedgerTable /> },
  vault: { title: "Guild Bank Vault", accentClass: "snapgrid-tile--vault", render: () => <VaultView /> },
  logs: { title: "System Ticker Logs", accentClass: "snapgrid-tile--logs", render: () => <TickerLogs /> },
  map: { title: "map", accentClass: "snapgrid-tile--logs", render: () => <TransitMap /> },
};

function isTileId(value: string): value is TileId {
  return value in TILE_DEFS;
}

interface SnapGridWorkspaceProps {
  grid: Layout;
  setGrid: (next: Layout) => void;
}

export default function SortableGridExample({ grid, setGrid }: SnapGridWorkspaceProps) {
  return (
    <Body 
      grid={grid} 
      setGrid={setGrid} 
    />
  );
}

function Body({
  grid,
  setGrid,
}: {
  grid: Layout;
  setGrid: (next: Layout) => void;
}) {
  // Uses a single baseline fallback measurement for initial layout generation
  const { width, containerRef } = useContainerWidth({ initialWidth: 1200 });
  
  const { containerProps, group } = useGridContainer({
    layout: grid,
    width,
    onLayoutChange: (nextLayout) => {
      const MAX_ALLOWED_ROWS = 8;
      
      const hasOutOfBounds = nextLayout.some(it => (it.y + it.h) > MAX_ALLOWED_ROWS);

      if (hasOutOfBounds) {
        const updatedLayout = nextLayout.map((nextItem) => {
          const currentItem = grid.find(g => g.i === nextItem.i);
          
          if (currentItem && nextItem.h > currentItem.h) {
            const spaceRemaining = MAX_ALLOWED_ROWS - nextItem.y;
            const clampedH = Math.max(currentItem.h, spaceRemaining);
            
            return { ...nextItem, h: clampedH };
          }
          return nextItem;
        });

        const hasOverlap = updatedLayout.some((itemA, indexA) => 
          updatedLayout.some((itemB, indexB) => {
            if (indexA === indexB) return false;
            const horizontalOverlap = itemA.x < itemB.x + itemB.w && itemA.x + itemA.w > itemB.x;
            const verticalOverlap = itemA.y < itemB.y + itemB.h && itemA.y + itemA.h > itemB.y;
            return horizontalOverlap && verticalOverlap;
          })
        );

        const isStillInvalid = updatedLayout.some(it => (it.y + it.h) > MAX_ALLOWED_ROWS);
        
        if (hasOverlap || isStillInvalid) {
          setGrid([...grid]); 
        } else {
          setGrid(updatedLayout);
        }
      } else {
        setGrid(nextLayout);
      }
    },
    gridConfig: {
      ...GRID_CONFIG,
      maxRows: 14,
      margin:[10, 10],
      containerPadding: [16,16], 
    },
    isResizable: true,
    dropConfig: {
      enabled: true,
      defaultItem: { w: 2, h: 2 },
      accept: (source) => source.type === "tray-card",
    },
    accept: (s) => s.type === "tray-card",
    compactor: noCompactor, // 2. Attached the compactor to the hook
  });

  const placeholder = useGridPlaceholder(group);

  return (
    <div style={{ width: "100%" }}>
      <div
        ref={containerRef}
        style={{ 
          flex: "1 1 0%", 
          position: "relative", 
        }}
        className="snapgrid-measure-shell"
      >
        <div className="snapgrid-surface snapgrid-surface--cool">
          <div 
            {...containerProps} 
            className="snapgrid-grid-layer"
            style={{ 
              ...containerProps.style,
            }}
          >
            {grid.map((it) => (
              <GridTile key={it.i} id={it.i} group={group} />
            ))}
            {placeholder ? (
              <div 
                className="snapgrid-placeholder snapgrid-placeholder--cool" 
                style={placeholder.style} 
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function GridTile({ id, group }: { id: string; group: string }) {
  const { ref, style } = useGridItem({ id, group });

  if (!isTileId(id)) {
    return (
      <div ref={ref} style={style} className="snapgrid-tile">
        {id}
      </div>
    );
  }

  const theme = TILE_DEFS[id];
  const content = theme.render();
  const { ref: resizeRef, handleProps } = useGridResizeHandle({ id, group, handle: "se" });

  return (
    <div ref={ref} style={style} className={`snapgrid-tile ${theme.accentClass}`}>
      <div className="snapgrid-tile__content">{content}</div>
      <button
        ref={resizeRef}
        type="button"
        aria-label={`Resize ${theme.title}`}
        className="tile-resize-handle tile-resize-handle-se"
        {...handleProps}
      />
    </div>
  );
}