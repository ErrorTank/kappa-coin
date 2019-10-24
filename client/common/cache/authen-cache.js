
import {Cache} from "./cache"
import Cookies from "js-cookie";
import {userInfo, walletInfo} from "../states/common";
import {userApi} from "../../api/common/user-api";
import {appInstances} from "../instance";
import io from "socket.io-client";

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
      let walletSocket = appInstances.getInstance("walletSocket");
      walletSocket.disconnect();
    },
    loadAuthen() {
      return new Promise((resolve, reject) => {
        let authen = cache.get("k-authen-token");
        if (!authen) {
          reject();
        } else {
          userApi.getInfo().then(({user, wallet}) => {

            if (!user){

              reject();
            }

            else {
              let walletSocket = appInstances.setInstance("walletSocket", io( document.location.origin + "/pending-transaction"));

              walletSocket.on("connect", () => {

                walletSocket.on("update-wallet", wallet => {
                  walletInfo.setState(wallet);
                });
                walletSocket.on("update-wallet-individuals", (addresses) => {
                  if(addresses.includes(walletInfo.getState().address)){
                    userApi.getWalletInfo(userInfo.getState()._id).then((wallet) => {

                      walletInfo.setState(wallet);
                    })
                  }

                });
              });
              return resolve(Promise.all([userInfo.setState(user), walletInfo.setState(wallet)]));

            }

          }).catch(err => {

            reject()
          });

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
