// src/components/TransitMap.tsx
import React, { useMemo } from 'react';
import { useGameStore } from '../store/useGameStore';

// Define the geographical telemetry system parameters
interface TradeNode {
  id: string;
  name: string;
  x: number; // Percent-based X coordinate inside the map canvas
  y: number; // Percent-based Y coordinate inside the map canvas
  type: 'hub' | 'outpost' | 'capital';
}

interface RouteEdge {
  id: string;
  from: string;
  to: string;
  hazardRating: number; // Modifies the risk percentage
}

export default function TransitMap() {
  const { gameTick } = useGameStore();

  // 1. DEFINE FIXED REGIONAL GEOGRAPHY TELEMETRY
  const nodes: TradeNode[] = useMemo(() => [
    { id: 'apex', name: 'APEX_PRIME', x: 20, y: 30, type: 'capital' },
    { id: 'ember', name: 'EMBER_PASS', x: 50, y: 15, type: 'outpost' },
    { id: 'frost', name: 'FROST_VALE', x: 80, y: 45, type: 'hub' },
    { id: 'deep', name: 'DEEP_MINES', x: 45, y: 75, type: 'hub' },
    { id: 'elven', name: 'SILVER_WOOD', x: 15, y: 70, type: 'capital' },
  ], []);

  const routes: RouteEdge[] = useMemo(() => [
    { id: 'r1', from: 'apex', to: 'ember', hazardRating: 15 },
    { id: 'r2', from: 'ember', to: 'frost', hazardRating: 45 },
    { id: 'r3', from: 'frost', to: 'deep', hazardRating: 60 }, // High volatility sector
    { id: 'r4', from: 'deep', to: 'elven', hazardRating: 25 },
    { id: 'r5', from: 'elven', to: 'apex', hazardRating: 5 },  // Heavily secured lane
    { id: 'r6', from: 'apex', to: 'deep', hazardRating: 30 },
  ], []);

  // 2. MOCK ACTIVE CARAVANS POSITION MATH BASED ON SYSTEM TICKS
  // In your production build, this payload will be pulled directly from useCaravanStore
  const activeCaravans = useMemo(() => [
    { id: 'v1', name: 'CRV_01_IRON', routeId: 'r1', speed: 4, startTick: 0 },
    { id: 'v2', name: 'CRV_02_ETHER', routeId: 'r3', speed: 2, startTick: 10 }
  ], []);

  return (
    <div className="w-full h-full relative bg-stone-950 rounded overflow-hidden flex flex-col font-mono text-[10px]">
      
      {/* 🧭 Top Telemetry Status Header */}
      <div className="bg-stone-900/60 border-b border-stone-900 p-1.5 flex justify-between items-center text-stone-500 font-bold uppercase tracking-wider">
        <span>// TRANSIT_VECTOR_VECTOR_LANE_MAP</span>
        <span className="text-amber-500/80 animate-pulse">GRID_RADAR: ONLINE</span>
      </div>

      {/* 🗺️ SVG TOPOLOGY VECTOR DECK LAYER */}
      <div className="flex-1 relative bg-[radial-gradient(#2e2a24_0.5px,transparent_0.5px)] [background-size:12px_16px]">
        <svg className="w-full h-full absolute inset-0 select-none">
          
          {/* A. DRAW THE PERMANENT SUPPLY CONNECTIONS LINES (EDGES) */}
          {routes.map((route) => {
            const fromNode = nodes.find(n => n.id === route.from);
            const toNode = nodes.find(n => n.id === route.to);
            if (!fromNode || !toNode) return null;

            return (
              <g key={route.id}>
                {/* Background path line wireframe */}
                <line
                  x1={`${fromNode.x}%`} y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`} y2={`${toNode.y}%`}
                  className={`stroke-2 transition-all ${
                    route.hazardRating > 40 ? 'stroke-rose-950/40' : 'stroke-stone-800'
                  }`}
                />
                {/* Subtle moving alchemical particle laser flow pulsing along lanes */}
                <line
                  x1={`${fromNode.x}%`} y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`} y2={`${toNode.y}%`}
                  strokeDasharray="4, 12"
                  className={`stroke-[1px] ${
                    route.hazardRating > 40 ? 'stroke-rose-500/30' : 'stroke-amber-500/20'
                  } animate-[dash_20s_linear_infinite]`}
                />
              </g>
            );
          })}

          {/* B. CALCULATE AND DRAW LIVE MOVING CARAVANS BLIPS */}
          {activeCaravans.map((caravan) => {
            const targetRoute = routes.find(r => r.id === caravan.routeId);
            if (!targetRoute) return null;

            const fromNode = nodes.find(n => n.id === targetRoute.from);
            const toNode = nodes.find(n => n.id === targetRoute.to);
            if (!fromNode || !toNode) return null;

            // Mathematical linear interpolation tracking percent complete over engine ticks
            const elapsedTicks = Math.max(0, gameTick - caravan.startTick);
            const totalDuration = 20; // Ticks required to cross standard paths
            const progress = (elapsedTicks * caravan.speed) % 100; // Loops for tracking simulation
            
            // Calculate active dynamic position vectors
            const currentX = fromNode.x + ((toNode.x - fromNode.x) * progress) / 100;
            const currentY = fromNode.y + ((toNode.y - fromNode.y) * progress) / 100;

            return (
              <g key={caravan.id}>
                {/* Radar target ping aura ring */}
                <circle
                  cx={`${currentX}%`} cy={`${currentY}%`} r="6"
                  className="fill-none stroke-amber-500/40 stroke-1 animate-ping [animation-duration:1.5s]"
                />
                {/* Active vector blip particle dot node */}
                <circle
                  cx={`${currentX}%`} cy={`${currentY}%`} r="3"
                  className="fill-amber-500 shadow-md"
                />
                {/* Vector callsign label overlay data box */}
                <text
                  x={`${currentX + 1.5}%`} y={`${currentY - 1.5}%`}
                  className="fill-amber-400/80 font-bold font-mono text-[8px] uppercase font-semibold"
                >
                  {caravan.name}
                </text>
              </g>
            );
          })}

          {/* C. DRAW GEOGRAPHICAL KINGDOM NODE ANCHORS */}
          {nodes.map((node) => (
            <g key={node.id}>
              {/* Core interactive structure element node circle anchor */}
              <circle
                cx={`${node.x}%`} cy={`${node.y}%`} r="4"
                className={`stroke-stone-950 stroke-1 ${
                  node.type === 'capital' ? 'fill-amber-500' : node.type === 'hub' ? 'fill-stone-400' : 'fill-stone-600'
                }`}
              />
              {/* Data label overlay box mapping elements */}
              <text
                x={`${node.x}%`} y={`${node.y + 4}%`}
                textAnchor="middle"
                className="fill-stone-400 font-bold tracking-wider font-mono text-[8px] mt-1"
              >
                {node.name}
              </text>
            </g>
          ))}

        </svg>
      </div>

      {/* 📋 Symmetrical Bottom Legend Metadata Panel footer */}
      <div className="bg-stone-950 p-1.5 border-t border-stone-900 text-[8px] text-stone-600 flex gap-4 uppercase font-semibold select-none justify-center">
        <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Capital_Hub</span>
        <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-stone-400" /> Trading_Post</span>
        <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 bg-rose-500/50" /> High_Hazard_Sector</span>
      </div>

    </div>
  );
}