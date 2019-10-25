import React from "react";
import {MainLayout} from "../../../layout/main-layout/main-layout";
import {PageTitle} from "../../../common/page-title/page-title";
import {customHistory} from "../../routes";
import * as yup from "yup";
import {createSimpleForm} from "../../../common/form-validator/form-validator";

export default class SignupRoute extends React.Component{
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

    };

    render(){
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