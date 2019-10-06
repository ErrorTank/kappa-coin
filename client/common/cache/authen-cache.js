
import {Cache} from "./cache"
import Cookies from "js-cookie";
import {userInfo} from "../states/common";
import {userApi} from "../../api/common/user-api";

const cookiesEngine = {
  getItem: Cookies.get,
  setItem: Cookies.set,
  removeItem: Cookies.remove
};


export const authenCache = (() => {
  const cache = new Cache(cookiesEngine);
  return {
    clearAuthen() {

      cache.set(null, "k-authen-token");
    },
    loadAuthen() {
      return new Promise((resolve, reject) => {
        let authen = cache.get("k-authen-token");
        if (!authen) {
          reject();
        } else {
          userApi.getInfo().then((data) => {
            if (!data)
              reject();
            else {
              return resolve(userInfo.setState(data));

            }

          }).catch(err => reject());

        }
      });

    },
    getAuthen() {
      return cache.get("k-authen-token")
    },
    setAuthen(authen, options) {

      cache.set(authen, "k-authen-token", options);
    }
  }
})();
