import React from "react";
import {KComponent} from "../../../../common/k-component";
import classnames from "classnames";
import {userInfo} from "../../../../../common/states/common";
import {Tooltip} from "../../../../common/tooltip/tooltip";
import {CommonInput} from "../../../../common/common-input/common-input";
import * as yup from "yup";
import {createSimpleForm} from "../../../../common/form-validator/form-validator";
import debounce from "lodash/debounce";
import {exchangeApi} from "../../../../../api/common/exchange-api";
import {generatePair} from "../../../../../common/crypto";
import {getMoneyValueAsText} from "../../../../../common/utils/common";

export class ExchangeForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            addressError: "",
            addressSuccess: "",
            addressChecking: false,
            receiverInfo: null
        };
        this.exchangeSchema = yup.object().shape({
            to: yup.string().required("Wallet address is required"),

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
            this.setState({addressChecking: true});
            exchangeApi.checkReceiverAddress({address, sender: userInfo.getState()._id}).then((data) => {

                this.setState({
                    addressChecking: false, addressSuccess: {
                        message: "Wallet found!"
                    }, receiverInfo: data, addressError: ""
                })
            }).catch((err) => {
                this.setState({addressChecking: false, addressError: err, addressSuccess: ""})
            })
        }

    };

    debounceCheckReceiverAddress = debounce(this.checkReceiverAddress, 1500);

    handleChangeAddress = (e) => {
        let isValid = yup.reach(this.exchangeSchema, "to").isValidSync(e.target.value);
        if (this.state.receiverInfo) this.setState({receiverInfo: null});
        this.debounceCheckReceiverAddress(e.target.value, isValid);

    };



    render() {

        let {wallet} = this.props;
        let {addressError, addressSuccess, addressChecking, receiverInfo} = this.state;

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
                                    this.handleChangeAddress(e);
                                }}
                                {...others}
                            />
                            {addressChecking && (
                                <p className="checking">Checking...</p>
                            )}
                        </div>
                    ), true)}
                    {receiverInfo && (
                        <>
                            <div className="receiver-info">
                                <div className="section">
                                    <p className="label">Receiver name</p>
                                    <p className="value">{receiverInfo.fullname}</p>
                                </div>
                                <div className="section">
                                    <p className="label">Receiver email</p>
                                    <p className="value">{receiverInfo.email}</p>
                                </div>
                            </div>
                            <div className="amount">
                                <div className="amount-input">
                                    {this.form.enhanceComponent("kap", ({error, onChange, onEnter, ...others}) => (


                                        <CommonInput
                                            className="pt-0 send-input"
                                            id={"kap"}
                                            type={"text"}
                                            extraDisplay={<span>KAP</span>}
                                            label={"Amount"}
                                            placeholder={"0"}
                                            onChange={e => {
                                                let actualValue = getMoneyValueAsText(e.target.value);
                                                onChange(actualValue);
                                            }}
                                            {...others}
                                        />

                                    ), true)}
                                </div>
                                <div className="amount-separate">=</div>
                                <div className="amount-input">
                                    {this.form.enhanceComponent("usd", ({error, onChange, onEnter, ...others}) => (


                                        <CommonInput
                                            className="pt-0 send-input usd-input"
                                            id={"usd"}
                                            type={"text"}
                                            label={"Text"}
                                            extraDisplay={<span>USD</span>}
                                            placeholder={"$0.00"}
                                            onChange={e => {
                                                let actualValue = getMoneyValueAsText(e.target.value);
                                                onChange(actualValue);
                                            }}
                                            {...others}
                                        />

                                    ), true)}
                                </div>
                            </div>
                        </>
                    )

                    }
                </div>
            </div>
        );
    }
}