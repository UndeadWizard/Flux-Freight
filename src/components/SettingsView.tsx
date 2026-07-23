// src/components/SettingsView.tsx
import { useSettingsStore } from '../store/useSettingsStore';
import { useGameStore } from '../store/useGameStore';
import { Eye, Volume2, ShieldAlert, RefreshCw, Trash2 } from 'lucide-react';

export default function SettingsView() {
  const { 
    matrixGridlines, toggleMatrixGridlines,
    audibleAlarms, toggleAudibleAlarms,
    lensFocalProfile, setLensFocalProfile 
  } = useSettingsStore();

  const appendLog = (msg: string) => {
    useGameStore.setState((state) => ({ commandHistory: [msg, ...state.commandHistory] }));
  };

  const handleHardPurge = () => {
    if (window.confirm("CRITICAL WARNING: This will purge all localized crystal lattice data files. Proceed?")) {
      window.localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 font-mono text-[10px] text-stone-400 select-none">
      
      {/* SECTION 1: LITHOMANCY CORE RENDERING */}
      <div className="flex flex-col gap-2 border border-stone-900 bg-stone-950/40 p-2.5 rounded">
        <div className="text-amber-500 font-bold uppercase tracking-wider">// LITHOMANCY_CORE_RENDERING</div>
        
        {/* Toggle: Background Grid Matrix */}
        <div className="flex justify-between items-center py-1">
          <div className="flex items-center gap-2">
            <Eye className="h-3.5 w-3.5 text-stone-600" />
            <div>
              <div className="text-stone-300 font-bold uppercase">Background Matrix Gridlines</div>
              <div className="text-stone-600 text-[9px] mt-0.5">Toggles the high-contrast background canvas alignment nodes.</div>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => { toggleMatrixGridlines(); appendLog(`[SYS_CONFIG] Matrix gridlines updated.`); }}
            className={`px-2 py-0.5 rounded font-bold uppercase cursor-pointer border ${
              matrixGridlines ? 'bg-amber-500 text-stone-950 border-amber-500' : 'bg-transparent border-stone-800 text-stone-500'
            }`}
          >
            {matrixGridlines ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>

        {/* Toggle: Resonator Lens Focal Profile */}
        <div className="flex justify-between items-center py-1 border-t border-stone-900/60 pt-2">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-3.5 w-3.5 text-stone-600" />
            <div>
              <div className="text-stone-300 font-bold uppercase">Lens Focal Profile</div>
              <div className="text-stone-600 text-[9px] mt-0.5">Modifies the projection typography sharpening matrix parameters.</div>
            </div>
          </div>
          <div className="flex bg-stone-900 p-0.5 border border-stone-800 rounded">
            {(['standard', 'crisp'] as const).map((prof) => (
              <button
                key={prof}
                type="button"
                onClick={() => { setLensFocalProfile(prof); appendLog(`[SYS_CONFIG] Lens focal profile set to ${prof}.`); }}
                className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] cursor-pointer ${
                  lensFocalProfile === prof ? 'bg-amber-500 text-stone-950' : 'text-stone-500'
                }`}
              >
                {prof}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: AUDIO RESONATOR HARMONICS */}
      <div className="flex flex-col gap-2 border border-stone-900 bg-stone-950/40 p-2.5 rounded">
        <div className="text-amber-500 font-bold uppercase tracking-wider">// AUDIO_RESONATOR_HARMONICS</div>
        
        <div className="flex justify-between items-center py-1">
          <div className="flex items-center gap-2">
            <Volume2 className="h-3.5 w-3.5 text-stone-600" />
            <div>
              <div className="text-stone-300 font-bold uppercase">Audible Resonator Alarms</div>
              <div className="text-stone-600 text-[9px] mt-0.5">Fires warning chime clicks when caravan supply runs suffer an SOS ambush.</div>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => { toggleAudibleAlarms(); appendLog(`[SYS_CONFIG] Audio resonator filters modified.`); }}
            className={`px-2 py-0.5 rounded font-bold uppercase cursor-pointer border ${
              audibleAlarms ? 'bg-amber-500 text-stone-950 border-amber-500' : 'bg-transparent border-stone-800 text-stone-500'
            }`}
          >
            {audibleAlarms ? 'ACTIVE' : 'MUTED'}
          </button>
        </div>
      </div>

      {/* SECTION 3: CORE LATTICE PURGE */}
      <div className="flex flex-col gap-2 border border-rose-950/40 bg-rose-950/5 p-2.5 rounded mt-auto">
        <div className="text-rose-500 font-bold uppercase tracking-wider flex items-center gap-1">
          <ShieldAlert className="h-3.5 w-3.5" /> DANGER_ZONE_CORE_MAINTENANCE
        </div>
        <div className="flex justify-between items-center py-1">
          <div className="text-stone-500 text-[9px] max-w-[70%]">
            Executing a hard database purge wipes your localized caravan logs, saved canvas layouts, treasury balances, and resetting files back to seed footprints.
          </div>
          <button
            type="button"
            onClick={handleHardPurge}
            className="px-2 py-1 bg-rose-950/20 border border-rose-800 hover:bg-rose-900/40 text-rose-400 rounded font-bold uppercase cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="h-3 w-3" /> Purge_Database
          </button>
        </div>
      </div>

    </div>
  );
}