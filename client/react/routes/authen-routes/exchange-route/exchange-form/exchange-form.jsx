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
import {convertTextMoneyToNumber, formatMoney, getMoneyValueAsText} from "../../../../../common/utils/common";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";
import pick from "lodash/pick"
import {appModal} from "../../../../common/modal/modals";
import {customHistory} from "../../../routes";
import {Badge} from "../../../../common/badge/badge";

const CreatePendingTransactionSuccess = ({data, success}) => {
    return (
        <div className={classnames("content", {fail: !success})}>
            <p className="icon">
                {success ? (
                    <i className="far fa-check-circle"></i>
                ) : (
                    <i className="far fa-times-circle"></i>
                )

                }

            </p>
            <p className="sub">
                {success ? "Your transaction has been successful created!" : "Your transaction has been refused to update!"

                }

            </p>
            <div className="details">
                <div className="detail">
                    <span className="label">Transaction Hash:</span>
                    <span className="hash">{data.hash}</span>
                </div>
                <div className="detail">
                    <span className="label">Status:</span>
                    <Badge
                        content={"Pending"}
                        style="danger"
                    />
                </div>
            </div>
            <div className="more-info">
                {success ? "Your transaction will be proceeded in next several minutes. You will receive notification(s) about anything relevant to this exchange." : "Cannot updated your transaction due to total spent amount exceeds your current balance!"}

            </div>
        </div>
    )
}

