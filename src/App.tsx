// src/App.tsx
import { useEffect, useState } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import Header from './components/Header'; 
import Sidebar from './components/Sidebar';
import SnapGridWorkspace, {
  TILE_DEFS,
  type TileId,
} from './components/SnapGridWorkSpace';

import { useGameStore } from './store/useGameStore';
import { useMarketStore } from './store/useMarketStore';
import './styles/terminal.scss';
import {
  type Layout,
  removeItemWithCompactor,
  snapMove,
  verticalCompactor,
} from '@snapgridjs/react';

// Static layout properties to feed SnapGrid modifiers directly
const STATIC_GRID_COLS = 20;
const WORKSPACE_LAYOUT_STORAGE_KEY = 'flux-freight-workspace-layout';

const DEFAULT_GRID: Layout = [
  { i: 'ledger', x: 0, y: 0, w: 4, h: 2 },
  { i: 'vault', x: 4, y: 0, w: 2, h: 2 },
];

const DEFAULT_TRAY: TileId[] = ['logs', 'map'];

function isLayoutItem(value: unknown): value is Layout[number] {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.i === 'string' &&
    typeof candidate.x === 'number' &&
    typeof candidate.y === 'number' &&
    typeof candidate.w === 'number' &&
    typeof candidate.h === 'number' &&
    (candidate.static === undefined || typeof candidate.static === 'boolean')
  );
}

function readWorkspaceState(): { grid: Layout; tray: TileId[] } {
  if (typeof window === 'undefined') {
    return { grid: DEFAULT_GRID, tray: DEFAULT_TRAY };
  }

  const saved = window.localStorage.getItem(WORKSPACE_LAYOUT_STORAGE_KEY);

  if (!saved) {
    return { grid: DEFAULT_GRID, tray: DEFAULT_TRAY };
  }

  try {
    const parsed = JSON.parse(saved) as { grid?: unknown; tray?: unknown };
    const grid = Array.isArray(parsed.grid) && parsed.grid.every(isLayoutItem)
      ? parsed.grid
      : DEFAULT_GRID;
    const tray = Array.isArray(parsed.tray) && parsed.tray.every((item): item is TileId => isTileId(String(item)))
      ? parsed.tray.map((item) => item as TileId)
      : DEFAULT_TRAY;

    return { grid, tray };
  } catch {
    return { grid: DEFAULT_GRID, tray: DEFAULT_TRAY };
  }
}

function isTileId(value: string): value is TileId {
  return value in TILE_DEFS;
}

function insertBefore(list: TileId[], id: TileId, beforeId: string): TileId[] {
  const without = list.filter((item) => item !== id);
  const index = isTileId(beforeId) ? without.indexOf(beforeId) : -1;
  return index < 0 ? [...without, id] : [...without.slice(0, index), id, ...without.slice(index)];
}

export default function App() {
  const { isPaused, advanceTick } = useGameStore();
  const advanceMarketTick = useMarketStore((state) => state.advanceTick);

  const [{ grid: initialGrid, tray: initialTray }] = useState(readWorkspaceState);
  const [grid, setGrid] = useState<Layout>(initialGrid);
  const [tray, setTray] = useState<TileId[]>(initialTray);

  useEffect(() => {
    window.localStorage.setItem(
      WORKSPACE_LAYOUT_STORAGE_KEY,
      JSON.stringify({ grid, tray }),
    );
  }, [grid, tray]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPaused) return;
      advanceTick();        
      advanceMarketTick();  
    }, 3000);
    return () => clearInterval(interval);
  }, [advanceTick, advanceMarketTick, isPaused]);

  return (
    <div className="flux-terminal-environment font-mono select-none">
      
      {/* Top Chronology Control Bar Header */}
      <Header />

      {/* Symmetrical Left-to-Right layout row configuration */}
      <DragDropProvider
          onDragEnd={(event) => {
          const { source, target } = event.operation;
          if (!source || !target) return;

          const id = String(source.id);
          const tileId = isTileId(id) ? id : null;

          if (source.type === 'tray-card' && target.type === 'grid') {
            if (!tileId) return;
            setTray((currentTray) => currentTray.filter((item) => item !== tileId));
            setGrid((currentGrid) => snapMove(currentGrid, event, { defaultItem: { w: 2, h: 2 } }));
            return;
          }

          if (source.type === 'grid-item' && (target.type === 'tray-card' || target.type === 'tray')) {
            if (!tileId) return;

            setGrid((currentGrid) =>
              removeItemWithCompactor(currentGrid, id, {
                compactor: verticalCompactor,
                cols: STATIC_GRID_COLS,
              }),
            );

            setTray((currentTray) => {
              if (currentTray.includes(tileId)) return currentTray;
              if (target.type === 'tray-card') {
                return insertBefore(currentTray, tileId, String(target.id));
              }
              return [...currentTray, tileId];
            });
            return;
          }

          if (source.type === 'tray-card' && target.type === 'tray-card') {
            if (!tileId) return;
            setTray((currentTray) => insertBefore(currentTray, tileId, String(target.id)));
          }
        }}
      >
        <div className="apex-split-workspace-deck">
          <Sidebar tray={tray} />
          <SnapGridWorkspace grid={grid} setGrid={setGrid} />
        </div>
      </DragDropProvider>
    </div>
  );
}
