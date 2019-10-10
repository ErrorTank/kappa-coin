import {authenApi, offlineApi} from "../api";

export const exchangeApi = {
    checkReceiverAddress(payload){
        return authenApi.post(`/exchange/check-address`, payload)
    }
}
