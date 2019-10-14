import {authenApi, offlineApi} from "../api";

export const chainApi = {
    getBlockchainOverview(){
        return offlineApi.get(`/chain/overview`)
    },
    addNewBlock(payload){
        return authenApi.post(`/chain/new-block`, payload)
    }
};
