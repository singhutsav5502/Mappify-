import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/storeHooks";
import {
  updateNode,
  removeNode,
  addNodeByValAndCoord,
} from "../../store/nodesSlice";
import styles from "../../styles/PopUpPanel.module.css";

type PopUpPanelProps = {
  triggeringNodeId: string;
  isPropertyPanel: boolean;
  xCoordinate: number;
  yCoordinate: number;
};
const PopUpPanel = ({
  triggeringNodeId,
  isPropertyPanel,
  xCoordinate,
  yCoordinate,
}: PopUpPanelProps) => {
  const dispatch = useAppDispatch();

  const triggeringNode = useAppSelector((state) => state.nodes.nodes).find(
    (node) => node._id === triggeringNodeId
  );
  const suggestedConnections = triggeringNode?.suggestedNodes;

  const [newNodeValue, setNewNodeValue] = useState(
    isPropertyPanel ? triggeringNode?.name : ""
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddNode = (value: string) => {
    dispatch(addNodeByValAndCoord({ name: value, xCoordinate, yCoordinate }));
    setNewNodeValue(""); // Clear the input after dispatch
  };

  const handleDeleteNode = () => {
    if (triggeringNode) {
      dispatch(removeNode(triggeringNode));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && newNodeValue) {
      if (isPropertyPanel && triggeringNode)
        dispatch(
          updateNode({ ...triggeringNode, name: newNodeValue })
        );
      else handleAddNode(newNodeValue);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        {isPropertyPanel ? <span>Properties</span> : <span>Add new Node</span>}
        <div className={styles.redCircle}></div>
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
