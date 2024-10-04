import React, { useState, useCallback } from "react";
import { useAppDispatch } from "../../hooks/storeHooks";
import { updateNode } from "../../store/nodesSlice";
import type { NodeState } from "../../types/storeTypes";

interface CircleProps {
  node: NodeState;
  radius?: number;
}

const Node: React.FC<CircleProps> = ({ node, radius = 50 }) => {
  const dispatch = useAppDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [initialCoords, setInitialCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Mouse down event to start dragging
  const handleMouseDown = (event: React.MouseEvent<SVGCircleElement>) => {
    // Only start dragging if the left mouse button is pressed
    if (event.button === 0) {
      setIsDragging(true);
      setInitialCoords({
        x: event.clientX - node.xCoordinate,
        y: event.clientY - node.yCoordinate,
      });
    }
  };

  // Mouse move event to update node position
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = event.clientX - initialCoords.x;
      const newY = event.clientY - initialCoords.y;

      // Dispatch the updated node with new coordinates
      dispatch(updateNode({ ...node, xCoordinate: newX, yCoordinate: newY }));
    },
    [isDragging, initialCoords, node, dispatch]
  );

  // Mouse up event to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add and remove mouse move and up events
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  return (
    <>
      {/* Node/ Circle */}
      <circle
        cx={node.xCoordinate}
        cy={node.yCoordinate}
        r={radius}
        fill="var(--bg-node)" // Light purple fill
        stroke="var(--stroke-node)"
        strokeWidth={1}
        onMouseDown={handleMouseDown} // Trigger dragging on mouse down
        style={{ cursor: "grab" }} // Change cursor to indicate dragging
      />
      {/* Centered Text */}
      <text
        x={node.xCoordinate}
        y={node.yCoordinate}
        textAnchor="middle"
        dy=".3em" // Vertical center alignment
        fontSize="12px"
        fill="var(--font-primary)" // Light cream/white text
      >
        {node.name}
      </text>
    </>
  );
};

export default Node;
