// src/components/SettingsModal.tsx
import React, { useEffect } from 'react';
import SettingsView from './SettingsView';
import { X, Cpu } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  // Bind native browser escape key listeners to drop overlay visibility hooks
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
      {/* Absolute backdrop capture layer for click-away dismissals */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Symmetrical Settings Window Card */}
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-lg shadow-2xl flex flex-col overflow-hidden max-h-[85vh] font-mono animate-scaleUp">
        
        {/* Upper Modal Header Status Bar */}
        <div className="bg-stone-950 border-b border-stone-800 p-3 flex justify-between items-center select-none text-[10px] text-stone-400 font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5 text-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.2)]" />
            <span>// SYS_CONFIG_LATTICE_UTILITIES</span>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-stone-600 hover:text-rose-400 transition-colors cursor-pointer text-xs font-normal"
          >
            ✕
          </button>
        </div>

        {/* Inner Settings Content Canvas */}
        <div className="flex-1 p-4 overflow-y-auto bg-stone-900/50">
          <SettingsView />
        </div>

        {/* Symmetrical System Footer Tracker */}
        <div className="bg-stone-950 p-2 border-t border-stone-800/60 text-[8px] text-stone-600 text-center uppercase font-semibold">
          Terminal Status: Configuration Matrix Synced // Press ESC to drop
        </div>

      </div>
    </div>
  );
}
