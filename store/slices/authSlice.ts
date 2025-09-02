import { removeTokens, saveTokens } from "@/utils/auth";
import { handleApiError } from "@/utils/validation";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { storesApi } from "../api";
import {
    ILoginData,
    ILoginResponse,
    IResetPassword,
    ISetPassword,
    ISignUpEmail,
    IVerifyCode,
} from "../types";

type InfoState = {
    loading: boolean;
    error: null | string;
    login: ILoginResponse | null;
};

const initialState: InfoState = {
    error: null,
    loading: false,
    login: null,
};

export const fetchLogin = createAsyncThunk(
    "auth/fetchLogin",
    async (data: ILoginData, { rejectWithValue }) => {
        try {
            const res = await storesApi.login(data);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, "Ошибка при авторизации"));
        }
    }
);

export const fetchRefreshToken = createAsyncThunk(
    "auth/fetchRefreshToken",
    async (refreshToken: string, { rejectWithValue }) => {
        try {
            const res = await storesApi.refreshToken(refreshToken);
            if (res.data && res.data.access && res.data.refresh) {
                await saveTokens(res.data.access, res.data.refresh);
            }
            return res.data;
        } catch (error: any) {
            await removeTokens();
            return rejectWithValue(handleApiError(error, "Ошибка при обновлении токена"));
        }
    }
);

export const fetchSignUp = createAsyncThunk(
    "auth/fetchSignUp",
    async (data: ISignUpEmail, { rejectWithValue }) => {
        try {
            const res = await storesApi.signUp(data);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, "Ошибка при регистрации"));
        }
    }
);

export const fetchVerifyCode = createAsyncThunk(
    "auth/fetchVerifyCode",
    async (data: IVerifyCode, { rejectWithValue }) => {
        try {
            const res = await storesApi.verifyCode(data);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, "Ошибка при проверке кода"));
        }
    }
);

export const fetchSetPassword = createAsyncThunk(
    "auth/fetchSetPassword",
    async (data: ISetPassword, { rejectWithValue }) => {
        try {
            const res = await storesApi.setPassword(data);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, "Ошибка при установке пароля"));
        }
    }
);

export const fetchResetPassword = createAsyncThunk(
    "auth/fetchResetPassword",
    async (data: IResetPassword, { rejectWithValue }) => {
        try {
            const res = await storesApi.resetPassword(data);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, "Ошибка при сбросе пароля"));
        }
    }
);

export const fetchForgotPassword = createAsyncThunk(
    "auth/fetchForgotPassword",
    async (data: ISignUpEmail, { rejectWithValue }) => {
        try {
            const res = await storesApi.forgotPassword(data);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, "Ошибка при сбросе пароля"));
        }
    }
);
const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.login = null;
            state.loading = false;
            state.error = null;
            removeTokens();
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLogin.fulfilled, (state, action) => {
                state.login = action.payload;
                state.loading = false;
                saveTokens(action.payload.access, action.payload.refresh);
            })
            .addCase(fetchLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchRefreshToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRefreshToken.fulfilled, (state, action) => {
                state.login = action.payload;
                state.loading = false;
                saveTokens(action.payload.access, action.payload.refresh);
            })
            .addCase(fetchRefreshToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.login = null;
                removeTokens();
            })

            .addCase(fetchSignUp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSignUp.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(fetchSignUp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? String(action.payload) : "Ошибка при регистрации";
            })

            .addCase(fetchVerifyCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVerifyCode.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(fetchVerifyCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? String(action.payload) : "Ошибка при проверке кода";
            })

            .addCase(fetchSetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.login = {
                    id: action.payload.id || 0,
                    email: action.payload.user || "",
                    access: action.payload.access,
                    refresh: action.payload.refresh,
                };
            })
            .addCase(fetchSetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? String(action.payload) : "Ошибка при установке пароля";
            })

            .addCase(fetchForgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchForgotPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchForgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
                    ? String(action.payload)
                    : "Ошибка при отправке кода восстановления";
            })

            .addCase(fetchResetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchResetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchResetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? String(action.payload) : "Ошибка при сбросе пароля";
            });
    },
});

export const { logout, setError } = AuthSlice.actions;

export default AuthSlice.reducer;
