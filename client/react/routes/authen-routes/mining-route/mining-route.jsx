import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {MainLayout} from "../../../layout/main-layout/main-layout";
import {BlockchainOverview} from "../../../common/blockchain-overview/blockchain-overview";
import {LoadingInline} from "../../../common/loading-inline/loading-inline";
import {pronounce} from "../../../../common/utils/common";
import moment from "moment"
import {transactionApi} from "../../../../api/common/transaction-api";
import {wait} from "../../../../common/utils";
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

export default class MiningRoute extends React.Component{
    constructor(props){
        super(props);
        this.initState = {
            hash: "",
            nonce: 0,
            timestamp: null,
            txns: [],
            step: this.steps[0],
            counter: 0
        };
        this.state={
            ...this.initState
        };
    };

    startMiningProcess = async () => {
        this.setState({step: this.steps[1]});
        let txns = await transactionApi.getValidTransactions() || [];
        this.setState({txns});
        await wait(1);
        this.setState({step: this.steps[2]});
        await wait(1.5);
        if(txns.length){
            this.setState({step: this.steps[4]});
            this.startMining();
        }else{
            this.setState({step: this.steps[3]});
            await wait(1.5);
            this.setState({...this.initState});
        }
    };

    startMining = () => {

    };

    steps = [
        {
            key: "pending",
            uiTitle: "Pending...",
            mineRender: () => (
                <button className="btn mine-btn"
                        onClick={this.startMiningProcess}
                >
                    Mine
                </button>
            )
        },{
            key: "preparing1",
            uiTitle: "Preparing...",
            mineRender: () => (
                <div className="mine-loading">
                    <i className="fas fa-sync-alt spin-icon spin"></i>
                    <p className="sub">Collecting valid transactions</p>
                </div>
            )
        },{
            key: "preparing2",
            uiTitle: "Preparing...",
            mineRender: () => (
                <div className="mine-loading">
                    <i className="fas fa-sync-alt spin-icon spin"></i>
                    <p className="sub">Found {length} {pronounce("transaction", this.state.txns.length, "s")}</p>
                </div>
            )
        },
        {
            key: "preparing3",
            uiTitle: "Stopping...",
            mineRender: () => (
                <div className="mine-loading">
                    <i className="fas fa-sync-alt spin-icon spin"></i>
                    <p className="sub">Not enough transactions to mined!</p>
                </div>
            )
        },{
            key: "mining",
            uiTitle: "Mining...",
            mineRender: () => (
                <div className="mine-loading">
                    <p className="counter">{moment.duration(this.state.counter , "seconds").format("    hh:mm:ss")}</p>
                    <p className="sub">Calculating Hash</p>
                </div>
            )
        },
    ];

    render(){
        let {hash, nonce, timestamp, step} = this.state;
        let {key, uiTitle, mineRender} = step;
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
                                <div className="mining-interface border-box">
                                    <div className="panel mine-info col-4">
                                        <div className="panel-title">
                                            Mining details
                                        </div>
                                        <div className="info">
                                            <p className="label">Nonce</p>
                                            <p className="value">
                                                {key === "pending" ? "Not mined yet" : ["preparing1", "preparing3"].includes(key) ? "Loading..." : nonce}
                                            </p>
                                        </div>
                                        <div className="info">
                                            <p className="label">Hash</p>
                                            <p className="value">{key === "pending" ? "Not mined yet" : ["preparing1", "preparing3"].includes(key) ? "Loading..." : hash}</p>
                                        </div>
                                        <div className="info">
                                            <p className="label">Timestamp</p>
                                            <p className="value">{key === "pending" ? "Not mined yet" : ["preparing1", "preparing3"].includes(key) ? "Loading..." : timestamp}</p>
                                        </div>
                                    </div>
                                    <div className="panel mine-ui col-4">
                                        <div className="panel-title">
                                            {uiTitle}
                                        </div>
                                        <div className="mine-ui-center">
                                            {mineRender()}
                                        </div>
                                    </div>
                                    <div className="panel transactions col-4">
                                        <div className="panel-title">
                                            Transactions
                                        </div>
                                        <div className="txns">
                                            {key === "pending" && (
                                                <p className="not-mine">Not mined yet</p>
                                            )}
                                            {["preparing1", "preparing3"].includes(key) && (
                                                <LoadingInline/>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </MainLayout>
            </PageTitle>
        );
    }
}