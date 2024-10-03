import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SessionState } from "../types/storeTypes";

const initialState: SessionState = {}
export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setSessionID: (state, action: PayloadAction<string>) => {
            state._id = action.payload
        },
        setUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload
        },
        clearSessionID: (state,) => {
            state._id = null
        },
        clearUsername: (state,) => {
            state.username = null
        },
        clearToken: (state,) => {
            state.token = null
        }
    }
})

export const { setSessionID, setUsername, setToken, clearSessionID, clearUsername, clearToken } = sessionSlice.actions
export default sessionSlice.reducer