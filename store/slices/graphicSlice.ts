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

// export const fetchGraphic = createAsyncThunk<GraphicData, number | string, { rejectValue: string }>(
//     "graphic/fetchGraphic",
//     async (houseCardId, { rejectWithValue }) => {
//         try {
//             console.log("🔍 fetchGraphic - houseCardId:", houseCardId, "type:", typeof houseCardId);
//             const res = await storesApi.getGraphicChecks(houseCardId);
//             console.log("✅ fetchGraphic response:", res.data);

//             if (res.status !== 200) {
//                 return rejectWithValue(`Ошибка сервера: ${res.status}`);
//             }

//             return res.data as GraphicData;
//         } catch (error: any) {
//             console.error("❌ fetchGraphic error:", error);
//             return rejectWithValue(`Ошибка: ${error?.message || error}`);
//         }
//     }
// );

export const fetchGraphic = createAsyncThunk<GraphicData, number | string, { rejectValue: string }>(
    "graphic/fetchGraphic",
    async (houseCardId, { rejectWithValue }) => {
        try {
            const numericId = Number(houseCardId);
            console.log("🔍 fetchGraphic - houseCardId:", numericId, "type:", typeof numericId);

            const res = await storesApi.getGraphicChecks(numericId);
            console.log("✅ fetchGraphic response status:", res.status);
            console.log("✅ fetchGraphic response data:", res.data);
            console.log("✅ fetchGraphic request URL:", res.config.url);
            console.log("✅ fetchGraphic request params:", res.config.params);

            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }

            return res.data as GraphicData;
        } catch (error: any) {
            console.error("❌ fetchGraphic error:", error);
            console.error("❌ fetchGraphic error response:", error.response?.data);
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
                console.log("✅ Graphic data saved to Redux:", {
                    house_card_id: action.meta.arg,
                    data_received: action.payload,
                    points_count: action.payload.graphic_evaluate?.length,
                });
            })
            .addCase(fetchGraphic.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default graphicSlice.reducer;