export class ExchangeForm extends KComponent {
    constructor(props) {
        super(props);
        this.initialState = {
            addressError: "",
            addressSuccess: "",
            addressChecking: false,
            receiverInfo: null,
            proceeding: false
        };
        this.state = {
          ...this.initialState
        };
        this.exchangeSchema = yup.object().shape({
            to: yup.string().required("Wallet address is required"),
            kap: yup.string().test("validate-kap", "Amount cannot equal to 0", function (value) {
                let actualValue = convertTextMoneyToNumber(value, 2);
                return actualValue !== 0;
            }),
            usd: yup.string(),
            description: yup.string(),
        });
        this.initData = {
            to: "",
            kap: "",
            usd: "",
            description: ""
        };
        this.form = createSimpleForm(this.exchangeSchema, {
            initData: {...this.initData}
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
                this.form.updateData({
                    kap: "",
                    usd: "",
                    description: ""
                });
                this.setState({
                    addressChecking: false, addressSuccess: {
                        message: "Wallet address found!"
                    }, receiverInfo: data, addressError: ""
                })

            }).catch((err) => {
                this.setState({addressChecking: false, addressError: err, addressSuccess: ""})
            })
        }

    };

    debounceCheckReceiverAddress = debounce(this.checkReceiverAddress, 1000);

    handleChangeAddress = (e) => {
        let isValid = yup.reach(this.exchangeSchema, "to").isValidSync(e.target.value);
        if (this.state.receiverInfo) this.setState({receiverInfo: null});
        this.debounceCheckReceiverAddress(e.target.value, isValid);

    };

    resetForm = () => {
        this.setState({...this.initialState});
        this.form.resetData();
    }

    handleCreateTransaction = () => {
        this.setState({proceeding: true});
        let {wallet} = this.props;
        let {receiverInfo} = this.state;
        console.log(receiverInfo)
        let {kap, description, to} = this.form.getData();
        let sentPayload = {
            senderWallet: pick(wallet, ["balance", "address", "keyPair"]),
            receiverWallet: {
                address: to
            },
            amount: convertTextMoneyToNumber(kap, 2),
            description
        };
        exchangeApi.createPendingTransaction(sentPayload).then((data) => {
            this.resetForm();
            appModal.confirm({
                title: "Notification",
                className: "create-pending-transaction",
                text: (
                    <CreatePendingTransactionSuccess
                        data={data}
                        success={true}
                    />
                ),
                btnText: "My transactions",
                cancelText: "Close"
            }).then(isNavigate => isNavigate && customHistory.push("/my-transactions"))
        }).catch((err) => {
            this.resetForm();
            appModal.confirm({
                title: "Notification",
                className: "create-pending-transaction",
                text: (
                    <CreatePendingTransactionSuccess
                        data={err.extra}
                        success={false}
                    />
                ),
                btnText: "My transactions",
                cancelText: "Close"
            }).then(isNavigate => isNavigate && customHistory.push("/my-transactions"))
        });
    };


    render() {

        let {wallet} = this.props;
        let {addressError, addressSuccess, addressChecking, receiverInfo, proceeding} = this.state;
        let amount = convertTextMoneyToNumber(this.form.getPathData("kap"), 2);
        let kapError = this.form.getErrorPath("kap");
        let amountError = (kapError && kapError.hasOwnProperty("message")) ? {message: kapError.message} : (amount > wallet.balance ? {message: "Amount exceeds current wallet balance"} : "");
        // console.log(this.form.getErrorPath("usd"))
        // console.log(this.form.getInvalidPaths())
        // console.log(amountError)
        let canProceed = !this.form.getInvalidPaths().length && !addressError && !proceeding && !amountError && !addressChecking;
        return (
            <div className="exchange-form border-box">
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
                                <div className="link"
                                     onClick={() => customHistory.push("/profile#wallet")}
                                >
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
                                    {this.form.enhanceComponent("kap", ({error, onChange, onEnter, ...others}) => {
                                        return (


                                            <CommonInput
                                                className="pt-0 send-input"
                                                id={"kap"}
                                                type={"text"}
                                                displayErr={false}
                                                error={amountError}
                                                extraDisplay={<span className="currency-name">KAP</span>}
                                                label={"Amount"}
                                                placeholder={"0"}
                                                onChange={e => {
                                                    let actualValue = getMoneyValueAsText(e.target.value);
                                                    onChange(actualValue);

                                                    this.form.updatePathData("usd", formatMoney(convertTextMoneyToNumber(actualValue, 2) * process.env.USD_RATE))
                                                }}
                                                {...others}
                                            />

                                        )
                                    }, true)}
                                </div>
                                <div className="amount-separate">=</div>
                                <div className="amount-input">
                                    {this.form.enhanceComponent("usd", ({error, onChange, onEnter, ...others}) => (


                                        <CommonInput
                                            className="pt-0 send-input usd-input"
                                            id={"usd"}
                                            displayErr={false}
                                            type={"text"}
                                            error={amountError}
                                            label={"Text"}
                                            extraDisplay={<span className="currency-name">USD</span>}
                                            placeholder={"$0.00"}
                                            onChange={e => {
                                                let actualValue = getMoneyValueAsText(e.target.value);
                                                onChange(actualValue);
                                                this.form.updatePathData("kap", formatMoney(convertTextMoneyToNumber(actualValue, 2) / process.env.USD_RATE))
                                            }}
                                            {...others}
                                        />

                                    ), true)}
                                </div>
                                {amountError && (
                                    <p className="custom-err">{amountError.message}</p>
                                )}

                            </div>
                            {this.form.enhanceComponent("description", ({error, onChange, onEnter, ...others}) => (
                                <CommonInput
                                    textArea={true}
                                    className="pt-0 send-input"
                                    error={error || addressError}
                                    success={addressSuccess}
                                    id={"description"}
                                    type={"text"}
                                    label={"Description"}
                                    placeholder={"What's this transaction for? (Optional)"}
                                    onChange={e => {
                                        onChange(e);
                                    }}
                                    {...others}
                                />
                            ), true)}

                        </>
                    )

                    }
                </div>
                {receiverInfo && (
                    <div className="form-footer">
                        <button className="btn proceed-btn"
                                disabled={!canProceed}
                                onClick={this.handleCreateTransaction}
                        >{proceeding && (
                            <LoadingInline/>
                        )
                        }
                            Submit Transaction
                        </button>
                    </div>
                )

                }
            </div>
        );
    }
}