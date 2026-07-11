import { useSortable } from '@dnd-kit/react/sortable';
import { GripVertical } from 'lucide-react';

interface TrayCardProps {
  id: string;
  index: number;
  title: string;
}

export default function TrayCard({ id, index, title }: TrayCardProps) {
  const { ref, handleRef, isDragging } = useSortable({
    id,
    index,
    group: 'tray',
    type: 'tray-card',
    accept: ['tray-card', 'grid-item']
  });

  return (
    <div
      ref={ref}
      className={`tray-card-item ${isDragging ? 'is-dragging-node' : ''}`}
    >
      <div ref={handleRef} className="tray-card-grab">
        <GripVertical className="h-3.5 w-3.5" />
      </div>
      <div className="tray-card-meta">
        <span className="tray-card-tag">MODULE</span>
        <span className="tray-card-title">{title}</span>
      </div>
    </div>
  );
}
