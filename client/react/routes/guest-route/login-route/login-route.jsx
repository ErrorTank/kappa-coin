import React from "react";
import {KComponent} from "../../../common/k-component";
import {MainLayout} from "../../../layout/main-layout/main-layout";
import {PageTitle} from "../../../common/page-title/page-title";
import * as yup from "yup"
import {createSimpleForm} from "../../../common/form-validator/form-validator";
import {CommonInput} from "../../../common/common-input/common-input";
import {LoadingInline} from "../../../common/loading-inline/loading-inline";
import {userInfo, walletInfo} from "../../../../common/states/common";
import {customHistory} from "../../routes";
import {userApi} from "../../../../api/common/user-api";
import {authenCache} from "../../../../common/cache/authen-cache";
import {appInstances} from "../../../../common/instance";
import io from "socket.io-client";

export default class LoginRoute extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
            loading: false,
        };
        const loginSchema = yup.object().shape({
            email: yup.string().email("Invalid email").required("Email cannot be empty"),
            password: yup.string().min(6, "Password must contains more than 6 characters").noSpecialChar("Password cannot contains special characters")
        });
        this.form = createSimpleForm(loginSchema, {
            initData: {
                email: "",
                password: ""
            }
        });
        this.onUnmount(this.form.on("enter", () => this.handleLogin()));
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();
            this.state.error && this.setState({error: ""});
        }));
        this.form.validateData();
    };

    handleLogin = () => {
        let {email, password} = this.form.getData();
        this.setState({loading: true});
        userApi.login({email, password}).then(data => {
            let {user, token, wallet} = data;
            authenCache.setAuthen(token, {expires: 30});
            let walletSocket = appInstances.setInstance("walletSocket", io( document.location.origin + "/pending-transaction"));
            walletSocket.on("update-wallet", wallet => {
                walletInfo.setState({wallet});
            });
            walletSocket.on("update-wallet-individuals", (addresses) => {
                if(addresses.includes(walletInfo.getState().address)){
                    userApi.getWalletInfo(userInfo.getState()._id).then((wallet) => {
                        console.log(wallet)
                        walletInfo.setState(wallet);
                    })
                }

            });
            return Promise.all([userInfo.setState({...user}), walletInfo.setState({...wallet})]).then(() => customHistory.push("/"));
        }).catch(err => this.setState({loading: false, error: err.message}));
    };

    renderServerError = () => {
        let {error} = this.state;
        let {email} = this.form.getData();
        let errMatcher = {
            "not_existed": `Email address ${email} is not existed`,
            "password_wrong": `Wrong password`,
        };
        return errMatcher.hasOwnProperty(error) ? errMatcher[error] : "Something went wrong! Please try again"
    };

    render() {
        const canLogin = !this.form.getInvalidPaths().length && !this.state.error && !this.state.loading;

        return (
            <PageTitle
                title={"Login"}
            >
                <MainLayout>
                    <div className="login-route">
                        <div className="container">
                            <div className="login-wrapper">
                                <p className="login-title-1">
                                    Welcome <span>Back</span>
                                </p>
                                <p className="login-title-2">
                                    Login to your account
                                </p>
                                <div className="login-form">
                                    {this.state.error && (
                                        <div className="server-error">
                                            {this.renderServerError()}
                                        </div>
                                    )}
                                    {this.form.enhanceComponent("email", ({error, onChange, onEnter, ...others}) => (
                                        <CommonInput
                                            className="pt-0 login-input"
                                            error={error}
                                            id={"email"}
                                            onKeyDown={onEnter}
                                            type={"text"}
                                            label={"Email"}
                                            placeholder={"abc@xyz.com"}
                                            onChange={e => {

                                                this.setState({error: ""});
                                                onChange(e);
                                            }}
                                            {...others}
                                        />
                                    ), true)}
                                    {this.form.enhanceComponent("password", ({error, onChange, onEnter, ...others}) => (
                                        <CommonInput
                                            className="pt-0 login-input"
                                            error={error}
                                            id={"password"}
                                            type={"password"}
                                            placeholder={"Password contains at lease 6 characters"}
                                            onKeyDown={onEnter}
                                            onChange={e => {
                                                this.setState({error: ""});
                                                onChange(e);
                                            }}
                                            label={"Mật khẩu"}
                                            {...others}
                                        />
                                    ), true)}
                                    <button className="btn btn-login"
                                            disabled={!canLogin}
                                            onClick={this.handleLogin}
                                    >
                                        Login
                                        {this.state.loading && (
                                            <LoadingInline
                                                className={"login-loading"}
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </MainLayout>
            </PageTitle>
        );
    }
}