import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {MainLayout} from "../../../layout/main-layout/main-layout";
import {userApi} from "../../../../api/common/user-api";
import {userInfo, walletInfo} from "../../../../common/states/common";
import {formatMoney} from "../../../../common/utils/common";
import {ExchangeForm} from "./exchange-form/exchange-form";
import {CommonInput} from "../../../common/common-input/common-input";
import {KComponent} from "../../../common/k-component";
import {customHistory} from "../../routes";

export default class ExchangeRoute extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            wallet: null,
            loading: true,

        };

        this.onUnmount(walletInfo.onChange((newState, oldState) => {

            console.log(newState)
            this.setState({wallet: newState});


        })) ;
        userApi.getWalletInfo(userInfo.getState()._id).then((wallet) => this.setState({wallet, loading: false}))
    };

    render() {
        let {loading, wallet, } = this.state;
        return (
            <PageTitle
                title={"Exchange Cryptocurrency"}
            >
                <MainLayout>
                    <div className="exchange-route">
                        <div className="container">

                            <div className="big-wrapper">
                                <p className="route-title">Exchange Cryptocurrency</p>
                                {!loading && (
                                    <>
                                        <div className="top-overview">
                                            <div className="balance-overview">
                                                <span className="label">Total Balance</span>
                                                <div className="text-right value-wrap d-inline-block">
                                                    <span className="value">{formatMoney(wallet.balance, 2)} <span>KAP</span></span>
                                                    <span className="separate">=</span>
                                                    <span className="value">{formatMoney(wallet.balance * process.env.USD_RATE, 2)} <span>USD</span></span>
                                                </div>

                                            </div>
                                            <div/>
                                            <div className="balance-overview">
                                                <span className="label">Pending Spent</span>
                                                <div className="text-right value-wrap d-inline-block">
                                                    <span className="value">{formatMoney(wallet.pendingSpent, 2)} <span>KAP</span></span>
                                                    <span className="separate">=</span>
                                                    <span className="value">{formatMoney(wallet.pendingSpent * process.env.USD_RATE, 2)} <span>USD</span></span>
                                                </div>


                                            </div>
                                        </div>
                                        <p className="clearfix"></p>
                                        <div className="main-content ">
                                            <ExchangeForm
                                                wallet={wallet}
                                            />

                                        </div>
                                    </>
                                )}

                            </div>
                        </div>
                    </div>
                </MainLayout>
            </PageTitle>
        );
    }
}