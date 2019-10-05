import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";

export default class HomeRoute extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    };
    render(){
        return(
            <PageTitle
                title={"Home"}
            >

            </PageTitle>
        );
    }
}