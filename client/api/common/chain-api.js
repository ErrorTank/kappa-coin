import {authenApi, offlineApi} from "../api";
import {appInstances} from "../../common/instance";

export const chainApi = {
    getBlockchainOverview(){
        return offlineApi.get(`/chain/overview`)
    },
    addNewBlock(payload){
        let walletSocket = appInstances.getInstance("walletSocket");
        return authenApi.post(`/chain/new-block?socketID=${encodeURIComponent(walletSocket.id)}`, payload)
    }
};
