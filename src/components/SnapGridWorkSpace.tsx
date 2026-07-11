"use client";

import { DragDropProvider, useDroppable } from "@dnd-kit/react";
import { rectIntersection } from "@dnd-kit/core";
import {
  type Layout,
  removeItemWithCompactor,
  snapMove,
  useContainerWidth,
  useGridContainer,
  useGridItem,
  useGridPlaceholder,
  useGridResizeHandle,
  verticalCompactor,
} from "@snapgridjs/react";
import { type ReactNode, useState, useEffect } from "react";
import LedgerTable from "./LedgerTable";
import TickerLogs from "./TickerLogs";
import TrayCard from "./TrayCard";
import VaultView from "./VaultView";

// Responsive grid profiles and breakpoints
const BREAKPOINTS = { lg: 1200, md: 768, sm: 480 };

const GRID_PROFILES = {
  lg: { cols: 6, rowHeight: 60 },
  md: { cols: 4, rowHeight: 55 },
  sm: { cols: 2, rowHeight: 50 },
};

const TRAY_W = 140; // Slightly widened for better visual clearance
const GAP = 16; 

type TileId = "ledger" | "vault" | "logs";

type TileTheme = {
  title: string;
  accentClass: string;
  render: () => ReactNode;
};

const TILE_DEFS: Record<TileId, TileTheme> = {
  ledger: { title: "Commodity Ledger", accentClass: "snapgrid-tile--ledger", render: () => <LedgerTable /> },
  vault: { title: "Guild Bank Vault", accentClass: "snapgrid-tile--vault", render: () => <VaultView /> },
  logs: { title: "System Ticker Logs", accentClass: "snapgrid-tile--logs", render: () => <TickerLogs /> },
};

function isTileId(value: string): value is TileId {
  return value in TILE_DEFS;
}

// Hook to track current layout tier dynamically
function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<"lg" | "md" | "sm">("lg");

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= BREAKPOINTS.lg) setBreakpoint("lg");
      else if (w >= BREAKPOINTS.md) setBreakpoint("md");
      else setBreakpoint("sm");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}

export default function SortableGridExample() {
  const breakpoint = useBreakpoint();
  const currentGridConfig = GRID_PROFILES[breakpoint];

  const [grid, setGrid] = useState<Layout>([
    { i: "ledger", x: 0, y: 0, w: 4, h: 2 },
    { i: "vault", x: 4, y: 0, w: 2, h: 2 },
  ]);
  const [tray, setTray] = useState<TileId[]>(["logs"]);

  return (
    <DragDropProvider
      collisionDetection={rectIntersection} // Solves edge/boundary selection dead zones
      onDragOver={(event) => {
        const { source, target } = event.operation;
        if (!source || !target) return;
        const id = String(source.id);
        const tileId = isTileId(id) ? id : null;

        if (source.type === "tray-card" && target.type === "grid") {
          if (!tileId) return;
          setTray((t) => t.filter((x) => x !== tileId));
          setGrid((g) => snapMove(g, event, { defaultItem: { w: 2, h: 2 } }));
        } else if (source.type === "grid-item" && (target.type === "tray-card" || target.type === "tray")) {
          if (!tileId) return;
          
          setGrid((g) =>
            removeItemWithCompactor(g, id, { compactor: verticalCompactor, cols: currentGridConfig.cols }),
          );
          
          setTray((t) => {
            if (t.includes(tileId)) return t;
            if (target.type === "tray-card") {
              return insertBefore(t, tileId, String(target.id));
            }
            return [...t, tileId]; // Safely falls back to appending when dropped on empty tray canvas
          });
        } else if (source.type === "tray-card" && target.type === "tray-card") {
          if (!tileId) return;
          setTray((t) => insertBefore(t, tileId, String(target.id)));
        }
      }}
    >
      <Body 
        grid={grid} 
        setGrid={setGrid} 
        tray={tray} 
        gridConfig={currentGridConfig} 
        breakpoint={breakpoint} 
      />
    </DragDropProvider>
  );
}

