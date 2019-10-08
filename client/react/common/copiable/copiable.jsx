import React from "react";
import {Tooltip} from "../tooltip/tooltip";
import classnames from "classnames"

let $textarea = $("<textarea class='clipboard-registry' style='position: absolute;pointer-events: none;opacity: 0;top: 0;width: 0;height: 0;'></textarea>");
$("body").append($textarea);

export const clipboardService = {
    copy(value) {
        $textarea.val(value);

        let scrollY = window.pageYOffset || document.documentElement.scrollTop;
        $textarea.on('focus', () => {
            window.scrollTo(0, scrollY);
        });

        $textarea.focus();
        $textarea[0].setSelectionRange(0, $textarea[0].value.length);
        document.execCommand("copy");
    }
};

export class Copiable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCopied: false
        };
    };



    handleCopy = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({isCopied: true});
        clipboardService.copy(this.props.getCopyValue());
    };

    render() {
        return (
            <Tooltip
                text={() => this.state.isCopied ? "Copied" : "Click to copy to clipboard"}
                position={"bottom"}
                onHide={() => this.setState({isCopied: false})}
                className={classnames({copied: this.state.isCopied })}
            >
                <div className="copiable"
                     onClick={this.handleCopy}
                >
                    {this.props.children}

                </div>
            </Tooltip>
        )
    }
}