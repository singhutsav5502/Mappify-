import React, { useCallback, useEffect, useRef, useState } from "react";
import NodeRenderer from "./NodeRenderer";
import EdgeRenderer from "./EdgeRenderer";
import PopUpPanel from "../Panels/PopUpPanel";
import { useAppSelector } from "../../hooks/storeHooks";
export default function GraphRenderer() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  // Local states for offset and zoom
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1); // Default zoom level
  const popUpPanelDetails = useAppSelector((state) => state.panels);
  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Mouse wheel zooming
  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      const zoomFactor = 0.001;
      const newZoom = Math.max(0.1, zoom - event.deltaY * zoomFactor); // Inverted zoom direction

      setZoom(newZoom);
    },
    [zoom]
  );

  // Mouse down event for panning
  const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
    // Start panning if the middle mouse button is pressed
    if (event.button === 1) {
      const startPan = { x: event.clientX, y: event.clientY };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - startPan.x;
        const dy = moveEvent.clientY - startPan.y;
        setOffset({ x: offset.x - dx, y: offset.y - dy });
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      event.preventDefault(); // Prevent default behavior for the middle mouse button
    }
  };

  // Add event listeners
  useEffect(() => {
    const options = { passive: false }; // Set passive to false for the wheel event
    window.addEventListener("wheel", handleWheel, options);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  // Functions to handle button clicks for zoom
  const zoomIn = () => setZoom(Math.min(zoom + 0.01, 2)); // Set a max zoom level
  const zoomOut = () => setZoom(Math.max(zoom - 0.01, 0.1)); // Prevent zooming out too much

  // Calculate the new viewBox based on the current zoom level and offsets
  const viewBoxWidth = viewportWidth / zoom;
  const viewBoxHeight = viewportHeight / zoom;

  return (
    <div style={{ position: "relative", height: "100%" }}>
      {popUpPanelDetails.popUpPanelIsVisible && <PopUpPanel svgRef={svgRef} />}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        style={{
          backgroundColor: "var(--bg-primary)",
          height: "auto !important",
        }}
        onMouseDown={handleMouseDown}
        viewBox={`${offset.x} ${offset.y} ${viewBoxWidth} ${viewBoxHeight}`} // Set viewBox based on pan and zoom
        ref={svgRef}
      >
        <EdgeRenderer />
        <NodeRenderer svgRef={svgRef} />
      </svg>
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          backgroundColor: "var(--bg-primary)",
          borderRadius: "5px",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          zIndex: 10, // Make sure it is on top of the SVG
        }}
      >
        <button
          onClick={zoomIn}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "var(--font-primary)",
            cursor: "pointer",
            fontSize: "18px",
            marginBottom: "5px",
          }}
        >
          +
        </button>
        <button
          onClick={zoomOut}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "var(--font-primary)",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          -
        </button>
      </div>
    </div>
  );
}
