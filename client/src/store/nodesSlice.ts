import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { NodeState, NodeValueAndCoordinates } from "../types/storeTypes";

type NodesInitialState = {
  nodes: NodeState[]
}

const dummyNodes: NodeState[] = [
  // Forest 1
  {
    _id: "1",
    name: "Node 1",
    suggestedNodes: [],
    xCoordinate: 200, // Spaced from the left
    yCoordinate: 250,
    isIntermediate: false,
  },
  {
    _id: "2",
    name: "Node 2",
    suggestedNodes: [],
    xCoordinate: 400, // Increased space
    yCoordinate: 250,
    isIntermediate: false,
  },
  {
    _id: "3",
    name: "Node 3",
    suggestedNodes: [],
    xCoordinate: 300, // Increased space
    yCoordinate: 450,
    isIntermediate: false,
  },
  {
    _id: "4",
    name: "Node 4",
    suggestedNodes: [],
    xCoordinate: 500, // Increased space
    yCoordinate: 500,
    isIntermediate: true,
  },
  {
    _id: "5",
    name: "Node 5",
    suggestedNodes: [],
    xCoordinate: 250, // Increased space
    yCoordinate: 350,
    isIntermediate: false,
  },
  {
    _id: "6",
    name: "Node 6",
    suggestedNodes: [],
    xCoordinate: 450, // Increased space
    yCoordinate: 350,
    isIntermediate: false,
  },
  {
    _id: "7",
    name: "Node 7",
    suggestedNodes: [],
    xCoordinate: 600, // Increased space
    yCoordinate: 200,
    isIntermediate: false,
  },
  {
    _id: "8",
    name: "Node 8",
    suggestedNodes: [],
    xCoordinate: 200, // Increased space
    yCoordinate: 600,
    isIntermediate: true,
  },

  // Forest 2
  {
    _id: "9",
    name: "Node 9",
    suggestedNodes: [],
    xCoordinate: 1000, // Far away from Forest 1
    yCoordinate: 250,
    isIntermediate: false,
  },
  {
    _id: "10",
    name: "Node 10",
    suggestedNodes: [],
    xCoordinate: 1200, // Increased space
    yCoordinate: 250,
    isIntermediate: false,
  },
  {
    _id: "11",
    name: "Node 11",
    suggestedNodes: [],
    xCoordinate: 1100, // Increased space
    yCoordinate: 450,
    isIntermediate: false,
  },
  {
    _id: "12",
    name: "Node 12",
    suggestedNodes: [],
    xCoordinate: 1300, // Increased space
    yCoordinate: 500,
    isIntermediate: true,
  },
  {
    _id: "13",
    name: "Node 13",
    suggestedNodes: [],
    xCoordinate: 1000, // Increased space
    yCoordinate: 400,
    isIntermediate: false,
  },
  {
    _id: "14",
    name: "Node 14",
    suggestedNodes: [],
    xCoordinate: 1150, // Increased space
    yCoordinate: 350,
    isIntermediate: false,
  },
  {
    _id: "15",
    name: "Node 15",
    suggestedNodes: [],
    xCoordinate: 1200, // Increased space
    yCoordinate: 200,
    isIntermediate: false,
  },
  {
    _id: "16",
    name: "Node 16",
    suggestedNodes: [],
    xCoordinate: 1350, // Increased space
    yCoordinate: 450,
    isIntermediate: true,
  },

  // Forest 3
  {
    _id: "17",
    name: "Node 17",
    suggestedNodes: [],
    xCoordinate: 1600, // Far away from Forest 2
    yCoordinate: 250,
    isIntermediate: false,
  },
  {
    _id: "18",
    name: "Node 18",
    suggestedNodes: [],
    xCoordinate: 1800, // Increased space
    yCoordinate: 250,
    isIntermediate: false,
  },
  {
    _id: "19",
    name: "Node 19",
    suggestedNodes: [],
    xCoordinate: 1700, // Increased space
    yCoordinate: 450,
    isIntermediate: false,
  },
  {
    _id: "20",
    name: "Node 20",
    suggestedNodes: [],
    xCoordinate: 1900, // Increased space
    yCoordinate: 500,
    isIntermediate: true,
  },
  {
    _id: "21",
    name: "Node 21",
    suggestedNodes: [],
    xCoordinate: 1650, // Increased space
    yCoordinate: 350,
    isIntermediate: false,
  },
  {
    _id: "22",
    name: "Node 22",
    suggestedNodes: [],
    xCoordinate: 1725, // Increased space
    yCoordinate: 400,
    isIntermediate: false,
  },
  {
    _id: "23",
    name: "Node 23",
    suggestedNodes: [],
    xCoordinate: 1775, // Increased space
    yCoordinate: 200,
    isIntermediate: false,
  },
  {
    _id: "24",
    name: "Node 24",
    suggestedNodes: [],
    xCoordinate: 1850, // Increased space
    yCoordinate: 450,
    isIntermediate: true,
  },
  {
    _id: "25",
    name: "Node 25",
    suggestedNodes: ["jeadkajd" , "dajkldaldkj"],
    xCoordinate: 1925, // Increased space
    yCoordinate: 250,
    isIntermediate: false,
  },
];

const initialState: NodesInitialState = { nodes: dummyNodes }
export const nodeSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<NodeState>) => {
      state.nodes = [...state.nodes, action.payload]
    },
    addNodeByValAndCoord: (state, action: PayloadAction<NodeValueAndCoordinates>)=>{
      const suggestions: string[] = []
      const newNode: NodeState = { ...action.payload, isIntermediate: false, suggestedNodes: suggestions }
      state.nodes = [...state.nodes, newNode]
    },
    removeNode: (state, action: PayloadAction<NodeState>) => {
      state.nodes = state.nodes.filter((node) => node._id !== action.payload._id)
    },
    updateNode: (state, action: PayloadAction<NodeState>) => {
      state.nodes = state.nodes.map((node) =>
        node._id === action.payload._id ? action.payload : node
      );
    }
    // TODO: Add "remove node" function that converts node type to a draggable node that connects multiple edges
    //  should remove suggested nodes  +  name
    // set isIntermediate to true
  }
})

export const { addNode, removeNode, updateNode, addNodeByValAndCoord } = nodeSlice.actions
export default nodeSlice.reducer