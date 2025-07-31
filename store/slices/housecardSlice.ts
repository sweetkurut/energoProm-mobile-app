import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storesApi } from "../api";
import type { HouseCard, HouseCardDetail } from "../types";
// import { storesApi } from "@/api";

type InfoState = {
    detail: HouseCardDetail | null;
    loading: boolean;
    error: null | string;
    house: HouseCard[] | null;
};

const initialState: InfoState = {
    error: null,
    loading: false,
    house: null,
    detail: null,
};

// гет запрос
export const fetchHouseCard = createAsyncThunk<HouseCard[], void, { rejectValue: string }>(
    "housecard/fetchHouseCard",
    async (_, { rejectWithValue }) => {
        try {
            const res = await storesApi.getListHouseCards();
            console.log("====================================");
            console.log(res);
            console.log("====================================");
            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }
            return res.data as HouseCard[];
        } catch (error: unknown) {
            console.error(error);
            return rejectWithValue(`Ошибка: ${error}`);
        }
    }
);

// дательная страница
export const fetchDetailHouse = createAsyncThunk<HouseCardDetail, number, { rejectValue: string }>(
    "housecard/fetchDetailHouse",
    async (id, { rejectWithValue }) => {
        try {
            const res = await storesApi.getDetailHouseCard(id);
            console.log(res, "Детальная информация");
            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }
            return res.data as HouseCardDetail;
        } catch (error: unknown) {
            console.error(error);
            return rejectWithValue(`Ошибка: ${error}`);
        }
    }
);

// удаление
export const removeHouseCard = createAsyncThunk<void, number, { rejectValue: string }>(
    "housecard/removeHouseCard",
    async (id, { rejectWithValue }) => {
        try {
            const res = await storesApi.deleteHouseCard(id);
            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }
            // return id;
        } catch (error: unknown) {
            console.error(error);
            return rejectWithValue(`Ошибка: ${error}`);
        }
    }
);

const HouceCardSlice = createSlice({
    name: "house",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHouseCard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHouseCard.fulfilled, (state, action) => {
                state.loading = false;
                state.house = action.payload;
            })
            .addCase(fetchHouseCard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка";
            })
            .addCase(removeHouseCard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeHouseCard.fulfilled, (state) => {
                state.loading = false;
            })

            .addCase(removeHouseCard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка";
            })
            .addCase(fetchDetailHouse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка";
            })
            .addCase(fetchDetailHouse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDetailHouse.fulfilled, (state, action) => {
                state.loading = false;
                state.detail = action.payload;
            });
    },
});

export default HouceCardSlice.reducer;
