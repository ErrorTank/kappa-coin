import React from "react";
import {KComponent} from "../../../../common/k-component";
import classnames from "classnames";
import {userInfo} from "../../../../../common/states/common";
import {Tooltip} from "../../../../common/tooltip/tooltip";

export class ExchangeForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        let {wallet} = this.props;
        return (
            <div className="exchange-form">
                <div className="form-header">
                    <i className="fas fa-paper-plane"></i>
                    Send Kappacoin
                </div>
                <div className="form-body">
                    <div className="fr">
                        <div className={classnames("common-input value-present")}>
                            <label>Currency</label>
                            <Tooltip
                                text={() => <span>USD rate: x1000</span>}
                                className={"usd-rate-tooltip"}
                            >
                                <div className="value">
                                    <img src={"./assets/image/kappa.png"}/>
                                    <p className="coin-name">KappaCoin</p>
                                </div>
                            </Tooltip>
                        </div>
                        <div className="separate"/>
                        <div className={classnames("common-input value-present")}>
                            <label>From <i className="fas fa-wallet"></i></label>
                            <div className="value">
                                <div className="link">
                                    <p>{userInfo.getState().fullname} wallet</p>
                                    <p className="address">{wallet.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}