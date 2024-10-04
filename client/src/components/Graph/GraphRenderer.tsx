import NodeRenderer from "./NodeRenderer.tsx";
import EdgeRenderer from "./EdgeRenderer.tsx";
export default function GraphRenderer() {
  return (
    <>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          <EdgeRenderer />
          <NodeRenderer />
        </svg>
      </div>
    </>
  );
}
