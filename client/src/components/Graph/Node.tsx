import React, { useState, useCallback } from "react";
import { useAppDispatch } from "../../hooks/storeHooks";
import { generateEdgeId } from "../../utils/generators";
import { updateNode } from "../../store/nodesSlice";
import type { EdgeState, NodeState } from "../../types/storeTypes";
import { addEdge } from "../../store/edgesSlice";
import { closePanel, openPanel } from "../../store/panelSlice";
import { getScreenCoords, getSvgCoords } from "../../utils/coords";
interface CircleProps {
  node: NodeState;
  radius?: number;
  svgRef: React.RefObject<SVGSVGElement>; // Pass a reference to the SVG element
}

const Node: React.FC<CircleProps> = ({ node, radius = 50, svgRef }) => {
  const dispatch = useAppDispatch();
  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const [isDraggingEdge, setIsDraggingEdge] = useState(false);
  const [initialCoords, setInitialCoords] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [currentMousePos, setCurrentMousePos] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [newEdgeID, setNewEdgeID] = useState<string | null>(null); // State for prospective newEdgeID


  // Mouse down event to start dragging a node or creating an edge
  const handleMouseDown = (event: React.MouseEvent<SVGCircleElement>) => {
    if (event.button === 0) {
      if (event.shiftKey) {
        // Start dragging an edge if Shift key is held
        setIsDraggingEdge(true);
        setNewEdgeID(generateEdgeId()); // Generate prospective newEdgeID
        const svgCoords = getSvgCoords(event.clientX, event.clientY, svgRef);
        setCurrentMousePos({ x: svgCoords.x, y: svgCoords.y });
      } else {
        // Start dragging the node
        setIsDraggingNode(true);
        setInitialCoords({
          x: event.clientX - node.xCoordinate,
          y: event.clientY - node.yCoordinate,
        });
      }
    }
  };

  // Mouse move event to update node position or draw edge
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isDraggingNode) {
        const newX = event.clientX - initialCoords.x;
        const newY = event.clientY - initialCoords.y;

        // Dispatch the updated node with new coordinates
        dispatch(updateNode({ ...node, xCoordinate: newX, yCoordinate: newY }));
      } else if (isDraggingEdge) {
        const svgCoords = getSvgCoords(event.clientX, event.clientY, svgRef);
        setCurrentMousePos({ x: svgCoords.x, y: svgCoords.y });
      }
    },
    [isDraggingNode, isDraggingEdge, initialCoords, node, dispatch]
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      if (isDraggingNode) {
        setIsDraggingNode(false);
      } else if (isDraggingEdge) {
        setIsDraggingEdge(false);

        const elements = document.elementsFromPoint(
          event.clientX,
          event.clientY
        );
        const topElement = elements.find(
          (el) => el.tagName.toLowerCase() === "circle"
        );
        // Check if the top element is another node
        if (topElement && topElement.tagName === "circle") {
          const targetNodeId = topElement.getAttribute("data-node-id");
          if (targetNodeId && newEdgeID !== null) {
            // Create an edge between nodes using the prospective newEdgeID
            dispatch(
              addEdge({
                _id: newEdgeID, // Use the same prospective newEdgeID
                ends: [node._id, targetNodeId],
              } as EdgeState)
            );
          }
        } else {
          // Open panel to create a new node if no valid node is found
          const screenSpaceCoords = getScreenCoords(currentMousePos.x , currentMousePos.y, svgRef)
          openNewNodePanel(screenSpaceCoords.x, screenSpaceCoords.y, false);
        }
        setNewEdgeID(null); // Reset newEdgeID after use
      }
    },
    [isDraggingNode, isDraggingEdge, node, dispatch, newEdgeID]
  );

  // Function to open panel for creating a new node
  const openNewNodePanel = (x: number, y: number, isPropertyPanel: boolean) => {
    dispatch(closePanel())
    dispatch(
      openPanel({
        popUpPanelTriggeringNodeId: node._id,
        isPropertyPanel,
        xCoordinate: x,
        yCoordinate: y,
      })
    );
  };

  // Add and remove mouse move and up events
  React.useEffect(() => {
    if (isDraggingNode || isDraggingEdge) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingNode, isDraggingEdge, handleMouseMove, handleMouseUp]);

  // Handle right-click (context menu) to open the property panel
  const handleContextMenu = (event: React.MouseEvent<SVGCircleElement>) => {
    event.preventDefault(); // Prevent default browser context menu
    openNewNodePanel(event.clientX, event.clientY, true); // Open property panel
  };
  return (
    <>
      {/* Node / Circle */}
      <circle
        cx={node.xCoordinate}
        cy={node.yCoordinate}
        r={radius}
        fill="var(--bg-node)"
        stroke="var(--stroke-node)"
        strokeWidth={1}
        onMouseDown={handleMouseDown} // Trigger dragging or edge creation on mouse down
        onContextMenu={handleContextMenu} // panel
        style={{ cursor: isDraggingEdge ? "crosshair" : "grab" }}
        data-node-id={node._id}
      />
      {/* Centered Text */}
      <text
        x={node.xCoordinate}
        y={node.yCoordinate}
        textAnchor="middle"
        dy=".3em"
        fontSize="12px"
        fill="var(--font-primary)"
        style={{ userSelect: "none" }}
      >
        {node.name}
      </text>
      {/* Edge line while dragging */}
      {isDraggingEdge && newEdgeID !== null && (
        <line
          x1={node.xCoordinate}
          y1={node.yCoordinate}
          x2={currentMousePos.x}
          y2={currentMousePos.y}
          stroke="var(--bg-edge)"
          strokeWidth={5}
        />
      )}
    </>
  );
};

export default Node;
