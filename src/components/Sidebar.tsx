// src/components/Sidebar.tsx
import { useGameStore } from '../store/useGameStore';
import { useVaultStore } from '../store/useVaultStore';
import { Coins, Weight, Layers } from 'lucide-react';

export default function Sidebar() {
  const { assignments, mountWidgetInFirstOpenSlot } = useGameStore();
  const { gold, maxWeight, getCurrentWeight } = useVaultStore();

  const currentWeight = getCurrentWeight();
  const weightPercentage = Math.min(100, (currentWeight / maxWeight) * 100);

  const navigationModules = [
    { id: 'ledger', label: 'Commodity Ledger' },
    { id: 'vault', label: 'Guild Bank Vault' },
    { id: 'logs', label: 'System Ticker Logs' }
  ] as const;

  return (
    <aside>
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

      {/* Dynamic Spawn Button Group Controllers */}
      <div className="flex-1 flex flex-col gap-1.5">
        {navigationModules.map((mod) => {
          // Check if this specific module type is currently loaded anywhere inside our grid slots
          const isCurrentlyActiveOnCanvas = Object.values(assignments).includes(mod.id);

          return (
            <button
              key={mod.id}
              type="button"
              disabled={isCurrentlyActiveOnCanvas}
              onClick={() => mountWidgetInFirstOpenSlot(mod.id)}
              className={`w-full text-left border p-2 rounded font-semibold uppercase tracking-wider text-[10px] flex items-center gap-2 transition-all ${
                isCurrentlyActiveOnCanvas
                  ? 'bg-stone-950 border-stone-900/40 text-stone-700 cursor-not-allowed opacity-30'
                  : 'bg-stone-950 hover:bg-stone-800 border-stone-800 text-stone-400 hover:text-amber-400 cursor-pointer'
              }`}
            >
              <Layers className="h-3 w-3 text-stone-600" />
              {isCurrentlyActiveOnCanvas ? `Active_${mod.id}` : `Mount_${mod.id}`}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
