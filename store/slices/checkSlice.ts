import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storesApi } from "../api";
import { LastCheck } from "../types";

type InfoState = {
    loading: boolean;
    error: null | string;
    check: LastCheck | null;
};

const initialState: InfoState = {
    error: null,
    loading: false,
    check: null,
};

export const fetchLastCheck = createAsyncThunk<LastCheck, number, { rejectValue: string }>(
    "lastcheck/fetchLastCheck",
    async (houseCardId, { rejectWithValue }) => {
        try {
            const res = await storesApi.getLastCheck(houseCardId);
            console.log(res, "чек");

            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }

            return res.data as LastCheck;
        } catch (error: any) {
            console.error(error);
            return rejectWithValue(`Ошибка: ${error?.message || error}`);
        }
    }
);

const checkSlice = createSlice({
    name: "check",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLastCheck.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLastCheck.fulfilled, (state, action) => {
                state.loading = false;
                state.check = action.payload;
            })
            .addCase(fetchLastCheck.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default checkSlice.reducer;
