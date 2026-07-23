"use client";

import {
  type Layout,
  noCompactor,
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
import TransitMap from "./TransitMap";
import { Lock, Unlock } from "lucide-react";

export const GRID_CONFIG = { cols: 20, rowHeight: 10 };

const LOCK_BLOCKING_COMPACTOR = {
  ...noCompactor,
  preventCollision: true,
};

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

  const overlaps = (itemA: Layout[number], itemB: Layout[number]) => {
    const horizontalOverlap = itemA.x < itemB.x + itemB.w && itemA.x + itemA.w > itemB.x;
    const verticalOverlap = itemA.y < itemB.y + itemB.h && itemA.y + itemA.h > itemB.y;
    return horizontalOverlap && verticalOverlap;
  };
  
  const { containerProps, group } = useGridContainer({
    layout: grid,
    width,
    onLayoutChange: (nextLayout) => {
      if (nextLayout.length < grid.length) {
        setGrid(nextLayout);
        return;
      }

      const MAX_ALLOWED_ROWS = 100;
      const lockedItems = grid.filter((item) => item.static);

      const movedLockedItem = lockedItems.some((lockedItem) => {
        const nextItem = nextLayout.find((item) => item.i === lockedItem.i);

        return (
          !nextItem ||
          nextItem.x !== lockedItem.x ||
          nextItem.y !== lockedItem.y ||
          nextItem.w !== lockedItem.w ||
          nextItem.h !== lockedItem.h ||
          nextItem.static !== true
        );
      });

      const overlapsLockedItem = nextLayout.some(
        (nextItem) => !nextItem.static && lockedItems.some((lockedItem) => overlaps(nextItem, lockedItem)),
      );

      if (movedLockedItem || overlapsLockedItem) {
        return;
      }
      
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
          return; // Simply break out here as well
        } else {
          setGrid(updatedLayout);
        }
      } else {
        setGrid(nextLayout);
      }
    },

    gridConfig: {
      ...GRID_CONFIG,
      maxRows: 31,
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
    compactor: LOCK_BLOCKING_COMPACTOR,
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
              <GridTile 
                key={it.i} 
                id={it.i} 
                group={group} 
                isLocked={!!it.static}
                onToggleLock={() => {
                  const nextGrid = grid.map((item) => 
                    item.i === it.i 
                      ? { ...item, static: !item.static } 
                      : item
                  );
                  setGrid(nextGrid);
                }}
              />
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


function GridTile({ 
  id, 
  group, 
  isLocked, 
  onToggleLock 
}: { 
  id: string; 
  group: string; 
  isLocked: boolean; 
  onToggleLock: () => void; 
}) {
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
      
      {/* Action Header Layer */}
      <div className="flex justify-between items-center p-2 border-b border-stone-800 bg-stone-900/50">
        <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400">
          // {theme.title} {isLocked && "(Locked)"}
        </span>
        
        <button
          type="button"
          onClick={onToggleLock}
          className={`p-1 rounded transition-colors ${
            isLocked ? "text-amber-500 hover:text-amber-400" : "text-stone-500 hover:text-stone-300"
          }`}
          aria-label={isLocked ? "Unlock tile" : "Lock tile"}
        >
          {isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Main Grid Content */}
      <div className="snapgrid-tile__content flex-1 overflow-auto">{content}</div>
      
      {/* Hide the resize handle entirely if the tile is locked */}
      {!isLocked && (
        <button
          ref={resizeRef}
          type="button"
          aria-label={`Resize ${theme.title}`}
          className="tile-resize-handle tile-resize-handle-se"
          {...handleProps}
        />
      )}
    </div>
  );
}