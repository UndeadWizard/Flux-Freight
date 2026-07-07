// src/App.tsx
import React, { useEffect } from 'react';
import Header from './components/Header'; 
import Sidebar from './components/Sidebar';
import SnapGridWorkspace from './components/SnapGridWorkSpace';

import { useGameStore } from './store/useGameStore';
import { useMarketStore } from './store/useMarketStore';
import './styles/terminal.scss';

export default function App() {
  const { isPaused, advanceTick } = useGameStore();
  const advanceMarketTick = useMarketStore((state) => state.advanceTick);

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
      <div className="apex-split-workspace-deck">
        
        {/* Mock-Shadcn side menu dock option panels */}
        <Sidebar />

        {/* 🛠️ INJECTS THE ERROR-FREE DRAGGABLE RESIZABLE SNAPGRID WORKSPACE */}
        <SnapGridWorkspace />

      </div>
    </div>
  );
}
