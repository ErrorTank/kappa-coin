import {authenApi, offlineApi} from "../api";

export const chainApi = {
    checkReceiverAddress(payload){
        return authenApi.post(`/exchange/check-address`, payload)
    },

}
