// src/components/Sidebar.tsx
import { useDroppable } from '@dnd-kit/react';
import { useVaultStore } from '../store/useVaultStore';
import { Coins, Weight } from 'lucide-react';
import TrayCard from './TrayCard';
import { TILE_DEFS, type TileId } from './SnapGridWorkSpace';

interface SidebarProps {
  tray: TileId[];
}

export default function Sidebar({ tray }: SidebarProps) {
  const { gold, maxWeight, getCurrentWeight } = useVaultStore();
  const { ref: trayRef, isDropTarget: isTrayDropTarget } = useDroppable({
    id: 'palette-tray-dropzone',
    type: 'tray',
    accept: ['grid-item', 'tray-card'],
  });

  const currentWeight = getCurrentWeight();
  const weightPercentage = Math.min(100, (currentWeight / maxWeight) * 100);

  return (
    <aside className="tray-dashboard-panel">
      <hr className="border-stone-800" />

      <div className="flex flex-col gap-3">
        <div className="bg-stone-950 border border-stone-800 p-2 rounded">
          <div className="text-[10px] text-stone-500 uppercase font-bold tracking-wider flex items-center gap-1">
            <Coins className="h-3 w-3 text-amber-600" />
            <span>{gold.toLocaleString()}g</span>
          </div>
        </div>

        <div className="bg-stone-950 border border-stone-800 p-2 rounded flex flex-col gap-1.5">
          <div className="text-[10px] text-stone-500 uppercase font-bold tracking-wider flex items-center gap-1">
            <Weight className="h-3 w-3 text-stone-500" />
            <span>{currentWeight.toFixed(1)} / {maxWeight}kg</span>
          </div>
          <div className="w-full bg-stone-900 h-1.5 rounded overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${weightPercentage > 85 ? 'bg-rose-600' : 'bg-amber-600'}`}
              style={{ width: `${weightPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <hr className="border-stone-800" />

      <div className="flex flex-col gap-3 flex-1 min-h-0">
        <div className="tray-panel-header">Module Tray</div>
        <div
          ref={trayRef}
          className={`tray-dropzone tray-card-stack ${isTrayDropTarget ? 'is-hovered-target' : ''}`}
        >
          {tray.length === 0 ? (
            <div className="tray-empty-state">Drop dashboard modules here to stash them.</div>
          ) : (
            tray.map((id, index) => (
              <TrayCard key={id} id={id} index={index} title={TILE_DEFS[id].title} />
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
