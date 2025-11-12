import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storesApi } from "../api";
import { PaymentPreviewResponse, PaymentResponse, PaymentState } from "../types";

const initialState: PaymentState = {
    error: null,
    loading: false,
    paymentMethods: [],
    requisite: "",
    sum: "",
    preview: {
        loading: false,
        error: null,
        previewData: null,
    },
};

// Создание платежа и получение методов оплаты
export const createPayment = createAsyncThunk<
    PaymentResponse,
    { houseCardId: number; requisite: string; sum: string },
    { rejectValue: string }
>("payment/createPayment", async ({ houseCardId, requisite, sum }, { rejectWithValue }) => {
    try {
        console.log("💰 createPayment - houseCardId:", houseCardId, "requisite:", requisite, "sum:", sum);

        const res = await storesApi.createPayment(houseCardId, requisite, sum);
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

// Предпросмотр платежа - ТЕПЕРЬ С ПРАВИЛЬНЫМИ ТИПАМИ
export const previewPayment = createAsyncThunk<
    PaymentPreviewResponse,
    { houseCardId: number; requisite: string; sum: string },
    { rejectValue: string }
>("payment/previewPayment", async ({ houseCardId, requisite, sum }, { rejectWithValue }) => {
    try {
        console.log("👀 previewPayment - houseCardId:", houseCardId, "requisite:", requisite, "sum:", sum);

        const res = await storesApi.previewPayment(houseCardId, requisite, sum);
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

// Получение PDF чека
export const fetchPaymentPdf = createAsyncThunk<any, number, { rejectValue: string }>(
    "payment/fetchPaymentPdf",
    async (houseCardId, { rejectWithValue }) => {
        try {
            console.log("📄 fetchPaymentPdf - houseCardId:", houseCardId);

            const res = await storesApi.getPaymentPdf(houseCardId);
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

// Получение истории платежей
export const fetchPaymentsHistory = createAsyncThunk<any[], number, { rejectValue: string }>(
    "payment/fetchPaymentsHistory",
    async (houseCardId, { rejectWithValue }) => {
        try {
            console.log("📊 fetchPaymentsHistory - houseCardId:", houseCardId);

            const res = await storesApi.getPaymentsHistory(houseCardId);
            console.log("✅ fetchPaymentsHistory response:", res.data);

            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }

            return res.data;
        } catch (error: any) {
            console.error("❌ fetchPaymentsHistory error:", error);
            return rejectWithValue(`Ошибка: ${error?.message || error}`);
        }
    }
);

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
            .addCase(fetchPaymentsHistory.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchPaymentsHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearPaymentError, clearPaymentMethods, clearPreviewData } = paymentSlice.actions;
export default paymentSlice.reducer;
