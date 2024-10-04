import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { NodeState } from "../types/storeTypes";

type NodesInitialState = {
    nodes: NodeState[]
}
const dummyNodes: NodeState[] = [
    {
      _id: 1,
      name: "Node 1",
      suggestedNodes: [],
      xCoordinate: 100,
      yCoordinate: 150,
      isIntermediate: false
    },
    {
      _id: 2,
      name: "Node 2",
      suggestedNodes: [],
      xCoordinate: 300,
      yCoordinate: 150,
      isIntermediate: false
    },
    {
      _id: 3,
      name: "Node 3",
      suggestedNodes: [],
      xCoordinate: 200,
      yCoordinate: 300,
      isIntermediate: false
    },
    {
      _id: 4,
      name: "Node 4",
      suggestedNodes: [],
      xCoordinate: 400,
      yCoordinate: 350,
      isIntermediate: true
    }
  ];
const initialState: NodesInitialState = { nodes: dummyNodes }
export const nodeSlice = createSlice({
    name: 'nodes',
    initialState,
    reducers: {
        addNode: (state, action: PayloadAction<NodeState>) => {
            state.nodes = [...state.nodes, action.payload]
        },
        removeNode: (state, action: PayloadAction<NodeState>) => {
            state.nodes = state.nodes.filter((node) => node._id !== action.payload._id)
        },
        // TODO: Add "remove node" function that converts node type to a draggable node that connects multiple edges
        //  should remove suggested nodes  +  name
        // set isIntermediate to true
    }
})

export const { addNode, removeNode } = nodeSlice.actions
export default nodeSlice.reducer