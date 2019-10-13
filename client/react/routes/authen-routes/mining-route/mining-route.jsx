import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {MainLayout} from "../../../layout/main-layout/main-layout";
import {BlockchainOverview} from "../../../common/blockchain-overview/blockchain-overview";

export default class MiningRoute extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    };
    render(){
        return(
            <PageTitle
                title={"Mining Block"}
            >
                <MainLayout>
                    <div className="mining-route">
                        <div className="container">
                            <div className="big-wrapper">
                                <p className="route-title">Mining Block</p>
                                <BlockchainOverview/>
                            </div>
                        </div>
                    </div>
                </MainLayout>
            </PageTitle>
        );
    }
}