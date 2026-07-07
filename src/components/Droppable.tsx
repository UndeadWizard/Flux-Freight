// src/components/Droppable.tsx
import React from 'react';
import { useDroppable } from '@dnd-kit/react';

interface DroppableProps {
  id: string;
  children: React.ReactNode;
}

export default function Droppable({ id, children }: DroppableProps) {
  /* 
     ⚠️ THE EXACT TS V2 COMPILATION FIX:
     'isDropTarget' is the official property that tracks real-time hovering in v2.
     We completely drop the non-existent 'droppable.isOver' reference line.
  */
  const { ref, isDropTarget } = useDroppable({ id });

  return (
    <div 
      ref={ref}
      /* 
         🚀 GLOW INJECTION:
         Maps 'isDropTarget' directly to our luxury '.is-hovered-target' SCSS animation class rules.
      */
      className={`matrix-square-cell rounded border flex items-center justify-center transition-all duration-200 ${
        isDropTarget 
          ? 'is-hovered-target' 
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
