import { store } from "../store/store"

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// export type nodeID = number;

export type NodeState = {
    _id: string,
    name: string,
    suggestedNodes: string[],
    xCoordinate: number,
    yCoordinate: number,
    isIntermediate: boolean
}
export type NodeValueAndCoordinates = {
    _id: string,
    name: string,
    xCoordinate: number,
    yCoordinate: number,
}
// export type edgeID = number;
export type EdgeState = {
    _id: string,
    ends: [string, string]
}

export type SessionState = {
    _id?: string | null,
    username?: string | null,
    token?: string | null
}

export type PanelState = {
    popUpPanelTriggeringNodeId: string | null,
    popUpPanelIsVisible: boolean,
    isPropertyPanel: boolean;
    xCoordinate: number;
    yCoordinate: number;
}