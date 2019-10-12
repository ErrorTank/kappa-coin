import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";

export const transactionApi = {
    getPendingTransactions(config){
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
        return authenApi.get(`/transactions/pending${urlUtils.buildParams(params)}`)
    },

};
