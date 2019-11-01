import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";
import {walletInfo} from "../../common/states/common";

export const transactionApi = {
    getPendingTransactions(config){
        let {skip, take, filter, sort} = config;
        let {key, value} = sort || {};
        let {keyword} = filter || {};
        const params = {
            skip,
            take,
            sortKey: key,
            sortValue: value,
            keyword: keyword || null
        };
        return offlineApi.get(`/transactions/pending${urlUtils.buildParams(params)}`)
    },
    getValidTransactions(){
        return offlineApi.get(`/transactions/pending/valid`)
    },
    getTransactionDetails(txnID){
        return offlineApi.get(`/transaction/${txnID}/details`)
    },
    getUserTransactions(config){
        let {skip, take, filter, sort} = config;
        let {key, value} = sort || {};
        let {keyword} = filter || {};
        const params = {
            skip,
            take,
            sortKey: key,
            sortValue: value,
            keyword: keyword || null
        };
        return authenApi.get(`/transactions/wallet/${walletInfo.getState().address}${urlUtils.buildParams(params)}`)
    }
};
