// src/components/TickerLogs.tsx
import { useMarketStore } from '../store/useMarketStore';

export default function TickerLogs() {
  const logs = useMarketStore((state) => state.logs);

  return (
    <div className="flex flex-col gap-1.5 font-mono text-[10px] max-h-[300px]">
      {logs.map((log, index) => (
        <div 
          key={index} 
          className={`p-1 rounded border border-stone-900/60 ${
            index === 0 ? 'bg-amber-950/15 text-amber-400 border-l border-l-amber-600' : 'text-stone-500'
          }`}
        >
          &gt; {log}
        </div>
      ))}
    </div>
  );
}