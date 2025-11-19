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

// export const fetchLastCheck = createAsyncThunk<LastCheck, number, { rejectValue: string }>(
//     "lastcheck/fetchLastCheck",
//     async (houseCardId, { rejectWithValue }) => {
//         try {
//             console.log("🔍 fetchLastCheck - houseCardId:", houseCardId, "type:", typeof houseCardId);
//             const res = await storesApi.getLastCheck(houseCardId);
//             console.log("✅ fetchLastCheck response:", res.data);

//             if (res.status !== 200) {
//                 return rejectWithValue(`Ошибка сервера: ${res.status}`);
//             }

//             return res.data as LastCheck;
//         } catch (error: any) {
//             console.error("❌ fetchLastCheck error:", error);
//             return rejectWithValue(`Ошибка: ${error?.message || error}`);
//         }
//     }
// );

export const fetchLastCheck = createAsyncThunk<LastCheck, number, { rejectValue: string }>(
    "lastcheck/fetchLastCheck",
    async (houseCardId, { rejectWithValue }) => {
        try {
            console.log("🔍 fetchLastCheck - houseCardId:", houseCardId);

            const res = await storesApi.getLastCheck(houseCardId);
            console.log("✅ fetchLastCheck response:", res.data);

            return res.data as LastCheck;
        } catch (error: any) {
            console.error("❌ fetchLastCheck error details:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                params: error.config?.params,
            });

            if (error.response?.status === 404) {
                const errorDetail = error.response?.data?.detail;
                return rejectWithValue(errorDetail || `Лицевой счет ${houseCardId} не найден`);
            }

            return rejectWithValue(error.response?.data?.detail || error.message);
        }
    }
);

export const updateCheckPhoto = createAsyncThunk(
    "check/updateCheckPhoto",
    async ({ id, formData }: { id: number; formData: FormData }, { rejectWithValue }) => {
        try {
            const res = await storesApi.updatePhoto(id, formData);
            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }
            return await res.data;
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
            })

            .addCase(updateCheckPhoto.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCheckPhoto.fulfilled, (state, action) => {
                state.loading = false;
                state.check = action.payload;
            })
            .addCase(updateCheckPhoto.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default checkSlice.reducer;
