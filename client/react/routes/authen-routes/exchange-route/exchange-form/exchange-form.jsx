import React from "react";
import {KComponent} from "../../../../common/k-component";
import classnames from "classnames";
import {userInfo} from "../../../../../common/states/common";
import {Tooltip} from "../../../../common/tooltip/tooltip";
import {CommonInput} from "../../../../common/common-input/common-input";
import * as yup from "yup";
import {createSimpleForm} from "../../../../common/form-validator/form-validator";
import {userApi} from "../../../../../api/common/user-api";
import debounce from "lodash/debounce";

export class ExchangeForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            addressError: "",
            addressSuccess: "",
            addressChecking: false
        };
        this.exchangeSchema = yup.object().shape({
            to: yup.string().required("Wallet address is required"),
            kap: yup.string().test("validate-kap", "Amount exceeds current balance", this.validateKap),
            usd: yup.string().test("validate-usd", "Amount exceeds current balance", this.validateUsd),
        });
        this.form = createSimpleForm(this.exchangeSchema, {
            initData: {
                to: "",
                kap: "",
                usd: "",

            }
        });
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();
        }));
        this.form.validateData();
    };

    checkReceiverAddress = (address, isValid) => {
        if (isValid) {
            userApi.checkReceiverAddress({address, sender: this.props.wallet.address}).then((data) => {
                this.setState({
                    checking: false, success: {
                        message: "Valid address"
                    }
                })
            }).catch((err) => {
                this.setState({checking: false, err: err.extra})
            })
        }

    };

    debounceCheckReceiverAddress = debounce(this.checkReceiverAddress, 1500);

    handleChangeAddress = (e) => {
        let isValid = yup.reach(this.editSchema, "email").isValidSync(e.target.value);
        if (isValid) {
            this.setState({addressChecking: true});
        } else {
            this.setState({addressChecking: false});
        }

        this.debounceCheckReceiverAddress(e.target.value, isValid);

    };

    validateKap = (value) => {
        let {wallet} = this.props;
        return wallet.balance >= Number(value);
    };

    validateUsd = (value) => {
        let {wallet} = this.props;
        return wallet.balance >= Number(value) / 1000;
    };

    render() {
        let {wallet} = this.props;
        let {addressError, addressSuccess, addressChecking} = this.state;
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
                    {this.form.enhanceComponent("to", ({error, onChange, onEnter, ...others}) => (
                        <div className="send-wrap">

                            <CommonInput
                                className="pt-0 send-input"
                                error={error || addressError}
                                success={addressSuccess}
                                id={"to"}
                                type={"text"}
                                label={"To"}
                                placeholder={"Type or paste wallet address here"}
                                onChange={e => {

                                    this.setState({addressError: "", addressSuccess: ""});
                                    onChange(e);
                                    this.handleChangeAddress();
                                }}
                                {...others}
                            />
                            {addressChecking && (
                                <p className="checking">Checking...</p>
                            )}
                        </div>
                    ), true)}
                </div>
            </div>
        );
    }
}