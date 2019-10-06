import React from "react";
import classnames from "classnames"

export class CommonInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        const {className, success = false, error = false, label = null, helper = null, id, icon, inputType = "input", ...others} = this.props;
        return (
            <div className={classnames("common-input", className)}>
                <label htmlFor={id}>{label}</label>
                <input className={classnames("form-control", {"is-invalid": error, "is-valid": success})} id={id} {...others}/>
                {(error) && (
                    <div className="invalid-feedback">{error.message}</div>
                )}
                {(success) && (
                    <div className="valid-feedback">{success.message}</div>
                )}
            </div>
        );

    }
}