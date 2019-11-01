import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {MainLayout} from "../../../layout/main-layout/main-layout";
import {BlockchainOverview} from "../../../common/blockchain-overview/blockchain-overview";
import {LatestDisplay} from "./latest-display/latest-display";
import {pronounce} from "../../../../common/utils/common";
import io from "socket.io-client";
import {chainApi} from "../../../../api/common/chain-api";
import {transactionApi} from "../../../../api/common/transaction-api";
import moment from "moment";
import {customHistory} from "../../routes";
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

export default class HomeRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chain: null,
            loading: true,
            blocks: {
                total: 0,
                list: []
            },
            txns: {
                total: 0,
                list: []
            }
        };

        this.socket1 = io(document.location.origin + "/mine-block");
        this.socket2 = io(document.location.origin + "/pending-transaction");
        this.socket1.on('connect', () => {

            this.socket1.on("new-chain-info", (data) => {
                console.log("new-chain-info")
                console.log(data);
                this.setState({chain: {...this.state.chain, ...data}});
            })

            this.socket1.on("new-chain-overview", (data) => {
                console.log("sssss")
                this.setState({blocks: data});
            })
        });
        this.socket2.on('connect', () => {
            this.socket2.on("new-pool-overview", (data) => {
                console.log("Cacaca")
                this.setState({txns: data});
            })
        });
        Promise.all([
            chainApi.getBlockchainOverview(),
            chainApi.getBlocks({skip: 0, take: 5}),
            transactionApi.getPendingTransactions({skip: 0, take: 5})
        ]).then(([chain, blocks, txns]) => this.setState({chain, blocks, txns, loading: false}))
    };

    componentWillUnmount() {
        this.socket && this.socket.disconnect();
    }

    render() {
        let {chain, blocks, txns, loading} = this.state;
        return (
            <PageTitle
                title={"Exchange And Mining KAP"}
            >
                <MainLayout>
                    <div className="home-route">
                        <div className="container">
                            <div className="big-wrapper">
                                <p className="route-title">Kappa Coin Overview</p>
                                {!loading && (
                                    <BlockchainOverview
                                        chain={chain}
                                    />
                                )}
                                {!loading && (
                                    <div className="mt-5">
                                        <div className="border-box overview-panel">
                                            <LatestDisplay
                                                title={`Latest ${blocks.list.length} ${pronounce("block", blocks.total, "s")}`}
                                                list={blocks.list}
                                                getKey={data => data._id}
                                                display={data => (
                                                    <div className="block-display" onClick={() => customHistory.push(`/block/${data.hash}`)}>
                                                        <div className="row align-items-center">
                                                            <div className="col-6 p-0">
                                                                <p className="link-text">{data.blockNo + 1}</p>
                                                                <p className="sub">{moment(data.createdAt).fromNow()}</p>
                                                            </div>
                                                            <div className="col-6 p-0">
                                                                {!data.isGenesis ? (
                                                                    <>
                                                                        <p className="inline-text"><span>Miner</span> <span className="link-text">{data.minedBy.fullname}</span></p>
                                                                        <p className="sub">In {moment.duration(Number(data.minedRate)).asSeconds()} {pronounce("second", Number(data.minedRate) / 1000, "s")}</p>
                                                                    </>
                                                                ) : "GENESIS BLOCK"}

                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                emptyNotify={"No blocks found"}
                                                displayFooter={() => {
                                                    return <p className={"more text-center inline-text"}><span className="link-text" onClick={() => customHistory.push("/blocks")}>View all blocks</span></p>
                                                }}
                                                total={blocks.total}
                                            />
                                        </div>
                                        <div className="border-box overview-panel">
                                            <LatestDisplay
                                                total={txns.total}
                                                title={`Latest ${txns.list.length} ${pronounce("txn", txns.total, "s")}`}
                                                list={txns.list}
                                                getKey={data => data._id}
                                                display={data => (
                                                    <div className="txn-display" onClick={() => customHistory.push(`/txn/${data.hash}`)}>
                                                        <div className="row align-items-center">
                                                            <div className="col-6 p-0">
                                                                <p className="link-text address">{data.hash}</p>
                                                            </div>
                                                            <div className="col-6 p-0">
                                                                <p className="inline-text"><span>From</span> <span className="link-text address">{data.input.address}</span></p>
                                                                <p className="inline-text"><span>Receiver count: </span> <span className="link-text">{Object.keys(data.outputMap).length - 1}</span></p>

                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                emptyNotify={"No txns found"}
                                                displayFooter={() => {
                                                    return <p className={"more text-center inline-text"}><span className="link-text" onClick={() => customHistory.push("/pool")}>View all transactions</span></p>
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </MainLayout>
            </PageTitle>
        );
    }
}