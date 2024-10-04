import { useAppSelector } from "../../hooks/storeHooks";
import Node from "./Node";
export default function NodeRenderer() {
  const nodes = useAppSelector((state) => state.nodes.nodes);
  return (
    <>
      {nodes.map((node) => (
        <Node key={node._id} node={node} />
      ))}
    </>
  );
}
