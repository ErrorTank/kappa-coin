import {authenApi, offlineApi} from "../api";
import {appInstances} from "../../common/instance";

export const exchangeApi = {
    checkReceiverAddress(payload){
        return authenApi.post(`/exchange/check-address`, payload)
    },
    createPendingTransaction(payload){
        let walletSocket = appInstances.getInstance("walletSocket");
        console.log(walletSocket.id)
        return authenApi.post(`/exchange/create-transaction?socketID=${encodeURIComponent(walletSocket.id)}`, payload)
    }
}
