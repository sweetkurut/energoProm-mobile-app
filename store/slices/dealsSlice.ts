import { handleApiError } from "@/utils/validation";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storesApi } from "../api";
import { CreateDeal, Deal, DealDetail } from "../types";

type InfoState = {
    loading: boolean;
    error: null | string;
    deals: Deal[] | null;
    deal: DealDetail | null;
};

const initialState: InfoState = {
    error: null,
    loading: false,
    deals: null,
    deal: null,
};

export const fetchDeals = createAsyncThunk<Deal[], void, { rejectValue: string }>(
    "deals/fetchDeals",
    async (_, { rejectWithValue }) => {
        try {
            const res = await storesApi.getListDeals();
            console.log(res, "заявки");

            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }

            return res.data as Deal[];
        } catch (error: any) {
            console.error(error);
            return rejectWithValue(`Ошибка: ${error?.message || error}`);
        }
    }
);

export const fetchDetailDeal = createAsyncThunk<DealDetail, number, { rejectValue: string }>(
    "deal/fetchDetailDeal",
    async (id, { rejectWithValue }) => {
        try {
            const res = await storesApi.getDetailDeal(id);
            console.log(res, "заявка по ID");

            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }

            return res.data as DealDetail;
        } catch (error: any) {
            console.error(error);
            return rejectWithValue(`Ошибка: ${error?.message || error}`);
        }
    }
);

export const createDeal = createAsyncThunk(
    "deal/createDeal",
    async (data: CreateDeal, { rejectWithValue }) => {
        try {
            const res = await storesApi.addDeal(data);
            console.log(res, "создание заявки");
            return res.data;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, "Ошибка при регистрации"));
        }
    }
);

export const deleteDeal = createAsyncThunk("deal/deleteDeal", async (id: number, { rejectWithValue }) => {
    try {
        const res = await storesApi.deleteDeal(id);
        console.log(res, "удаление заявки");
        return id;
    } catch (error: any) {
        return rejectWithValue(handleApiError(error, "Ошибка при удалении"));
    }
});

const dealsSlice = createSlice({
    name: "deals",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDeals.fulfilled, (state, action) => {
                state.loading = false;
                state.deals = action.payload;
            })
            .addCase(fetchDeals.rejected, (state) => {
                state.loading = false;
            })

            .addCase(fetchDetailDeal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDetailDeal.fulfilled, (state, action) => {
                state.loading = false;
                state.deal = action.payload;
            })
            .addCase(fetchDetailDeal.rejected, (state) => {
                state.loading = false;
            })

            .addCase(deleteDeal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDeal.fulfilled, (state, action) => {
                state.loading = false;
                // action.payload - это ID, который мы вернули из asyncThunk
                // Фильтруем массив, чтобы удалить элемент
                if (state.deals) {
                    state.deals = state.deals.filter((deal) => deal.id !== action.payload);
                }
            })
            .addCase(deleteDeal.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default dealsSlice.reducer;
