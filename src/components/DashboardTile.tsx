// src/components/DashboardTile.tsx
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useGameStore, type WidgetNode } from '../store/useGameStore';
import { X, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';

interface TileProps {
  widget: WidgetNode;
  children: React.ReactNode;
}

export default function DashboardTile({ widget, children }: TileProps) {
  const removeWidget = useGameStore((state) => state.removeWidget);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: widget.id });

  const inlineStyles = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div 
      ref={setNodeRef}
      style={inlineStyles}
      className={widget.sizeClass}
    >
      <div className="widget-portal-shell w-full h-full">
        
        <div className="widget-drag-header flex justify-between items-center font-mono select-none">
          <div className="flex items-center gap-2">
            
            <div 
              {...attributes} 
              {...listeners} 
              className="drag-grabber-node p-0.5 rounded transition-colors"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </div>
            
            <span className="title-glint uppercase">// {widget.title}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              type="button" 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="text-stone-600 hover:text-amber-500 transition-colors cursor-pointer"
            >
              {isCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            </button>
            <button 
              type="button" 
              onClick={() => removeWidget(widget.id)} 
              className="text-stone-600 hover:text-rose-400 transition-colors cursor-pointer border-l border-stone-800 pl-1.5"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="widget-inner-body flex-1 p-3 overflow-auto">
            {children}
          </div>
        )}

      </div>
    </div>
  );
}