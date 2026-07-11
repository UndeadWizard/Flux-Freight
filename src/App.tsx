// src/App.tsx
import { useEffect, useState } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import Header from './components/Header'; 
import Sidebar from './components/Sidebar';
import SnapGridWorkspace, {
  BREAKPOINTS,
  GRID_PROFILES,
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

function isTileId(value: string): value is TileId {
  return value in TILE_DEFS;
}

function insertBefore(list: TileId[], id: TileId, beforeId: string): TileId[] {
  const without = list.filter((item) => item !== id);
  const index = isTileId(beforeId) ? without.indexOf(beforeId) : -1;
  return index < 0 ? [...without, id] : [...without.slice(0, index), id, ...without.slice(index)];
}

function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'lg' | 'md' | 'sm'>('lg');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS.lg) setBreakpoint('lg');
      else if (width >= BREAKPOINTS.md) setBreakpoint('md');
      else setBreakpoint('sm');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

export default function App() {
  const { isPaused, advanceTick } = useGameStore();
  const advanceMarketTick = useMarketStore((state) => state.advanceTick);
  const breakpoint = useBreakpoint();
  const currentGridConfig = GRID_PROFILES[breakpoint];
  const [grid, setGrid] = useState<Layout>([
    { i: 'ledger', x: 0, y: 0, w: 4, h: 2 },
    { i: 'vault', x: 4, y: 0, w: 2, h: 2 },
  ]);
  const [tray, setTray] = useState<TileId[]>(['logs']);

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
          onDragOver={(event) => {
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
                cols: currentGridConfig.cols,
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
