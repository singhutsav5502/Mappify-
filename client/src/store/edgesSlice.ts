import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { EdgeState } from "../types/storeTypes";
import { nodeSlice } from "./nodesSlice";

type EdgesInitialState = {
  edges: EdgeState[]
}
const dummyEdges : EdgeState[] = [
  // Edges for Forest 1
  {
    _id: "1",
    ends: ["1", "2"], // Connects Node 1 and Node 2
  },
  {
    _id: "2",
    ends: ["1", "3"], // Connects Node 1 and Node 3
  },
  {
    _id: "3",
    ends: ["2", "3"], // Connects Node 2 and Node 3
  },
  {
    _id: "4",
    ends: ["3", "4"], // Connects Node 3 and Node 4
  },
  {
    _id: "5",
    ends: ["2", "5"], // Connects Node 2 and Node 5
  },
  {
    _id: "6",
    ends: ["5", "6"], // Connects Node 5 and Node 6
  },
  {
    _id: "7",
    ends: ["6", "3"], // Connects Node 6 and Node 3
  },
  {
    _id: "8",
    ends: ["7", "8"], // Connects Node 7 and Node 8
  },

  // Edges for Forest 2
  {
    _id: "9",
    ends: ["9", "10"], // Connects Node 9 and Node 10
  },
  {
    _id: "10",
    ends: ["9", "11"], // Connects Node 9 and Node 11
  },
  {
    _id: "11",
    ends: ["10", "11"], // Connects Node 10 and Node 11
  },
  {
    _id: "12",
    ends: ["11", "12"], // Connects Node 11 and Node 12
  },
  {
    _id: "13",
    ends: ["10", "13"], // Connects Node 10 and Node 13
  },
  {
    _id: "14",
    ends: ["12", "14"], // Connects Node 12 and Node 14
  },
  {
    _id: "15",
    ends: ["14", "15"], // Connects Node 14 and Node 15
  },
  {
    _id: "16",
    ends: ["13", "16"], // Connects Node 13 and Node 16
  },

  // Edges for Forest 3
  {
    _id: "17",
    ends: ["17", "18"], // Connects Node 17 and Node 18
  },
  {
    _id: "18",
    ends: ["17", "19"], // Connects Node 17 and Node 19
  },
  {
    _id: "19",
    ends: ["18", "19"], // Connects Node 18 and Node 19
  },
  {
    _id: "20",
    ends: ["19", "20"], // Connects Node 19 and Node 20
  },
  {
    _id: "21",
    ends: ["20", "21"], // Connects Node 20 and Node 21
  },
  {
    _id: "22",
    ends: ["21", "22"], // Connects Node 21 and Node 22
  },
  {
    _id: "23",
    ends: ["22", "23"], // Connects Node 22 and Node 23
  },
  {
    _id: "24",
    ends: ["23", "24"], // Connects Node 23 and Node 24
  },
  {
    _id: "25",
    ends: ["19", "25"], // Connects Node 19 and Node 25
  },
];

const initialState: EdgesInitialState = { edges: dummyEdges }
export const edgeSlice = createSlice({
  name: 'edges',
  initialState,
  reducers: {
    addEdge: (state, action: PayloadAction<EdgeState>) => {
      const { ends } = action.payload;

      // Check if an edge with the same endpoints already exists
      const edgeExists = state.edges.some(
        (edge) =>
          (edge.ends[0] === ends[0] && edge.ends[1] === ends[1]) ||
          (edge.ends[0] === ends[1] && edge.ends[1] === ends[0]) 
      );

      // If no such edge exists, add the new edge
      if (!edgeExists) {
        state.edges = [...state.edges, action.payload];
      }
    },
    removeEdge: (state, action: PayloadAction<EdgeState | string>) => {
      if (typeof action.payload === 'string') {
        // If action.payload is a string, remove edges that involve the given nodeID
        state.edges = state.edges.filter((edge) => !edge.ends.includes(action.payload as string));
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