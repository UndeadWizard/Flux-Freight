// src/components/SnapGridWorkspace.tsx
import React, { useState } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import Droppable from './Droppable';
import Draggable from './Draggable';

// Import our modular TanStack Table views
import LedgerTable from './LedgerTable';
import VaultView from './VaultView';
import TickerLogs from './TickerLogs';

interface ActiveNode {
  id: string;
  title: string;
  type: 'ledger' | 'vault' | 'logs';
}

type GridAssignments = Record<string, 'ledger' | 'vault' | 'logs' | null>;

export default function SnapGridWorkspace() {
  // Symmetrical layout slot coordinates list
  const targets = ['SLOT_A', 'SLOT_B', 'SLOT_C', 'SLOT_D', 'SLOT_E', 'SLOT_06'];

  const [assignments, setAssignments] = useState<GridAssignments>({
    SLOT_A: 'ledger',
    SLOT_B: 'vault',
    SLOT_C: 'logs',
    SLOT_D: null,
    SLOT_E: null,
    SLOT_06: null
  });

  const handleDragEnd = (event: any) => {
    if (event.canceled) return;

    const targetSlotId = event.operation.target?.id;
    const movingWidgetId = event.operation.source?.id;

    if (targetSlotId && movingWidgetId) {
      setAssignments((prev) => {
        const next = { ...prev };
        const sourceSlotId = Object.keys(next).find(key => next[key] === movingWidgetId);
        const displacedWidgetId = next[targetSlotId];

        if (sourceSlotId) {
          next[sourceSlotId] = displacedWidgetId; 
        }
        
        next[targetSlotId] = movingWidgetId as any; 
        return next;
      });
    }
  };

  const handleCloseWidget = (slotId: string) => {
    setAssignments(prev => ({ ...prev, [slotId]: null }));
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="grid-workspace-canvas relative flex-1 overflow-y-auto">
        
        <div className="matrix-square-deck">
          {targets.map((id) => {
            const assignedWidgetType = assignments[id];

            return (
              <Droppable key={id} id={id}>
                {assignedWidgetType && (
                  <Draggable 
                    id={assignedWidgetType} 
                    title={`${assignedWidgetType.toUpperCase()} OPERATIONS CONSOLE`}
                    onClose={() => handleCloseWidget(id)}
                  >
                    {/* 
                      🚀 INLINE AUTO SELECTION PROFILE:
                      By specifying "w-auto h-auto", the internal content container elements 
                      scale responsively based on whatever dimensions you drag the panel handle out to!
                    */}
                    <div 
                      key={`view-node-${assignedWidgetType}`} 
                      className="w-full h-full min-h-0 overflow-hidden flex flex-col"
                    >
                      {assignedWidgetType === 'ledger' && <LedgerTable />}
                      {assignedWidgetType === 'vault' && <VaultView />}
                      {assignedWidgetType === 'logs' && <TickerLogs />}
                    </div>
                  </Draggable>
                )}
              </Droppable>
            );
          })}
        </div>

      </div>
    </DragDropProvider>
  );
}
