import React from "react";
import type { NodeState } from "../../types/storeTypes";

interface CircleProps {
  node: NodeState;
  radius?: number;
}

const Node: React.FC<CircleProps> = ({ node, radius = 50 }) => {
  return (
    <>
      {/* Circle */}
      <circle
        cx={node.xCoordinate}
        cy={node.yCoordinate}
        r={radius}
        fill="var(--bg-node)" /* Light purple fill */
        stroke="#eee"
        strokeWidth={1}
      />
      {/* Centered Text */}
      <text
        x={node.xCoordinate}
        y={node.yCoordinate}
        textAnchor="middle"
        dy=".3em" // Vertical center alignment
        fontSize="12px"
        fill="var(--font-primary)" /* Light cream/white text */
      >
        {node.name}
      </text>
    </>
  );
};

export default Node;
