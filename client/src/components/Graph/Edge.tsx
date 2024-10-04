import { useAppSelector } from "../../hooks/storeHooks";
import { EdgeState } from "../../types/storeTypes";

interface EdgeProps {
  edge: EdgeState;
}
const Edge: React.FC<EdgeProps> = ({ edge }) => {
  //   const dispatch = useAppDispatch();
  const nodes = useAppSelector((state) => state.nodes.nodes);
  const endOne = nodes.find((node) => node._id === edge.ends[0]);
  const endTwo = nodes.find((node) => node._id === edge.ends[1]);
  return (
    <line
      key={edge._id}
      x1={endOne?.xCoordinate}
      y1={endOne?.yCoordinate}
      x2={endTwo?.xCoordinate}
      y2={endTwo?.yCoordinate}
      stroke="var(--bg-edge)"
      strokeWidth={5}
    />
  );
};

export default Edge;
