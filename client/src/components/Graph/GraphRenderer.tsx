import Nodes from "./Nodes.tsx";
import Edges from "./Edges.tsx";
export default function GraphRenderer() {
  return (
    <>
      <svg>
        <Nodes />
        <Edges />
      </svg>
    </>
  );
}
