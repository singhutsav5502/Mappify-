import { useAppSelector } from "../../hooks/storeHooks";
import Edge from "./Edge";
export default function EdgeRenderer() {
  const edges = useAppSelector((state) => state.edges.edges);
  return (
    <>
      {edges.map((edge) => (
        <Edge key={edge._id} edge={edge} />
      ))}
    </>
  );
}
