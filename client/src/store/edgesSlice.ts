import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { EdgeState } from "../types/storeTypes";
import { nodeSlice } from "./nodesSlice";

type EdgesInitialState = {
    edges: EdgeState[]
}
const initialState: EdgesInitialState = { edges: [] }
export const edgeSlice = createSlice({
    name: 'edges',
    initialState,
    reducers: {
        addEdge: (state, action: PayloadAction<EdgeState>) => {
            state.edges = [...state.edges, action.payload]
        },
        removeEdge: (state, action: PayloadAction<EdgeState | number>) => {
            if (typeof action.payload === 'number') {
                // If action.payload is a number, remove edges that involve the given nodeID
                state.edges = state.edges.filter((edge) => !edge.ends.includes(action.payload as number));
            } else {
                // If action.payload is an EdgeState, remove the edge by its _id
                state.edges = state.edges.filter((edge) => edge._id !== (action.payload as EdgeState)._id);
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(nodeSlice.actions.removeNode, (state, action) => {
            state.edges = state.edges.filter((edge) => !edge.ends.includes(action.payload._id));
        })
    }
})

export const { addEdge, removeEdge } = edgeSlice.actions
export default edgeSlice.reducer