function Body({
  grid,
  setGrid,
  tray,
  gridConfig,
  breakpoint,
}: {
  grid: Layout;
  setGrid: (next: Layout) => void;
  tray: TileId[];
  gridConfig: { cols: number; rowHeight: number };
  breakpoint: "lg" | "md" | "sm";
}) {
  const isMobile = breakpoint === "sm";
  const initialWidthEstimate = isMobile ? 340 : breakpoint === "md" ? 600 : 900;
  
  const { width, containerRef } = useContainerWidth({ initialWidth: initialWidthEstimate });
  
  const { containerProps, group } = useGridContainer({
    layout: grid,
    width,
    onLayoutChange: setGrid,
    gridConfig: gridConfig,
    isResizable: true,
    accept: (s) => s.type === "tray-card",
  });

  const { ref: trayRef, isDropTarget: isTrayDropTarget } = useDroppable({
    id: "palette-tray-dropzone",
    type: "tray",
    accept: ["grid-item", "tray-card"],
  });

  const placeholder = useGridPlaceholder(group);

  return (
    <div 
      style={{ 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row",
        gap: GAP, 
        alignItems: "stretch", // Ensures column children match heights perfectly
        width: "100%",
        padding: "16px", // Adds container padding to give drag gestures breathing room
        boxSizing: "border-box"
      }}
    >
      {/* Dynamic, full-height tray surface target */}
      <div
        ref={trayRef}
        className={`palette tray-dropzone ${isTrayDropTarget ? "is-hovered-target" : ""}`}
        style={{ 
          width: isMobile ? "100%" : TRAY_W, 
          flex: "0 0 auto", 
          minHeight: isMobile ? "auto" : 620,
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          gap: GAP,
          padding: "12px",
          background: isTrayDropTarget ? "rgba(0, 0, 0, 0.04)" : "rgba(0, 0, 0, 0.01)",
          borderRadius: "8px",
          transition: "background 0.2s ease-in-out",
          boxSizing: "border-box"
        }}
      >
        {tray.map((id, i) => (
          <TrayCard key={id} id={id} index={i} title={TILE_DEFS[id].title} />
        ))}
      </div>

      {/* Fluid dashboard canvas layout shell */}
      <div
        ref={containerRef}
        style={{ 
          flex: "1 1 0%", 
          width: "100%",
          position: "relative", 
          minHeight: 620,
          boxSizing: "border-box"
        }}
        className="snapgrid-measure-shell"
      >
        <div className="snapgrid-surface snapgrid-surface--cool" style={{ height: "100%" }}>
          <div 
            {...containerProps} 
            className="snapgrid-grid-layer"
            style={{ 
              ...containerProps.style,
              padding: "8px", // Helps allow crosshair selections on outer edge grids
              boxSizing: "border-box"
            }}
          >
            {grid.map((it) => (
              <GridTile key={it.i} id={it.i} group={group} />
            ))}
            {placeholder ? (
              <div 
                className="snapgrid-placeholder snapgrid-placeholder--cool" 
                style={placeholder.style} 
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

// A standard grid item component
function GridTile({ id, group }: { id: string; group: string }) {
  const { ref, style } = useGridItem({ id, group });

  if (!isTileId(id)) {
    return (
      <div ref={ref} style={style} className="snapgrid-tile">
        {id}
      </div>
    );
  }

  const theme = TILE_DEFS[id];
  const content = theme.render();
  const { ref: resizeRef, handleProps } = useGridResizeHandle({ id, group, handle: "se" });

  return (
    <div ref={ref} style={style} className={`snapgrid-tile ${theme.accentClass}`}>
      <div className="snapgrid-tile__content">{content}</div>
      <button
        ref={resizeRef}
        type="button"
        aria-label={`Resize ${theme.title}`}
        className="tile-resize-handle tile-resize-handle-se"
        {...handleProps}
      />
    </div>
  );
}

// Reordering array management helper
function insertBefore(list: TileId[], id: TileId, beforeId: string): TileId[] {
  const without = list.filter((x) => x !== id);
  const i = isTileId(beforeId) ? without.indexOf(beforeId) : -1;
  return i < 0 ? [...without, id] : [...without.slice(0, i), id, ...without.slice(i)];
}