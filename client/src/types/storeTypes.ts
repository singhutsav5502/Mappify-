import { store } from "../store/store"

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// export type nodeID = number;

export type NodeState = {
    _id: number,
    name: string,
    suggestedNodes: NodeState[],
    xCoordinate: number,
    yCoordinate: number,
    isIntermediate: boolean
}

// export type edgeID = number;
export type EdgeState = {
    _id: number,
    ends: [number, number]
}

export type SessionState ={
    _id?: string|null,
    username?: string|null,
    token?: string|null
}