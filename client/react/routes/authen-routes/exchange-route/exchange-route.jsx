import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {MainLayout} from "../../../layout/main-layout/main-layout";
import {userApi} from "../../../../api/common/user-api";
import {userInfo} from "../../../../common/states/common";
import {formatMoney} from "../../../../common/utils/common";
import {ExchangeForm} from "./exchange-form/exchange-form";
import {CommonInput} from "../../../common/common-input/common-input";

export default class ExchangeRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wallet: null,
            loading: true,

        };

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
                                        <div className="balance-overview">
                                            <span className="label">Total Balance</span>
                                            <span className="value">{formatMoney(wallet.balance)} <span>KAP</span></span>
                                            <span className="separate">=</span>
                                            <span className="value">{formatMoney(wallet.balance * process.env.USD_RATE)} <span>USD</span></span>
                                        </div>
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