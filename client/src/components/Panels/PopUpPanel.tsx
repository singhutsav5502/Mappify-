import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/storeHooks";
import {
  updateNode,
  removeNode,
  addNodeByValAndCoord,
} from "../../store/nodesSlice";
import styles from "../../styles/PopUpPanel.module.css";
import { addEdge } from "../../store/edgesSlice";
import { generateEdgeId, generateNodeId } from "../../utils/generators";
import { closePanel } from "../../store/panelSlice";
import { getSvgCoords } from "../../utils/coords";

type popUpPanelProps = {
  svgRef: React.RefObject<SVGSVGElement>;
};
const PopUpPanel = ({ svgRef }: popUpPanelProps) => {
  const dispatch = useAppDispatch();

  const {
    popUpPanelTriggeringNodeId,
    xCoordinate,
    yCoordinate,
    isPropertyPanel,
  } = useAppSelector((state) => state.panels);
  const triggeringNodeId = popUpPanelTriggeringNodeId;
  const triggeringNode = useAppSelector((state) => state.nodes.nodes).find(
    (node) => node._id === triggeringNodeId
  );
  const suggestedConnections = triggeringNode?.suggestedNodes;

  const [newNodeValue, setNewNodeValue] = useState(
    isPropertyPanel ? triggeringNode?.name : ""
  );
  const [isExpanded, setIsExpanded] = useState(false);

  // State for panel dragging
  const [isDragging, setIsDragging] = useState(false);
  const [panelPos, setPanelPos] = useState({ x: xCoordinate, y: yCoordinate });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle panel dragging
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button === 0) {
      setIsDragging(true);
      setDragStart({
        x: event.clientX - panelPos.x,
        y: event.clientY - panelPos.y,
      });
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      const newX = event.clientX - dragStart.x;
      const newY = event.clientY - dragStart.y;
      setPanelPos({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Attach and detach event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const handleAddNode = (value: string) => {
    const newNodeId = generateNodeId();
    const transformedCoords = getSvgCoords(panelPos.x, panelPos.y, svgRef);
    dispatch(
      addNodeByValAndCoord({
        _id: newNodeId,
        name: value,
        xCoordinate: transformedCoords.x,
        yCoordinate: transformedCoords.y,
      })
    );
    if (triggeringNodeId)
      dispatch(
        addEdge({ _id: generateEdgeId(), ends: [triggeringNodeId, newNodeId] })
      );
    setNewNodeValue(""); // Clear the input after dispatch
    dispatch(closePanel());
  };

  const handleDeleteNode = () => {
    if (triggeringNode) {
      dispatch(removeNode(triggeringNode));
    }
    dispatch(closePanel());
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && newNodeValue) {
      if (isPropertyPanel && triggeringNode)
        dispatch(updateNode({ ...triggeringNode, name: newNodeValue }));
      else handleAddNode(newNodeValue);
    }
  };

  return (
    <div
      className={styles.panel}
      style={{ top: panelPos.y, left: panelPos.x }}
      onMouseDown={handleMouseDown}
    >
      <div className={styles.header}>
        {isPropertyPanel ? <span>Properties</span> : <span>Add new Node</span>}
        <div
          className={styles.redCircle}
          onClick={() => {
            dispatch(closePanel());
          }}
        ></div>
      </div>

      {!isPropertyPanel ? (
        <input
          type="text"
          placeholder={"Add new node..."}
          value={newNodeValue}
          onChange={(e) => setNewNodeValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />
      ) : (
        <input
          type="text"
          placeholder={"Edit node value..."}
          value={newNodeValue}
          onChange={(e) => setNewNodeValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />
      )}

      <div className={styles.suggestedConnections}>
        <span>Suggested Connections</span>
        <ul
          className={styles.connectionList}
          style={{
            maxHeight: isExpanded ? "200px" : "100px",
            overflowY: "auto",
          }}
        >
          {suggestedConnections?.map((connection, index) => (
            <li
              key={index}
              className={styles.connectionItem}
              onClick={() => handleAddNode(connection)}
            >
              {connection}
            </li>
          ))}
        </ul>
      </div>

      {!isPropertyPanel ? (
        <button
          className={styles.expandButton}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      ) : (
        <button className={styles.deleteButton} onClick={handleDeleteNode}>
          Delete
        </button>
      )}
    </div>
  );
};

export default PopUpPanel;
