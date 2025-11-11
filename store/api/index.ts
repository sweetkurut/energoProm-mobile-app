import { setupInterceptors } from "@/utils/interceptors";
import axios from "axios";
import {
    ILoginData,
    IProfileUpdate,
    IProfileUpdatePassword,
    IResetPassword,
    ISetPassword,
    ISignUpEmail,
    IVerifyCode,
} from "../types";

const instance = axios.create({
    baseURL: "https://flagman-backend.com.kg/api/",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false,
});

setupInterceptors(instance);

export const storesApi = {
    login(data: ILoginData) {
        return instance.post(`/users/signin/`, data);
    },
    signUp(data: ISignUpEmail) {
        return instance.post(`/users/signup/`, data);
    },
    verifyCode(data: IVerifyCode) {
        return instance.patch(`/users/verify-email/`, data);
    },
    setPassword(data: ISetPassword) {
        return instance.patch(`/users/set-password/`, data);
    },

    forgotPassword(data: ISignUpEmail) {
        return instance.post(`/users/forgot-password/`, data);
    },
    resetPassword(data: IResetPassword) {
        return instance.post(`/users/reset-password/`, data);
    },
    refreshToken: (refreshToken: string) => {
        return instance.post("/users/token/refresh/", {
            refresh: refreshToken,
        });
    },
    getProfile() {
        return instance.get(`/users/profile/`);
    },
    updateProfile(data: IProfileUpdate | { email: string }) {
        return instance.patch(`/users/profile/`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    updateNewEmail(data: { code: string }) {
        return instance.post(`/users/confirm-new-email/`, data);
    },

    updateProfilePassword(data: IProfileUpdatePassword) {
        return instance.put(`/users/change-password/`, data);
    },

    deleteProfile() {
        return instance.delete(`/users/profile/`);
    },

    // housecard
    getListHouseCards() {
        return instance.get("house-card/house-card-user-list/");
    },

    getDetailHouseCard(id: number) {
        return instance.get(`house-card/house-cards/${id}/`);
    },

    addHouseCard(data: HouseCardCreate) {
        return instance.post("house-card/create/", data);
    },

    deleteHouseCard(id: number) {
        return instance.delete(`house-card/edit/${id}/`);
    },

    // чеки
    getLastCheck(houseCardId: number) {
        return instance.get("check/last-check/", {
            params: {
                house_card: houseCardId,
            },
        });
    }, 

    // графики
    getGraphicChecks(houseCardId: number) {
        return instance.get("check/graphic-checks/", {
            params: {
                house_card: houseCardId,
            },
        });
    },

    updatePhoto(id: number, formData: FormData) {
        return instance.patch(`check/${id}/update-photo/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    // список заявок
    getListDeals() {
        return instance.get("bid/deal/");
    },

    getDetailDeal(id: number) {
        return instance.get(`bid/deal/${id}/`);
    },

    addDeal(data: any) {
        return instance.post("bid/deal/", data);
    },

    deleteDeal(id: number) {
        return instance.delete(`bid/deal/${id}/`);
    },

    //  список услуг bid
    getListBids() {
        return instance.get("bid/bid/");
    },
    getDetailBid(id: number) {
        return instance.get(`bid/bid/${id}/`);
    },
};
