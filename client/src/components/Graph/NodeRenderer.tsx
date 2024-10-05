import React from "react";
import { useAppSelector } from "../../hooks/storeHooks";
import Node from "./Node";

interface NodeRendererProps {
  svgRef: React.RefObject<SVGSVGElement>;
}

export default function NodeRenderer({ svgRef }: NodeRendererProps) {
  // Type your selector using the shape of your Redux state
  const nodes = useAppSelector((state) => state.nodes.nodes);

  return (
    <>
      {nodes.map((node) => (
        <Node key={node._id} node={node} svgRef={svgRef} />
      ))}
    </>
  );
}
