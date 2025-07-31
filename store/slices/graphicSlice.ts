import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storesApi } from "../api";
import { Graphic } from "../types";

type InfoState = {
    // detail: HouseCardDetail | null;
    loading: boolean;
    error: null | string;
    graphic: Graphic[] | null;
};

const initialState: InfoState = {
    error: null,
    loading: false,
    graphic: null,
    // detail: null,
};

export const fetchGraphic = createAsyncThunk<Graphic[], number, { rejectValue: string }>(
    "graphic/fetchGraphic",
    async (houseCardId, { rejectWithValue }) => {
        try {
            const res = await storesApi.getGraphicChecks(houseCardId);
            console.log(res, "график");

            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }

            return res.data as Graphic[];
        } catch (error: any) {
            console.error(error);
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
