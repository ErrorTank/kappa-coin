
import {authenApi, offlineApi} from "../api";

export const userApi = {
    getInfo() {
        return authenApi.get("/auth");
    },
    login(info){
        return offlineApi.post("/login", info);

    }
};
