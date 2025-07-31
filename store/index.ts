import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./slices/authSlice";
import CheckSlice from "./slices/checkSlice";
import GraphicSlice from "./slices/graphicSlice";
import HouceCardSlice from "./slices/housecardSlice";
import ProfileSlice from "./slices/profileSlice";

export const store = configureStore({
    reducer: {
        auth: AuthSlice,
        profile: ProfileSlice,
        house: HouceCardSlice,
        check: CheckSlice,
        graphic: GraphicSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    devTools: false,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
