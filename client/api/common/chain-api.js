import {authenApi, offlineApi} from "../api";

export const chainApi = {
    getBlockchainOverview(){
        return offlineApi.get(`/chain/overview`)
    },

};
