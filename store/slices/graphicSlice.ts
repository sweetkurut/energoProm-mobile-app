import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storesApi } from "../api";
import { GraphicData } from "../types";

type InfoState = {
    // detail: HouseCardDetail | null;
    loading: boolean;
    error: null | string;
    graphic: GraphicData | null;
};

const initialState: InfoState = {
    error: null,
    loading: false,
    graphic: null,
    // detail: null,
};

// export const fetchGraphic = createAsyncThunk<GraphicData, number, { rejectValue: string }>(
//     "graphic/fetchGraphic",
//     async (houseCardId, { rejectWithValue }) => {
//         try {
//             const res = await storesApi.getGraphicChecks(houseCardId);
//             console.log(res, "график");

//             if (res.status !== 200) {
//                 return rejectWithValue(`Ошибка сервера: ${res.status}`);
//             }

//             return res.data as GraphicData;
//         } catch (error: any) {
//             console.error(error);
//             return rejectWithValue(`Ошибка: ${error?.message || error}`);
//         }
//     }
// );

export const fetchGraphic = createAsyncThunk<GraphicData, number, { rejectValue: string }>(
    "graphic/fetchGraphic",
    async (houseCardId, { rejectWithValue }) => {
        try {
            console.log("🔍 fetchGraphic - houseCardId:", houseCardId, "type:", typeof houseCardId);
            const res = await storesApi.getGraphicChecks(houseCardId);
            console.log("✅ fetchGraphic response:", res.data);

            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }

            return res.data as GraphicData;
        } catch (error: any) {
            console.error("❌ fetchGraphic error:", error);
            return rejectWithValue(`Ошибка: ${error?.message || error}`);
        }
    }
);

const graphicSlice = createSlice({
    name: "graphic",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGraphic.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGraphic.fulfilled, (state, action) => {
                state.loading = false;
                state.graphic = action.payload;
            })
            .addCase(fetchGraphic.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default graphicSlice.reducer;
