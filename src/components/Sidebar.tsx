// src/components/Sidebar.tsx
import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/react';
import { useVaultStore } from '../store/useVaultStore';
import { Coins, Weight, Settings } from 'lucide-react';
import TrayCard from './TrayCard';
import { TILE_DEFS, type TileId } from './SnapGridWorkSpace';
import SettingsModal from './SettingsModal'; // 🚀 IMPORT THE FIXED OVERLAY MODAL

interface SidebarProps {
  tray: TileId[];
}

export default function Sidebar({ tray }: SidebarProps) {
  const { gold, maxWeight, getCurrentWeight } = useVaultStore();
  
  const [modalOpen, setModalOpen] = useState(false);

  const { ref: trayRef, isDropTarget: isTrayDropTarget } = useDroppable({
    id: 'palette-tray-dropzone',
    type: 'tray',
    accept: ['grid-item', 'tray-card'],
  });

  const currentWeight = getCurrentWeight();
  const weightPercentage = Math.min(100, (currentWeight / maxWeight) * 100);

  return (
    <aside className="tray-dashboard-panel flex flex-col justify-between h-full font-mono select-none">
      
      <div className="flex flex-col gap-3 shrink-0">
        <div className="bg-stone-950 border border-stone-800 p-2 rounded">
          <div className="text-[10px] text-stone-500 uppercase font-bold tracking-wider flex items-center gap-1">
            <Coins className="h-3 w-3 text-amber-600" />
            <span className="text-amber-400 font-mono">{gold.toLocaleString()}g</span>
          </div>
        </div>

        <div className="bg-stone-950 border border-stone-800 p-2 rounded flex flex-col gap-1.5">
          <div className="text-[10px] text-stone-500 uppercase font-bold tracking-wider flex items-center gap-1">
            <Weight className="h-3 w-3 text-stone-500" />
            <span className="text-stone-300 font-mono">{currentWeight.toFixed(1)} / {maxWeight}kg</span>
          </div>
          <div className="w-full bg-stone-900 h-1.5 rounded overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${weightPercentage > 85 ? 'bg-rose-600' : 'bg-amber-600'}`}
              style={{ width: `${weightPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <hr className="border-stone-800 my-2" />

      <div className="flex flex-col gap-3 flex-1 min-h-0">
        <div className="tray-panel-header text-[10px] font-bold tracking-widest text-stone-500 uppercase">// Module_Dock_Tray</div>
        <div
          ref={trayRef}
          className={`tray-dropzone tray-card-stack flex-1 overflow-y-auto min-h-[120px] transition-colors rounded ${
            isTrayDropTarget ? 'is-hovered-target border border-dashed border-amber-500/40 bg-amber-950/5' : ''
          }`}
        >
          {tray.length === 0 ? (
            <div className="tray-empty-state text-[10px] text-stone-600 text-center py-6 italic uppercase tracking-wider">
              [Tray_Vacant_Drop_Windows_Here]
            </div>
          ) : (
            tray.map((id, index) => (
              <TrayCard key={id} id={id} index={index} title={TILE_DEFS[id].title} />
            ))
          )}
        </div>
      </div>

      <div className="sidebar-element-group mt-auto pt-2 border-t border-stone-900 shrink-0">
        <button
          key="sidebar-settings-anchor-btn"
          type="button"
          onClick={() => setModalOpen(true)}
          className="w-full bg-stone-950 hover:bg-stone-900/60 border border-stone-800/80 p-2 rounded text-stone-500 hover:text-amber-400 transition-all font-mono uppercase text-[9px] tracking-widest font-bold cursor-pointer flex items-center gap-2 group"
        >
          <Settings className="h-3.5 w-3.5 text-stone-600 group-hover:text-amber-500 transition-transform group-hover:rotate-45 duration-300 shrink-0" />
          <span>SYS_CONFIG_CORE</span>
        </button>
      </div>

      <SettingsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </aside>
  );
}