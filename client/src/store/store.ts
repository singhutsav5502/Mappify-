import { configureStore } from "@reduxjs/toolkit";
import nodesReducer from "./nodesSlice"
import edgesReducer from "./edgesSlice"
import sessionReducer from "./sessionSlice"
import panelsReducer from "./panelSlice"

export const store = configureStore({
    reducer: {
        nodes: nodesReducer,
        edges: edgesReducer,
        session: sessionReducer,
        panels: panelsReducer,
    }
})
