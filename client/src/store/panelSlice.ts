import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { PanelState } from "../types/storeTypes";

const initialState: PanelState = {
    popUpPanelIsVisible: false,
    popUpPanelTriggeringNodeId: null,
    isPropertyPanel: false,
    xCoordinate: 0,
    yCoordinate: 0,
}
type openPanelType = {
    popUpPanelTriggeringNodeId: string | null,
    isPropertyPanel: boolean;
    xCoordinate: number;
    yCoordinate: number;
}
export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        openPanel: (state, action: PayloadAction<openPanelType>) => {
            return { ...state, ...action.payload, popUpPanelIsVisible: true };
        },
        closePanel: (state) => {
            state.popUpPanelIsVisible = false;
            state.popUpPanelTriggeringNodeId = null
        }
    }
})

export const { openPanel, closePanel } = sessionSlice.actions
export default sessionSlice.reducer