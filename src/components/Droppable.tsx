// src/components/Droppable.tsx
import React from 'react';
import { useDroppable } from '@dnd-kit/react';

interface DroppableProps {
  id: string;
  type?: string;
  accept?: string | string[] | ((source: any) => boolean);
  variant?: 'grid' | 'tray';
  children: React.ReactNode;
}

export default function Droppable({ id, type, accept, variant = 'grid', children }: DroppableProps) {
  /* 
     ⚠️ THE EXACT TS V2 COMPILATION FIX:
     'isDropTarget' is the official property that tracks real-time hovering in v2.
     We completely drop the non-existent 'droppable.isOver' reference line.
  */
  const { ref, isDropTarget } = useDroppable({ id, type, accept });

  return (
    <div 
      ref={ref}
      /* 
         🚀 GLOW INJECTION:
         Maps 'isDropTarget' directly to our luxury '.is-hovered-target' SCSS animation class rules.
      */
      className={`${variant === 'tray' ? 'tray-dropzone' : 'matrix-square-cell'} rounded border flex items-center justify-center transition-all duration-200 ${
        isDropTarget 
          ? 'is-hovered-target' 
          : variant === 'tray'
            ? 'border-stone-800/80 bg-stone-950/55'
            : 'border-stone-900/40 bg-stone-950/20'
      }`}
    >
      {children ? (
        <div className="w-full h-full animate-fadeIn">{children}</div>
      ) : (
        /* Symmetrical wireframe background box outline */
        <div className={`w-full h-full border border-dashed rounded transition-colors duration-200 ${
          isDropTarget ? 'border-amber-500/40 bg-amber-950/5' : 'border-stone-900/50'
        }`} />
      )}
    </div>
  );
}
