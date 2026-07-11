// src/components/Header.tsx
import { useGameStore } from '../store/useGameStore';
import { Play, Pause, Compass } from 'lucide-react';

export default function Header() {
  const { gameTick, isPaused, togglePause } = useGameStore();

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

  return (
    <header className="apex-console-input-bar p-3 flex justify-between items-center shadow-inner font-mono text-xs select-none">
      
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

      <div className="flex items-center gap-3 bg-stone-950 px-3 py-1.5 border border-stone-900 rounded shadow-md">
        <Compass className={`h-4 w-4 text-stone-500 ${!isPaused && 'animate-spin [animation-duration:12s]'}`} />
        <div className="flex gap-2 items-center text-[10px] tracking-wide text-stone-400 font-bold uppercase">
          <span>Yr {currentYear} | {currentMonthName.toUpperCase()}| Day {padTime(currentDay)} | {padTime(currentHour)}:00</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={togglePause}
        >
          {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          {isPaused ? 'Resume_Matrix' : 'Pause_Matrix'}
        </button>
      </div>

    </header>
  );
}