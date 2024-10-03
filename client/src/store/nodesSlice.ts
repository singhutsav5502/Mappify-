import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { NodeState } from "../types/storeTypes";

type NodesInitialState = {
    nodes: NodeState[]
}
const initialState: NodesInitialState = { nodes: [] }
export const nodeSlice = createSlice({
    name: 'nodes',
    initialState,
    reducers: {
        addNode: (state, action: PayloadAction<NodeState>) => {
            state.nodes = [...state.nodes, action.payload]
        },
        removeNode: (state, action: PayloadAction<NodeState>) => {
            state.nodes = state.nodes.filter((node) => node._id !== action.payload._id)
        }
        // TODO: Add "remove node" function that converts node type to a draggable node that connects multiple edges
        //  should remove suggested nodes  +  name
        // set isIntermediate to true
    }
})

export const { addNode, removeNode } = nodeSlice.actions
export default nodeSlice.reducer