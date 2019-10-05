import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {MainLayout} from "../../../layout/main-layout/main-layout";

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
                <MainLayout>
                    <div className="home-route">

                    </div>
                </MainLayout>
            </PageTitle>
        );
    }
}