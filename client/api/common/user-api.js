
import {authenApi, offlineApi} from "../api";

export const userApi = {
    getInfo() {
        return authenApi.get("/auth");
    },
    login(info){
        return offlineApi.post("/login", info);

    },
    getWalletInfo(userID){
        return authenApi.get(`/user/${userID}/wallet`);
    },
    getDetailUserInfo(userID){
        return authenApi.get(`/user/${userID}/detail`)
    },
    checkEmailExisted(payload){
        return authenApi.put(`/user/${payload.userID}/check-email/${payload.email}`)
    },
    updateUser(userID, payload){
        return authenApi.post(`/user/${userID}/update`, payload)
    }
};
