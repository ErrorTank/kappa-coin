import React from "react";
import classnames from "classnames"

export class Dropdown extends React.Component{

    constructor(props){
        super(props);
        this.state={
            dropdown: false
        };
    };
    render(){
        let {className, content, dropdownContent, ...rest} = this.props;
        return(
            <div className={classnames("dropdown", className)}
                 {...rest}
                 onMouseEnter={() => this.setState({dropdown: true})}
                 onMouseLeave={() => this.setState({dropdown: false})}
            >
                {content}
                {dropdownContent(this.state.dropdown)}
            </div>
        );
    }
}