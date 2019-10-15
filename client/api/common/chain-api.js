import {authenApi, offlineApi} from "../api";
import {appInstances} from "../../common/instance";
import {urlUtils} from "../../common/utils/url-utils";

export const chainApi = {
    getBlockchainOverview(){
        return offlineApi.get(`/chain/overview`)
    },
    addNewBlock(payload){
        let walletSocket = appInstances.getInstance("walletSocket");
        return authenApi.post(`/chain/new-block?socketID=${encodeURIComponent(walletSocket.id)}`, payload)
    },
    getBlocks(config){
        let {skip, take, filter, sort} = config;
        let {key, value} = sort || {};
        let {keyword} = filter;
        const params = {
            skip,
            take,
            sortKey: key,
            sortValue: value,
            keyword: keyword || null
        };
        return offlineApi.get(`/blocks${urlUtils.buildParams(params)}`)
    }
};
