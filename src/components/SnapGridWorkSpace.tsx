"use client";

import {
  type Layout,
  useContainerWidth,
  useGridContainer,
  useGridItem,
  useGridPlaceholder,
  useGridResizeHandle,
} from "@snapgridjs/react";
import { type ReactNode, useEffect, useState } from "react";
import LedgerTable from "./LedgerTable";
import TickerLogs from "./TickerLogs";
import VaultView from "./VaultView";

// Responsive grid profiles and breakpoints
export const BREAKPOINTS = { lg: 1200, md: 768, sm: 480 };

export const GRID_PROFILES = {
  lg: { cols: 6, rowHeight: 60 },
  md: { cols: 4, rowHeight: 55 },
  sm: { cols: 2, rowHeight: 50 },
};

const GAP = 16; 

export type TileId = "ledger" | "vault" | "logs";

type TileTheme = {
  title: string;
  accentClass: string;
  render: () => ReactNode;
};

export const TILE_DEFS: Record<TileId, TileTheme> = {
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

interface SnapGridWorkspaceProps {
  grid: Layout;
  setGrid: (next: Layout) => void;
}

export default function SortableGridExample({ grid, setGrid }: SnapGridWorkspaceProps) {
  const breakpoint = useBreakpoint();
  const currentGridConfig = GRID_PROFILES[breakpoint];

  return (
    <Body 
      grid={grid} 
      setGrid={setGrid} 
      gridConfig={currentGridConfig} 
      breakpoint={breakpoint} 
    />
  );
}

function Body({
  grid,
  setGrid,
  gridConfig,
  breakpoint,
}: {
  grid: Layout;
  setGrid: (next: Layout) => void;
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

  const placeholder = useGridPlaceholder(group);

  return (
    <div 
      style={{ 
        display: "flex",
        gap: GAP,
        alignItems: "stretch",
        width: "100%",
        padding: "16px",
        boxSizing: "border-box"
      }}
    >
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
