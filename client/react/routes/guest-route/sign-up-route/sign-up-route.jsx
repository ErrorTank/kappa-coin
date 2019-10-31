import React from "react";
import {MainLayout} from "../../../layout/main-layout/main-layout";
import {PageTitle} from "../../../common/page-title/page-title";
import {customHistory} from "../../routes";
import * as yup from "yup";
import {createSimpleForm} from "../../../common/form-validator/form-validator";
import {KComponent} from "../../../common/k-component";
import {CommonInput} from "../../../common/common-input/common-input";
import {LoadingInline} from "../../../common/loading-inline/loading-inline";
import {userApi} from "../../../../api/common/user-api";
import {authenCache} from "../../../../common/cache/authen-cache";
import {appInstances} from "../../../../common/instance";
import io from "socket.io-client";
import {userInfo, walletInfo} from "../../../../common/states/common";

export default class SignupRoute extends KComponent{
    constructor(props){
        super(props);
        this.state={
        };
        this.state = {
            error: "",
            loading: false,
        };
        const signupSchema = yup.object().shape({
            fullname: yup.string().min(6, "Fullname must contains more than 6 characters").max(50, "Fullname must contains less than 50 characters").required("Fullname cannot be empty"),
            confirmPassword: yup.string().equalTo(yup.ref("password"), "Password not matched"),
            email: yup.string().email("Invalid email").required("Email cannot be empty"),
            password: yup.string().min(6, "Password must contains more than 6 characters").noSpecialChar("Password cannot contains special characters")
        });
        this.form = createSimpleForm(signupSchema, {
            initData: {
                email: "",
                password: "",
                fullname: "",
                confirmPassword: ""
            }
        });
        this.onUnmount(this.form.on("enter", () => this.handleSignup()));
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();
            this.state.error && this.setState({error: ""});
        }));
        this.form.validateData();
    };

    handleSignup = () => {
        let {email, password, fullname} = this.form.getData();
        this.setState({loading: true});
        userApi.signup({email, password, fullname}).then(data => {
            let {user, token, wallet} = data;
            authenCache.setAuthen(token, {expires: 30});
            let walletSocket = appInstances.setInstance("walletSocket", io( document.location.origin + "/pending-transaction"));
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
            return Promise.all([userInfo.setState({...user}), walletInfo.setState({...wallet})]).then(() => customHistory.push("/"));
        }).catch(err => this.setState({loading: false, error: err.message}));
    };

    renderServerError = () => {
        let {error} = this.state;
        let {email} = this.form.getData();
        let errMatcher = {
            "existed": `Email address ${email} is existed`,
        };
        return errMatcher.hasOwnProperty(error) ? errMatcher[error] : "Something went wrong! Please try again"
    };

    render(){
        const canLogin = !this.form.getInvalidPaths().length && !this.state.error && !this.state.loading;
        return(
            <PageTitle
                title={"Sign up"}
            >
                <MainLayout>
                    <div className="register-route">
                        <div className="container">
                            <div className="login-wrapper">
                                <p className="login-title-1">
                                    Register a <span>New</span> Account
                                </p>
                                <p className="login-title-2">
                                    Fill out the form to get started.
                                </p>
                                <div className="login-form">
                                    {this.state.error && (
                                        <div className="server-error">
                                            {this.renderServerError()}
                                        </div>
                                    )}
                                    {this.form.enhanceComponent("fullname", ({error, onChange, onEnter, ...others}) => (
                                        <CommonInput
                                            className="pt-0 login-input"
                                            error={error}
                                            id={"fullname"}
                                            onKeyDown={onEnter}
                                            type={"text"}
                                            label={"Username"}
                                            placeholder={"Enter fullname"}
                                            onChange={e => {

                                                this.setState({error: false});
                                                onChange(e);
                                            }}
                                            {...others}
                                        />
                                    ), true)}
                                    {this.form.enhanceComponent("email", ({error, onChange, onEnter, ...others}) => (
                                        <CommonInput
                                            className="pt-0 login-input"
                                            error={error}
                                            id={"email"}
                                            onKeyDown={onEnter}
                                            type={"text"}
                                            label={"Email"}
                                            placeholder={"Enter email"}
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
                                            label={"Password"}
                                            {...others}
                                        />
                                    ), true)}
                                    {this.form.enhanceComponent("confirmPassword", ({error, onChange, onEnter, ...others}) => (
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
                                            label={"Confirm password"}
                                            {...others}
                                        />
                                    ), true)}
                                    <button className="btn btn-login"
                                            disabled={!canLogin}
                                            onClick={this.handleSignup}
                                    >
                                        Sign Up
                                        {this.state.loading && (
                                            <LoadingInline
                                                className={"login-loading"}
                                            />
                                        )}
                                    </button>
                                    <p className="suggest"
                                       onClick={() => customHistory.push("/login")}
                                    >
                                        Already have an account?<span className="link"> Click to Sign In</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </MainLayout>
            </PageTitle>
        );
    }
}