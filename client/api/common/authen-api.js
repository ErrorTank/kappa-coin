
import {authenApi, offlineApi} from "../api";

export const authenticationApi = {
    getInfo() {
        return authenApi.get("/auth");
    },
    login(info){
        return offlineApi.post("/login", info);

    }
};
