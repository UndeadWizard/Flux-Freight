// src/components/Header.tsx
import { useGameStore, type LithoClockSpeed } from '../store/useGameStore';
import { Play, Pause, Compass, Zap } from 'lucide-react';

export default function Header() {
  const { gameTick, isPaused, togglePause, tickSpeed, setTickSpeed } = useGameStore();

  const hoursPerDay = 24;
  const daysPerMonth = 30;

  const currentHour = gameTick % hoursPerDay;
  const currentDay = Math.floor((gameTick / hoursPerDay) % daysPerMonth) + 1;
  const totalMonths = Math.floor(gameTick / (hoursPerDay * daysPerMonth));

  const fantasyMonths = [
    "Cycle of Embers",
    "Glimmering Frost",
    "Aura of Whispers",
    "Deep Mine Harvest",
    "Celestial Eclipse"
  ];
  const currentMonthName = fantasyMonths[totalMonths % fantasyMonths.length];
  const currentYear = Math.floor(totalMonths / fantasyMonths.length) + 1;

  const padTime = (num: number) => String(num).padStart(2, '0');

  const speeds: LithoClockSpeed[] = ['1x', '2x', '4x'];

  return (
    <header className="apex-console-input-bar p-3 flex justify-between items-center shadow-inner font-mono text-xs select-none">
      
      {/* LEFT COLUMN: GUILD SIGIL BRANDING */}
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]" />
        <div className="flex flex-col gap-0.5">
          <span className="text-amber-500 font-bold uppercase tracking-widest text-[11px]">
            Flux & Freight Ltd.
          </span>
          <span className="text-[9px] text-stone-600 uppercase tracking-wider font-semibold">
            Merchant Guild Network Operations
          </span>
        </div>
      </div>

      {/* MIDDLE COLUMN: TICKING CALENDAR GEOGRAPHY STATUS */}
      <div className="flex items-center gap-3 bg-stone-950 px-3 py-1.5 border border-stone-900 rounded shadow-md">
        <Compass className={`h-4 w-4 text-stone-500 ${!isPaused && 'animate-spin [animation-duration:12s]'}`} />
        <div className="flex gap-2 items-center text-[10px] tracking-wide text-stone-400 font-bold uppercase">
          <span>Yr {currentYear}</span>
          <span className="text-stone-700">|</span>
          <span className="text-amber-400/90">{currentMonthName.toUpperCase()}</span>
          <span className="text-stone-700">|</span>
          <span>Day {padTime(currentDay)}</span>
          <span className="text-stone-700">|</span>
          <span className="text-amber-500 font-mono font-bold tracking-widest bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800">
            {padTime(currentHour)}:00
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: CORE HARMONIC TIME CONTROLLERS */}
      <div className="flex items-center gap-3">
        
        {/* Segmented Lithomancy Clock-Speed Tray */}
        <div className="litho-speed-tray flex items-center bg-stone-950 border border-stone-900 p-0.5 rounded">
          <div className="px-1.5 text-stone-600 flex items-center">
            <Zap className="h-3 w-3" />
          </div>
          {speeds.map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => setTickSpeed(speed)}
              className={`speed-step-btn px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                tickSpeed === speed
                  ? 'is-active bg-amber-500 text-stone-950 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                  : 'text-stone-500 hover:text-stone-300 hover:bg-stone-900/40'
              }`}
            >
              {speed}
            </button>
          ))}
        </div>

        <div className="h-4 w-[1px] bg-stone-800 mx-0.5" />

        {/* Master Pause/Play Matrix Button */}
        <button
          type="button"
          onClick={togglePause}
          className={`px-3 py-1 border font-bold uppercase tracking-wider rounded transition-all text-[10px] flex items-center gap-1.5 cursor-pointer ${
            isPaused 
              ? 'bg-emerald-950/20 border-emerald-800 text-emerald-400 hover:bg-emerald-900/20 shadow-[0_0_8px_rgba(16,185,129,0.05)]' 
              : 'bg-rose-950/20 border-rose-800 text-rose-400 hover:bg-rose-900/20'
          }`}
        >
          {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          {isPaused ? 'Resume_Matrix' : 'Pause_Matrix'}
        </button>

      </div>

    </header>
  );
}