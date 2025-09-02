import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storesApi } from "../api";
import { Bid, BidDetail } from "../types";

type InfoState = {
    loading: boolean;
    error: null | string;
    bids: Bid[] | null;
    bid: BidDetail | null;
};

const initialState: InfoState = {
    error: null,
    loading: false,
    bids: null,
    bid: null,
};

export const fetchBids = createAsyncThunk<Bid[], void, { rejectValue: string }>(
    "bids/fetchBids",
    async (_, { rejectWithValue }) => {
        try {
            const res = await storesApi.getListBids();
            console.log(res, "услуги");

            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }

            return res.data as Bid[];
        } catch (error: any) {
            console.error(error);
            return rejectWithValue(`Ошибка: ${error?.message || error}`);
        }
    }
);

export const fetchBid = createAsyncThunk<Bid, number, { rejectValue: string }>(
    "bids/fetchBid",
    async (id, { rejectWithValue }) => {
        try {
            const res = await storesApi.getDetailBid(id);
            console.log(res, "услуга");

            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }

            return res.data as Bid;
        } catch (error: any) {
            console.error(error);
            return rejectWithValue(`Ошибка: ${error?.message || error}`);
        }
    }
);

const bidSlice = createSlice({
    name: "bids",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBids.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBids.fulfilled, (state, action) => {
                state.loading = false;
                state.bids = action.payload;
            })
            .addCase(fetchBids.rejected, (state) => {
                state.loading = false;
            })
            .addCase(fetchBid.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBid.fulfilled, (state, action) => {
                state.loading = false;
                state.bid = action.payload;
            })
            .addCase(fetchBid.rejected, (state) => {
                state.loading = false;
            })
    },
});

export default bidSlice.reducer;
