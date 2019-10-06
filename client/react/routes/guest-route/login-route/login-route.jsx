import React from "react";
import {KComponent} from "../../../common/k-component";
import {MainLayout} from "../../../layout/main-layout/main-layout";
import {PageTitle} from "../../../common/page-title/page-title";
import * as yup from "yup"
import {createSimpleForm} from "../../../common/form-validator/form-validator";
import {CommonInput} from "../../../common/common-input/common-input";

export default class LoginRoute extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
            loading: false,
        };
        const loginSchema = yup.object().shape({
            email: yup.string().email("Email không hợp lệ").required("Email không được để trống"),
            password: yup.string().min(6, "Mật khẩu bắt buộc từ 6 ký tự trở lên").noSpecialChar("Mật khẩu không được có kí tự đặc biệt")
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

    };

    render() {
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
                                    {this.form.enhanceComponent("email", ({error, onChange, onEnter, ...others}) => (
                                        <CommonInput
                                            className="registration-input pt-0"
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
                                            className="registration-input pt-0 pb-0"
                                            error={error}
                                            id={"password"}
                                            type={"password"}
                                            placeholder={"Mật khẩu gồm ít nhất 6 kí tự"}
                                            onKeyDown={onEnter}
                                            onChange={e => {
                                                this.setState({error: ""});
                                                onChange(e);
                                            }}
                                            label={"Mật khẩu"}
                                            {...others}
                                        />
                                    ), true)}
                                </div>
                            </div>
                        </div>
                    </div>
                </MainLayout>
            </PageTitle>
        );
    }
}