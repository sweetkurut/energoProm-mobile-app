import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storesApi } from "../api";
import {
    PaymentHistory,
    PaymentHistoryParams,
    PaymentPreviewResponse,
    PaymentResponse,
    PaymentState,
} from "../types";

const initialState: PaymentState = {
    error: null,
    loading: false,
    paymentMethods: [],
    requisite: "",
    payments: [],
    sum: "",
    preview: {
        loading: false,
        error: null,
        previewData: null,
    },
};

// Создание платежа и получение методов оплаты - ТЕПЕРЬ С checkId
export const createPayment = createAsyncThunk<
    PaymentResponse,
    { checkId: number; requisite: string; sum: string },
    { rejectValue: string }
>("payment/createPayment", async ({ checkId, requisite, sum }, { rejectWithValue }) => {
    try {
        console.log("💰 createPayment - checkId:", checkId, "requisite:", requisite, "sum:", sum);

        const res = await storesApi.createPayment(checkId, requisite, sum);
        console.log("✅ createPayment response:", res.data);

        if (res.status !== 200 && res.status !== 201) {
            return rejectWithValue(`Ошибка сервера: ${res.status}`);
        }

        return res.data as PaymentResponse;
    } catch (error: any) {
        console.error("❌ createPayment error:", error);
        return rejectWithValue(`Ошибка: ${error?.message || error}`);
    }
});

// Предпросмотр платежа - ТЕПЕРЬ С checkId
export const previewPayment = createAsyncThunk<
    PaymentPreviewResponse,
    { checkId: number; requisite: string; sum: string },
    { rejectValue: string }
>("payment/previewPayment", async ({ checkId, requisite, sum }, { rejectWithValue }) => {
    try {
        console.log("👀 previewPayment - checkId:", checkId, "requisite:", requisite, "sum:", sum);

        const res = await storesApi.previewPayment(checkId, requisite, sum);
        console.log("✅ previewPayment response:", res.data);

        if (res.status !== 200) {
            return rejectWithValue(`Ошибка сервера: ${res.status}`);
        }

        return res.data as PaymentPreviewResponse;
    } catch (error: any) {
        console.error("❌ previewPayment error:", error);
        return rejectWithValue(`Ошибка: ${error?.message || error}`);
    }
});

// Получение PDF чека - ТЕПЕРЬ С checkId
export const fetchPaymentPdf = createAsyncThunk<any, number, { rejectValue: string }>(
    "payment/fetchPaymentPdf",
    async (checkId, { rejectWithValue }) => {
        try {
            console.log("📄 fetchPaymentPdf - checkId:", checkId);

            const res = await storesApi.getPaymentPdf(checkId);
            console.log("✅ fetchPaymentPdf response:", res.data);

            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }

            return res.data;
        } catch (error: any) {
            console.error("❌ fetchPaymentPdf error:", error);
            return rejectWithValue(`Ошибка: ${error?.message || error}`);
        }
    }
);

// Получение истории платежей - остается без изменений
export const fetchPaymentsHistory = createAsyncThunk<
    PaymentHistory[],
    PaymentHistoryParams,
    { rejectValue: string }
>("payment/fetchPaymentsHistory", async ({ checkId, userId }, { rejectWithValue }) => {
    try {
        console.log("📊 fetchPaymentsHistory - houseCardId:", checkId, "userId:", userId);

        const res = await storesApi.getPaymentsHistory(checkId, userId);
        console.log("✅ fetchPaymentsHistory response:", res.data);

        if (res.status !== 200) {
            return rejectWithValue(`Ошибка сервера: ${res.status}`);
        }

        return res.data;
    } catch (error: any) {
        console.error("❌ fetchPaymentsHistory error:", error);
        return rejectWithValue(`Ошибка: ${error?.message || error}`);
    }
});

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        clearPaymentError: (state) => {
            state.error = null;
            state.preview.error = null;
        },
        clearPaymentMethods: (state) => {
            state.paymentMethods = [];
            state.requisite = "";
            state.sum = "";
        },
        clearPreviewData: (state) => {
            state.preview.previewData = null;
            state.preview.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // createPayment
            .addCase(createPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentMethods = action.payload.urls;
                state.requisite = action.payload.requisite;
                state.sum = action.payload.sum;
            })
            .addCase(createPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // previewPayment
            .addCase(previewPayment.pending, (state) => {
                state.preview.loading = true;
                state.preview.error = null;
            })
            .addCase(previewPayment.fulfilled, (state, action) => {
                state.preview.loading = false;
                state.preview.previewData = action.payload;
            })
            .addCase(previewPayment.rejected, (state, action) => {
                state.preview.loading = false;
                state.preview.error = action.payload as string;
            })

            // fetchPaymentPdf
            .addCase(fetchPaymentPdf.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaymentPdf.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchPaymentPdf.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // fetchPaymentsHistory
            .addCase(fetchPaymentsHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaymentsHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload;
            })
            .addCase(fetchPaymentsHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearPaymentError, clearPaymentMethods, clearPreviewData } = paymentSlice.actions;
export default paymentSlice.reducer;
