import {apiFactory} from "./api-factory/api-config";



const authenApiConfig = {
    hostURL: `${document.location.origin}/api`,


};

const offlineApiConfig = {
    hostURL: `${document.location.origin}/api`
};


export const authenApi = apiFactory.createApi(authenApiConfig);

export const offlineApi = apiFactory.createApi(offlineApiConfig);

