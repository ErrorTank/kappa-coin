import React from "react";
import moment from "moment";
import {KComponent} from "../../../../common/k-component";
import * as yup from "yup";
import {createSimpleForm} from "../../../../common/form-validator/form-validator";
import isEqual from "lodash/isEqual"
import pick from "lodash/pick"
import debounce from "lodash/debounce"
import {CommonInput} from "../../../../common/common-input/common-input";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";
import {userApi} from "../../../../../api/common/user-api";
import {userInfo} from "../../../../../common/states/common";

export class InfoEditPanel extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            error: false,
            checking: false,
        };
        this.editSchema = yup.object().shape({
            fullname: yup.string().min(6, "Fullname must contains more than 6 characters").max(50, "Fullname must contains less than 50 characters").required("Fullname cannot be empty"),
            email: yup.string().email("Invalid email").required("Email cannot be empty"),
            password: yup.string().min(6, "Password must contains more than 6 characters").noSpecialChar("Password cannot contains special characters")
        });
        this.form = createSimpleForm(this.editSchema, {
            initData: {
                email: props.info.email,
                password: props.info.password,
                fullname: props.info.fullname
            }
        });
        this.onUnmount(this.form.on("enter", () => this.handleLogin()));
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();
            this.state.error && this.setState({error: ""});
        }));
        this.form.validateData();
    };

    checkEmailExisted = (email, isValid) => {
        if (isValid){
            userApi.checkEmailExisted({email, userID: this.props.info._id}).then((data) => {
                this.setState({checking: false})
            }).catch((err) => {
                console.log(err)
                this.setState({checking: false, err: true})
            })
        }

    };

    debounceCheckEmailExisted = debounce(this.checkEmailExisted, 1500);

    handleChange = (e) => {
        let isValid = yup.reach(this.editSchema, "email").isValidSync(e.target.value) && e.target.value !== this.props.info.email;
        if (isValid){
            this.setState({checking: true});
        }else{
            this.setState({checking: false});
        }

        this.debounceCheckEmailExisted(e.target.value, isValid);

    };

    save = () => {
        userApi.updateUser(this.props.info._id, this.form.getData()).then(newData => {
            let {password, ...rest} = newData;
            userInfo.setState(rest);
            this.props.onEdit({...newData});
        })
    };

    render() {
        let {createdAt, updatedAt, _id,} = this.props.info;
        let {email, password, fullname} = this.form.getData();
        let canSave = !this.state.saving && !this.form.getInvalidPaths().length && !isEqual({
            email,
            password,
            fullname
        }, pick(this.props.info, ["email", "password", "fullname"])) && !this.state.err && !this.state.checking;
        return (
            <div className="info-edit-panel edit-panel border-box" id="info">

                <div className="panel-header">
                    <p className="header-title"><i className="fas fa-edit"></i> Edit Profile</p>
                    <p className="last-update">
                        Last updated: {moment(updatedAt).format("hh:mm a DD/MM/YYYY")}
                    </p>
                </div>
                <div className="panel-body">
                    <div className="edit-profile-form">
                        {this.form.enhanceComponent("fullname", ({error, onChange, onEnter, ...others}) => (
                            <CommonInput
                                className="pt-0 edit-input"
                                error={error}
                                id={"email"}
                                onKeyDown={onEnter}
                                type={"text"}
                                label={"Username"}
                                placeholder={"abc@xyz.com"}
                                onChange={e => {

                                    this.setState({error: false});
                                    onChange(e);
                                }}
                                {...others}
                            />
                        ), true)}
                        {this.form.enhanceComponent("email", ({error, onChange, onEnter, ...others}) => (
                            <>
                                <div className="email-wrap">
                                    <CommonInput
                                        className="pt-0 edit-input email-input"
                                        error={error}
                                        id={"email"}
                                        onKeyDown={onEnter}
                                        type={"text"}
                                        label={"Email"}
                                        placeholder={"abc@xyz.com"}
                                        onChange={e => {

                                            this.setState({error: false});
                                            onChange(e);
                                            this.handleChange(e);
                                        }}
                                        {...others}
                                    />
                                    {this.state.checking && (
                                        <span className="check-loading">
              <i className="fas fa-spinner spin"></i>
            </span>
                                    )

                                    }

                                </div>
                                {this.state.err && (
                                    <p className="server-err">Email is existed. Please try another one</p>
                                )}
                            </>
                        ), true)}
                        {this.form.enhanceComponent("password", ({error, onChange, onEnter, ...others}) => (
                            <CommonInput
                                className="pt-0 edit-input"
                                error={error}
                                id={"password"}
                                type={"password"}
                                placeholder={"Password contains at lease 6 characters"}
                                onKeyDown={onEnter}
                                onChange={e => {
                                    this.setState({error: false});
                                    onChange(e);
                                }}
                                label={"Mật khẩu"}
                                {...others}
                            />
                        ), true)}

                    </div>
                </div>
                <div className="panel-footer">
                    <button className="btn save-btn" disabled={!canSave} onClick={this.save}>Save Change</button>
                </div>
            </div>
        );
    }
}