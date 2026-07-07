// src/components/Draggable.tsx
import React from 'react';
import { useDraggable } from '@dnd-kit/react';
import { GripVertical, X } from 'lucide-react';

interface DraggableProps {
  id: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Draggable({ id, title, onClose, children }: DraggableProps) {
  // Extract the drag framework tracking elements
  const { ref, isDragging } = useDraggable({ id });

  return (
    <div 
      ref={ref}
      /* 
         🚀 IN-LINE TRANSITION MATRICES:
         Applying inline ease transitions makes components animate 
         fluidly into their destination target grid squares upon mouse drop!
      */
      style={{ 
        opacity: isDragging ? 0.3 : 1,
        transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.15s ease',
      }}
      className={`w-full h-full widget-portal-shell ${isDragging ? 'is-dragging-node' : ''}`}
    >
      <div className="widget-drag-header flex justify-between items-center select-none font-mono">
        <div className="flex items-center gap-2">
          <div className="drag-grabber-node p-0.5 rounded text-stone-700 hover:text-amber-500">
            <GripVertical className="h-3.5 w-3.5" />
          </div>
          <span className="title-glint uppercase tracking-widest text-[10px] text-stone-400 font-bold">// {title}</span>
        </div>
        
        <button 
          type="button" 
          onClick={onClose} 
          className="text-stone-600 hover:text-rose-400 transition-colors border-l border-stone-800 pl-1.5 cursor-pointer text-xs"
        >
          ✕
        </button>
      </div>

      <div className="widget-inner-body flex-1 p-3 overflow-auto">
        {children}
      </div>
    </div>
  );
}
