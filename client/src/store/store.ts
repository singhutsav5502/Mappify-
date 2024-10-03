import { configureStore } from "@reduxjs/toolkit";
import nodesReducer from "./nodesSlice"
import edgesReducer from "./edgesSlice"
import sessionReducer from "./sessionSlice"
export const store = configureStore({
    reducer: {
        nodes: nodesReducer,
        edges: edgesReducer,
        session: sessionReducer
    }
})
